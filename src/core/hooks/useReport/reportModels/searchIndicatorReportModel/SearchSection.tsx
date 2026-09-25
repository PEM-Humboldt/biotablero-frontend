import { View, Page, Text, Image } from "@react-pdf/renderer";

import { styles } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/footer";
import type {
  ReportMetadata,
  SearchSection as SearchSectionType,
} from "@appTypes/report";
import { REPORT_PAGE_SIZE } from "@config/report";
import { useMemo } from "react";
import { documentInfo } from "@hooks/useReport/reportModels/searchIndicatorReportModel/layout/documentInfo";

export function SearchSection({
  section,
  metadata,
}: {
  section: SearchSectionType;
  metadata: ReportMetadata;
}) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: section.title, fit: true }}
    >
      {section.graphs.map((graph, index) => (
        <View key={graph.id} break={index > 0}>
          <Header
            title={section.title}
            graphId={graph.id}
            graphIndex={index + 1}
            graphsTotal={section.graphs.length}
          />

          {graph.mapUrl && (
            <View style={styles.chartBox} wrap={false}>
              <View style={styles.graphStateRow}>
                <View style={styles.graphStateItem}>
                  <Text style={styles.h4}>
                    {documentInfo.SearchSection.grapMapLabel(graph.id)}
                  </Text>
                </View>
              </View>
              <Image src={graph.mapUrl} style={styles.indicatorMap} />
            </View>
          )}

          <View style={styles.chartBox} wrap={false}>
            <View style={styles.graphStateRow}>
              <View style={styles.graphStateItem}>
                <Text style={styles.h4}>
                  {documentInfo.SearchSection.metricsInGraphLabel(graph.id)}
                </Text>
              </View>
            </View>
            <Image src={graph.blobUrl} style={styles.indicatorImage} />
          </View>

          {section.rawData && section.rawData.length > 0 && (
            <View style={styles.chartBox}>
              <Text style={styles.h4} minPresenceAhead={100}>
                {documentInfo.SearchSection.dataInLabel(graph.id)}
              </Text>
              <DynamicPdfTable data={section.rawData} />
            </View>
          )}

          {graph.userNote && (
            <View style={styles.noteBox} wrap={false}>
              <Text style={styles.noteLabel}>
                {documentInfo.SearchSection.userNoteTitleLabel(
                  metadata.madeBy.name ?? metadata.madeBy.username,
                )}
              </Text>
              <Text style={styles.noteText}>{graph.userNote}</Text>
            </View>
          )}
        </View>
      ))}

      {section.description ? (
        <View style={styles.quoteBox} wrap={false}>
          <Text style={styles.h4}>
            {documentInfo.SearchSection.sectionDescriptionLabel}
          </Text>
          <Text style={styles.quoteText}>{section.description}</Text>
        </View>
      ) : null}

      {section?.graphInfo &&
        Object.entries(section.graphInfo).map(([item, description]) => (
          <LabeledBlock key={item} label={item}>
            {description}
          </LabeledBlock>
        ))}

      <Footer metadata={metadata} />
    </Page>
  );
}

export function LabeledBlock({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  if (!children) {
    return null;
  }

  return (
    <View style={styles.block} wrap={false}>
      <Text style={styles.h4}>{label}</Text>
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}

type CsvCell = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvCell>;

export function DynamicPdfTable({ data }: { data: CsvRow[] }) {
  const headers = Object.keys(data[0]);

  const columnWidths = useMemo(() => {
    const maxLengths = headers.map((header) => {
      const maxContentLength = data.reduce((max, row) => {
        const val = row[header];
        const len = val !== null && val !== undefined ? String(val).length : 1;
        return Math.max(max, len);
      }, header.length);

      return Math.max(maxContentLength, 8);
    });

    const totalWeight = maxLengths.reduce((sum, len) => sum + len, 0);

    return maxLengths.map(
      (len) => `${((len / totalWeight) * 100).toFixed(2)}%`,
    );
  }, [data, headers]);

  return !data || data.length === 0 ? null : (
    <View style={styles.tableContainer} wrap={true}>
      <View style={styles.tableHeaderRow} wrap={false}>
        {headers.map((header, index) => (
          <View
            key={header}
            style={[styles.tableCellHeader, { width: columnWidths[index] }]}
          >
            <Text style={styles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>

      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow} wrap={false}>
          {headers.map((header, colIndex) => {
            const cellValue = row[header];
            const displayValue =
              cellValue === null || cellValue === undefined
                ? "-"
                : String(cellValue);

            return (
              <View
                key={`${rowIndex}-${header}`}
                style={[styles.tableCell, { width: columnWidths[colIndex] }]}
              >
                <Text style={styles.tableCellText}>{displayValue}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
