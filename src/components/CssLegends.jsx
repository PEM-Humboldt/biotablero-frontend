import styled from 'styled-components';

const Legend = styled.p`
  display: ${({ orientation }) => {
    if (orientation === 'column') return 'block';
    return 'inline-block';
  }};
  font-size: 12px;
  color: #424242;
  line-height: 1;
  margin-right: 10px;

  &:before {
    display: inline-block;
    content: "";
    width: 12px;
    height: 12px;
    margin-right: 5px;
    border-radius: 6px;
    vertical-align: middle;
  }
`;

const LegendColor = styled(Legend)`
  &:before {
    background-color: ${({ color }) => color};
  }
`;

const BorderLegendColor = styled(Legend)`
  &:before {
    color: #ffffff;
    border: 2px solid ${({ color }) => color};
    width: 8px;
    height: 8px;
  }
`;

export { LegendColor, BorderLegendColor };