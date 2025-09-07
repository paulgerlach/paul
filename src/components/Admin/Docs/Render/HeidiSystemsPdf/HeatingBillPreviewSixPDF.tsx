"use client";

import { Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
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
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.accent2,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12, // text-lg
    fontWeight: "bold",
    color: "white",
  },
  sectionIcon: {
    fontSize: 20,
  },
  table: {
    width: "100%",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  borderedRow: {
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 12,
    flexDirection: "row",
    color: colors.dark,
    fontWeight: "bold",
  },
  chartContainer: {
    flexDirection: "row",
    gap: 32,
    fontSize: 8,
    marginBottom: 16,
  },
  chart: {
    flex: 1,
  },
  chartTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  sideBySideTables: {
    flexDirection: "row",
    gap: 40,
    fontSize: 9,
    marginTop: 16,
  },
  qrCode: {
    width: 40, // 160 in preview is too big
    height: 40,
  },
  footnotes: {
    fontSize: 7,
    color: colors.text,
  },
  footnote: {
    marginBottom: 4,
  },
  link: {
    color: colors.link,
    textDecoration: "none",
  },
});

export default function HeatingBillPreviewSixPDF({
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
            6/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src="/admin_logo.png" />
        </View>
      </View>

      <Text style={styles.paragraph}>
        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
        sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
        um Ihren Energieverbrauch bewerten zu können.
      </Text>

      {/* Energieträger der Liegenschaft */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Energieträger der Liegenschaft</Text>
        {/* <Text style={styles.sectionIcon}>🏠</Text> */}
      </View>

      <View style={[styles.table, { marginBottom: 24 }]}>
        <View style={styles.borderedRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            Eingesetzte Energieträger
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            Nah-/Fernwärme
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            761.123,0 kWh
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableCell,
              { fontWeight: "bold", color: colors.dark, flex: 3 },
            ]}
          >
            CO2-Emissionsfaktor¹ des Nah-/Fernwärmenetzes
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            0,21010 kg CO2/kWh
          </Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableCell,
              { fontWeight: "bold", color: colors.dark, flex: 3 },
            ]}
          >
            Primärenergiefaktoren² für Nah-/Fernwärmenetze laut DIN V 18599³
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { paddingLeft: 24, flex: 3 }]}>
            Heizwerke und fossile Brennstoffe
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            1,30
          </Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { paddingLeft: 24, flex: 3 }]}>
            KWK-Anlage mit fossilen Brennstoffen
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            1,00
          </Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { paddingLeft: 24, flex: 3 }]}>
            KWK-Anlage mit erneuerbaren Brennstoffen
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            0,70
          </Text>
          <Text style={[styles.tableCell, { flex: 2 }]}></Text>
        </View>
        <View style={styles.borderedRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            CO2-Emissionen der Liegenschaft
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            Nah-/Fernwärme
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            159.911,9 kg
          </Text>
        </View>
      </View>

      {/* Ihr Energieverbrauch */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Ihr Energieverbrauch</Text>
        {/* <Text style={styles.sectionIcon}>👤</Text> */}
      </View>
      <Text style={[styles.paragraph, { marginBottom: 16 }]}>
        Die hier dargestellten Werte berücksichtigen neben Ihren individuellen
        Verbrauchswerten u.a. den Wirkungsgrad der Heizungsanlage und
        Leitungsverluste im Gebäude.⁴
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>Heizung in kWh</Text>
          <View style={styles.chartPlaceholder}>
            <Text>Chart Placeholder</Text>
          </View>
        </View>
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>Warmwasser in kWh</Text>
          <View style={styles.chartPlaceholder}>
            <Text>Chart Placeholder</Text>
          </View>
        </View>
      </View>

      <View style={styles.sideBySideTables}>
        <View style={{ flex: 1 }}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihr Heizungsverbrauch
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                5.945,0 kWh
              </Text>
            </View>
            <View
              style={[
                styles.tableRow,
                {
                  borderBottomWidth: 1,
                  borderColor: colors.dark,
                  paddingBottom: 8,
                  marginBottom: 8,
                },
              ]}
            >
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihr Warmwasserverbrauch
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                1.534,0 kWh
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>GESAMT</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                7.479,1 kWh
              </Text>
            </View>
            <View
              style={[styles.tableRow, { paddingBottom: 8, marginBottom: 8 }]}
            >
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihre Wohnfläche
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                77,0 m²
              </Text>
            </View>
            <View style={styles.borderedRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihr Energieverbrauch je Quadratmeter Wohnfläche
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                97,1 kWh / m²
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.table}>
            <View
              style={[
                styles.tableRow,
                {
                  borderBottomWidth: 1,
                  borderColor: colors.dark,
                  paddingBottom: 4,
                  marginBottom: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    color: colors.dark,
                  },
                ]}
              >
                Vergleichswerte⁶
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell]}>
                Bundesweiter Vergleichsnutzer
              </Text>
              <Text style={[styles.tableCell, { textAlign: "right" }]}>
                Liegenschafts- durchschnitt
              </Text>
            </View>
            <View style={styles.borderedRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>92,9 kWh/ m²</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                68,0 kWh/m²
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Weitere Informationen */}
      <View style={[styles.sectionTitleContainer, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>
          Weitere Informationen und Informationsquellen
        </Text>
        {/* <Text style={styles.sectionIcon}>ℹ️</Text> */}
      </View>
      <View style={{ fontSize: 9, marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          Entgelte für die Gebrauchsüberlassung, für die Verwendung der
          Ausstattung zur Verbrauchserfassung einschließlich der Eichung, sowie
          für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vorliegenden
          Heizkostenabrechnung unter dem Punkt &quot;Aufstellung der Kosten /
          Weitere Heizungsbetriebskosten&quot;.
        </Text>
        <View
          style={{ flexDirection: "row", gap: 16, alignItems: "flex-start" }}
        >
          <Image
            style={styles.qrCode}
            src="https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=https://heidi.systems/3303"
          />
          <Text style={{ flex: 1 }}>
            Informationen zu Verbraucherorganisationen, Energiespartipps zur
            Reduzierung der Heizkosten und des Energieverbrauches sowie Hinweise
            zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizkörper
            finden Sie unter{" "}
            <Link src="www.heidisystems.de/co2" style={styles.link}>
              www.heidisystems.de/co2.
            </Link>
            {""}
            Hier finden Sie auch weitere Informationen zu Steuern, Abgaben und
            Zöllen der eingesetzten Energieträger, sowie zur Möglichkeit eines
            Streitbeilegungsverfahren, wenn Sie sich hierzu informieren wollen.
            {""}
            Informationen zu Energieagenturen finden Sie z.B. unter{" "}
            <Link src="www.energieagenturen.de" style={styles.link}>
              www.energieagenturen.de.
            </Link>
          </Text>
        </View>
      </View>

      {/* Footnotes */}
      <View style={styles.footnotes}>
        <Text style={styles.footnote}>
          1 Der CO2-Emissionsfaktor berücksichtigt die unterschiedlichen
          Energieträger bei der Wärmeerzeugung und gibt an, wieviele
          CO2-Treibhausgase dabei freigesetzt werden.
        </Text>
        <Text style={styles.footnote}>
          2 Der Primärenergiefaktor gibt an, wie viel Primärenergie eingesetzt
          werden muss um eine bestimmte Menge an Endenergie zu erhalten. Je
          kleiner dieser Wert, desto nachhaltiger die Energiequelle.
        </Text>
        <Text style={styles.footnote}>
          3 Es wurde keine Angabe für das vorliegende Nah-/Fernwärmenetz
          eingebracht. Die Werte der DIN V 18599 stellen typische
          Primärenergiefaktoren für die drei genannten Beispiele dar.
        </Text>
        <Text style={styles.footnote}>
          4 Energieverbräuche sind in kWh auszuweisen. Die im Rahmen der
          unterjährigen Verbrauchsinformationen (UVI) vorab ausgewiesenen
          Energieverbräuche für Heizung bzw. Warmwasser werden über ein anderes
          Berechnungsverfahren ermittelt und können daher von den hier
          dargestellten, tatsächlichen Energieverbräuchen abweichen.
        </Text>
        <Text style={styles.footnote}>
          5 Das Wetter - bedingt durch Temperaturschwankungen - hat Einfluss auf
          Ihr Heizverhalten. In der oben stehenden Grafik werden Ihre
          Energieverbräuche über das langjährige Mittel des
          Liegenschaftsstandorts auch witterungsbereinigt dargestellt, d.h.
          Wetterschwankungen werden herausgerechnet.
        </Text>
        <Text style={styles.footnote}>
          6 Bitte beachten Sie: Der Vergleichsverbrauch wird durch weitere
          Kriterien wie Verbrauchsverhalten, Gebäudezustand oder Lage innerhalb
          des Gebäudes beeinflusst.
        </Text>
      </View>
    </Page>
  );
}
