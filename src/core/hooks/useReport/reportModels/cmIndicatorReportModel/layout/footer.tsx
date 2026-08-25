import { View, Text } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { Wordmark } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/branding";
import type { ReportMetadata } from "@appTypes/report";

export function Footer({ metadata }: { metadata: ReportMetadata }) {
  return (
    <View style={styles.footer} fixed>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Wordmark size={8} />
        <Text style={[styles.footerText, { marginLeft: 6 }]}>
          Reporte del {metadata.creationDate}. Elaborado por{" "}
          {metadata.madeBy.name}, {metadata.madeBy.email}.
        </Text>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  );
}
