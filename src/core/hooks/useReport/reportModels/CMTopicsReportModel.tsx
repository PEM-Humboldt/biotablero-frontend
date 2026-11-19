import { Document } from "@react-pdf/renderer";
import { CoverPage } from "@hooks/useReport/reportModels/cmTopicReportModel/CoverPage";
import type {
  TopicContext,
  TopicSection as TopicSectionType,
  ReportMetadata,
} from "@appTypes/report";
import { InitiativeSection } from "@hooks/useReport/reportModels/cmTopicReportModel/AboutInitiative";
import { TopicSection } from "@hooks/useReport/reportModels/cmTopicReportModel/TopicSection";
import { Credits } from "@hooks/useReport/reportModels/cmTopicReportModel/Credits";
import { documentInfo } from "@hooks/useReport/reportModels/cmTopicReportModel/layout/documentInfo";

export function CMTopicsReportModel({
  context,
  metadata,
  sections,
}: {
  context: TopicContext;
  metadata: ReportMetadata;
  sections: Map<string, TopicSectionType>;
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
        topicsAmount={sections.size}
      />

      <InitiativeSection context={context} metadata={metadata} />

      {[...sections.entries()].map(([key, section]) => (
        <TopicSection key={key} section={section} metadata={metadata} />
      ))}

      <Credits metadata={metadata} />
    </Document>
  );
}
