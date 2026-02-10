

import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { formatDateGerman, formatEuro } from "@/utils";
import type { CalculatedBillData } from "@/actions/generate/generateHeatingBillPDF";

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
  data,
}: {
  data: CalculatedBillData;
}) {
  const { page2Data, mainDoc, objekt, user, contracts } = data;
  const contractors = contracts.flatMap((c) => c.contractors);
  const contractorsNames = contractors.map((c) => `${c.first_name} ${c.last_name}`).join(", ");

  // Safe access to page2Data (it should be populated by the action)
  if (!page2Data) return <Text>Loading Page 2 Data...</Text>;

  const { breakdowns, sums, calculation } = page2Data;

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            2/6 {objekt?.id.substring(0, 8)}/{user?.id.substring(0, 8)}
          </Text>
          <View>
            {data.logoPath ? (
              <Image
                style={{ width: 80, height: 20 }}
                src={data.logoPath}
              />
            ) : null}
          </View>
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
                <Text>{contractorsNames}</Text>
                <Text>{objekt?.street}</Text>
                <Text>{objekt?.zip}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Liegenschaftsnummer</Text>
                <Text>{objekt?.id.substring(0, 8)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Abrechnungszeitraum</Text>
                <Text>
                  {formatDateGerman(mainDoc?.start_date)} -{" "}
                  {formatDateGerman(mainDoc?.end_date)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>erstellt am</Text>
                <Text>
                  {formatDateGerman(mainDoc?.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Cost breakdown tables */}
      <View style={styles.costBreakdown}>
        <Text style={styles.sectionTitle}>Aufstellung der Kosten</Text>
        <View style={styles.tableContainer}>
          {/* Energy table */}
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

            {breakdowns.energy.map((inv, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{inv.purpose || 'Rechnung'}</Text>
                <Text style={styles.tableCell}>{formatDateGerman(inv.invoice_date)}</Text>
                <Text style={styles.tableCell}>{/* Individual kWh hidden usually, or show if parsed */}</Text>
                <Text style={styles.tableCellRight}>{formatEuro(Number(inv.total_amount))}</Text>
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
                {/* Total kWh Sum */}
                {calculation.totalBuildingHeatConsumption.toLocaleString('de-DE')}
              </Text>
              <Text
                style={[
                  styles.tableCellRight,
                  { fontWeight: "bold", color: colors.dark },
                ]}
              >
                {formatEuro(sums.energy)}
              </Text>
            </View>
          </View>

          {/* Heating costs table */}
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
              <Text style={styles.tableCellRight}>{formatEuro(sums.energy)}</Text>
            </View>

            {breakdowns.operating.map((inv, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{inv.purpose || 'Betriebskosten'}</Text>
                <Text style={styles.tableCell}>{formatDateGerman(inv.invoice_date)}</Text>
                <Text style={styles.tableCellRight}>{formatEuro(Number(inv.total_amount))}</Text>
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
                {formatEuro(sums.totalHeatingSystemCost)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Costs for separate distribution */}
      <View style={styles.costBreakdown}>
        <Text style={styles.sectionTitle}>
          Kosten für gesonderte Verteilung
        </Text>
        <View style={styles.tableContainer}>
          {/* Distribution types - Static for now or derive from data */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>VERTEILUNG NACH</Text>
            </View>
            {breakdowns.separate.map((inv, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{inv.cost_type}</Text>
              </View>
            ))}
          </View>

          {/* Distribution costs */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>POSITION</Text>
              <Text style={styles.tableHeaderCell}>DATUM</Text>
              <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
            </View>

            {breakdowns.separate.map((inv, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCell}>{inv.purpose || inv.cost_type}</Text>
                <Text style={styles.tableCell}>{formatDateGerman(inv.invoice_date)}</Text>
                <Text style={styles.tableCellRight}>{formatEuro(Number(inv.total_amount))}</Text>
              </View>
            ))}

            {/* Sum row */}
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
                {formatEuro(sums.separate)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Summe der zu verteilenden Kosten</Text>
              <Text>{formatEuro(sums.totalHeatingSystemCost + sums.separate)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cost allocation – Warmwasser */}
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
              2,5 kWh/m³/K x {calculation.totalBuildingWaterVolume.toLocaleString('de-DE')} m³ x (60-10°C)
            </Text>
            <Text style={{ textAlign: "center" }}>1,15 ??</Text>
            {/* TODO: What is 1,15? Factor? If formula is 2.5 * V * 50, where does 1.15 fit? Ignoring for now */}
          </View>
          <Text style={{ color: "#FFFFFF" }}>
            = {calculation.Q_ww.toLocaleString('de-DE')} kWh Nah-/Fernwärme
          </Text>
          <Text style={{ color: "#FFFFFF" }}>= {calculation.percentageWW.toFixed(2)} % d. Gesamtverbr.</Text>
        </View>
      </View>
      <View style={styles.allocationRow}>
        <Text>
          {calculation.percentageWW.toFixed(2)} % aus {formatEuro(sums.totalHeatingSystemCost)} Energie- und Heizungsbetriebskosten
          entspricht Kosten für Erwärmung Warmwasser
        </Text>
        <Text>{formatEuro(calculation.costShareWW)}</Text>
      </View>
      <View style={styles.allocationBox}>
        <Text>Kosten für Warmwasser</Text>
        <Text>{formatEuro(calculation.costShareWW)}</Text>
      </View>

      <View style={styles.allocationGrid}>
        <Text style={styles.allocationLabelBold}>
          davon {calculation.fixedSharePercent}% Grundkosten
        </Text>
        <Text>{formatEuro(calculation.wwFixedCostTotal)} :</Text>
        <Text>{data.totalLivingSpace.toLocaleString('de-DE')} m²</Text>
        <Text>= {formatEuro(calculation.wwFixedPricePerM2)}/m²</Text>
      </View>
      <View style={styles.allocationGrid}>
        <Text style={styles.allocationLabelBold}>
          davon {calculation.variableSharePercent}%
          Verbrauchskosten
        </Text>
        <Text>{formatEuro(calculation.wwVariableCostTotal)} :</Text>
        <Text>{calculation.totalBuildingWaterVolume.toLocaleString('de-DE')} m³</Text>
        <Text>= {formatEuro(calculation.wwVariablePricePerM3)}/m³</Text>
      </View>

      {/* 
      TODO: Calculate Unit Prices (Price per m2 / Price per m3)
      Currently hardcoded or derived from totals / living space.
      We need data.totalLivingSpace and data.totalBuildingConsumption
      */}

      {/* Cost allocation – Heizung */}
      <View style={styles.costBreakdown}>
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
          Berechnung und Aufteilung der Kosten für Heizung
        </Text>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            Summe Energie- und Heizungsbetriebskosten
          </Text>
          <Text>{formatEuro(sums.totalHeatingSystemCost)}</Text>
        </View>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            abzüglich Kosten für Erwärmung Warmwasser
          </Text>
          <Text>-{formatEuro(calculation.costShareWW)}</Text>
        </View>
        <View style={styles.allocationRow}>
          <Text style={styles.allocationLabelBold}>
            Gerätemiete Heizung/Warmwasser
          </Text>
          <Text>0,00 €</Text>
        </View>
        <View style={styles.allocationBox}>
          <Text>Kosten für Heizung</Text>
          <Text>{formatEuro(calculation.costShareHeating)}</Text>
        </View>
        <View style={styles.allocationGrid}>
          <Text style={styles.allocationLabelBold}>davon {calculation.fixedSharePercent} % Grundkosten</Text>
          <Text>{formatEuro(calculation.heatFixedCostTotal)} :</Text>
          <Text>{data.totalLivingSpace.toLocaleString('de-DE')} m²</Text>
          <Text>= {formatEuro(calculation.heatFixedPricePerM2)}/m²</Text>
        </View>
        <View style={styles.allocationGrid}>
          <Text style={styles.allocationLabelBold}>
            davon {calculation.variableSharePercent} % Verbrauchskosten
          </Text>
          <Text>{formatEuro(calculation.heatVariableCostTotal)} :</Text>
          <Text>{(calculation.totalBuildingHeatConsumption / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} MWh</Text>
          <Text>= {formatEuro(calculation.heatVariablePricePerMWh)}/MWh</Text>
        </View>
      </View>
    </Page>
  );
}
