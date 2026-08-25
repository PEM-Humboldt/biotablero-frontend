import { View, Page, Text, Image, Link } from "@react-pdf/renderer";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/footer";
import type {
  IndicatorSection,
  IndicatorTag,
  ReportMetadata,
} from "@appTypes/report";
import { LOCALE, REPORT_PAGE_SIZE } from "@config/monitoring";
import { Fragment } from "react";
import { documentInfo } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/documentInfo";

export function IndicatorSection({
  section,
  metadata,
}: {
  section: IndicatorSection;
  metadata: ReportMetadata;
}) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: section.title, fit: true }}
    >
      <Header title={section.title} />

      <View style={styles.dateRow}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>
            {documentInfo.indicatorSection.creationDateLabel}
          </Text>
          <Text style={styles.dateVal}>
            {new Date(section.creationDate).toLocaleDateString(LOCALE, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>
            {documentInfo.indicatorSection.lastUpdateLabel}
          </Text>
          <Text style={styles.dateVal}>
            {new Date(section.lastUpdate).toLocaleDateString(LOCALE, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>
            {documentInfo.indicatorSection.indicatorUrlLabel}
          </Text>
          <Link
            src={section.url}
            style={[styles.kvVal, { color: colors.coral }]}
          >
            {section.url}
          </Link>
        </View>
      </View>

      <View style={{ marginBottom: 6 }}>
        <TagCategory
          label={documentInfo.indicatorSection.tagsLabel.ecosystem}
          items={section.EcosystemTag}
          type="ecosystem"
        />
        <TagCategory
          label={documentInfo.indicatorSection.tagsLabel.biologicalGroup}
          items={section.BiologicalGroupTag}
          type="biologicalGroup"
        />
      </View>

      {section.singleMap && section.graphs[0].mapUrl && (
        <View style={styles.chartBox} wrap={false}>
          <View style={styles.graphStateRow}>
            <View style={styles.graphStateItem}>
              <Text style={styles.graphStateText}>
                {documentInfo.indicatorSection.indicatorMapLabel}
              </Text>
            </View>
          </View>
          <Image src={section.graphs[0].mapUrl} style={styles.indicatorImage} />
        </View>
      )}

      {section.graphs.map((graph) => (
        <Fragment key={graph.id}>
          {!section.singleMap && graph.mapUrl && (
            <View style={styles.chartBox} wrap={false}>
              <View style={styles.graphStateRow}>
                <View style={styles.graphStateItem}>
                  <Text style={styles.graphStateText}>
                    {documentInfo.indicatorSection.grapMapLabel(graph.id)}
                  </Text>
                </View>
              </View>
              <Image src={graph.mapUrl} style={styles.indicatorImage} />
            </View>
          )}

          <View style={styles.chartBox} wrap={false}>
            <View style={styles.graphStateRow}>
              <View style={styles.graphStateItem}>
                <Text style={styles.graphStateText}>
                  {documentInfo.indicatorSection.metricsInGraphLabel(graph.id)}
                </Text>
              </View>
            </View>

            {graph.blobUrl && (
              <Image src={graph.blobUrl} style={styles.indicatorImage} />
            )}
          </View>

          {graph.userNote && (
            <View style={styles.noteBox} wrap={false}>
              <Text style={styles.noteLabel}>
                {documentInfo.indicatorSection.userNoteTitleLabel(
                  metadata.madeBy.name ?? metadata.madeBy.username,
                )}
              </Text>
              <Text style={styles.noteText}>{graph.userNote}</Text>
            </View>
          )}
        </Fragment>
      ))}

      {section.description ? (
        <View style={styles.quoteBox} wrap={false}>
          <Text style={styles.h4}>
            {documentInfo.indicatorSection.sectionDescriptionLabel}
          </Text>
          <Text style={styles.quoteText}>{section.description}</Text>
        </View>
      ) : null}

      <LabeledBlock label={documentInfo.indicatorSection.methodologyLabel}>
        {section.card.methodology}
      </LabeledBlock>
      <LabeledBlock label={documentInfo.indicatorSection.interpretationLabel}>
        {section.card.interpretation}
      </LabeledBlock>
      <LabeledBlock label={documentInfo.indicatorSection.considerationsLabel}>
        {section.card.considerations}
      </LabeledBlock>
      <LabeledBlock label={documentInfo.indicatorSection.authorshipLabel}>
        {section.card.authorship}
      </LabeledBlock>

      <Footer metadata={metadata} />
    </Page>
  );
}

const pillColors = {
  ecosystem: { backgroundColor: colors.ecoBg, color: colors.ecoText },
  biologicalGroup: {
    backgroundColor: colors.escalaBg,
    color: colors.escalaText,
  },
  theme: { backgroundColor: colors.temaBg, color: colors.temaText },
  default: { backgroundColor: colors.bgSoft, color: colors.textMuted },
} as const;

function TagCategory({
  label,
  items,
  type,
}: {
  label: string;
  items: IndicatorTag[];
  type?: keyof typeof pillColors;
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.conceptGroup}>
      <Text style={styles.conceptTitle}>{label}</Text>
      <View style={styles.pillRow}>
        {items.map((e) => (
          <View
            key={e.name}
            style={[styles.pill, pillColors[type ?? "default"]]}
          >
            <Text style={styles.pillText}>{e.name}</Text>
          </View>
        ))}
      </View>
    </View>
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
