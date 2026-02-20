import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPdfModel } from "@/app/api/generate-heating-bill/_lib";

const colors = {
  accent: "#DDE9E0",
  accent2: "#7F9D86",
  dark: "#083123",
  text: "#0D282FCC",
  title: "#5A917F",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: colors.text,
  },
  headerBox: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 24,
    color: colors.dark,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.text,
  },
  logo: {
    width: 80,
    height: 20,
  },
  headerMain: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-end",
  },
  headerMainCol: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
    color: colors.dark,
  },
  infoGrid: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 8,
  },
  infoLabel: {
    width: 75,
  },
  infoValue: {
    flex: 1,
  },
  bold: {
    fontWeight: 700,
    color: colors.dark,
  },
  textMuted: {
    color: colors.text,
  },
  heidiAddress: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    paddingBottom: 4,
    marginBottom: 8,
  },
  recipientAddress: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.dark,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.title,
    marginBottom: 16,
  },
  costTableTitle: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    fontWeight: "bold",
    padding: "4 8",
    color: colors.dark,
    marginTop: 8,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  tableCell: {
    paddingHorizontal: 8,
  },
  sumRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 8,
    padding: "4 8",
    fontWeight: "bold",
    color: colors.dark,
  },
  totalAmountBox: {
    backgroundColor: colors.accent2,
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  totalAmountText: {
    color: "white",
    fontWeight: "bold",
  },
  totalAmountValue: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  reliefBox: {
    backgroundColor: colors.accent2,
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 9,
    marginTop: 8,
  },
  reliefGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  reliefDivider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: "white",
    width: "100%",
  },
  consumptionTable: {
    width: "100%",
    marginTop: 5,
  },
  consumptionThead: {
    flexDirection: "row",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: colors.dark,
    paddingVertical: 4,
    fontSize: 8,
  },
  consumptionTh: {
    textAlign: "left",
  },
  consumptionTbody: {
    color: colors.text,
  },
  consumptionTr: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  consumptionTd: {
    textAlign: "left",
  },
  consumptionSumRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 8,
    padding: "4 8",
    fontWeight: "bold",
    color: colors.dark,
    marginTop: 4,
  },
  footer: {
    marginTop: 32,
    fontSize: 9,
    color: colors.text,
  },
});

export default function HeatingBillPreviewFourPDF({
  unitBreakdown,
  cover,
  logoSrc = "/admin_logo.png",
}: {
  unitBreakdown: HeatingBillPdfModel["unitBreakdown"];
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}) {
  const ub = unitBreakdown;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.headerTop}>
          <Text style={styles.pageNumber}>
            3/5 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src={logoSrc} />
        </View>
        <View style={styles.headerMain}>
          <View style={styles.headerMainCol}>
            <Text style={styles.headerTitle}>
              Ihre Heidi Systems ® Abrechnung für {"\n"} Heizung, Warmwasser,
              Kaltwasser
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.bold]}>Liegenschaft</Text>
                <Text style={styles.infoValue}>
                  {ub.contractorsNames}
                  {"\n"}
                  {ub.street}
                  {"\n"}
                  {ub.zip}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Erstellt im Auftrag von
                </Text>
                <Text style={styles.infoValue}>
                  {ub.contractorsNames}
                  {"\n"}
                  {ub.street}
                  {"\n"}
                  {ub.zip}
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.bold]}>
                  Liegenschaftsnummer
                </Text>
                <Text style={[styles.infoLabel, styles.bold]}>
                  {cover.propertyNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Heidi Nutzernummer
                </Text>
                <Text style={styles.infoValue}>{cover.heidiCustomerNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Abrechnungszeitraum
                </Text>
                <Text style={styles.infoValue}>
                  {ub.billingPeriodStart} - {ub.billingPeriodEnd}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  erstellt am
                </Text>
                <Text style={styles.infoValue}>{ub.createdAt}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerMainCol}>
            <View style={styles.heidiAddress}>
              <Text>Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin</Text>
            </View>
            <Text style={styles.recipientAddress}>
              {ub.contractorsNames}
              {"\n"}
              {ub.street}
              {"\n"}
              {ub.zip}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ihre Kosten</Text>
        <Text style={styles.costTableTitle}>Kosten für Heizung</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Grundkosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.livingSpaceM2Formatted} m² Wohnfläche
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.heatingBaseCostCalc.split(" x ")[1] ?? ub.heatingBaseCostCalc}
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              {ub.heatingBaseCostFormatted}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Verbrauchskosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.heatingConsumptionMwhFormatted} MWh
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.heatingConsumptionCalc.split(" x ")[1] ?? ub.heatingConsumptionCalc}
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              {ub.heatingConsumptionCostFormatted}
            </Text>
          </View>
        </View>

        <Text style={styles.costTableTitle}>Kosten für Warmwasser</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Grundkosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.livingSpaceM2Formatted} m² Wohnfläche
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.warmWaterBaseCostCalc.split(" x ")[1] ?? ub.warmWaterBaseCostCalc}
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              {ub.warmWaterBaseCostFormatted}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Verbrauchskosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.warmWaterConsumptionM3Formatted} m³
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              {ub.warmWaterConsumptionCalc.split(" x ")[1] ?? ub.warmWaterConsumptionCalc}
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              {ub.warmWaterConsumptionCostFormatted}
            </Text>
          </View>
          <View style={[styles.sumRow, { marginTop: 4 }]}>
            <Text style={{ flex: 1 }}>
              Summe Kosten für Heizung und Warmwasser
            </Text>
            <Text style={{ textAlign: "right" }}>
              {ub.heatingAndWarmWaterTotalFormatted}
            </Text>
          </View>
        </View>

        <Text style={styles.costTableTitle}>Kosten für Kaltwasser</Text>
        <View style={styles.table}>
          {ub.coldWaterItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
                {item.label}
              </Text>
              <Text
                style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
              >
                {item.volumeFormatted} {item.unit}
              </Text>
              <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
              <Text
                style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
              >
                {item.rateFormatted} {item.rateUnit}
              </Text>
              <Text
                style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
              >
                =
              </Text>
              <Text
                style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
              >
                {item.costFormatted}
              </Text>
            </View>
          ))}
          <View style={[styles.sumRow, { marginTop: 4 }]}>
            <Text style={{ flex: 1 }}>Summe Kosten für Kaltwasser</Text>
            <Text style={{ textAlign: "right" }}>{ub.coldWaterTotalFormatted}</Text>
          </View>
        </View>

        <View style={styles.totalAmountBox}>
          <Text style={styles.totalAmountText}>Gesamtbetrag</Text>
          <Text style={styles.totalAmountValue}>{ub.grandTotalFormatted}</Text>
        </View>
      </View>

      {ub.stateRelief && (
        <View style={styles.reliefBox}>
          <View style={styles.reliefGrid}>
            <Text style={{ flex: 4, color: "white", fontWeight: "bold" }}>
              Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)
            </Text>
            <Text style={{ flex: 1, color: "white" }}>Betrag</Text>
            <Text style={{ flex: 1, textAlign: "right", color: "white" }}>
              Ihr Anteil
            </Text>
          </View>
          <View style={styles.reliefDivider} />
          <View style={styles.reliefGrid}>
            <Text style={{ flex: 4, color: "white" }}>{ub.stateRelief.label}</Text>
            <Text style={{ flex: 1, color: "white" }}>
              {ub.stateRelief.buildingTotalFormatted}
            </Text>
            <Text style={{ flex: 1, textAlign: "right", color: "white" }}>
              {ub.stateRelief.unitShareFormatted}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ihre Verbrauchswerte</Text>

        <Text style={styles.costTableTitle}>Heizung in MWh</Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>GERÄTENUMMER</Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
          </View>
          <View style={styles.consumptionTbody}>
            {ub.heatingDevices.map((device, i) => (
              <View key={i} style={styles.consumptionTr}>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.location}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 2 }]}>
                  {device.deviceNumber}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.deviceType}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.startReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.endReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.consumptionFormatted}
                </Text>
              </View>
            ))}
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 5 }}>Summe Heizung</Text>
              <Text style={{ flex: 1 }}>{ub.heatingDevicesTotalFormatted}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.costTableTitle, { marginTop: 10 }]}>
          Warmwasser in m³
        </Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>GERÄTENUMMER</Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
          </View>
          <View style={styles.consumptionTbody}>
            {ub.warmWaterDevices.map((device, i) => (
              <View key={i} style={styles.consumptionTr}>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.location}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 2 }]}>
                  {device.deviceNumber}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.deviceType}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.startReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.endReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.consumptionFormatted}
                </Text>
              </View>
            ))}
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 5 }}>Summe Warmwasser</Text>
              <Text style={{ flex: 1 }}>{ub.warmWaterDevicesTotalFormatted}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.costTableTitle, { marginTop: 10 }]}>
          Kaltwasser in m³
        </Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>GERÄTENUMMER</Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
          </View>
          <View style={styles.consumptionTbody}>
            {ub.coldWaterDevices.map((device, i) => (
              <View key={i} style={styles.consumptionTr}>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.location}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 2 }]}>
                  {device.deviceNumber}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                  {device.deviceType}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.startReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.endReadingFormatted}
                </Text>
                <Text style={[styles.consumptionTd, { flex: 1 }]}>
                  {device.consumptionFormatted}
                </Text>
              </View>
            ))}
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 5 }}>Summe Kaltwasser</Text>
              <Text style={{ flex: 1 }}>{ub.coldWaterDevicesTotalFormatted}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>
          Detaillierte Berechnung und Verteilung auf alle Nutzeinheiten des
          Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte wenden Sie
          sich bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder
          Verwalter. Informationen zur verbrauchsabhängigen Abrechnung finden
          Sie unter www.heidisystems.com.
        </Text>
      </View>
    </Page>
  );
}
