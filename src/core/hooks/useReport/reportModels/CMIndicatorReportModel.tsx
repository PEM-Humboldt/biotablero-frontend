import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
// import { Footer } from "./components/Common";
import { CoverPage } from "@hooks/useReport/reportModels/cmIndicatorReportModel/CoverPage";
import type {
  IndicatorContext,
  IndicatorSection as IndicatorSectionType,
  ReportMetadata,
} from "@appTypes/report";
import { InitiativeSection } from "@hooks/useReport/reportModels/cmIndicatorReportModel/AboutInitiative";
import { IndicatorSection } from "@hooks/useReport/reportModels/cmIndicatorReportModel/IndicatorSection";
// import { InitiativeSection } from "./sections/InitiativeSection";
// import { IndicatorSection } from "./sections/IndicatorSection";

export function CMIndicatorReportModel({
  context,
  metadata,
  sections,
}: {
  context: IndicatorContext;
  metadata: ReportMetadata;
  sections: Map<string, IndicatorSectionType>;
}) {
  return (
    <Document
      title={`Reporte de indicadores — ${context.initiativeName}`}
      author={`${metadata.madeBy.name}, mail: ${metadata.madeBy.email}`}
      subject="Monitoreo Comunitario · BioTablero"
    >
      <CoverPage
        context={context}
        metadata={metadata}
        indicatorsAmount={sections.size}
      />

      <InitiativeSection context={context} metadata={metadata} />

      {[...sections.entries()].map(([key, section]) => (
        <IndicatorSection key={key} section={section} metadata={metadata} />
      ))}

      {/* <Page size="A4" style={styles.page}> */}
      {/*   <View style={{ marginTop: 4 }}> */}
      {/*     <Text style={styles.disclaimerLabel}>Información del reporte</Text> */}
      {/*     <View style={styles.kvRow}> */}
      {/*       <Text style={styles.kvKey}>Elaborado por</Text> */}
      {/*       <Text style={styles.kvVal}>{metadata.usuarioNombre}</Text> */}
      {/*     </View> */}
      {/*     <View style={styles.kvRow}> */}
      {/*       <Text style={styles.kvKey}>Contacto</Text> */}
      {/*       <Text style={[styles.kvVal, { color: colors.coral }]}> */}
      {/*         {metadata.usuarioCorreo} */}
      {/*       </Text> */}
      {/*     </View> */}
      {/*     <View style={[styles.disclaimerBox, { marginTop: 12 }]}> */}
      {/*       <Text style={styles.disclaimerLabel}>Aviso legal</Text> */}
      {/*       <Text style={styles.disclaimerText}>{metadata.disclaimer}</Text> */}
      {/*     </View> */}
      {/*   </View> */}
      {/*   <Footer meta={metadata} /> */}
      {/* </Page> */}
    </Document>
  );
}
