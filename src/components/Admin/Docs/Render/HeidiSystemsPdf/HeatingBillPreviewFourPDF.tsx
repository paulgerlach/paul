"use client";

import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";

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
  twoCol: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  col: { width: "48%" },
  bold: { fontWeight: "bold", color: "#083123" },
  title: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
    color: "#083123",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowLabel: { width: 200 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5A917F",
    borderBottomWidth: 2,
    borderBottomColor: "#083123",
    paddingBottom: 4,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#DDE9E0",
    padding: 4,
    borderRadius: 8,
    fontWeight: "bold",
    color: "#083123",
    marginTop: 8,
  },
});

export default function HeatingBillPreviewFourPDF({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>4/6 355703/0010</Text>
      </View>

      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={styles.title}>
            Ihre Heidi Systems ® Abrechnung für{"\n"}Heizung, Warmwasser,
            Kaltwasser
          </Text>
          <View style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={[styles.bold, styles.rowLabel]}>Liegenschaft</Text>
              <Text>
                {previewData.contractorsNames}
                {"\n"}
                {previewData.objektInfo.street}
                {"\n"}
                {previewData.objektInfo.zip}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Erstellt im Auftrag von</Text>
              <Text>
                {previewData.contractorsNames}
                {"\n"}
                {previewData.objektInfo.street}
                {"\n"}
                {previewData.objektInfo.zip}
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.row}>
              <Text style={[styles.bold, styles.rowLabel]}>
                Liegenschaftsnummer
              </Text>
              <Text>355703</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Heidi Nutzernummer</Text>
              <Text>0010</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.bold, styles.rowLabel]}>
                Abrechnungszeitraum
              </Text>
              <Text>
                {previewData.mainDocDates.start_date} -{" "}
                {previewData.mainDocDates.end_date}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>erstellt am</Text>
              <Text>{previewData.mainDocDates.created_at}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.col, { alignItems: "flex-end" }]}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#083123",
              paddingBottom: 4,
              marginBottom: 6,
              width: "100%",
            }}
          >
            <Text style={styles.bold}>
              Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
            </Text>
          </View>
          <Text style={[styles.bold, { fontSize: 16, textAlign: "right" }]}>
            {previewData.contractorsNames}
            {"\n"}
            {previewData.objektInfo.street}
            {"\n"}
            {previewData.objektInfo.zip}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Ihre Kosten</Text>
        <Text style={styles.chip}>Kosten für Heizung</Text>
        <View style={{ marginTop: 4 }}>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>Grundkosten</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              77,02 m² Wohnfläche
            </Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              1,869733 € je m²
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>144,01 €</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>
              Verbrauchskosten
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>7,00 MWh</Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              120,895580 € je MWh
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>846,27 €</Text>
          </View>
        </View>

        <Text style={[styles.chip, { marginTop: 10 }]}>
          Kosten für Warmwasser
        </Text>
        <View style={{ marginTop: 4 }}>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>Grundkosten</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              77,02 m² Wohnfläche
            </Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              1,453210 € je m²
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>111,93 €</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>
              Verbrauchskosten
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>10,88 m³</Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              12,059077 € je m³
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>131,20 €</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderTopColor: "#083123",
                paddingTop: 4,
                marginTop: 4,
              },
            ]}
          >
            <Text style={[styles.bold, { width: "80%" }]}>
              Summe Kosten für Heizung und Warmwasser
            </Text>
            <Text style={[styles.bold, { width: "20%", textAlign: "right" }]}>
              1.233,41 €
            </Text>
          </View>
        </View>

        <Text style={[styles.chip, { marginTop: 10 }]}>
          Kosten für Kaltwasser
        </Text>
        <View style={{ marginTop: 4 }}>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>
              Kaltwasser Gesamt
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>45,20 m³</Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              1,713411 € je m³
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>77,45 €</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>Abwasser Gesamt</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>45,20 m³</Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              2,014517 € je m³
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>91,06 €</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>
              Gerätemiete Kaltwasser
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>45,20 m³</Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              0,228791 € je m³
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>10,34 €</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: "20%" }]}>
              Abrechnung Kaltwasser
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              1,00 Nutzeinh.
            </Text>
            <Text style={{ width: "5%" }}>x</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              17,290569 € je Nutzeinh.
            </Text>
            <Text style={{ width: "5%" }}>=</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>17,29 €</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderTopColor: "#083123",
                paddingTop: 4,
                marginTop: 4,
              },
            ]}
          >
            <Text style={[styles.bold, { width: "80%" }]}>
              Summe Kosten für Kaltwasser
            </Text>
            <Text style={[styles.bold, { width: "20%", textAlign: "right" }]}>
              1.233,41 €
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.row,
            {
              backgroundColor: "#7F9D86",
              color: "#ffffff",
              padding: 8,
              borderRadius: 8,
              marginTop: 10,
            },
          ]}
        >
          <Text style={{ color: "#ffffff" }}>Gesamtbetrag</Text>
          <Text style={{ color: "#ffffff" }}>1.429,55 €</Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: "#7F9D86",
              color: "#ffffff",
              padding: 6,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: "#ffffff", flex: 1 }}>
            Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)
          </Text>
          <Text style={{ color: "#ffffff", width: 60 }}>Betrag</Text>
          <Text style={{ color: "#ffffff", width: 60, textAlign: "right" }}>
            Ihr Anteil
          </Text>
        </View>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Text style={{ flex: 1 }}>Preisbremse Energie</Text>
          <Text style={{ width: 60 }}>21.035,94 €</Text>
          <Text style={{ width: 60, textAlign: "right" }}>209,21 €</Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Ihre Verbrauchswerte</Text>
        <Text style={styles.chip}>Heizung in MWh</Text>
        <View style={{ marginTop: 6 }}>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderColor: "#083123",
                paddingVertical: 4,
              },
            ]}
          >
            <Text style={{ flex: 1 }}>RAUMBEZEICHNUNG</Text>
            <Text style={{ flex: 1 }}>GERÄTENUMMER</Text>
            <Text style={{ flex: 1 }}>GERÄTEART</Text>
            <Text style={{ flex: 1 }}>ANF.-STAND</Text>
            <Text style={{ flex: 1 }}>ABLESUNG</Text>
            <Text style={{ flex: 1 }}>FAKTOR</Text>
            <Text style={{ flex: 1 }}>VERBRAUCH</Text>
            <Text style={{ flex: 1 }}>BEMERKUNG</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Flur</Text>
            <Text style={{ flex: 1 }}>6EFE0121755587</Text>
            <Text style={{ flex: 1 }}>Wärmezähler</Text>
            <Text style={{ flex: 1 }}>1,918</Text>
            <Text style={{ flex: 1 }}>8,916</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 1 }}>7,000</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderTopColor: "#083123",
                paddingTop: 4,
                marginTop: 4,
              },
            ]}
          >
            <Text style={[styles.bold, { flex: 6 }]}>Summe Heizung</Text>
            <Text style={[styles.bold, { flex: 1 }]}>7,000</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
        </View>

        <Text style={[styles.chip, { marginTop: 10 }]}>Warmwasser in m³</Text>
        <View style={{ marginTop: 6 }}>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Bad</Text>
            <Text style={{ flex: 1 }}>9DWZ0122156287</Text>
            <Text style={{ flex: 1 }}>Warmwasserzähler</Text>
            <Text style={{ flex: 1 }}>3,52</Text>
            <Text style={{ flex: 1 }}>11,381</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 1 }}>7,86</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Bad</Text>
            <Text style={{ flex: 1 }}>9DWZ0122156297</Text>
            <Text style={{ flex: 1 }}>Warmwasserzähler</Text>
            <Text style={{ flex: 1 }}>1,04</Text>
            <Text style={{ flex: 1 }}>4,051</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 1 }}>3,02</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderTopColor: "#083123",
                paddingTop: 4,
                marginTop: 4,
              },
            ]}
          >
            <Text style={[styles.bold, { flex: 6 }]}>Summe Warmwasser</Text>
            <Text style={[styles.bold, { flex: 1 }]}>10,88</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
        </View>

        <Text style={[styles.chip, { marginTop: 10 }]}>Kaltwasser in m³</Text>
        <View style={{ marginTop: 6 }}>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Bad</Text>
            <Text style={{ flex: 1 }}>8DWZ0122033399</Text>
            <Text style={{ flex: 1 }}>Kaltwasserzähler</Text>
            <Text style={{ flex: 1 }}>7,56</Text>
            <Text style={{ flex: 1 }}>23,291</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 1 }}>15,73</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Bad</Text>
            <Text style={{ flex: 1 }}>8DWZ0122033396</Text>
            <Text style={{ flex: 1 }}>Kaltwasserzähler</Text>
            <Text style={{ flex: 1 }}>11,91</Text>
            <Text style={{ flex: 1 }}>30,494</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 1 }}>18,59</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 2,
                borderTopColor: "#083123",
                paddingTop: 4,
                marginTop: 4,
              },
            ]}
          >
            <Text style={[styles.bold, { flex: 6 }]}>Summe Kaltwasser</Text>
            <Text style={[styles.bold, { flex: 1 }]}>34,32</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16, color: "#6B7280" }}>
        <Text>
          Detaillierte Berechnung und Verteilung auf alle Nutzeinheiten des
          Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte wenden Sie
          sich bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder
          Verwalter. Informationen zur verbrauchsabhängigen Abrechnung finden
          Sie unter www.brunata-metrona.de.
        </Text>
      </View>
    </Page>
  );
}
