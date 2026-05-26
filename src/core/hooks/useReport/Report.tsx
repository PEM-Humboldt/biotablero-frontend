import { Document, Page, Text, View, Image, Link } from "@react-pdf/renderer";

import type { SectionDTO } from "@hooks/useReport/types/useReport";
import logoHumboldt from "@assets/logos/humboldt.png";
import { reportStyles } from "@hooks/useReport/layout/reportStyles";

export function Report({
  sections,
  creator,
}: {
  sections: SectionDTO[];
  creator: { name: string; email: string };
}) {
  const coverBookmark = { bookmark: { title: "Portada", fit: true } };

  return (
    <Document>
      <Page size="LETTER" style={reportStyles.coverPage} {...coverBookmark}>
        <View style={{ alignItems: "center" }}>
          <View style={reportStyles.logoContainer}>
            <Image src={logoHumboldt} style={reportStyles.logo} />
          </View>

          <Text style={reportStyles.titleGeneral}>Reporte General</Text>
          <Text style={[reportStyles.textGeneral, { marginBottom: 25 }]}>
            Intro, el Humboldt y sus cositas...
          </Text>

          <View style={{ marginTop: 15, alignItems: "center" }}>
            <Text style={reportStyles.textGeneral}>
              Informe recopilado por: {creator.name}
            </Text>

            <Text style={reportStyles.textGeneral}>
              Fecha de recopilación: {new Date().toLocaleDateString()}
            </Text>

            <Link
              style={[
                reportStyles.textGeneral,
                { color: "blue", marginTop: 2 },
              ]}
              src={`mailto:${creator.email}`}
            >
              Contactar: {creator.email}
            </Link>
          </View>
        </View>
      </Page>

      {sections.map((section, sIndex) => {
        const sectionBookmark = {
          bookmark: { title: section.title, fit: true },
        };

        return (
          <Page
            key={`sec-${sIndex}`}
            size="LETTER"
            style={reportStyles.page}
            {...sectionBookmark}
          >
            <View style={reportStyles.sectionHeader}>
              <Text style={reportStyles.sectionTitle}>{section.title}</Text>
              <Text style={reportStyles.sectionDescription}>
                {section.description}
              </Text>
            </View>

            {section.graphs.map((graph, gIndex) => {
              const graphBookmarkTitle = graph.state
                ? `Gráfica: ${graph.state}`
                : `Gráfica ${gIndex + 1}`;

              const bookmarkProps = {
                bookmark: { title: graphBookmarkTitle, fit: true },
              };

              return (
                <View key={`g-${gIndex}`} style={reportStyles.graphBlock}>
                  {graph.info && Object.keys(graph.info).length > 0 && (
                    <View style={reportStyles.infoContainer} wrap={false}>
                      {Object.entries(graph.info).map(([key, value]) => (
                        <View key={key} style={reportStyles.infoRow}>
                          <Text style={reportStyles.infoKey}>{key}:</Text>
                          <Text style={reportStyles.infoValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View wrap={false} {...bookmarkProps}>
                    <Image src={graph.blobUrl} style={reportStyles.graph} />
                  </View>

                  {graph.maps.map((map, mIndex) => (
                    <View
                      key={`m-${mIndex}`}
                      style={reportStyles.mapBlock}
                      wrap={false}
                    >
                      <Text style={reportStyles.mapTitle}>
                        {map.title}, mapa {mIndex + 1}
                      </Text>
                      <Image src={map.blobUrl} style={reportStyles.map} />
                    </View>
                  ))}
                </View>
              );
            })}

            <Text
              style={reportStyles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                pageNumber > 1 ? `${pageNumber} / ${totalPages}` : ""
              }
              fixed
            />
          </Page>
        );
      })}
    </Document>
  );
}
