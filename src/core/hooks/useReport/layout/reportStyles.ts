import { StyleSheet, Font } from "@react-pdf/renderer";
import latoRegular from "@assets/fonts/Lato-Regular.ttf";
import latoBold from "@assets/fonts/Lato-Bold.ttf";

Font.register({
  family: "Lato",
  fonts: [
    {
      src: latoRegular,
      fontWeight: "normal",
    },
    {
      src: latoBold,
      fontWeight: "bold",
    },
  ],
});

export const reportStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: "Lato",
  },
  coverPage: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Lato",
  },
  titleGeneral: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textGeneral: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sectionDescription: {
    fontSize: 12,
    color: "#555",
    marginBottom: 15,
  },
  infoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoKey: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 11,
    color: "#444",
  },
  graphBlock: {
    marginBottom: 20,
  },
  map: {
    width: "70%",
    borderRadius: 4,
    marginBottom: 10,
  },
  graph: {
    width: "100%",
    borderRadius: 4,
    marginBottom: 10,
  },
  logoContainer: {
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: "auto",
  },
  mapBlock: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeft: "2px solid #ddd",
  },
  mapTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#777",
  },
});
