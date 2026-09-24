import { View, Text } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";

export function Header({
  title,
  break: brk = false,
}: {
  title: string;
  break?: boolean;
}) {
  return (
    <View style={styles.sectionHeader} break={brk}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );
}
