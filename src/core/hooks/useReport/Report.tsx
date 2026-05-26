import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { SectionDTO } from "@hooks/useReport/types/useReport";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  coverPage: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleGeneral: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textGeneral: {
    fontSize: 14,
    textAlign: "center",
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
  image: {
    width: "100%",
    borderRadius: 4,
    marginBottom: 10,
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
});

export function Report({ sections }: { sections: SectionDTO[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.titleGeneral}>Reporte General</Text>
          <Text style={styles.textGeneral}>
            Intro, el Humboldt y sus cositas...
          </Text>
        </View>
      </Page>

      {sections.map((section, sIndex) => (
        <Page key={`sec-${sIndex}`} size="A4" style={styles.page}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionDescription}>{section.description}</Text>
          </View>

          {section.graphs.map((graph, gIndex) => (
            <View key={`g-${gIndex}`} style={styles.graphBlock}>
              {graph.info && Object.keys(graph.info).length > 0 && (
                <View style={styles.infoContainer} wrap={false}>
                  {Object.entries(graph.info).map(([key, value]) => (
                    <View key={key} style={styles.infoRow}>
                      <Text style={styles.infoKey}>{key}:</Text>
                      <Text style={styles.infoValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View wrap={false}>
                <Image src={graph.blobUrl} style={styles.image} />
              </View>

              {graph.maps.map((map, mIndex) => (
                <View key={`m-${mIndex}`} style={styles.mapBlock} wrap={false}>
                  <Text style={styles.mapTitle}>{map.title}</Text>
                  <Image src={map.blobUrl} style={styles.image} />
                </View>
              ))}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}
