import { Page, View, Text, Image, Link } from "@react-pdf/renderer";
import InitiativeReportCover from "@assets/InitiativeReportCover.png";

import type { IndicatorContext, ReportMetadata } from "@appTypes/report";

import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import {
  Wordmark,
  Slogan,
  HumboldtLogo,
} from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/branding";
import { LOCALE } from "@config/monitoring";
import { makeLocationsString } from "@hooks/useReport/reportModels/cmIndicatorReportModel/utils/formatters";

export function CoverPage({
  context,
  metadata,
  indicatorsAmount,
}: {
  context: IndicatorContext;
  metadata: ReportMetadata;
  indicatorsAmount: number;
}) {
  const locations = makeLocationsString(context.initiativeLocation);
  return (
    <Page
      size="A4"
      style={styles.coverPage}
      bookmark={{
        title: "Reporte personalizado de Monitoreo Comunitario",
        fit: true,
      }}
    >
      <View style={styles.coverImageBox}>
        <Image src={InitiativeReportCover} style={styles.coverImage} />
      </View>

      <View style={styles.coverBody}>
        <Text style={styles.coverKicker}>
          Reporte de indicadores · Monitoreo Comunitario
        </Text>
        <Text style={styles.titleGeneral}>{context.initiativeName}</Text>
        {context.initiativeShortName && (
          <Text style={styles.coverInitiative}>
            {context.initiativeShortName}
          </Text>
        )}
        <Text style={[styles.textGeneral, { marginTop: 8 }]}>
          {locations} · Desde{" "}
          {new Date(context.initiativeCreationDate).toLocaleDateString(LOCALE, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <View style={styles.coverMetaRow}>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>Generado</Text>
            <Text style={styles.coverMetaValue}>{metadata.creationDate}</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>Elaborado por</Text>
            <Text style={styles.coverMetaValue}>{metadata.madeBy.name}</Text>
            <Text style={styles.coverMetaValue}>
              <Link
                src={`mailto:${metadata.madeBy.email}`}
                style={styles.coverMetaValue}
              >
                {metadata.madeBy.email}
              </Link>
            </Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>Indicadores</Text>
            <Text style={styles.coverMetaValue}>{indicatorsAmount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.coverBrandRow}>
        <HumboldtLogo height={56} />
        <View style={{ alignItems: "flex-end" }}>
          <Wordmark />
          <Slogan />
        </View>
      </View>
    </Page>
  );
}
