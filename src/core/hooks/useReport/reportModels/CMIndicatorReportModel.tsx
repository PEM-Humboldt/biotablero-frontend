import { Document } from "@react-pdf/renderer";
import { CoverPage } from "@hooks/useReport/reportModels/cmIndicatorReportModel/CoverPage";
import type {
  IndicatorContext,
  IndicatorSection as IndicatorSectionType,
  ReportMetadata,
} from "@appTypes/report";
import { InitiativeSection } from "@hooks/useReport/reportModels/cmIndicatorReportModel/AboutInitiative";
import { IndicatorSection } from "@hooks/useReport/reportModels/cmIndicatorReportModel/IndicatorSection";
import { Credits } from "@hooks/useReport/reportModels/cmIndicatorReportModel/Credits";
import { documentInfo } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/documentInfo";

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
      title={documentInfo.title(context.initiativeName)}
      author={documentInfo.author(metadata.madeBy.name, metadata.madeBy.email)}
      subject={documentInfo.subject}
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

      <Credits metadata={metadata} />
    </Document>
  );
}
