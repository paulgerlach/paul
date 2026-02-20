import { Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import type { HeatingBillPdfModel } from "@/app/api/generate-heating-bill/_lib";

const colors = {
  accent: "#DDE9E0",
  accent2: "#7F9D86",
  dark: "#083123",
  text: "#0D282FCC",
  title: "#5A917F",
  link: "#6BCAAA",
};

const chartColors = {
  user: "#7F9D86",
  property: "#B8C9BC",
  national: "#D5DDD7",
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
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.accent2,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "white" },
  table: { width: "100%", fontSize: 8 },
  tableRow: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 8 },
  tableCell: { flex: 1, paddingVertical: 4, paddingHorizontal: 8 },
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
  chart: { flex: 1 },
  chartTitle: { fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  sideBySideTables: {
    flexDirection: "row",
    gap: 40,
    fontSize: 9,
    marginTop: 16,
  },
  qrCode: { width: 40, height: 40 },
  footnotes: { fontSize: 7, color: colors.text },
  footnote: { marginBottom: 4 },
  link: { color: colors.link, textDecoration: "none" },
});

/* ---------- helpers ---------- */

/** Format a number with German thousand separators (e.g. 7000 -> "7.000") */
function fmtDE(value: number): string {
  const rounded = Math.round(value);
  return rounded.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ---------- Bar chart built from react-pdf Views ---------- */

type BarDatum = { label: string; value: number; color: string };

function EnergyBarChart({ bars }: Readonly<{ bars: readonly BarDatum[] }>) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const barAreaHeight = 110; // max bar height in pt

  return (
    <View style={{ height: 160, backgroundColor: "#FAFBFA", borderRadius: 8, padding: 8 }}>
      {/* bars */}
      <View
        style={{
          flexDirection: "row",
          height: barAreaHeight,
          justifyContent: "space-evenly",
        }}
      >
        {bars.map((bar, i) => {
          const barH = Math.max(
            Math.round((bar.value / maxVal) * (barAreaHeight - 18)),
            4
          );
          return (
            <View
              key={i}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 7,
                  fontWeight: "bold",
                  color: colors.dark,
                  marginBottom: 2,
                }}
              >
                {fmtDE(bar.value)}
              </Text>
              <View
                style={{
                  width: 32,
                  height: barH,
                  backgroundColor: bar.color,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            </View>
          );
        })}
      </View>

      {/* baseline */}
      <View
        style={{
          height: 0.5,
          backgroundColor: colors.dark,
          opacity: 0.25,
          marginBottom: 6,
        }}
      />

      {/* labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {bars.map((bar, i) => (
          <Text
            key={i}
            style={{
              fontSize: 5.5,
              textAlign: "center",
              color: colors.text,
              width: 52,
            }}
          >
            {bar.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function HeatingBillPreviewSixPDF({
  energySummary,
  cover,
  logoSrc = "/admin_logo.png",
}: Readonly<{
  energySummary: HeatingBillPdfModel["energySummary"];
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}>) {
  const es = energySummary;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.headerTop}>
          <Text style={styles.pageNumber}>
            5/5 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src={logoSrc} />
        </View>
      </View>

      <Text style={styles.paragraph}>
        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
        sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
        um Ihren Energieverbrauch bewerten zu können.
      </Text>

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Energieträger der Liegenschaft</Text>
      </View>

      <View style={[styles.table, { marginBottom: 24 }]}>
        <View style={styles.borderedRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            Eingesetzte Energieträger
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            {es.energyCarrier}
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            {es.totalKwhFormatted} kWh
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
            {es.co2EmissionFactorFormatted} kg CO2/kWh
          </Text>
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
        {es.primaryEnergyFactors.map((f, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { paddingLeft: 24, flex: 3 }]}>
              {f.label}
            </Text>
            <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
              {f.valueFormatted}
            </Text>
          </View>
        ))}
        <View style={styles.borderedRow}>
          <Text style={[styles.tableCell, { flex: 3 }]}>
            CO2-Emissionen der Liegenschaft
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            {es.energyCarrier}
          </Text>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
            {es.totalCo2KgFormatted} kg
          </Text>
        </View>
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Ihr Energieverbrauch</Text>
      </View>
      <Text style={[styles.paragraph, { marginBottom: 16 }]}>
        Die hier dargestellten Werte berücksichtigen neben Ihren individuellen
        Verbrauchswerten u.a. den Wirkungsgrad der Heizungsanlage und
        Leitungsverluste im Gebäude.⁴
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>Heizung in kWh</Text>
          <EnergyBarChart
            bars={[
              { label: "Ihr\nVerbrauch", value: es.heatingKwh, color: chartColors.user },
              { label: "Liegenschafts-\ndurchschnitt", value: es.comparisonHeatingPropertyKwh, color: chartColors.property },
              { label: "Bundesweiter\nDurchschnitt", value: es.comparisonHeatingNationalKwh, color: chartColors.national },
            ]}
          />
        </View>
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>Warmwasser in kWh</Text>
          <EnergyBarChart
            bars={[
              { label: "Ihr\nVerbrauch", value: es.warmWaterKwh, color: chartColors.user },
              { label: "Liegenschafts-\ndurchschnitt", value: es.comparisonWarmWaterPropertyKwh, color: chartColors.property },
              { label: "Bundesweiter\nDurchschnitt", value: es.comparisonWarmWaterNationalKwh, color: chartColors.national },
            ]}
          />
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
                {es.heatingKwhFormatted} kWh
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
                {es.warmWaterKwhFormatted} kWh
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>GESAMT</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {es.totalUnitKwhFormatted} kWh
              </Text>
            </View>
            <View
              style={[styles.tableRow, { paddingBottom: 8, marginBottom: 8 }]}
            >
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihre Wohnfläche
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {es.livingSpaceM2Formatted} m²
              </Text>
            </View>
            <View style={styles.borderedRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Ihr Energieverbrauch je Quadratmeter Wohnfläche
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {es.kwhPerM2Formatted} kWh / m²
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
              <Text style={[styles.tableCell]}>Bundesweiter Vergleichsnutzer</Text>
              <Text style={[styles.tableCell, { textAlign: "right" }]}>
                Liegenschafts- durchschnitt
              </Text>
            </View>
            <View style={styles.borderedRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {es.nationalAverageFormatted} kWh/ m²
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {es.propertyAverageFormatted} kWh/m²
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.sectionTitleContainer, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>
          Weitere Informationen und Informationsquellen
        </Text>
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
          <Image style={styles.qrCode} src={es.qrCodeUrl} />
          <Text style={{ flex: 1 }}>
            Informationen finden Sie unter{" "}
            <Link src={es.infoLink} style={styles.link}>
              {es.infoLink}
            </Link>
            . Informationen zu Energieagenturen finden Sie z.B. unter{" "}
            <Link src={es.energyAgencyLink} style={styles.link}>
              {es.energyAgencyLink}
            </Link>
          </Text>
        </View>
      </View>

      <View style={styles.footnotes}>
        <Text style={styles.footnote}>
          1 Der CO2-Emissionsfaktor berücksichtigt die unterschiedlichen
          Energieträger bei der Wärmeerzeugung.
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
