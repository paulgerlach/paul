"use client";

import { Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";
import { formatDateGerman } from "@/utils";

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
  // Header
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
  pageNumber: {
    fontSize: 8,
    color: colors.text,
  },
  logo: {
    width: 80,
    height: 20,
  },
  paragraph: {
    fontSize: 8,
    marginBottom: 12,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    backgroundColor: colors.accent2,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  subTitle: {
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 4,
  },
  table: {
    width: "100%",
    fontSize: 8,
  },
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
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 4,
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 12,
  },
  classificationTable: {
    width: "100%",
    fontSize: 8,
    marginBottom: 8,
  },
  classificationRow: {
    flexDirection: "row",
  },
  classificationCell: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    flex: 1,
  },
  classificationSummaryRow: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 12,
    padding: 4,
  },
  levelsTable: {
    width: "100%",
    fontSize: 8,
  },
  levelsHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    color: colors.dark,
    backgroundColor: colors.accent,
  },
  levelsHeaderCell: {
    padding: 4,
    textAlign: "left",
  },
  levelsRow: {
    flexDirection: "row",
  },
  levelsCell: {
    padding: 4,
  },
  highlightedRow: {
    backgroundColor: colors.accent2,
    color: "white",
  },
  qrCode: {
    width: 40,
    height: 40,
  },
  link: {
    color: colors.link,
    textDecoration: "none",
  },
});

const classificationData = [
  {
    bis: "",
    range: "< 12",
    co: "kg CO₂/m²/a",
    mieter: "100 %",
    vermieter: "0 %",
  },
  {
    bis: "12 bis",
    range: "< 17",
    co: "kg CO₂/m²/a",
    mieter: "90 %",
    vermieter: "10 %",
    highlight: true,
  },
  {
    bis: "17 bis",
    range: "< 22",
    co: "kg CO₂/m²/a",
    mieter: "80 %",
    vermieter: "20 %",
  },
  {
    bis: "22 bis",
    range: "< 27",
    co: "kg CO₂/m²/a",
    mieter: "70 %",
    vermieter: "30 %",
  },
  {
    bis: "27 bis",
    range: "< 32",
    co: "kg CO₂/m²/a",
    mieter: "60 %",
    vermieter: "40 %",
  },
  {
    bis: "32 bis",
    range: "< 37",
    co: "kg CO₂/m²/a",
    mieter: "50 %",
    vermieter: "50 %",
  },
  {
    bis: "37 bis",
    range: "< 42",
    co: "kg CO₂/m²/a",
    mieter: "40 %",
    vermieter: "60 %",
  },
  {
    bis: "42 bis",
    range: "< 47",
    co: "kg CO₂/m²/a",
    mieter: "30 %",
    vermieter: "70 %",
  },
  {
    bis: "47 bis",
    range: "< 52",
    co: "kg CO₂/m²/a",
    mieter: "20 %",
    vermieter: "80 %",
  },
  {
    bis: "",
    range: ">= 52",
    co: "kg CO₂/m²/a",
    mieter: "5 %",
    vermieter: "95 %",
  },
];

export default function HeatingBillPreviewFivePDF({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerTop}>
          <Text style={styles.pageNumber}>
            5/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src="/admin_logo.png" />
        </View>
      </View>

      <Text style={styles.paragraph}>
        Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz
        (BEHG) für fossile Brennstoffe erhoben, welche Kohlenstoffdioxid (CO2)
        emittieren. Das zum 01.01.2023 in Kraft getretene
        Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die Aufteilung
        der CO2-Kosten zwischen Mieter und Vermieter.
      </Text>

      {/* Title */}
      <Text style={styles.sectionTitle}>CO2-Kostenaufteilung</Text>
      <Text style={styles.subTitle}>Energieart: Nah-/Fernwärme</Text>

      {/* CO2 Costs of the Property */}
      <View style={[styles.table, { marginBottom: 24 }]}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableHeaderCell,
              { borderTopLeftRadius: 12, flex: 2 },
            ]}
          >
            POSITION
          </Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>DATUM</Text>
          <Text
            style={[styles.tableHeaderCell, { textAlign: "right", flex: 2 }]}
          >
            Menge in kWh
          </Text>
          <Text
            style={[styles.tableHeaderCell, { textAlign: "right", flex: 3 }]}
          >
            CO2-Emissionen in kg
          </Text>
          <Text
            style={[
              styles.tableHeaderCell,
              { textAlign: "right", borderTopRightRadius: 12, flex: 3 },
            ]}
          >
            CO2-Kosten in EUR
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Bezug</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {formatDateGerman(previewData.mainDocDates.created_at)}
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            761.123
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 3 }]}>
            159.911,9
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 3 }]}>
            14.318,13
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Summe Verbrauch</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            761.123
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 3 }]}>
            159.911,9
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 3 }]}>
            14.318,13
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Gesamt</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>761.123</Text>
          <Text style={[styles.tableCell, { flex: 3 }]}>159.911,9</Text>
          <Text style={[styles.tableCell, { flex: 3 }]}>14.318,13</Text>
        </View>
      </View>

      {/* Classification of the Property */}
      <Text style={styles.sectionTitle}>
        Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)
      </Text>
      <View style={[styles.classificationTable, { marginBottom: 8 }]}>
        <View style={styles.classificationRow}>
          <Text style={styles.classificationCell}>
            CO2-Emissionen der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            159.912 kg CO2
          </Text>
          <Text style={[styles.classificationCell, { paddingLeft: 16 }]}>
            CO2-Kosten der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            14.318,13 €
          </Text>
        </View>
        <View style={styles.classificationRow}>
          <Text style={styles.classificationCell}>
            Gesamtwohnfläche der Liegenschaft
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            11.196,4 m²
          </Text>
          <Text style={[styles.classificationCell, { paddingLeft: 16 }]}>
            CO2-Emissionsfaktor
          </Text>
          <Text style={[styles.classificationCell, { textAlign: "right" }]}>
            0,210 kg CO2/kWh
          </Text>
        </View>
        <View style={styles.classificationSummaryRow}>
          <Text style={{ flex: 3 }}>CO²-Emission pro m² Wohnfläche</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>14,3 kg CO2/m²/a</Text>
        </View>
      </View>

      <View style={[styles.levelsTable, { marginBottom: 24 }]}>
        <View
          style={[
            styles.levelsHeader,
            { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
          ]}
        >
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
        {classificationData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.levelsRow,
              item.highlight ? styles.highlightedRow : {},
              item.highlight ? { borderRadius: 12 } : {},
            ].filter(Boolean)}
          >
            <Text
              style={[
                styles.levelsCell,
                { flex: 1.5, color: item.highlight ? "white" : colors.text },
              ]}
            >
              {item.bis}
            </Text>
            <Text
              style={[
                styles.levelsCell,
                { flex: 1.5, color: item.highlight ? "white" : colors.text },
              ]}
            >
              {item.range}
            </Text>
            <Text
              style={[
                styles.levelsCell,
                { flex: 3, color: item.highlight ? "white" : colors.text },
              ]}
            >
              {item.co}
            </Text>
            <Text
              style={[
                styles.levelsCell,
                { flex: 2, color: item.highlight ? "white" : colors.text },
              ]}
            >
              {item.mieter}
            </Text>
            <Text
              style={[
                styles.levelsCell,
                { flex: 2, color: item.highlight ? "white" : colors.text },
              ]}
            >
              {item.vermieter}
            </Text>
          </View>
        ))}
      </View>

      {/* CO2 Cost Allocation for Your Unit */}
      <Text style={styles.sectionTitle}>
        CO2-Kostenaufteilung für Ihre Nutzeinheit
      </Text>
      <View style={[styles.table, { marginBottom: 24 }]}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableHeaderCell,
              { borderTopLeftRadius: 12, flex: 3 },
            ]}
          >
            Aufteilung der CO2-Kosten
          </Text>
          <Text
            style={[styles.tableHeaderCell, { textAlign: "right", flex: 2 }]}
          >
            Anteil Mieter
          </Text>
          <Text
            style={[styles.tableHeaderCell, { textAlign: "right", flex: 2 }]}
          >
            Anteil Vermieter
          </Text>
          <Text
            style={[
              styles.tableHeaderCell,
              { textAlign: "right", borderTopRightRadius: 12, flex: 2 },
            ]}
          >
            Summe
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            gemäß Einstufung (jeweils)
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            90 %
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            10 %
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            100 %
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            für die Liegenschaft
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            12.886,32 €
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            1.431,81 €
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            14.318,13 €
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            für Ihre Nutzeinheit (anteilig)
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            126,60 €
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            14,08 €
          </Text>
          <Text style={[styles.tableCell, { textAlign: "right", flex: 2 }]}>
            140,68 €
          </Text>
        </View>
      </View>

      <Text style={[styles.paragraph, { marginBottom: 24 }]}>
        Der Abzug des Vermieteranteils an den CO2-Kosten wurde in der
        Heizkostenabrechnung noch nicht berücksichtigt.
        {"\n"}
        Im Falle einer Vermietung dieser Nutzeinheit ist gemäß CO2KostAufG noch
        die Kostenübernahme durch den Vermieter in Höhe von 14,08 € zu leisten.
      </Text>

      {/* Further Information */}
      <Text style={styles.sectionTitle}>
        Weitere Informationen und Informationsquellen
      </Text>
      <View style={{ flexDirection: "row", gap: 40, alignItems: "center" }}>
        <Image
          style={styles.qrCode}
          src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://heidi.systems/3303"
        />
        <Text style={{ fontSize: 9 }}>
          Informationen rund um das Thema CO2-Kostenaufteilung finden Sie unter{" "}
          <Link src="www.heidisystems.de/co2" style={styles.link}>
            www.heidisystems.de/co2.
          </Link>
        </Text>
      </View>
    </Page>
  );
}
