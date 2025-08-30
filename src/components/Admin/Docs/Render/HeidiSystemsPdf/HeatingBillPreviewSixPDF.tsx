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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  table: { width: "100%", fontSize: 7 },
  tableRow: { flexDirection: "row" },
  tableCell: { paddingVertical: 2, flex: 1 },
  tableCellRight: { paddingVertical: 2, flex: 1, textAlign: "right" },
  tableRowBorderTop: {
    borderTopWidth: 2,
    borderTopColor: "#000000",
    marginTop: 4,
  },
  chartPlaceholder: {
    width: 200,
    height: 120,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  chartColumn: { width: "48%", alignItems: "center" },
  chartTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    fontSize: 8,
  },
  footerText: { fontSize: 7, color: "#6B7280", marginBottom: 4 },
});

export default function HeatingBillPreviewSixPDF({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          6/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>
          Ergänzende Informationen in der Abrechnung
        </Text>
      </View>

      <Text style={styles.paragraph}>
        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
        sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
        um Ihren Energieverbrauch bewerten zu können.
      </Text>

      <View style={styles.subSectionHeader}>
        <Text>Energieträger der Liegenschaft</Text>
        <Text>🏠</Text>
      </View>
      <View style={{ fontSize: 9, marginBottom: 15 }}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Eingesetzte Energieträger
            </Text>
            <Text style={styles.tableCellRight}>Nah-/Fernwärme</Text>
            <Text style={styles.tableCellRight}>761.123,0 kWh</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              CO2-Emissionsfaktor¹ des Nah-/Fernwärmenetzes
            </Text>
            <Text style={styles.tableCellRight}>0,21010 kg CO2/kWh</Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Primärenergiefaktoren² für Nah-/Fernwärmenetze laut DIN V 18599³
            </Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
              Heizwerke und fossile Brennstoffe
            </Text>
            <Text style={styles.tableCellRight}>1,30</Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
              KWK-Anlage mit fossilen Brennstoffen
            </Text>
            <Text style={styles.tableCellRight}>1,00</Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
              KWK-Anlage mit erneuerbaren Brennstoffen
            </Text>
            <Text style={styles.tableCellRight}>0,70</Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowBorderTop]}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              CO2-Emissionen der Liegenschaft
            </Text>
            <Text style={styles.tableCellRight}>Nah-/Fernwärme</Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              159.911,9 kg
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.subSectionHeader}>
        <Text>Ihr Energieverbrauch</Text>
        <Text>👤</Text>
      </View>
      <Text style={styles.paragraph}>
        Die hier dargestellten Werte berücksichtigen neben Ihren individuellen
        Verbrauchswerten u.a. den Wirkungsgrad der Heizungsanlage und
        Leitungsverluste im Gebäude.⁴
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartColumn}>
          <Text style={styles.chartTitle}>Heizung in kWh</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={{ fontSize: 10, textAlign: "center" }}>
              Chart Placeholder
            </Text>
            <Text style={{ fontSize: 8, textAlign: "center" }}>
              (Recharts not supported)
            </Text>
          </View>
        </View>
        <View style={styles.chartColumn}>
          <Text style={styles.chartTitle}>Warmwasser in kWh</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={{ fontSize: 10, textAlign: "center" }}>
              Chart Placeholder
            </Text>
            <Text style={{ fontSize: 8, textAlign: "center" }}>
              (Recharts not supported)
            </Text>
          </View>
        </View>
      </View>
      <View style={{ fontSize: 8, marginTop: 10 }}>
        <Text style={{ marginBottom: 5 }}>* Keine Werte verfügbar</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Ihr Heizungsverbrauch
            </Text>
            <Text
              style={[
                styles.tableCellRight,
                { borderBottomWidth: 2, borderBottomColor: "#000000" },
              ]}
            >
              5.945,0 kWh
            </Text>
            <Text style={[styles.tableCell, { width: "33%" }]}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Ihr Warmwasserverbrauch
            </Text>
            <Text
              style={[
                styles.tableCellRight,
                { borderBottomWidth: 2, borderBottomColor: "#000000" },
              ]}
            >
              1.534,0 kWh
            </Text>
            <Text style={[styles.tableCell, { width: "33%" }]}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              GESAMT
            </Text>
            <Text
              style={[
                styles.tableCellRight,
                { borderBottomWidth: 2, borderBottomColor: "#000000" },
              ]}
            >
              7.479,1 kWh
            </Text>
            <Text
              style={[styles.tableCell, { width: "33%", textAlign: "center" }]}
            >
              Vergleichswerte⁶
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Ihre Wohnfläche
            </Text>
            <Text
              style={[
                styles.tableCellRight,
                { borderBottomWidth: 2, borderBottomColor: "#000000" },
              ]}
            >
              77,0 m²
            </Text>
            <Text
              style={[styles.tableCell, { width: "33%", textAlign: "center" }]}
            >
              Bundesweiter Vergleichsnutzer
            </Text>
            <Text
              style={[styles.tableCell, { width: "33%", textAlign: "center" }]}
            >
              Liegenschafts-durchschnitt
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                { color: "#5A917F", fontWeight: "bold" },
              ]}
            >
              Ihr Energieverbrauch je{"\n"}Quadratmeter Wohnfläche
            </Text>
            <Text style={[styles.tableCellRight, { color: "#5A917F" }]}>
              97,1 kWh / m²
            </Text>
            <Text
              style={[
                styles.tableCell,
                { width: "33%", textAlign: "center", color: "#5A917F" },
              ]}
            >
              92,9 kWh / m²
            </Text>
            <Text
              style={[
                styles.tableCell,
                { width: "33%", textAlign: "center", color: "#5A917F" },
              ]}
            >
              68,0 kWh / m²
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.subSectionHeader, { marginTop: 20 }]}>
        <Text>Weitere Informationen und Informationsquellen</Text>
        <Text>ℹ️</Text>
      </View>
      <View style={{ fontSize: 9, marginBottom: 15 }}>
        <Text style={{ marginBottom: 10 }}>
          Entgelte für die Gebrauchsüberlassung, für die Verwendung der
          Ausstattung zur Verbrauchserfassung einschließlich der Eichung, sowie
          für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vorliegenden
          Heizkostenabrechnung unter dem Punkt `&quot;`Aufstellung der Kosten /
          Weitere Heizungsbetriebskosten`&quot;`.
        </Text>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={styles.chartPlaceholder}>
            <Text style={{ fontSize: 8, textAlign: "center" }}>
              QR Code Placeholder
            </Text>
          </View>
          <Text style={{ flex: 1 }}>
            Informationen zu Verbraucherorganisationen, Energiespartipps zur
            Reduzierung der Heizkosten und des Energieverbrauches sowie Hinweise
            zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizkörper
            finden Sie unter www.heidisystems.de/co2.
            {"\n\n"}
            Hier finden Sie auch weitere Informationen zu Steuern, Abgaben und
            Zöllen der eingesetzten Energieträger, sowie zur Möglichkeit eines
            Streitbeilegungsverfahren, wenn Sie sich hierzu informieren wollen.
            {"\n\n"}
            Informationen zu Energieagenturen finden Sie z.B. unter
            www.energieagenturen.de.
          </Text>
        </View>
      </View>

      <View style={styles.footerText}>
        <Text>
          1 Der CO2-Emissionsfaktor berücksichtigt die unterschiedlichen
          Energieträger bei der Wärmeerzeugung und gibt an, wieviele
          CO2-Treibhausgase dabei freigesetzt werden.
        </Text>
        <Text>
          2 Der Primärenergiefaktor gibt an, wie viel Primärenergie eingesetzt
          werden muss um eine bestimmte Menge an Endenergie zu erhalten. Je
          kleiner dieser Wert, desto nachhaltiger die Energiequelle.
        </Text>
        <Text>
          3 Es wurde keine Angabe für das vorliegende Nah-/Fernwärmenetz
          eingebracht. Die Werte der DIN V 18599 stellen typische
          Primärenergiefaktoren für die drei genannten Beispiele dar.
        </Text>
        <Text>
          4 Energieverbräuche sind in kWh auszuweisen. Die im Rahmen der
          unterjährigen Verbrauchsinformationen (UVI) vorab ausgewiesenen
          Energieverbräuche für Heizung bzw. Warmwasser werden über ein anderes
          Berechnungsverfahren ermittelt und können daher von den hier
          dargestellten, tatsächlichen Energieverbräuchen abweichen.
        </Text>
        <Text>
          5 Das Wetter - bedingt durch Temperaturschwankungen - hat Einfluss auf
          Ihr Heizverhalten. In der oben stehenden Grafik werden Ihre
          Energieverbräuche über das langjährige Mittel des
          Liegenschaftsstandorts auch witterungsbereinigt dargestellt, d.h.
          Wetterschwankungen werden herausgerechnet.
        </Text>
        <Text>
          6 Bitte beachten Sie: Der Vergleichsverbrauch wird durch weitere
          Kriterien wie Verbrauchsverhalten, Gebäudezustand oder Lage innerhalb
          des Gebäudes beeinflusst.
        </Text>
      </View>
    </Page>
  );
}
