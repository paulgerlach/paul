"use client";

import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";

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
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
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
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  table: { width: "100%", fontSize: 8, marginBottom: 10 },
  tableRow: { flexDirection: "row", paddingVertical: 2 },
  cell: { flex: 1 },
  cellRight: { flex: 1, textAlign: "right" },
  headerBox: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
});

export default function HeatingBillPreviewThreePDF({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) {
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

      <View style={styles.summaryRow}>
        <Text>Kosten für Kaltwasser</Text>
        <Text>41.468,88 €</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Kaltwasser
          </Text>
          <Text style={styles.cellRight}>17.036,69 € :</Text>
          <Text style={styles.cellRight}>9.943,14 m³ =</Text>
          <Text style={styles.cellRight}>1,713411 €/m³</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Abwasser Gesamt
          </Text>
          <Text style={styles.cellRight}>20.030,62 € :</Text>
          <Text style={styles.cellRight}>9.943,14 m³ =</Text>
          <Text style={styles.cellRight}>2,014517 €/m³</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Gerätemiete Kaltwasser
          </Text>
          <Text style={styles.cellRight}>2.274,90 € :</Text>
          <Text style={styles.cellRight}>9.943,14 m³ =</Text>
          <Text style={styles.cellRight}>0,228791 €/m³</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { fontWeight: "bold", color: "#083123" }]}>
            Abrechnung Kaltwasser
          </Text>
          <Text style={styles.cellRight}>2.126,67 € :</Text>
          <Text style={styles.cellRight}>123,00 Nutzeinh. =</Text>
          <Text style={styles.cellRight}>17,290000 €/Nutzeinh.</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Text>Summe Ihrer Kosten für Kaltwasser</Text>
        <Text>153,80 €</Text>
      </View>
    </Page>
  );
}
