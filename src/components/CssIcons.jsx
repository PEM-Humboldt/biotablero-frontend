import styled from 'styled-components';

const Icon = styled.div`
  background: ${({ image }) => `url(${image}) no-repeat center center`};
  width: 25px;
  height: 27px;
  display: inline-block;

  &:hover {
    background: ${({ hoverImage }) => `url(${hoverImage}) no-repeat center center`};
    width: 25px;
    height: 27px;
  }
`;

export default Icon;
