"use client";

import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/types";
import { type HeatingBillPreviewFourCalculated } from "../HeatingBillPreview/HeatingBillPreviewFourView";
import { formatEuro } from "@/utils";

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
  previewData,
  data,
}: {
  previewData: HeatingBillPreviewData;
  data: HeatingBillPreviewFourCalculated;
}) {
  const formatter = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const rateFormatter = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  const { costCalculations } = data;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            3/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
          </Text>
          <Image style={{ width: 80, height: 20 }} src="/admin_logo.png" />
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>
          Berechnung und Aufteilung der Kosten für Kaltwasser
        </Text>
      </View>

      <View style={styles.summaryTopRow}>
        <Text>Kosten für Kaltwasser</Text>
        <Text>{formatEuro(costCalculations.coldwater.total)}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Kaltwasser
          </Text>
          <Text style={styles.cellRight}>{formatter.format(costCalculations.coldwater.consumption)} m³ *</Text>
          <Text style={styles.cellRight}>{rateFormatter.format(costCalculations.coldwater.rates.kaltwasser)} €/m³ =</Text>
          <Text style={styles.cellRight}>{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.kaltwasser)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Abwasser Gesamt
          </Text>
          <Text style={styles.cellRight}>{formatter.format(costCalculations.coldwater.consumption)} m³ *</Text>
          <Text style={styles.cellRight}>{rateFormatter.format(costCalculations.coldwater.rates.abwasser)} €/m³ =</Text>
          <Text style={styles.cellRight}>{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.abwasser)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Gerätemiete Kaltwasser
          </Text>
          <Text style={styles.cellRight}>{formatter.format(costCalculations.coldwater.consumption)} m³ *</Text>
          <Text style={styles.cellRight}>{rateFormatter.format(costCalculations.coldwater.rates.geraetmiete)} €/m³ =</Text>
          <Text style={styles.cellRight}>{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.geraetmiete)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Abrechnung Kaltwasser
          </Text>
          <Text style={styles.cellRight}>1,00 Nutzeinh. *</Text>
          <Text style={styles.cellRight}>{rateFormatter.format(costCalculations.coldwater.rates.abrechnung)} €/Nutzeinh. =</Text>
          <Text style={styles.cellRight}>{formatEuro(costCalculations.coldwater.rates.abrechnung)}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Text>Summe Ihrer Kosten für Kaltwasser</Text>
        <Text>{formatEuro(costCalculations.coldwater.total)}</Text>
      </View>
    </Page>
  );
}
