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
`;

const PointLegend = styled(Legend)`
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

const LegendColor = styled(PointLegend)`
  &:before {
    background-color: ${({ color }) => color};
  }
`;

const BorderLegendColor = styled(PointLegend)`
  &:before {
    color: #ffffff;
    border: 2px solid ${({ color }) => color};
    width: 8px;
    height: 8px;
    border-radius: 0;
  }
`;

const LineLegend = styled(Legend)`
  &:before {
    display: inline-block;
    content: "";
    width: 15px;
    height: 8px;
    margin-right: 5px;
    margin-bottom: 4px;
    border-bottom: 3px solid ${({ color }) => color};
    vertical-align: middle;
  }
`;

const TextLegend = styled(Legend)`
  color: ${({ color }) => color};
`;

export {
  LegendColor,
  BorderLegendColor,
  LineLegend,
  TextLegend,
};
