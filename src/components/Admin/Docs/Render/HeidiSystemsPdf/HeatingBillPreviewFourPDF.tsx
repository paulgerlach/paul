"use client";

import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";
import { formatDateGerman } from "@/utils";

const colors = {
  accent: "#DDE9E0",
  accent2: "#7F9D86",
  dark: "#083123",
  text: "#0D282FCC",
  title: "#5A917F",
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
    color: colors.dark,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.text,
  },
  logo: {
    width: 80,
    height: 20,
  },
  headerMain: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-end",
  },
  headerMainCol: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
    color: colors.dark,
  },
  infoGrid: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 8,
  },
  infoLabel: {
    width: 75,
  },
  infoValue: {
    flex: 1,
  },
  bold: {
    fontWeight: 700,
    color: colors.dark,
  },
  textMuted: {
    color: colors.text,
  },
  heidiAddress: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    paddingBottom: 4,
    marginBottom: 8,
  },
  recipientAddress: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.dark,
  },

  // Costs Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.title,
    marginBottom: 16,
  },
  costTableTitle: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    fontWeight: "bold",
    padding: "4 8",
    color: colors.dark,
    marginTop: 8,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  tableCell: {
    paddingHorizontal: 8,
  },
  sumRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 8,
    padding: "4 8",
    fontWeight: "bold",
    color: colors.dark,
  },

  // Total Amount
  totalAmountBox: {
    backgroundColor: colors.accent2,
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  totalAmountText: {
    color: "white",
    fontWeight: "bold",
  },
  totalAmountValue: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  // State Relief
  reliefBox: {
    backgroundColor: colors.accent2,
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 9,
    marginTop: 8,
  },
  reliefGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  reliefDivider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: "white",
    width: "100%",
  },

  // Consumption Values
  consumptionTable: {
    width: "100%",
    marginTop: 5,
  },
  consumptionThead: {
    flexDirection: "row",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: colors.dark,
    paddingVertical: 4,
    fontSize: 8,
  },
  consumptionTh: {
    textAlign: "left",
  },
  consumptionTbody: {
    color: colors.text,
  },
  consumptionTr: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  consumptionTd: {
    textAlign: "left",
  },
  consumptionSumRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 8,
    padding: "4 8",
    fontWeight: "bold",
    color: colors.dark,
    marginTop: 4,
  },

  // Footer
  footer: {
    marginTop: 32,
    fontSize: 9,
    color: colors.text,
  },
});

export default function HeatingBillPreviewFourPDF({
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
            4/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
          </Text>
          <Image style={styles.logo} src="/admin_logo.png" />
        </View>
        <View style={styles.headerMain}>
          <View style={styles.headerMainCol}>
            <Text style={styles.headerTitle}>
              Ihre Heidi Systems ® Abrechnung für {"\n"} Heizung, Warmwasser,
              Kaltwasser
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.bold]}>
                  Liegenschaft
                </Text>
                <Text style={styles.infoValue}>
                  {previewData.contractorsNames}
                  {"\n"}
                  {previewData.objektInfo.street}
                  {"\n"}
                  {previewData.objektInfo.zip}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Erstellt im Auftrag von
                </Text>
                <Text style={styles.infoValue}>
                  {previewData.contractorsNames}
                  {"\n"}
                  {previewData.objektInfo.street}
                  {"\n"}
                  {previewData.objektInfo.zip}
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.bold]}>
                  Liegenschaftsnummer
                </Text>
                <Text style={[styles.infoLabel, styles.bold]}>
                  {previewData.propertyNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Heidi Nutzernummer
                </Text>
                <Text style={styles.infoValue}>
                  {previewData.heidiCustomerNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  Abrechnungszeitraum
                </Text>
                <Text style={styles.infoValue}>
                  {formatDateGerman(previewData.mainDocDates.start_date)} -{" "}
                  {formatDateGerman(previewData.mainDocDates.end_date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.textMuted]}>
                  erstellt am
                </Text>
                <Text style={styles.infoValue}>
                  {formatDateGerman(previewData.mainDocDates.created_at)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerMainCol}>
            <View style={styles.heidiAddress}>
              <Text>Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin</Text>
            </View>
            <Text style={styles.recipientAddress}>
              {previewData.contractorsNames}
              {"\n"}
              {previewData.objektInfo.street}
              {"\n"}
              {previewData.objektInfo.zip}
            </Text>
          </View>
        </View>
      </View>

      {/* Costs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ihre Kosten</Text>
        {/* Heating Costs */}
        <Text style={styles.costTableTitle}>Kosten für Heizung</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Grundkosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              77,02 m² Wohnfläche
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              1,869733 € je m²
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              144,01 €
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Verbrauchskosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              7,00 MWh
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              120,895580 € je MWh
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              846,27 €
            </Text>
          </View>
        </View>

        {/* Hot Water Costs */}
        <Text style={styles.costTableTitle}>Kosten für Warmwasser</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Grundkosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              77,02 m² Wohnfläche
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              1,453210 € je m²
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              111,93 €
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Verbrauchskosten
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              10,88 m³
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              12,059077 € je m³
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              131,20 €
            </Text>
          </View>
          <View style={[styles.sumRow, { marginTop: 4 }]}>
            <Text style={{ flex: 1 }}>
              Summe Kosten für Heizung und Warmwasser
            </Text>
            <Text style={{ textAlign: "right" }}>1.233,41 €</Text>
          </View>
        </View>

        {/* Cold Water Costs */}
        <Text style={styles.costTableTitle}>Kosten für Kaltwasser</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Kaltwasser Gesamt
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              45,20 m³
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              1,713411 € je m³
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              77,45 €
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Abwasser Gesamt
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              45,20 m³
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              2,014517 € je m³
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              91,06 €
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Gerätemiete Kaltwasser
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              45,20 m³
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              0,228791 € je m³
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              10,34 €
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold, { width: "25%" }]}>
              Abrechnung Kaltwasser
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              1,00 Nutzeinh.
            </Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
            <Text
              style={[styles.tableCell, { width: "25%", textAlign: "right" }]}
            >
              17,290569 € je Nutzeinh.
            </Text>
            <Text
              style={[styles.tableCell, { width: "5%", textAlign: "right" }]}
            >
              =
            </Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
            >
              17,29 €
            </Text>
          </View>
          <View style={[styles.sumRow, { marginTop: 4 }]}>
            <Text style={{ flex: 1 }}>Summe Kosten für Kaltwasser</Text>
            <Text style={{ textAlign: "right" }}>1.233,41 €</Text>
          </View>
        </View>

        {/* Total Amount */}
        <View style={styles.totalAmountBox}>
          <Text style={styles.totalAmountText}>Gesamtbetrag</Text>
          <Text style={styles.totalAmountValue}>1.429,55 €</Text>
        </View>
      </View>

      {/* State Relief */}
      <View style={styles.reliefBox}>
        <View style={styles.reliefGrid}>
          <Text style={{ flex: 4, color: "white", fontWeight: "bold" }}>
            Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)
          </Text>
          <Text style={{ flex: 1, color: "white" }}>Betrag</Text>
          <Text style={{ flex: 1, textAlign: "right", color: "white" }}>
            Ihr Anteil
          </Text>
        </View>
        <View style={styles.reliefDivider} />
        <View style={styles.reliefGrid}>
          <Text style={{ flex: 4, color: "white" }}>Preisbremse Energie</Text>
          <Text style={{ flex: 1, color: "white" }}>21.035,94 €</Text>
          <Text style={{ flex: 1, textAlign: "right", color: "white" }}>
            209,21 €
          </Text>
        </View>
      </View>

      {/* Consumption Values */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ihre Verbrauchswerte</Text>

        {/* Heating in MWh */}
        <Text style={styles.costTableTitle}>Heizung in MWh</Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>
              GERÄTENUMMER
            </Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>FAKTOR</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>BEMERKUNG</Text>
          </View>
          <View style={styles.consumptionTbody}>
            <View style={styles.consumptionTr}>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>Flur</Text>
              <Text style={[styles.consumptionTd, { flex: 2 }]}>
                6EFE0121755587
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                Wärmezähler
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>1,918</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>8,916</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>7,000</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
            </View>
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 8 }}>Summe Heizung</Text>
              <Text style={{ flex: 1 }}>7,000</Text>
              <Text style={{ flex: 1 }}></Text>
            </View>
          </View>
        </View>

        {/* Hot water in m³ */}
        <Text style={[styles.costTableTitle, { marginTop: 10 }]}>
          Warmwasser in m³
        </Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>
              GERÄTENUMMER
            </Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>FAKTOR</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>BEMERKUNG</Text>
          </View>
          <View style={styles.consumptionTbody}>
            <View style={styles.consumptionTr}>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>Bad</Text>
              <Text style={[styles.consumptionTd, { flex: 2 }]}>
                9DWZ0122156287
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                Warmwasserzähler
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>1,918</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>8,916</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>7,000</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
            </View>
            <View style={styles.consumptionTr}>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>Bad</Text>
              <Text style={[styles.consumptionTd, { flex: 2 }]}>
                9DWZ0122156287
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                Warmwasserzähler
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>1,918</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>8,916</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>7,000</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
            </View>
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 8 }}>Summe Warmwasser</Text>
              <Text style={{ flex: 1 }}>7,000</Text>
              <Text style={{ flex: 1 }}></Text>
            </View>
          </View>
        </View>

        {/* Cold water in m³ */}
        <Text style={[styles.costTableTitle, { marginTop: 10 }]}>
          Kaltwasser in m³
        </Text>
        <View style={styles.consumptionTable}>
          <View style={styles.consumptionThead}>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>
              RAUMBEZEICHNUNG
            </Text>
            <Text style={[styles.consumptionTh, { flex: 2 }]}>
              GERÄTENUMMER
            </Text>
            <Text style={[styles.consumptionTh, { flex: 1.5 }]}>GERÄTEART</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ANF.-STAND</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>ABLESUNG</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>FAKTOR</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>VERBRAUCH</Text>
            <Text style={[styles.consumptionTh, { flex: 1 }]}>BEMERKUNG</Text>
          </View>
          <View style={styles.consumptionTbody}>
            <View style={styles.consumptionTr}>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>Bad</Text>
              <Text style={[styles.consumptionTd, { flex: 2 }]}>
                8DWZ0122033399
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                Kaltwasserzähler
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>1,918</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>8,916</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>7,000</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
            </View>
            <View style={styles.consumptionTr}>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>Bad</Text>
              <Text style={[styles.consumptionTd, { flex: 2 }]}>
                8DWZ0122033399
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1.5 }]}>
                Kaltwasserzähler
              </Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>1,918</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>8,916</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}>7,000</Text>
              <Text style={[styles.consumptionTd, { flex: 1 }]}></Text>
            </View>
            <View style={styles.consumptionSumRow}>
              <Text style={{ flex: 8 }}>Summe Kaltwasser</Text>
              <Text style={{ flex: 1 }}>7,000</Text>
              <Text style={{ flex: 1 }}></Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
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
