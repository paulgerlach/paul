"use client";

import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";
import { formatDateGerman } from "@/utils";

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
    marginBottom: 12,
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
  paragraph: { fontSize: 8, marginBottom: 12 },
  subSectionHeader: {
    backgroundColor: "#DDE9E0",
    fontWeight: "bold",
    padding: 2,
    paddingLeft: 4,
    fontSize: 8,
    marginBottom: 4,
  },
  table: { width: "100%", fontSize: 7 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontWeight: "normal",
    paddingVertical: 2,
    flex: 1,
    textAlign: "left",
  },
  tableHeaderCellRight: {
    fontWeight: "normal",
    paddingVertical: 2,
    flex: 1,
    textAlign: "right",
  },
  tableRow: { flexDirection: "row" },
  tableCell: { paddingVertical: 2, flex: 1 },
  tableCellRight: { paddingVertical: 2, flex: 1, textAlign: "right" },
  tableRowBorderTop: {
    borderTopWidth: 2,
    borderTopColor: "#000000",
    marginTop: 4,
  },
  tableRowHighlight: { backgroundColor: "#7F9D86", color: "#ffffff" },
  tableCellHighlight: { color: "#ffffff" },
  classificationTable: { width: "100%", fontSize: 8, marginBottom: 12 },
  classificationTableRow: { flexDirection: "row" },
  classificationTableCell: { paddingVertical: 2, flex: 1 },
  classificationTableCellRight: {
    paddingVertical: 2,
    flex: 1,
    textAlign: "right",
  },
  classificationTableBorder: { borderWidth: 2, borderColor: "#000000" },
  classificationTableInnerHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  classificationTableInnerHeaderCell: {
    fontWeight: "bold",
    padding: 4,
    textAlign: "center",
    flex: 1,
  },
  classificationTableInnerRow: { flexDirection: "row" },
  classificationTableInnerCell: { padding: 4, textAlign: "center", flex: 1 },
});

export default function HeatingBillPreviewFivePDF({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) {
  const co2Data = [
    { range: "< 12", mieter: "100 %", vermieter: "0 %" },
    {
      range: "12 bis < 17",
      mieter: "90 %",
      vermieter: "10 %",
      highlight: true,
    },
    { range: "17 bis < 22", mieter: "80 %", vermieter: "20 %" },
    { range: "22 bis < 27", mieter: "70 %", vermieter: "30 %" },
    { range: "27 bis < 32", mieter: "60 %", vermieter: "40 %" },
    { range: "32 bis < 37", mieter: "50 %", vermieter: "50 %" },
    { range: "37 bis < 42", mieter: "40 %", vermieter: "60 %" },
    { range: "42 bis < 47", mieter: "30 %", vermieter: "70 %" },
    { range: "47 bis < 52", mieter: "20 %", vermieter: "80 %" },
    { range: ">= 52", mieter: "5 %", vermieter: "95 %" },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          5/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>CO2-Kostenaufteilung</Text>
      </View>

      <Text style={styles.paragraph}>
        Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz
        (BEHG) für fossile Brennstoffe erhoben, welche Kohlenstoffdioxid (CO2)
        emittieren. Das zum 01.01.2023 in Kraft getretene
        Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die Aufteilung
        der CO2-Kosten zwischen Mieter und Vermieter.
      </Text>

      <Text style={styles.subSectionHeader}>CO2-Kosten der Liegenschaft</Text>
      <View style={{ fontSize: 9, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Energieart: Nah-/Fernwärme
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>POSITION</Text>
            <Text style={styles.tableHeaderCell}>DATUM</Text>
            <Text style={styles.tableHeaderCellRight}>Menge in kWh</Text>
            <Text style={styles.tableHeaderCellRight}>
              CO2-Emissionen in kg
            </Text>
            <Text style={styles.tableHeaderCellRight}>CO2-Kosten in EUR</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Bezug</Text>
            <Text style={styles.tableCell}>
              {formatDateGerman(previewData.mainDocDates.created_at)}
            </Text>
            <Text style={styles.tableCellRight}>761.123</Text>
            <Text style={styles.tableCellRight}>159.911,9</Text>
            <Text style={styles.tableCellRight}>14.318,13</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowBorderTop]}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Summe Verbrauch
            </Text>
            <Text style={styles.tableCell}></Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              761.123
            </Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              159.911,9
            </Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              14.318,13
            </Text>
          </View>
          <View
            style={[styles.tableRow, { color: "#5A917F", fontWeight: "bold" }]}
          >
            <Text style={styles.tableCell}>Gesamt</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCellRight}>761.123</Text>
            <Text style={styles.tableCellRight}>159.911,9</Text>
            <Text style={styles.tableCellRight}>14.318,13</Text>
          </View>
        </View>
      </View>

      <Text style={styles.subSectionHeader}>
        Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)
      </Text>
      <View style={{ fontSize: 9, marginBottom: 15 }}>
        <View style={styles.classificationTable}>
          <View style={styles.classificationTableRow}>
            <Text style={styles.classificationTableCell}>
              CO2-Emissionen der Liegenschaft
            </Text>
            <Text style={styles.classificationTableCellRight}>
              159.912 kg CO2
            </Text>
            <Text style={[styles.classificationTableCell, { paddingLeft: 15 }]}>
              CO2-Kosten der Liegenschaft
            </Text>
            <Text style={styles.classificationTableCellRight}>14.318,13 €</Text>
          </View>
          <View style={styles.classificationTableRow}>
            <Text style={styles.classificationTableCell}>
              Gesamtwohnfläche der Liegenschaft
            </Text>
            <Text style={styles.classificationTableCellRight}>11.196,4 m²</Text>
            <Text style={[styles.classificationTableCell, { paddingLeft: 15 }]}>
              CO2-Emissionsfaktor
            </Text>
            <Text style={styles.classificationTableCellRight}>
              0,210 kg CO2/kWh
            </Text>
          </View>
          <View
            style={[styles.classificationTableRow, styles.tableRowBorderTop]}
          >
            <Text
              style={[styles.classificationTableCell, { fontWeight: "bold" }]}
            >
              CO2-Emission pro m² Wohnfläche
            </Text>
            <Text
              style={[
                styles.classificationTableCellRight,
                { fontWeight: "bold" },
              ]}
            >
              14,3 kg CO2/m²/a
            </Text>
            <Text style={styles.classificationTableCell}></Text>
            <Text style={styles.classificationTableCell}></Text>
          </View>
        </View>
        <View style={[styles.table, styles.classificationTableBorder]}>
          <View style={styles.classificationTableInnerHeader}>
            <Text style={styles.classificationTableInnerHeaderCell}>
              CO2-Emission pro m²{"\n"}Wohnfläche und Jahr
            </Text>
            <Text style={styles.classificationTableInnerHeaderCell}>
              Anteil{"\n"}Mieter
            </Text>
            <Text style={styles.classificationTableInnerHeaderCell}>
              Anteil{"\n"}Vermieter
            </Text>
          </View>
          {co2Data.map((item, index) => (
            <View
              key={index}
              style={[
                styles.classificationTableInnerRow,
                item.highlight ? styles.tableRowHighlight : {},
              ]}
            >
              <Text
                style={[
                  styles.classificationTableInnerCell,
                  item.highlight ? styles.tableCellHighlight : {},
                ]}
              >
                {item.range} kg CO2/m²/a
              </Text>
              <Text
                style={[
                  styles.classificationTableInnerCell,
                  item.highlight ? styles.tableCellHighlight : {},
                ]}
              >
                {item.mieter}
              </Text>
              <Text
                style={[
                  styles.classificationTableInnerCell,
                  item.highlight ? styles.tableCellHighlight : {},
                ]}
              >
                {item.vermieter}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.subSectionHeader}>
        CO2-Kostenaufteilung für Ihre Nutzeinheit
      </Text>
      <View style={{ fontSize: 9, marginBottom: 15 }}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>
              Aufteilung der CO2-Kosten
            </Text>
            <Text style={styles.tableHeaderCellRight}>Anteil Mieter</Text>
            <Text style={styles.tableHeaderCellRight}>Anteil Vermieter</Text>
            <Text style={styles.tableHeaderCellRight}>Summe</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>gemäß Einstufung (jeweils)</Text>
            <Text style={styles.tableCellRight}>90 %</Text>
            <Text style={styles.tableCellRight}>10 %</Text>
            <Text style={styles.tableCellRight}>100 %</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>für die Liegenschaft</Text>
            <Text style={styles.tableCellRight}>12.886,32 €</Text>
            <Text style={styles.tableCellRight}>1.431,81 €</Text>
            <Text style={styles.tableCellRight}>14.318,13 €</Text>
          </View>
          <View
            style={[styles.tableRow, { color: "#5A917F", fontWeight: "bold" }]}
          >
            <Text style={styles.tableCell}>
              für Ihre Nutzeinheit (anteilig)
            </Text>
            <Text style={styles.tableCellRight}>126,60 €</Text>
            <Text style={styles.tableCellRight}>14,08 €</Text>
            <Text style={styles.tableCellRight}>140,68 €</Text>
          </View>
        </View>
      </View>

      <Text style={styles.paragraph}>
        Der Abzug des Vermieteranteils an den CO2-Kosten wurde in der
        Heizkostenabrechnung noch nicht berücksichtigt.{"\n"}
        Im Falle einer Vermietung dieser Nutzeinheit ist gemäß CO2KostAufG noch
        die Kostenübernahme durch den Vermieter in Höhe von 14,08 € zu leisten.
      </Text>

      <Text style={styles.subSectionHeader}>
        Weitere Informationen und Informationsquellen
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", fontSize: 8 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: "#000000",
            marginRight: 8,
          }}
        ></View>
        <Text>
          Informationen rund um das Thema CO2-Kostenaufteilung finden Sie unter
          www.heidisystems.de/co2.
        </Text>
      </View>
    </Page>
  );
}
