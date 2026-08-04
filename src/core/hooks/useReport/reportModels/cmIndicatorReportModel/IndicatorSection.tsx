import { View, Page, Text, Image } from "@react-pdf/renderer";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/footer";
import type {
  IndicatorSection,
  IndicatorTag,
  ReportMetadata,
} from "@appTypes/report";
import { LOCALE } from "@config/monitoring";
import { Fragment } from "react";

export function IndicatorSection({
  section,
  metadata,
}: {
  section: IndicatorSection;
  metadata: ReportMetadata;
}) {
  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: section.title, fit: true }}
    >
      <Header title={section.title} />

      <View style={styles.dateRow}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Creación</Text>
          <Text style={styles.dateVal}>
            {new Date(section.creationDate).toLocaleDateString(LOCALE, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Última actualización</Text>
          <Text style={styles.dateVal}>
            {new Date(section.lastUpdate).toLocaleDateString(LOCALE, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 6 }}>
        <TagCategory
          label="Ecosistemas Estratégicos"
          items={section.EcosystemTag}
          type="ecosystem"
        />
        <TagCategory
          label="Escala Biológica"
          items={section.BiologicalGroupTag}
          type="biologicalGroup"
        />
      </View>

      {section.graphs.map((graph) => (
        <Fragment key={graph.id}>
          <View style={styles.chartBox} wrap={false}>
            <View style={styles.graphStateRow}>
              <View style={styles.graphStateItem}>
                <Text style={styles.graphStateText}>
                  Gráfica del indicador para los valores de: {graph.id}
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
                Anotación de {metadata.madeBy.name ?? metadata.madeBy.username}
              </Text>
              <Text style={styles.noteText}>{graph.userNote}</Text>
            </View>
          )}
        </Fragment>
      ))}

      {section.description ? (
        <View style={styles.quoteBox} wrap={false}>
          <Text style={styles.h4}>¿Qué dice este indicador?</Text>
          <Text style={styles.quoteText}>{section.description}</Text>
        </View>
      ) : null}

      <LabeledBlock label="Metodología">
        {section.card.methodology}
      </LabeledBlock>
      <LabeledBlock label="Interpretación">
        {section.card.interpretation}
      </LabeledBlock>
      <LabeledBlock label="Consideraciones">
        {section.card.considerations}
      </LabeledBlock>
      <LabeledBlock label="Autoría">{section.card.authorship}</LabeledBlock>

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
