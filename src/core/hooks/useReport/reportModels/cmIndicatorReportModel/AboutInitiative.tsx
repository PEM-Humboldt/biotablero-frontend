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
import { REPORT_PAGE_SIZE } from "@config/monitoring";
import { documentInfo } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/documentInfo";

export function InitiativeSection({
  context,
  metadata,
}: {
  context: IndicatorContext;
  metadata: ReportMetadata;
}) {
  return (
    <Page
      size={REPORT_PAGE_SIZE}
      style={styles.page}
      bookmark={{ title: context.initiativeName, fit: true }}
    >
      <Header title={documentInfo.aboutInitiative.header} />

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
                {documentInfo.aboutInitiative.stats.areaLabel}
              </Text>
              <Text style={styles.metricValue}>
                {Math.round(context.initiativeStats.area)}
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
              <Text style={styles.metricLabel}>
                {documentInfo.aboutInitiative.stats.localitieslabel}
              </Text>
              <Text style={styles.metricValue}>
                {context.initiativeStats.localitiesUnderMonitoring}
              </Text>
            </View>
          </View>
        )}

        {context.initiativeStats?.monitoringEvents !== undefined && (
          <View style={styles.metricCard}>
            <View style={styles.metricCardInner}>
              <Text style={styles.metricLabel}>
                {documentInfo.aboutInitiative.stats.monitoringEventslabel}
              </Text>
              <Text style={styles.metricValue}>
                {context.initiativeStats.monitoringEvents}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.block, { marginTop: 8 }]}>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>
            {documentInfo.aboutInitiative.creationDateLabel}
          </Text>
          <Text style={styles.kvVal}>{context.initiativeCreationDate}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>
            {documentInfo.aboutInitiative.locationLabel}
          </Text>
          <Text style={styles.kvVal}>{context.initiativeLocation}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>
            {documentInfo.aboutInitiative.initiativeUrlLabel}
          </Text>
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
          title={documentInfo.aboutInitiative.tagsLabel.political}
          items={context.politicalTags}
        />
        <LinkList
          title={documentInfo.aboutInitiative.tagsLabel.social}
          items={context.socialTags}
        />
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
                      {item.url}
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
