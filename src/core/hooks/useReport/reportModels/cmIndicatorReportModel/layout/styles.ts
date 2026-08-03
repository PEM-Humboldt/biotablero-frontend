import { StyleSheet } from "@react-pdf/renderer";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";

export const styles = StyleSheet.create({
  // ---- Páginas ----
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Lato",
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.45,
  },
  coverPage: {
    fontFamily: "Lato",
    color: colors.text,
  },

  // ---- Portada ----
  coverImageBox: {
    height: "52%",
    backgroundColor: colors.slate,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  coverImagePlaceholderText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coverBody: {
    paddingHorizontal: 46,
    paddingTop: 30,
  },
  coverKicker: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.coral,
    fontWeight: 700,
    marginBottom: 10,
  },
  titleGeneral: {
    fontSize: 27,
    fontWeight: 900,
    color: colors.navy,
    marginBottom: 6,
    lineHeight: 1.1,
  },
  coverInitiative: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.slate,
    marginBottom: 2,
  },
  textGeneral: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 3,
  },
  coverMetaRow: {
    flexDirection: "row",
    marginTop: 22,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  coverMetaItem: { flexGrow: 1, flexBasis: 0 },
  coverMetaLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: 2,
  },
  coverMetaValue: { fontSize: 10, fontWeight: 700, color: colors.slate },
  coverBrandRow: {
    position: "absolute",
    bottom: 40,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  // ---- Encabezado de sección ----
  sectionHeader: {
    backgroundColor: colors.slate,
    borderRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 1,
    paddingRight: 8,
  },

  // ---- Bloques de contenido ----
  h4: {
    fontSize: 10.5,
    fontWeight: 700,
    color: colors.coral,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  paragraph: { fontSize: 10, color: colors.text, marginBottom: 8 },
  block: { marginBottom: 18 },

  metricGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  metricCard: {
    width: "33.333%",
    padding: 4,
  },
  metricCardInner: {
    backgroundColor: colors.cardBg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    height: 62,
  },
  metricLabel: { fontSize: 8, color: colors.textMuted, marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: 700, color: colors.navy },
  metricUnit: { fontSize: 9, fontWeight: 400, color: colors.textMuted },

  kvRow: { flexDirection: "row", marginBottom: 3 },
  kvKey: { width: 130, fontSize: 9, color: colors.textMuted },
  kvVal: {
    flexGrow: 1,
    flexBasis: 0,
    fontSize: 9.5,
    color: colors.text,
    fontWeight: 700,
  },

  // ---- Categorías de etiqueta ----
  conceptTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.slate,
    marginBottom: 5,
  },
  conceptGroup: {},

  // ---- Lista de vínculos (con enlace) ----
  vinculoGroup: { marginBottom: 12 },
  vinculoTitle: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  vinculoItem: { flexDirection: "row", marginBottom: 5, paddingRight: 10 },
  vinculoBullet: { width: 12, fontSize: 10, color: colors.coral },
  vinculoBody: { flexGrow: 1, flexBasis: 0 },
  vinculoName: { fontSize: 9.5, fontWeight: 700, color: colors.slate },
  vinculoUrl: { fontSize: 8.5, color: colors.coral, textDecoration: "none" },

  // ---- Fechas del indicador (debajo del título) ----
  dateRow: { flexDirection: "row", marginBottom: 10 },
  dateItem: { flexDirection: "row", alignItems: "center", marginRight: 22 },
  dateLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginRight: 5,
  },
  dateVal: { fontSize: 10, fontWeight: 700, color: colors.slate },

  // ---- Pills ----
  pillRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  pill: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 8,
    lineHeight: 1.3,
  },

  // ---- Indicador ----
  chartBox: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 10,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  graphStateRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  graphStateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 2,
  },
  graphStateText: { fontSize: 10, color: colors.textMuted },

  quoteBox: {
    backgroundColor: colors.bgSoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.coral,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  quoteText: { fontSize: 10, color: colors.slate, lineHeight: 1.5 },

  noteBox: {
    backgroundColor: "#fff7e6",
    borderWidth: 1,
    borderColor: "#f4dfae",
    borderRadius: 4,
    padding: 9,
    marginBottom: 10,
  },
  noteLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: "#9a6b00",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  noteText: { fontSize: 9.5, color: "#5f4a1e", fontStyle: "italic" },

  indicatorImage: {
    width: "100%",
    borderRadius: 6,
    marginBottom: 10,
    objectFit: "cover",
  },

  // ---- Disclaimer / cierre ----
  disclaimerBox: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  disclaimerLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  disclaimerText: { fontSize: 9, color: colors.textMuted, lineHeight: 1.5 },

  // ---- Pie de página (fijo) ----
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
  },
  footerText: { fontSize: 7.5, color: colors.textMuted },
  pageNumber: {
    fontSize: 8,
    color: colors.textMuted,
  },
});
