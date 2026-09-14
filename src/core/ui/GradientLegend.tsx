interface PropsGradientLeg {
  colors: Array<string>;
  from: number;
  to: number;
}

export function GradientLegend({ colors, from, to }: PropsGradientLeg) {
  const gradientStyle = {
    background: `linear-gradient(0.25turn, ${colors.join(",")})`,
  };

  return (
    <div className="mt-px bg-white p-[5px_8px_3px] text-[9px] font-semibold text-[#2a363b]">
      <div className="h-3 w-[95%] mx-auto" style={gradientStyle} />
      <div className="mt-0 flex justify-between">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}
