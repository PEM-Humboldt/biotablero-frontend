import { colors } from "@hooks/useReport/layout/theme";
import { StyleSheet } from "@react-pdf/renderer";

export const defaultMarkdownStyles = StyleSheet.create({
  h1: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 8,
    marginTop: 4,
  },
  h2: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 7,
    marginTop: 4,
  },
  h3: {
    fontSize: 11.5,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 6,
    marginTop: 3,
  },
  h4: {
    fontSize: 10.5,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 6,
  },
  h5: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 5,
  },
  h6: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 4,
  },

  list: { marginBottom: 8 },
  nestedList: { marginTop: 3, marginLeft: 6 },
  listItem: { flexDirection: "row", marginBottom: 3 },
  listMarker: { width: 14, fontSize: 10, color: colors.navy, fontWeight: 700 },
  listBody: { flexGrow: 1, flexBasis: 0 },

  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  link: { color: colors.navy, textDecoration: "underline" },
  paragraph: { fontSize: 10, color: colors.text, marginBottom: 8 },
  quoteBox: {
    backgroundColor: colors.bgSoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.coral,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  quoteText: { fontSize: 10, color: colors.slate, lineHeight: 1.5 },
});
