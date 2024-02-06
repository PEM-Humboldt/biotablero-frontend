import styled, { StyledComponent } from "styled-components";
import React from "react";
import { ArrowLeft, ArrowRight } from "pages/home/content/Arrows";

interface CarouselProps {
  children: Array<React.ReactNode>;
}

interface RefType {
  current: HTMLDivElement | null;
}

interface LeftCarouselButtonTypes {
  hasItemsOnLeft: boolean;
}

interface RightCarouselButtonTypes {
  hasItemsOnRight: boolean;
}

const Relative = styled.div`
  position: relative;
`;

const CarouselContainer: StyledComponent<any, any, {}> = styled(Relative)`
  overflow: hidden;
  padding: 0 40px;
`;

const Flex = styled.div`
  display: flex;
`;

const CarouselItem: StyledComponent<any, any, {}> = styled.div`
  flex: 0 0 auto;
`;

const CarouselContainerInner: StyledComponent<any, any, {}> = styled(Flex)`
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;

  // offset for children spacing
  margin-left: -1rem;

  &::-webkit-scrollbar {
    display: none;
  }

  ${CarouselItem} & {
    scroll-snap-align: center;
  }
`;

const CarouselButton = styled.button`
  position: absolute;

  cursor: pointer;

  top: 50%;
  z-index: 1;

  transition: transform 0.1s ease-in-out;

  background: none;
  border: none;
  padding: 0;
`;

const LeftCarouselButton: StyledComponent<any, any, {}> = styled(
  CarouselButton
)<LeftCarouselButtonTypes>`
  left: 0;
  transform: translate(0%, -50%);

  visibility: ${({ hasItemsOnLeft }) => (hasItemsOnLeft ? "all" : "hidden")};
`;

const RightCarouselButton: StyledComponent<any, any, {}> = styled(
  CarouselButton
)<RightCarouselButtonTypes>`
  right: 0;
  transform: translate(0%, -50%);

  visibility: ${({ hasItemsOnRight }) => (hasItemsOnRight ? "all" : "hidden")};
`;

const getPrevElement = (list: Array<Element>): HTMLElement | null => {
  const sibling = list[0].previousElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
};

const getNextElement = (list: Array<Element>): HTMLElement | null => {
  const sibling = list[list.length - 1].nextElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
};

const usePosition = (ref: RefType, moreThan4: boolean) => {
  const [prevElement, setPrevElement] = React.useState<HTMLElement | null>(
    null
  );
  const [nextElement, setNextElement] = React.useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    const element = ref.current;

    if (element !== null) {
      const update = () => {
        const rect = element.getBoundingClientRect();

        const visibleElements: Array<Element> = Array.from(
          element.children
        ).filter((child) => {
          const childRect = child.getBoundingClientRect();

          return childRect.left >= rect.left && childRect.right <= rect.right;
        });

        if (visibleElements.length > 0) {
          setPrevElement(getPrevElement(visibleElements));
          setNextElement(getNextElement(visibleElements));
        }
      };

      update();

      element.addEventListener<"scroll">("scroll", update, { passive: true });

      return () => {
        element.removeEventListener("scroll", update);
      };
    }
  }, [ref, moreThan4]);

  const scrollToElement = React.useCallback(
    (element: HTMLElement | null): void => {
      const currentNode = ref.current;

      if (!currentNode || !element) return;

      const newScrollPosition =
        element.offsetLeft +
        element.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2;

      currentNode.scroll({
        left: newScrollPosition,
        behavior: "smooth",
      });
    },
    [ref]
  );

  const scrollRight = React.useCallback(
    () => scrollToElement(nextElement),
    [scrollToElement, nextElement]
  );

  const scrollLeft = React.useCallback(
    () => scrollToElement(prevElement),
    [scrollToElement, prevElement]
  );

  return {
    hasItemsOnLeft: prevElement !== null,
    hasItemsOnRight: nextElement !== null,
    scrollRight,
    scrollLeft,
  };
};

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const { hasItemsOnLeft, hasItemsOnRight, scrollRight, scrollLeft } =
    usePosition(ref, children.length > 4);

  return (
    <CarouselContainer role="region" aria-label="Colors carousel">
      <CarouselContainerInner ref={ref}>
        {React.Children.map(children, (child, index) => (
          <CarouselItem key={index}>{child}</CarouselItem>
        ))}
      </CarouselContainerInner>
      <LeftCarouselButton
        hasItemsOnLeft={hasItemsOnLeft}
        onClick={scrollLeft}
        aria-label="Previous slide"
      >
        <ArrowLeft />
      </LeftCarouselButton>
      <RightCarouselButton
        hasItemsOnRight={hasItemsOnRight}
        onClick={scrollRight}
        aria-label="Next slide"
      >
        <ArrowRight />
      </RightCarouselButton>
    </CarouselContainer>
  );
};

export default Carousel;
