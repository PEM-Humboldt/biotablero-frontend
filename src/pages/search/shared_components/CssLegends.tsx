import styled from 'styled-components';
/* import {} from 'styled-components/cssprop' */

interface PropsLegend {
  orientation: string;
}

const Legend = styled.p`
  display: ${(props: PropsLegend) => {
    if (props.orientation === 'column') return 'block';
    return 'inline-block';
  }};
  font-size: 12px;
  color: #424242;
  line-height: 1;
  margin-right: 10px;
`;

interface PropsPointL extends PropsLegend {
  marginRight: string;
  marginLeft: string;
}

const PointLegend = styled(Legend)`
  &:before {
    display: inline-block;
    content: "";
    width: 12px;
    height: 12px;
    margin-right: ${(props: PropsPointL) => (props.marginRight ? props.marginRight : '5px')};
    border-radius: 6px;
    vertical-align: middle;
    margin-left: ${(props: PropsPointL) => (props.marginLeft ? props.marginLeft : '0')};
  }
`;

interface PropsLegendC extends PropsPointL {
  color: string;
}

const LegendColor = styled(PointLegend)`
  &:before {
    background-color: ${(props: PropsLegendC) => props.color};
  }
`;

interface PropsTest {
  orientation: string;
  marginRight: string;
  marginLeft: string;
  color: string;
}

const Test = styled.p<PropsTest>`
  display: ${(props) => {
    if (props.orientation === 'column') return 'block';
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
    margin-right: ${(props) => (props.marginRight ? props.marginRight : '5px')};
    border-radius: 6px;
    vertical-align: middle;
    margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0')};
    background-color: ${(props) => props.color};
  }
`;

interface PropsBorderLegendC {
  color: string;
}

const BorderLegendColor = styled(PointLegend)`
  &:before {
    color: #ffffff;
    border: 2px solid ${(props: PropsBorderLegendC) => props.color};
    width: 7px;
    height: 7px;
    border-radius: 0;
  }
`;

interface PropsLineL {
  color: string;
}

const LineLegend = styled(Legend)`
  &:before {
    display: inline-block;
    content: "";
    width: 15px;
    height: 3px;
    margin-right: 5px;
    margin-bottom: 4px;
    border-bottom: 3px solid ${(props: PropsLineL) => props.color};
    vertical-align: middle;
  }
`;

interface PropsThickLineL {
  color: string;
}

const ThickLineLegend = styled(LineLegend)`
  &:before {
    border-bottom: 8px solid ${(props: PropsThickLineL) => props.color};
    height: 0px;
  }
`;

interface PropsTextL {
  color: string;
  image: string;
  hoverImage: string;
}

const TextLegend = styled(Legend)`
  margin-right: 1px;
  padding-bottom: 3px;
  color: ${(props: PropsTextL) => props.color};

  &:before {
    display: inline-block;
    content: "";
    background: ${(props: PropsTextL) => (props.image ? `url(${props.image}) no-repeat center` : '')};
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
    background: ${(props: PropsTextL) => (props.hoverImage ? `url(${props.hoverImage}) no-repeat center` : '')};
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
  Test,
};
