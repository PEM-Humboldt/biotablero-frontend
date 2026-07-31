import { View, Text, Link, Page } from "@react-pdf/renderer";
import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import { colors } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/theme";
import { Header } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/header";
import { Footer } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/footer";
import type {
  IndicatorContext,
  IndicatorTag,
  ReportMetadata,
} from "@appTypes/report";
import { LOCALE } from "@config/monitoring";
import { makeLocationsString } from "@hooks/useReport/reportModels/cmIndicatorReportModel/utils/formatters";

export function InitiativeSection({
  context,
  metadata,
}: {
  context: IndicatorContext;
  metadata: ReportMetadata;
}) {
  const locations = makeLocationsString(context.initiativeLocation);

  return (
    <Page size="A4" style={styles.page}>
      <View>
        <Header title="Perfil de la iniciativa" />

        <Text style={[styles.titleGeneral, { fontSize: 16, marginBottom: 1 }]}>
          {context.initiativeName}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: colors.coral,
            marginBottom: 8,
          }}
        >
          {context.initiativeShortName}
        </Text>
        <Text style={styles.paragraph}>{context.initiativeDescription}</Text>

        <View style={styles.metricGrid}>
          {context.initiativeStats?.area !== undefined && (
            <View style={styles.metricCard}>
              <View style={styles.metricCardInner}>
                <Text style={styles.metricLabel}>
                  Área bajo monitoreo comunitario
                </Text>
                <Text style={styles.metricValue}>
                  {Number(context.initiativeStats.area.toFixed(2))}
                  {context.initiativeStats?.areaUnit ? (
                    <Text
                      style={styles.metricUnit}
                    >{` ${context.initiativeStats?.areaUnit}`}</Text>
                  ) : null}
                </Text>
              </View>
            </View>
          )}

          {context.initiativeStats?.localitiesUnderMonitoring !== undefined && (
            <View style={styles.metricCard}>
              <View style={styles.metricCardInner}>
                <Text style={styles.metricLabel}>Municipios monitoreados</Text>
                <Text style={styles.metricValue}>
                  {context.initiativeStats.localitiesUnderMonitoring}
                </Text>
              </View>
            </View>
          )}

          {context.initiativeStats?.monitoringEvents !== undefined && (
            <View style={styles.metricCard}>
              <View style={styles.metricCardInner}>
                <Text style={styles.metricLabel}>Eventos de monitoreo</Text>
                <Text style={styles.metricValue}>
                  {context.initiativeStats.monitoringEvents}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.block, { marginTop: 8 }]}>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Fecha de creación</Text>
            <Text style={styles.kvVal}>
              {new Date(context.initiativeCreationDate).toLocaleDateString(
                LOCALE,
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Ubicación</Text>
            <Text style={styles.kvVal}>{locations}</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Enlace</Text>
            <Link
              src={context.initiativeUrl}
              style={[styles.kvVal, { color: colors.coral }]}
            >
              {context.initiativeUrl}
            </Link>
          </View>
        </View>

        <View style={{ marginTop: 6 }}>
          <LinkList
            title="Vínculos institucionales"
            items={context.politicalTags}
          />
          <LinkList
            title="Vínculos con la sociedad civil"
            items={context.socialTags}
          />
        </View>
      </View>

      <Footer metadata={metadata} />
    </Page>
  );
}

function LinkList({ title, items }: { title: string; items: IndicatorTag[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.vinculoGroup} wrap={false}>
      <Text style={styles.vinculoTitle}>{title}</Text>
      {items.map((item) => {
        const name = item?.fullName
          ? `${item.fullName}, ${item.name}`
          : item.name;
        return (
          <View key={item?.fullName || item.name} style={styles.vinculoItem}>
            <Text style={styles.vinculoBullet}>•</Text>
            <View style={styles.vinculoBody}>
              <Text>
                <Text style={styles.vinculoName}>{name}</Text>
                {item?.url !== undefined && (
                  <>
                    <Text style={styles.vinculoName}> — </Text>
                    <Link src={item.url} style={styles.vinculoUrl}>
                      https://{item.url}
                    </Link>
                  </>
                )}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
