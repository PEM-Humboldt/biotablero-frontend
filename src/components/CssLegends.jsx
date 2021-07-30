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
    width: 7px;
    height: 7px;
    border-radius: 0;
  }
`;

const LineLegend = styled(Legend)`
  &:before {
    display: inline-block;
    content: "";
    width: 15px;
    height: 3px;
    margin-right: 5px;
    margin-bottom: 4px;
    border-bottom: 3px solid ${({ color }) => color};
    vertical-align: middle;
  }
`;

const TextLegend = styled(Legend)`
  margin-right: 1px;
  color: ${({ color }) => color};

  &:before {
    display: inline-block;
    content: "";
    background: ${({ image }) => (image ? `url(${image}) no-repeat center` : '')};
    background-size: 15px;
    width: 15px;
    height: 26px;
    margin-right: 5px;
    vertical-align: middle;
  }
`;

export {
  LegendColor,
  BorderLegendColor,
  LineLegend,
  TextLegend,
};
