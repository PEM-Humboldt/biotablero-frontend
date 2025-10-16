import styled from "styled-components";

interface PropsGradient {
  colors: Array<string>;
}

const Gradient = styled.div<PropsGradient>`
  height: 12px;
  width: 95%;
  margin: 0 auto;
  background: linear-gradient(0.25turn, ${(props) => props.colors.join()});
`;

interface PropsGradientLeg extends PropsGradient {
  fromValue: string;
  toValue: string;
}

const GradientLegend = (props: PropsGradientLeg) => {
  const { fromValue, toValue, colors } = props;
  return (
    <div className="gradientLegend">
      <Gradient colors={colors} />
      <div className="text">
        <span>{fromValue}</span>
        <span>{toValue}</span>
      </div>
    </div>
  );
};

export default GradientLegend;
