import { Text, Svg, Path } from "@react-pdf/renderer";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
import {
  HUMBOLDT_LOGO_PATHS,
  HUMBOLDT_LOGO_RATIO,
} from "@assets/logos/HumboldtLogoPath";

export function Wordmark({
  size = 16,
  color = colors.coral,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Text style={{ fontSize: size, fontWeight: 900, color }}>BioTablero</Text>
  );
}

/** Eslogan de marca en dos líneas: Lato Light, altas e interespaciado. */
export function Slogan({
  size = 8,
  color = colors.coral,
  align = "right",
}: {
  size?: number;
  color?: string;
  align?: "left" | "right" | "center";
}) {
  const base = {
    fontSize: size,
    fontWeight: 300 as const,
    color,
    textTransform: "uppercase" as const,
    letterSpacing: 2.2,
    textAlign: align,
    lineHeight: 1.35,
  };
  return (
    <>
      <Text style={base}>Cifras e Indicadores</Text>
      <Text style={base}>sobre biodiversidad</Text>
    </>
  );
}

export function HumboldtLogo({
  height = 40,
  color = "#29363a",
}: {
  height?: number;
  color?: string;
}) {
  const width = height * HUMBOLDT_LOGO_RATIO;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 377.9 409.6"
      style={{ width, height }}
    >
      {HUMBOLDT_LOGO_PATHS.map((d, i) => (
        <Path key={i} d={d} fill={color} />
      ))}
    </Svg>
  );
}
