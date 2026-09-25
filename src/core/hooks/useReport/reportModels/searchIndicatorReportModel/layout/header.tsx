import { View, Text } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/styles";

export function Header({
  title,
  break: brk = false,
  graphId,
  graphIndex,
  graphsTotal,
}: {
  title: string;
  break?: boolean;
  graphId?: string | number;
  graphIndex?: number;
  graphsTotal?: number;
}) {
  const showGraphInfo =
    graphId !== undefined &&
    graphIndex !== undefined &&
    !!graphsTotal &&
    graphsTotal > 1;

  return (
    <View style={styles.sectionHeader} break={brk} fixed>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>

      {showGraphInfo && (
        <View style={styles.sectionHeaderMetaRow}>
          <Text style={styles.sectionHeaderMetaValue}>valor: {graphId}</Text>
          <Text style={styles.sectionHeaderMetaCounter}>
            {graphIndex} / {graphsTotal}
          </Text>
        </View>
      )}
    </View>
  );
}
