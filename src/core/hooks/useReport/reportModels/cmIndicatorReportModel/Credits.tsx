import { Page, View, Text } from "@react-pdf/renderer";
import { REPORT_PAGE_SIZE } from "@config/monitoring";
import type { ReportMetadata } from "@appTypes/report";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
import { Footer } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/footer";
import { documentInfo } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/documentInfo";

export function Credits({ metadata }: { metadata: ReportMetadata }) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: documentInfo.credits.about, fit: true }}
    >
      <View style={{ marginTop: 4 }}>
        <Text style={styles.disclaimerLabel}>{documentInfo.credits.about}</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>{documentInfo.credits.madeBy}</Text>
          <Text style={styles.kvVal}>
            {metadata.madeBy.name} ({metadata.madeBy.username})
          </Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>{documentInfo.credits.contact}</Text>
          <Text style={[styles.kvVal, { color: colors.coral }]}>
            {metadata.madeBy.email}
          </Text>
        </View>
        <View style={[styles.disclaimerBox, { marginTop: 12 }]}>
          <Text style={styles.disclaimerLabel}>
            {documentInfo.credits.disclaimer.title}
          </Text>
          {documentInfo.credits.disclaimer.content.split("\n").map((p) => (
            <Text style={styles.disclaimerText}>{p}</Text>
          ))}
        </View>
      </View>
      <Footer metadata={metadata} />
    </Page>
  );
}
