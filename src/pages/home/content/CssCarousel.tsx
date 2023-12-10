/**
 * Taken from css-tricks: https://css-tricks.com/a-super-flexible-css-carousel-enhanced-with-javascript-navigation/
 */

/* eslint-env browser */
import styled from "styled-components";
import React from "react";

interface LeftCarouselButtonTypes {
  hasItemsOnLeft: boolean;
}

interface RightCarouselButtonTypes {
  hasItemsOnRight: boolean;
}

interface ArrowTypes {
  size?: number | undefined;
  color?: string | undefined;
}

interface MenubuttonProps {
  children: Array<React.ReactNode> & HTMLDivElement;
}

interface MenubuttonChildProps {
  itemsArray: Array<React.ReactNode> & HTMLDivElement;
}

const Relative = styled.div`
  position: relative;
`;

const Flex = styled.div`
  display: flex;
`;

const HorizontalCenter = styled(Flex)`
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

const Container = styled.div`
  height: stretch;
  max-width: 1310px;
`;

function getPrevElement(list: Array<Element>): HTMLElement | null {
  const sibling = list[0].previousElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
}

function getNextElement(list: Array<Element>): HTMLElement | null {
  const sibling = list[list.length - 1].nextElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
}

interface RefType {
  current: HTMLDivElement;
}
function usePosition(ref: RefType, moreThan4: boolean) {
  const [prevElement, setPrevElement] = React.useState<HTMLElement | null>(
    null
  );
  const [nextElement, setNextElement] = React.useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    const element = ref.current;

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
}

const CarouselContainer = styled(Relative)`
  overflow: hidden;
  padding: 0 40px;
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
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

const LeftCarouselButton = styled(CarouselButton)<LeftCarouselButtonTypes>`
  left: 0;
  transform: translate(0%, -50%);

  visibility: ${({ hasItemsOnLeft }) => (hasItemsOnLeft ? "all" : "hidden")};
`;

const RightCarouselButton = styled(CarouselButton)<RightCarouselButtonTypes>`
  right: 0;
  transform: translate(0%, -50%);

  visibility: ${({ hasItemsOnRight }) => (hasItemsOnRight ? "all" : "hidden")};
`;

const CarouselContainerInner = styled(Flex)`
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

const ArrowLeft = ({
  size = 30,
  color = "#ffffff",
}: ArrowTypes): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H6M12 5l-7 7 7 7" />
  </svg>
);

const ArrowRight = ({
  size = 30,
  color = "#ffffff",
}: ArrowTypes): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
);

const Carousel: React.FC<MenubuttonProps> = ({ children }) => {
  const ref = React.useRef(children);
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

const CssCarousel: React.FC<MenubuttonChildProps> = ({ itemsArray }) => {
  return (
    <HorizontalCenter>
      <Container>
        <Carousel>{itemsArray}</Carousel>
      </Container>
    </HorizontalCenter>
  );
};

export default CssCarousel;
