import { View, Page, Text, Image, Link } from "@react-pdf/renderer";
import { colors } from "@hooks/useReport/layout/theme";
import { styles } from "@hooks/useReport/reportModels/cmTopicReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/cmTopicReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/cmTopicReportModel/layout/footer";
import type { TopicSection, TopicTag, ReportMetadata } from "@appTypes/report";
import { LOCALE } from "@config/global";
import { REPORT_PAGE_SIZE } from "@config/report";
import { Fragment, ReactNode } from "react";
import { documentInfo } from "@hooks/useReport/reportModels/cmTopicReportModel/layout/documentInfo";
import { parseSimpleMarkdown } from "@utils/textParser";

export function TopicSection({
  section,
  metadata,
}: {
  section: TopicSection;
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
            {documentInfo.topicSection.creationDateLabel}
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
            {documentInfo.topicSection.lastUpdateLabel}
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
            {documentInfo.topicSection.topciUrlLabel}
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
          label={documentInfo.topicSection.tagsLabel.ecosystem}
          items={section.EcosystemTag}
          type="ecosystem"
        />
        <TagCategory
          label={documentInfo.topicSection.tagsLabel.biologicalGroup}
          items={section.BiologicalGroupTag}
          type="biologicalGroup"
        />
      </View>

      {section.singleMap && section.graphs[0].mapUrl && (
        <View style={styles.chartBox} wrap={false}>
          <View style={styles.graphStateRow}>
            <View style={styles.graphStateItem}>
              <Text style={styles.graphStateText}>
                {documentInfo.topicSection.topicMapLabel}
              </Text>
            </View>
          </View>
          <Image src={section.graphs[0].mapUrl} style={styles.topicImage} />
        </View>
      )}

      {section.graphs.map((graph) => (
        <Fragment key={graph.id}>
          {!section.singleMap && graph.mapUrl && (
            <View style={styles.chartBox} wrap={false}>
              <View style={styles.graphStateRow}>
                <View style={styles.graphStateItem}>
                  <Text style={styles.graphStateText}>
                    {documentInfo.topicSection.grapMapLabel(graph.id)}
                  </Text>
                </View>
              </View>
              <Image src={graph.mapUrl} style={styles.topicImage} />
            </View>
          )}

          <View style={styles.chartBox} wrap={false}>
            <View style={styles.graphStateRow}>
              <View style={styles.graphStateItem}>
                <Text style={styles.graphStateText}>
                  {documentInfo.topicSection.metricsInGraphLabel(graph.id)}
                </Text>
              </View>
            </View>

            {graph.blobUrl && (
              <Image src={graph.blobUrl} style={styles.topicImage} />
            )}
          </View>

          {graph.userNote && (
            <View style={styles.noteBox} wrap={false}>
              <Text style={styles.noteLabel}>
                {documentInfo.topicSection.userNoteTitleLabel(
                  metadata.madeBy.name ?? metadata.madeBy.username,
                )}
              </Text>
              <Text style={styles.noteText}>{graph.userNote}</Text>
            </View>
          )}
        </Fragment>
      ))}

      {section?.description ? (
        <View style={styles.quoteBox} wrap={false}>
          <Text style={styles.h4}>
            {parseSimpleMarkdown(
              documentInfo.topicSection.sectionDescriptionLabel,
              { renderToPdf: true },
            )}
          </Text>
          <Text style={styles.quoteText}>{section.description}</Text>
        </View>
      ) : null}

      {section?.card?.methodology ? (
        <LabeledBlock label={documentInfo.topicSection.methodologyLabel}>
          {parseSimpleMarkdown(section.card.methodology, { renderToPdf: true })}
        </LabeledBlock>
      ) : null}

      {section?.card?.interpretation ? (
        <LabeledBlock label={documentInfo.topicSection.interpretationLabel}>
          {parseSimpleMarkdown(section.card.interpretation, {
            renderToPdf: true,
          })}
        </LabeledBlock>
      ) : null}

      {section?.card?.considerations ? (
        <LabeledBlock label={documentInfo.topicSection.considerationsLabel}>
          {parseSimpleMarkdown(section.card.considerations, {
            renderToPdf: true,
          })}
        </LabeledBlock>
      ) : null}

      {section?.card?.authorship ? (
        <LabeledBlock label={documentInfo.topicSection.authorshipLabel}>
          {parseSimpleMarkdown(section.card.authorship, {
            renderToPdf: true,
          })}
        </LabeledBlock>
      ) : null}

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
  items: TopicTag[];
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
  children: ReactNode;
}) {
  if (!children) {
    return null;
  }

  return (
    <View style={styles.block} wrap={false}>
      <Text style={styles.h4}>{label}</Text>
      <View style={styles.paragraph}>{children}</View>
    </View>
  );
}
