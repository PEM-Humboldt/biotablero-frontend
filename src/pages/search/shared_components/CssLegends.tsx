import styled from 'styled-components';

interface PropsLeg {
  orientation?: string;
}

const Legend = styled.p<PropsLeg>`
  display: ${(props) => {
    if (props.orientation === 'column') return 'block';
    return 'inline-block';
  }};
  font-size: 12px;
  color: #424242;
  line-height: 1;
  margin-right: 10px;
`;

interface PropsPointLeg {
  marginRight?: string;
  marginLeft?: string;
}

const PointLegend = styled(Legend)<PropsPointLeg>`
  &:before {
    display: inline-block;
    content: "";
    width: 12px;
    height: 12px;
    margin-right: ${(props) => (props.marginRight ? props.marginRight : '5px')};
    border-radius: 6px;
    vertical-align: middle;
    margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0')};
  }
`;

interface PropsLegColor {
  color: string;
}

const LegendColor = styled(PointLegend)<PropsLegColor>`
  &:before {
    background-color: ${(props) => props.color};
  }
`;

interface PropsBorderLegColor {
  color: string;
}

const BorderLegendColor = styled(PointLegend)<PropsBorderLegColor>`
  &:before {
    color: #ffffff;
    border: 2px solid ${(props) => props.color};
    width: 7px;
    height: 7px;
    border-radius: 0;
  }
`;

interface PropsLineLeg {
  color: string;
}

const LineLegend = styled(Legend)<PropsLineLeg>`
  &:before {
    display: inline-block;
    content: "";
    width: 15px;
    height: 3px;
    margin-right: 5px;
    margin-bottom: 4px;
    border-bottom: 3px solid ${(props) => props.color};
    vertical-align: middle;
  }
`;

interface PropsThickLineLeg {
  color: string;
}

const ThickLineLegend = styled(LineLegend)<PropsThickLineLeg>`
  &:before {
    border-bottom: 8px solid ${(props) => props.color};
    height: 0px;
  }
`;

interface PropsTextLeg {
  color: string;
  image: string;
  hoverImage: string;
}

const TextLegend = styled(Legend)<PropsTextLeg>`
  margin-right: 1px;
  padding-bottom: 3px;
  color: ${(props) => props.color};

  &:before {
    display: inline-block;
    content: "";
    background: ${(props) => (props.image ? `url(${props.image}) no-repeat center` : '')};
    background-size: 15px;
    width: 15px;
    height: 26px;
    margin-right: 5px;
    vertical-align: middle;
  }

  &:hover {
    cursor: pointer;
  }

  &:hover:before {
    background: ${(props) => (props.hoverImage ? `url(${props.hoverImage}) no-repeat center` : '')};
    background-size: 15px;
    width: 15px;
    height: 26px;
  }

  &.filtered {
    border-bottom: 2px solid tomato;
  }
`;

export {
  LegendColor,
  BorderLegendColor,
  LineLegend,
  ThickLineLegend,
  TextLegend,
};
