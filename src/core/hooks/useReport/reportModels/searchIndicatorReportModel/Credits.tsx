import { Page, View, Text, Link } from "@react-pdf/renderer";
import { REPORT_PAGE_SIZE } from "@config/report";
import type { ReportMetadata, SearchContext } from "@appTypes/report";
import { styles } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/styles";
import { colors } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/theme";
import { Footer } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/footer";
import { documentInfo } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/documentInfo";

export function Credits({
  metadata,
  context,
}: {
  metadata: ReportMetadata;
  context: SearchContext;
}) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: documentInfo.credits.about, fit: true }}
    >
      <View style={{ marginTop: 4 }}>
        <Text style={styles.disclaimerLabel}>{documentInfo.credits.about}</Text>

        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>{documentInfo.credits.searchUrl}</Text>
          <Text style={[styles.kvVal, { color: colors.coral }]}>
            <Link src={context.searchUrl} style={{ color: colors.coral }}>
              {context.searchUrl}
            </Link>
          </Text>
        </View>

        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>{documentInfo.credits.madeBy}</Text>
          <Text style={styles.kvVal}>{metadata.madeBy.name}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>{documentInfo.credits.contact}</Text>
          <Text style={[styles.kvVal, { color: colors.coral }]}>
            <Link
              src={`mailto:${metadata.madeBy.email}`}
              style={{ color: colors.coral }}
            >
              {metadata.madeBy.email}
            </Link>
          </Text>
        </View>
        <View style={[styles.disclaimerBox, { marginTop: 12 }]}>
          <Text style={styles.disclaimerLabel}>
            {documentInfo.credits.disclaimer.title}
          </Text>
          {documentInfo.credits.disclaimer.content
            .split("\n")
            .map((parr, i) => (
              <Text key={i} style={styles.disclaimerText}>
                {parr}
              </Text>
            ))}
        </View>
      </View>
      <Footer metadata={metadata} />
    </Page>
  );
}
