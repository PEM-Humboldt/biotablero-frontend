import { Page, View, Text, Image, Link } from "@react-pdf/renderer";
import InitiativeReportCover from "@assets/InitiativeReportCover.png";

import type { IndicatorContext, ReportMetadata } from "@appTypes/report";

import { styles } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/styles";
import {
  Wordmark,
  Slogan,
  HumboldtLogo,
} from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/branding";
import { documentInfo } from "@hooks/useReport/reportModels/cmIndicatorReportModel/layout/documentInfo";

export function CoverPage({
  context,
  metadata,
  indicatorsAmount,
}: {
  context: IndicatorContext;
  metadata: ReportMetadata;
  indicatorsAmount: number;
}) {
  return (
    <Page
      size="A4"
      style={styles.coverPage}
      bookmark={{
        title: documentInfo.coverPage.bookmarkTitle,
        fit: true,
      }}
    >
      <View style={styles.coverImageBox}>
        <Image src={InitiativeReportCover} style={styles.coverImage} />
      </View>

      <View style={styles.coverBody}>
        <Text style={styles.coverKicker}>{documentInfo.coverPage.subject}</Text>
        <Text style={styles.titleGeneral}>{context.initiativeName}</Text>
        {context.initiativeShortName && (
          <Text style={styles.coverInitiative}>
            {context.initiativeShortName}
          </Text>
        )}
        <Text style={[styles.textGeneral, { marginTop: 8 }]}>
          {documentInfo.coverPage.initiativeContext(
            context.initiativeLocation,
            context.initiativeCreationDate,
          )}
        </Text>

        <View style={styles.coverMetaRow}>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>
              {documentInfo.coverPage.madeInDate}
            </Text>
            <Text style={styles.coverMetaValue}>{metadata.creationDate}</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>
              {documentInfo.coverPage.madeInBy}
            </Text>
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
            <Text style={styles.coverMetaLabel}>
              {documentInfo.coverPage.indicatorsAmount}
            </Text>
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
