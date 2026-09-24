import { View, Page, Text, Image, Link } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/footer";
import type {
  ReportMetadata,
  SearchSection as SearchSectionType,
} from "@appTypes/report";
import { REPORT_PAGE_SIZE } from "@config/report";
import { Fragment } from "react";
import { documentInfo } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/documentInfo";

export function SearchSection({
  section,
  metadata,
}: {
  section: SearchSectionType;
  metadata: ReportMetadata;
}) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: section.title, fit: true }}
    >
      <Header title={section.title} />

      {section.graphs.map((graph) => (
        <Fragment key={graph.id}>
          {graph.mapUrl && (
            <View style={styles.chartBox} wrap={false}>
              <View style={styles.graphStateRow}>
                <View style={styles.graphStateItem}>
                  <Text style={styles.graphStateText}>
                    {documentInfo.SearchSection.grapMapLabel(graph.id)}
                  </Text>
                </View>
              </View>
              <Image src={graph.mapUrl} style={styles.indicatorMap} />
            </View>
          )}

          <View style={styles.chartBox} wrap={false}>
            <View style={styles.graphStateRow}>
              <View style={styles.graphStateItem}>
                <Text style={styles.graphStateText}>
                  {documentInfo.SearchSection.metricsInGraphLabel(graph.id)}
                </Text>
              </View>
            </View>

            {graph.blobUrl && (
              <Image src={graph.blobUrl} style={styles.indicatorImage} />
            )}
          </View>

          {graph.userNote && (
            <View style={styles.noteBox} wrap={false}>
              <Text style={styles.noteLabel}>
                {documentInfo.SearchSection.userNoteTitleLabel(
                  metadata.madeBy.name ?? metadata.madeBy.username,
                )}
              </Text>
              <Text style={styles.noteText}>{graph.userNote}</Text>
            </View>
          )}
        </Fragment>
      ))}

      {section.description ? (
        <View style={styles.quoteBox} wrap={false}>
          <Text style={styles.h4}>
            {documentInfo.SearchSection.sectionDescriptionLabel}
          </Text>
          <Text style={styles.quoteText}>{section.description}</Text>
        </View>
      ) : null}

      {section?.graphInfo &&
        Object.entries(section.graphInfo).map(([item, description]) => (
          <LabeledBlock key={item} label={item}>
            {description}
          </LabeledBlock>
        ))}

      <Footer metadata={metadata} />
    </Page>
  );
}

export function LabeledBlock({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  if (!children) {
    return null;
  }

  return (
    <View style={styles.block} wrap={false}>
      <Text style={styles.h4}>{label}</Text>
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}
