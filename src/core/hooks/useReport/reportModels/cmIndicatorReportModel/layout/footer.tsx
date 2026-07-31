import { View, Text } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { Wordmark } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/branding";
import type { ReportMetadata } from "@appTypes/report";
import { LOCALE } from "@config/monitoring";

export function Footer({ metadata }: { metadata: ReportMetadata }) {
  return (
    <View style={styles.footer} fixed>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Wordmark size={9} />
        <Text style={[styles.footerText, { marginLeft: 6 }]}>
          · Reporte del{" "}
          {new Date(metadata.creationDate).toLocaleDateString(LOCALE, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · Elaborado por {metadata.madeBy.name}, {metadata.madeBy.email}
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
