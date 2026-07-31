import { View, Page, Text, Image } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { Header } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/footer";
import type { IndicatorSection, ReportMetadata } from "@appTypes/report";
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
    <Page size="A4" style={styles.page}>
      <View>
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
          />
          <TagCategory
            label="Escala Biológica"
            items={section.BiologicalGroupTag}
          />
        </View>

        {section.graphs.map((g, i) => (
          <Fragment key={g.id ?? i}>
            <View style={styles.chartBox} wrap={false}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendSwatch,
                      { backgroundColor: "#e84a5f" },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {g.id || `Gráfica ${i + 1}`}
                  </Text>
                </View>
              </View>

              {g.blobUrl && (
                <Image
                  src={g.blobUrl}
                  style={[
                    styles.indicatorImage,
                    { width: "100%", objectFit: "contain", marginBottom: 8 },
                  ]}
                />
              )}
            </View>

            {g.userNote && (
              <View style={styles.noteBox} wrap={false}>
                <Text style={styles.noteLabel}>
                  Nota de {metadata.madeBy.name ?? metadata.madeBy.username}
                </Text>
                <Text style={styles.noteText}>{g.userNote}</Text>
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
      </View>
    </Page>
  );
}

function TagCategory({
  label,
  items,
}: {
  label: string;
  items?: Array<{ name: string }>;
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.conceptGroup}>
      <Text style={styles.conceptTitle}>{label}</Text>
      <View style={styles.pillRow}>
        {items.map((e, i) => (
          <Text key={i} style={styles.pill}>
            {e.name}
          </Text>
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
