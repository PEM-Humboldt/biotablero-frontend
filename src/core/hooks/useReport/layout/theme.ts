import { Font } from "@react-pdf/renderer";

import latoRegular from "@assets/fonts/Lato-Regular.ttf";
import latoBold from "@assets/fonts/Lato-Bold.ttf";

Font.register({
  family: "Lato",
  fonts: [
    { src: latoRegular, fontWeight: 300 },
    { src: latoRegular, fontWeight: 400 },
    { src: latoRegular, fontWeight: 400, fontStyle: "italic" },
    { src: latoBold, fontWeight: 700 },
    { src: latoBold, fontWeight: 900 },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

export const colors = {
  coral: "#e84a5f",
  navy: "#03344b",
  slate: "#2a363b",
  amber: "#f9bb44",
  olive: "#8a9a4d",

  ink: "#2a363b",
  text: "#3f484c",
  textMuted: "#6e6e6e",
  line: "#e6e6e6",
  bgSoft: "#f4f4f2",
  cardBg: "#f8f8f8",
  white: "#ffffff",

  ecoBg: "#d9e8c8",
  ecoText: "#4a5d34",
  escalaBg: "#cdd9e8",
  escalaText: "#33475c",
  temaBg: "#eadfd0",
  temaText: "#7a5a3a",

  serie: ["#e84a5f", "#3a8a8a", "#f9bb44", "#03344b", "#a8402f", "#8a9a4d"],
};
