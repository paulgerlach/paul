import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPdfModel } from "@/app/api/generate-heating-bill/_lib";

const colors = {
  accent: "#DDE9E0",
  accent2: "#7F9D86",
  dark: "#083123",
  text: "#0D282FCC",
  title: "#5A917F",
  link: "#6BCAAA",
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
    padding: 16,
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: { fontSize: 7 },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  titleLeft: { width: "50%" },
  titleRight: { width: "50%", fontSize: 8 },
  mainTitle: {
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  subtitle: { fontSize: 8 },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: { width: "48%", marginBottom: 6 },
  detailLabel: { fontWeight: "bold", color: "#083123" },
  costBreakdown: { marginTop: 7 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.title,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    paddingBottom: 4,
    marginBottom: 8,
  },
  tableContainer: { flexDirection: "row", justifyContent: "space-between" },
  table: { width: "48%", fontSize: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.accent2,
    borderRadius: 6,
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
    color: "#FFFFFF",
  },
  tableHeaderCellRight: {
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    color: "#FFFFFF",
  },
  tableRow: { flexDirection: "row", marginBottom: 1 },
  tableCell: { flex: 1 },
  tableCellRight: { flex: 1, textAlign: "right" },
  sumRow: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sumRowAccent2: {
    backgroundColor: colors.accent2,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  totalRow: {
    backgroundColor: colors.accent2,
    color: "#ffffff",
    padding: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    fontWeight: "bold",
  },
  costAllocationBox: {
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    backgroundColor: colors.accent2,
  },
  costAllocationHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
    marginBottom: 6,
  },
  allocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  allocationLabelBold: { fontWeight: "700", color: colors.dark },
  allocationBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.accent,
    borderRadius: 6,
    padding: 4,
    marginTop: 4,
    fontWeight: "bold",
  },
  formulaBox: {
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#FFFFFF",
    padding: 4,
    marginTop: 4,
    fontWeight: "bold",
  },
  allocationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
});

export default function HeatingBillPreviewTwoPDF({
  buildingCalc,
  cover,
  logoSrc = "/admin_logo.png",
}: {
  buildingCalc: HeatingBillPdfModel["buildingCalc"];
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}) {
  const bc = buildingCalc;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            2/6 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <Image style={{ width: 80, height: 20 }} src={logoSrc} />
        </View>
        <View style={styles.titleSection}>
          <View style={styles.titleLeft}>
            <Text style={styles.mainTitle}>
              Heidi Systems® Gesamtrechnung{"\n"}Heizung, Warmwasser, Kaltwasser
            </Text>
            <Text style={styles.subtitle}>
              Die Gesamtabrechnung bildet die Aufteilung der Kosten für das
              gesamte Gebäude ab. Die anteiligen Kosten Ihrer Nutzeinheit
              entnehmen Sie bitte dem Formular &quot;Ihre Abrechnung&quot;.
            </Text>
          </View>
          <View style={styles.titleRight}>
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Liegenschaft</Text>
                <Text>{cover.contractorsNames}</Text>
                <Text>{cover.street}</Text>
                <Text>{cover.zip}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Liegenschaftsnummer</Text>
                <Text>{cover.propertyNumber}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Abrechnungszeitraum</Text>
                <Text>
                  {cover.billingPeriodStart} - {cover.billingPeriodEnd}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>erstellt am</Text>
                <Text>{cover.createdAt}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.costBreakdown}>
        <Text style={styles.sectionTitle}>Aufstellung der Kosten</Text>
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 5,
                color: colors.dark,
              }}
            >
              Energieart: Nah-/Fernwärme kWh
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>POSITION</Text>
              <Text style={styles.tableHeaderCell}>DATUM</Text>
              <Text style={styles.tableHeaderCell}>kWh</Text>
              <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
            </View>
            {bc.energyRelief && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{bc.energyRelief.label}</Text>
                <Text style={styles.tableCell}></Text>
                <Text style={styles.tableCell}></Text>
                <Text style={styles.tableCellRight}>{bc.energyRelief.amountFormatted}</Text>
              </View>
            )}
            {bc.energyInvoices.map((inv, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{inv.label}</Text>
                <Text style={styles.tableCell}>{inv.date}</Text>
                <Text style={styles.tableCell}>{inv.kWhFormatted}</Text>
                <Text style={styles.tableCellRight}>{inv.amountFormatted}</Text>
              </View>
            ))}
            <View style={[styles.tableRow, styles.sumRow]}>
              <Text
                style={[
                  styles.tableCell,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                Summe Verbrauch
              </Text>
              <Text style={styles.tableCell}></Text>
              <Text
                style={[
                  styles.tableCell,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                {bc.energyTotalKwhFormatted}
              </Text>
              <Text
                style={[
                  styles.tableCellRight,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                {bc.energyTotalAmountFormatted}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 5,
                color: colors.dark,
              }}
            >
              Weitere Heizungsbetriebskosten
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>POSITION</Text>
              <Text style={styles.tableHeaderCell}>DATUM</Text>
              <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Übertrag</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCellRight}>{bc.heatingCostCarryOverFormatted}</Text>
            </View>
            {bc.heatingCostItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.label}</Text>
                <Text style={styles.tableCell}>{item.date}</Text>
                <Text style={styles.tableCellRight}>{item.amountFormatted}</Text>
              </View>
            ))}
            <View style={[styles.tableRow, styles.sumRow]}>
              <Text
                style={[
                  styles.tableCell,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                Summe Energie- und Heizungsbetriebskosten
              </Text>
              <Text
                style={
                  (styles.tableCellRight,
                    { fontWeight: "bold", color: colors.dark })
                }
              >
                {bc.heatingCostTotalFormatted}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.costBreakdown}>
        <Text style={styles.sectionTitle}>
          Kosten für gesonderte Verteilung
        </Text>
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>VERTEILUNG NACH</Text>
            </View>
            {[
              "Heizung",
              "Warmwasser/Kaltwasser",
              "Warmwasser/Kaltwasser",
              "Warmwasser/Kaltwasser",
              "Nutzeinheit",
              "Warmwasser",
            ].map((v, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{v}</Text>
              </View>
            ))}
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>POSITION</Text>
              <Text style={styles.tableHeaderCell}>DATUM</Text>
              <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
            </View>
            {bc.distributionCostItems.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{item.label}</Text>
                <Text style={styles.tableCell}>{cover.createdAt}</Text>
                <Text style={styles.tableCellRight}>{item.amountFormatted}</Text>
              </View>
            ))}
            <View style={[styles.sumRow]}>
              <Text
                style={[
                  styles.tableCell,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                Summe Kosten zur gesonderten Verteilung
              </Text>
              <Text
                style={[
                  styles.tableCellRight,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                {bc.distributionCostTotalFormatted}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Summe der zu verteilenden Kosten</Text>
              <Text>{bc.grandTotalFormatted}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.costAllocationBox}>
        <Text style={styles.costAllocationHeader}>Aufteilung der Kosten</Text>
        <Text style={{ fontWeight: "bold", marginBottom: 4, color: "#FFFFFF" }}>
          Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
        </Text>
        <View style={styles.allocationRow}>
          <View style={styles.formulaBox}>
            <Text
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
                fontWeight: 400,
              }}
            >
              {bc.warmWater.constantFactor} kWh/m³/K x {bc.warmWater.volumeM3Formatted} m³ x ({bc.warmWater.tempDiffHigh}-{bc.warmWater.tempDiffLow}°C)
            </Text>
            <Text style={{ textAlign: "center" }}>{bc.warmWater.conversionFactor}</Text>
          </View>
          <Text style={{ color: "#FFFFFF" }}>
            = {bc.warmWater.energyKwhFormatted} kWh Nah-/Fernwärme
          </Text>
          <Text style={{ color: "#FFFFFF" }}>= {bc.warmWater.energySharePercentFormatted} % d. Gesamtverbr.</Text>
        </View>
      </View>
      <View style={styles.allocationRow}>
        <Text>
          {bc.warmWater.energySharePercentFormatted} % aus {bc.heatingCostTotalFormatted} Energie- und Heizungsbetriebskosten
          entspricht Kosten für Erwärmung Warmwasser
        </Text>
        <Text>{bc.warmWater.costFromEnergyFormatted}</Text>
      </View>
      <View style={styles.allocationRow}>
        <Text style={styles.allocationLabelBold}>
          Gerätemiete Heizung/Warmwasser
        </Text>
        <Text>{bc.warmWater.deviceRentalFormatted}</Text>
      </View>
      <View style={styles.allocationBox}>
        <Text>Kosten für Warmwasser</Text>
        <Text>{bc.warmWater.totalCostFormatted}</Text>
      </View>
      <View style={styles.allocationGrid}>
        <Text style={styles.allocationLabelBold}>
          davon {bc.warmWater.baseCostPercent}% Grundkosten
        </Text>
        <Text>{bc.warmWater.baseCostAmountFormatted} :</Text>
        <Text>{bc.warmWater.baseCostAreaFormatted} m²</Text>
        <Text>= {bc.warmWater.baseCostRatePerM2Formatted} €/m²</Text>
      </View>
      <View style={styles.allocationGrid}>
        <Text style={styles.allocationLabelBold}>
          davon {bc.warmWater.consumptionCostPercent}%
          Verbrauchskosten
        </Text>
        <Text>{bc.warmWater.consumptionCostAmountFormatted} :</Text>
        <Text>{bc.warmWater.consumptionCostVolumeFormatted} m³</Text>
        <Text>= {bc.warmWater.consumptionCostRatePerM3Formatted} €/m³</Text>
      </View>

      <View style={styles.costBreakdown}>
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
          Berechnung und Aufteilung der Kosten für Heizung
        </Text>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            Summe Energie- und Heizungsbetriebskosten
          </Text>
          <Text>{bc.heatingCostTotalFormatted}</Text>
        </View>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            abzüglich Kosten für Erwärmung Warmwasser
          </Text>
          <Text>-{bc.warmWater.costFromEnergyFormatted}</Text>
        </View>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            Gerätemiete Heizung/Warmwasser
          </Text>
          <Text>{bc.heating.deviceRentalFormatted}</Text>
        </View>
        <View style={styles.allocationBox}>
          <Text>Kosten für Heizung</Text>
          <Text>{bc.heating.totalCostFormatted}</Text>
        </View>
        <View style={styles.allocationGrid}>
          <Text style={styles.allocationLabelBold}>davon {bc.heating.baseCostPercent} % Grundkosten</Text>
          <Text>{bc.heating.baseCostAmountFormatted} :</Text>
          <Text>{bc.heating.baseCostAreaFormatted} m²</Text>
          <Text>= {bc.heating.baseCostRatePerM2Formatted} €/m²</Text>
        </View>
        <View style={styles.allocationGrid}>
          <Text style={styles.allocationLabelBold}>
            davon {bc.heating.consumptionCostPercent} % Verbrauchskosten
          </Text>
          <Text>{bc.heating.consumptionCostAmountFormatted} :</Text>
          <Text>{bc.heating.consumptionMwhFormatted} MWh</Text>
          <Text>= {bc.heating.consumptionCostRatePerMwhFormatted} €/MWh</Text>
        </View>
      </View>
    </Page>
  );
}
