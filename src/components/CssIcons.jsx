import styled from 'styled-components';

const Icon = styled.div`
  background: ${({ image }) => `url(${image}) no-repeat center center`};
  background-size: 15px;
  width: 15px;
  height: 26px;
  float: right;
`;

export default Icon;
