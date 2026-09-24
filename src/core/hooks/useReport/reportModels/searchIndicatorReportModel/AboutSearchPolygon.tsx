import { View, Text, Link, Page } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/styles";
import { colors } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/theme";
import { Header } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/footer";
import type { ReportMetadata, SearchContext } from "@appTypes/report";
import { REPORT_PAGE_SIZE } from "@config/report";
import { documentInfo } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/documentInfo";

export function SearchPolygonSection({
  context,
  metadata,
}: {
  context: SearchContext;
  metadata: ReportMetadata;
}) {
  const title = `${context.area.type}${context.area?.name ? ` - ${context.area.name}` : ""}`;
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{
        title: title,
        fit: true,
      }}
    >
      <Header title={documentInfo.aboutSearch.header} />

      <Text style={[styles.titleGeneral, { fontSize: 16, marginBottom: 1 }]}>
        {title}
      </Text>

      <View style={styles.metricGrid}>
        {context.area.size !== undefined && (
          <View style={styles.metricCard}>
            <View style={styles.metricCardInner}>
              <Text style={styles.metricLabel}>
                {documentInfo.aboutSearch.stats.areaLabel}
              </Text>
              <Text style={styles.metricValue}>
                {Math.round(context.area.size)}
                {context.area.type ? (
                  <Text style={styles.metricUnit}>
                    {documentInfo.aboutSearch.stats.areaUnit}
                  </Text>
                ) : null}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.block, { marginTop: 8 }]}>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>
            {documentInfo.aboutSearch.stats.polygonType}
          </Text>
          <Text style={styles.kvVal}>{context.area.type}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>
            {documentInfo.aboutSearch.searchUrlLabel}
          </Text>
          <Link
            src={context.searchUrl}
            style={[styles.kvVal, { color: colors.coral }]}
          >
            {context.searchUrl}
          </Link>
        </View>
      </View>

      <Footer metadata={metadata} />
    </Page>
  );
}
