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
    color: "#0D282FCC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: { fontSize: 7 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5A917F",
    borderBottomWidth: 2,
    borderBottomColor: "#083123",
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryRow: {
    backgroundColor: colors.dark,
    padding: 4,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  summaryTopRow: {
    backgroundColor: colors.accent,
    padding: 4,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 8,
  },
  table: { width: "100%", fontSize: 8, marginBottom: 10 },
  tableRow: { flexDirection: "row", paddingVertical: 2 },
  cell: { flex: 1 },
  cellRight: { flex: 1, textAlign: "right" },
  headerBox: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
});

export default function HeatingBillPreviewThreePDF({
  coldWater,
  cover,
  logoSrc = "/admin_logo.png",
}: {
  coldWater: HeatingBillPdfModel["coldWater"];
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            3/6 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <Image style={{ width: 80, height: 20 }} src={logoSrc} />
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>
          Berechnung und Aufteilung der Kosten für Kaltwasser
        </Text>
      </View>

      <View style={styles.summaryTopRow}>
        <Text>Kosten für Kaltwasser</Text>
        <Text>{coldWater.totalCostFormatted}</Text>
      </View>

      <View style={styles.table}>
        {coldWater.rateItems.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
              {item.label}
            </Text>
            <Text style={styles.cellRight}>{item.totalCostFormatted} :</Text>
            <Text style={styles.cellRight}>{item.totalVolumeFormatted} {item.unit} =</Text>
            <Text style={styles.cellRight}>{item.rateFormatted} {item.rateUnit}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryRow}>
        <Text>Summe Ihrer Kosten für Kaltwasser</Text>
        <Text>{coldWater.unitTotalCostFormatted}</Text>
      </View>
    </Page>
  );
}
