import styled from "styled-components";

interface Props {
  image: string;
  hoverImage: string;
}

const Icon = styled.div<Props>`
  background: ${(props) => `url(${props.image}) no-repeat center center`};
  width: 25px;
  height: 27px;
  display: inline-block;

  &:hover {
    background: ${(props) =>
      `url(${props.hoverImage}) no-repeat center center`};
    width: 25px;
    height: 27px;
  }
`;

export default Icon;
