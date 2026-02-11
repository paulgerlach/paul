import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPdfModel } from "@/lib/heating-bill/types";

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
    padding: 24,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pageNumber: { fontSize: 8, color: colors.text },
  logo: { width: 80, height: 20 },
  paragraph: { fontSize: 8, marginBottom: 12, color: colors.text },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    backgroundColor: colors.accent2,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  subTitle: { fontWeight: "bold", color: colors.dark, marginBottom: 4 },
  table: { width: "100%", fontSize: 8 },
  tableHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    textTransform: "uppercase",
  },
  tableHeaderCell: {
    textAlign: "left",
    padding: 4,
    backgroundColor: colors.accent,
    flex: 1,
  },
  tableRow: { flexDirection: "row" },
  tableCell: { padding: 4, flex: 1 },
  summaryRow: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 12,
  },
  classificationTable: { width: "100%", fontSize: 8, marginBottom: 8 },
  classificationRow: { flexDirection: "row" },
  classificationCell: { paddingVertical: 4, paddingHorizontal: 2, flex: 1 },
  classificationSummaryRow: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 12,
    padding: 4,
  },
  levelsTable: { width: "100%", fontSize: 8 },
  levelsHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    backgroundColor: colors.accent,
  },
  levelsHeaderCell: { padding: 4, textAlign: "left" },
  levelsRow: { flexDirection: "row" },
  levelsCell: { padding: 4 },
  highlightedRow: { backgroundColor: colors.accent2, color: "white" },
  qrCode: { width: 40, height: 40 },
  link: { color: colors.link, textDecoration: "none" },
});

export default function HeatingBillPreviewFivePDF({
  co2,
  cover,
  logoSrc = "/admin_logo.png",
}: {
  co2: HeatingBillPdfModel["co2"];
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.headerTop}>
          <Text style={styles.pageNumber}>
            5/6 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src={logoSrc} />
        </View>
      </View>

      <Text style={styles.paragraph}>
        Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz
        (BEHG) für fossile Brennstoffe erhoben, welche Kohlenstoffdioxid (CO2)
        emittieren. Das zum 01.01.2023 in Kraft getretene
        Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die Aufteilung
        der CO2-Kosten zwischen Mieter und Vermieter.
      </Text>

      <Text style={styles.sectionTitle}>CO2-Kostenaufteilung</Text>
      <Text style={styles.subTitle}>Energieart: Nah-/Fernwärme</Text>

      <View style={[styles.table, { marginBottom: 24 }]}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>POSITION</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>DATUM</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>
            Menge in kWh
          </Text>
          <Text style={[styles.tableHeaderCell, { flex: 3, textAlign: "right" }]}>
            CO2-Emissionen in kg
          </Text>
          <Text style={[styles.tableHeaderCell, { flex: 3, textAlign: "right" }]}>
            CO2-Kosten in EUR
          </Text>
        </View>
        {co2.energyRows.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{row.label}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{row.date}</Text>
            <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
              {row.kWhFormatted}
            </Text>
            <Text style={[styles.tableCell, { flex: 3, textAlign: "right" }]}>
              {row.co2KgFormatted}
            </Text>
            <Text style={[styles.tableCell, { flex: 3, textAlign: "right" }]}>
              {row.costFormatted}
            </Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Gesamt</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{co2.totalKwhFormatted}</Text>
          <Text style={[styles.tableCell, { flex: 3 }]}>{co2.totalCo2KgFormatted}</Text>
          <Text style={[styles.tableCell, { flex: 3 }]}>{co2.totalCostFormatted}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)
      </Text>
      <View style={[styles.classificationTable, { marginBottom: 8 }]}>
        <View style={styles.classificationRow}>
          <Text style={styles.classificationCell}>
            CO2-Emissionen der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            {co2.totalCo2KgFormatted} kg CO2
          </Text>
          <Text style={[styles.classificationCell, { paddingLeft: 16 }]}>
            CO2-Kosten der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            {co2.totalCostFormatted}
          </Text>
        </View>
        <View style={styles.classificationRow}>
          <Text style={styles.classificationCell}>
            Gesamtwohnfläche der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            {co2.totalLivingSpaceM2Formatted} m²
          </Text>
          <Text style={[styles.classificationCell, { paddingLeft: 16 }]}>
            CO2-Emissionsfaktor
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            {co2.emissionFactorFormatted} kg CO2/kWh
          </Text>
        </View>
        <View style={styles.classificationSummaryRow}>
          <Text style={{ flex: 3 }}>CO²-Emission pro m² Wohnfläche</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>
            {co2.emissionPerM2Formatted} kg CO2/m²/a
          </Text>
        </View>
      </View>

      <View style={[styles.levelsTable, { marginBottom: 24 }]}>
        <View style={styles.levelsHeader}>
          <Text style={[styles.levelsHeaderCell, { flex: 6 }]}>
            CO2-Emission pro m² Wohnfläche und Jahr
          </Text>
          <Text style={[styles.levelsHeaderCell, { flex: 2 }]}>
            Anteil Mieter
          </Text>
          <Text style={[styles.levelsHeaderCell, { flex: 2 }]}>
            Anteil Vermieter
          </Text>
        </View>
        {co2.classificationTable.map((item, index) => (
          <View
            key={index}
            style={[
              styles.levelsRow,
              item.isHighlighted ? styles.highlightedRow : {},
            ]}
          >
            <Text style={[styles.levelsCell, { flex: 6 }]}>{item.rangeLabel}</Text>
            <Text style={[styles.levelsCell, { flex: 2 }]}>
              {item.tenantPercent} %
            </Text>
            <Text style={[styles.levelsCell, { flex: 2 }]}>
              {item.landlordPercent} %
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.table}>
        <View style={styles.summaryRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            Gesamt CO2-Kosten der Liegenschaft
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {co2.buildingTotalCostFormatted}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            Ihr Anteil ({co2.selectedTierTenantPercent} %)
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {co2.unitTenantCostFormatted}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            Anteil Vermieter ({co2.selectedTierLandlordPercent} %)
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {co2.unitLandlordCostFormatted}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {co2.unitTotalCostFormatted}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
        <Image style={styles.qrCode} src={co2.qrCodeUrl} />
        <Text style={{ flex: 1 }}>
          Weitere Informationen unter{" "}
          <Text style={styles.link}>{co2.infoLink}</Text>
        </Text>
      </View>
    </Page>
  );
}
