/**
 * Taken from css-tricks: https://css-tricks.com/a-super-flexible-css-carousel-enhanced-with-javascript-navigation/
 */
import styled from "styled-components";
import React from "react";
import Carousel from "./Carousel";

interface CssCarouselProps {
  itemsArray: Array<React.ReactNode>;
}

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

const CssCarousel: React.FC<CssCarouselProps> = ({ itemsArray }) => {
  return (
    <HorizontalCenter>
      <Container>
        <Carousel>{itemsArray}</Carousel>
      </Container>
    </HorizontalCenter>
  );
};

export default CssCarousel;
