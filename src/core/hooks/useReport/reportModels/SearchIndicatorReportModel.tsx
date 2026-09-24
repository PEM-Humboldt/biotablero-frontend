import { Document } from "@react-pdf/renderer";
import { CoverPage } from "@hooks/useReport/reportModels/searchIndicatorReportModel/CoverPage";
import type {
  ReportMetadata,
  SearchContext,
  SearchSection as SearchSectionType,
} from "@appTypes/report";
import { SearchPolygonSection } from "@hooks/useReport/reportModels/searchIndicatorReportModel/AboutSearchPolygon";
import { SearchSection } from "@hooks/useReport/reportModels/searchIndicatorReportModel/SearchSection";
import { Credits } from "@hooks/useReport/reportModels/searchIndicatorReportModel/Credits";
import { documentInfo } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/documentInfo";

export function SearchIndicatorReportModel({
  context,
  metadata,
  sections,
}: {
  context: SearchContext;
  metadata: ReportMetadata;
  sections: Map<string, SearchSectionType>;
}) {
  return (
    <Document
      title={documentInfo.title(context.area.name ?? "Polígono personalizado")}
      author={documentInfo.author(metadata.madeBy.name, metadata.madeBy.email)}
      subject={documentInfo.subject}
    >
      <CoverPage
        context={context}
        metadata={metadata}
        indicatorsAmount={sections.size}
      />

      <SearchPolygonSection context={context} metadata={metadata} />

      {[...sections.entries()].map(([key, section]) => (
        <SearchSection key={key} section={section} metadata={metadata} />
      ))}

      <Credits metadata={metadata} />
    </Document>
  );
}
