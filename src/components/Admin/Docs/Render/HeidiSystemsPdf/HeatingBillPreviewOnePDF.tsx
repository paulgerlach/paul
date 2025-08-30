"use client";
import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";
import type { ContractorType } from "@/types";
import { formatDateGerman, formatEuro, generateUserNumber } from "@/utils";

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
    fontFamily: "Helvetica",
    fontSize: 8,
    padding: 30,
    color: colors.text,
  },
  headerBox: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: { width: 130, height: 48 },
  section: { marginBottom: 20 },
  bold: { fontWeight: "bold", color: colors.dark },
  title: { fontSize: 16, fontWeight: "bold", color: colors.dark },
  subTitle: { fontSize: 12, marginTop: 6, fontWeight: "bold" },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  twoColsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  colHalf: {
    width: "48%",
  },
  boxDark: {
    backgroundColor: colors.dark,
    color: "white",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  hintRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  square: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#F3F8F5",
    marginRight: 5,
  },
  accessBox: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },
  qr: { width: 100, height: 100, alignSelf: "flex-end" },
  contractorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  contractorItem: {
    width: "33%",
    marginBottom: 4,
  },
});

const mockData = {
  billNumber: "355703/0010",
  customerName: "Andreas Preissler Eigennutzer",
  customerAddress: "Lindenstraße 49",
  city: "12589 Berlin",
  createdBy: "Braun & Hubertus GmbH",
  createdByAddress: "Keithstr. 2-4",
  createdByCity: "10787 Berlin",
  createdDate: "14.11.2024",
  billingPeriod: {
    heating: "01.01.2023 - 31.12.2023",
    usage: "01.01.2023 - 31.12.2023",
  },
  propertyAccount: "Rungestr. 21 u.a.",
  propertyCity: "10179 Berlin",
  propertyNumber: "355703",
  heidiCustomerNumber: "0010",
  userNumber: "W647/4647/112",
  totalAmount: "1.429,55 €",
  userId: "1901913711",
  securityCode: "QNQH27LF1j",
  portalLink: "heidi.systems/3303",
  properties: [
    "10179 Berlin, Rungestr. 21",
    "10179 Berlin, Rungestr. 21A",
    "10179 Berlin, Rungestr. 21B",
    "10179 Berlin, Rungestr. 21C",
    "10179 Berlin, Rungestr. 21D",
    "10179 Berlin, Rungestr. 21E",
    "10179 Berlin, Rungestr. 21F",
  ],
};

export default function HeatingBillPreviewOnePDF({
  previewData,
  contractors,
}: {
  previewData: HeatingBillPreviewData;
  contractors: ContractorType[];
}) {
  return (
    // <Document>
    <Page size="A4" style={styles.page}>
      {/* ✅ Header */}
      <View style={styles.headerBox}>
        <View style={styles.flexRow}>
          <Text style={{ fontSize: 8 }}>
            1/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
          </Text>
          <View>
            <Image
              style={{ width: 80, height: 20, alignSelf: "center" }}
              src="/admin_logo.png"
            />
          </View>
          {/* Logo intentionally omitted in PDF to avoid bundling issues */}
        </View>

        <View style={[styles.flexRow, { marginTop: 20 }]}>
          {/* Customer */}
          <View>
            <Text style={[styles.bold, { borderBottom: "1px solid #000" }]}>
              Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
            </Text>
            <Text style={{ fontSize: 14, marginTop: 20, fontWeight: "bold" }}>
              {previewData.contractorsNames}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {previewData.objektInfo.street}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {previewData.objektInfo.zip}
            </Text>
          </View>

          {/* Right Side Title */}
          <View>
            <Text style={[styles.title]}>Ihre Heidi Systems®</Text>
            <Text style={[styles.title]}>Abrechnung für Heizung,</Text>
            <Text style={[styles.title]}>Warmwasser, Kaltwasser</Text>
            <Text style={styles.subTitle}>Zusammenstellung Ihrer Kosten</Text>
          </View>
        </View>
      </View>

      {/* ✅ General Info Grid */}
      <View style={[styles.section, styles.twoColsRow]}>
        {/* Left column */}
        <View style={styles.colHalf}>
          <View style={styles.gridRow}>
            <Text>Erstellt im Auftrag von</Text>
            <Text>
              {previewData.userInfo.first_name} {previewData.userInfo.last_name}
              {"\n"}
              Immobilienmanagement {"\n"}
              {previewData.objektInfo.street}
              {"\n"}
              {previewData.objektInfo.zip}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Abrechnungszeitraum</Text>
            <Text>
              {formatDateGerman(previewData.mainDocDates.start_date)}{" "}
              {formatDateGerman(previewData.mainDocDates.end_date)}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Ihr Nutzungszeitraum</Text>
            <Text>
              {formatDateGerman(previewData.mainDocDates.start_date)}{" "}
              {formatDateGerman(previewData.mainDocDates.end_date)}
            </Text>
          </View>
        </View>

        {/* Right column */}
        <View style={styles.colHalf}>
          <View style={styles.gridRow}>
            <Text>Erstellt am</Text>
            <Text>{formatDateGerman(previewData.mainDocDates.created_at)}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Liegenschaft</Text>
            <Text>
              {previewData.contractorsNames}
              {"\n"}
              {previewData.objektInfo.street}
              {"\n"}
              {previewData.objektInfo.zip}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Liegenschaftsnummer</Text>
            <Text>{mockData.propertyNumber}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text>Heidi Nutzernummer</Text>
            <Text>{mockData.heidiCustomerNumber}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text>Ihre Nutzernummer</Text>
            <Text>{generateUserNumber()}</Text>
          </View>
        </View>
      </View>

      {/* ✅ Greeting */}
      <View style={{ marginBottom: 8 }}>
        <Text>Sehr geehrte Damen und Herren,</Text>
        <Text>
          wir haben die Kosten, die im vergangenen Abrechnungszeitraum
          angefallen sind, abgerechnet. Unsere Abrechnung ist auf den folgenden
          {"\n"}
          Seiten dieses Schreibens detailliert beschrieben.
        </Text>
      </View>

      {/* ✅ Total Box */}
      <View style={styles.boxDark}>
        <Text style={{ fontSize: 10, textAlign: "right", marginBottom: 6 }}>
          Betrag
        </Text>
        <View style={{ borderTop: "1px solid white", marginBottom: 6 }} />
        <View style={styles.flexRow}>
          <Text style={{ fontSize: 12 }}>Gesamtbetrag</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {formatEuro(previewData.totalInvoicesAmount)}
          </Text>
        </View>
      </View>

      {/* ✅ Notes */}
      <Text style={[styles.bold, { marginBottom: 8 }]}>
        Beachten Sie bitte folgende Hinweise:
      </Text>
      <View style={styles.hintRow}>
        <View style={styles.square} />
        <Text>
          Bitte rechnen Sie Nachzahlungen oder Guthaben ausschließlich mit Ihrem
          Vermieter/Verwalter ab. Leisten Sie keine Zahlungen an Heidi Systems
          GmbH.
        </Text>
      </View>
      <View style={styles.hintRow}>
        <View style={styles.square} />
        <Text>
          Im Zuge der Energiekrise sind die Energiepreise gegenüber dem Vorjahr
          extrem gestiegen. Dies kann dazu führen, dass Ihre
          {"\n"}
          Energiekosten in diesem Abrechnungszeitraum höher liegen als bisher
          selbst bei reduziertem Verbrauch.
          {"\n"}
          Unter {mockData.portalLink} können Sie prüfen, wie sehr sich die
          Energiepreise in Ihrer Liegenschaft und für Sie persönlich
          {"\n"}
          verändert haben.
        </Text>
      </View>
      <View style={styles.hintRow}>
        <View style={styles.square} />
        <Text>
          Allgemeine Hinweise und Informationen zur Abrechnung finden Sie unter:{" "}
          {mockData.portalLink}
        </Text>
      </View>

      {/* ✅ Access Box */}
      <View style={styles.accessBox}>
        <View style={styles.twoColsRow}>
          <View style={[styles.colHalf, { gap: 6 }]}>
            <Text style={styles.bold}>
              Ihre persönlichen Zugangsdaten für das Heidi Nutzerportal.
            </Text>
            <Text>
              Mit Heidi Systems bekommen Sie Zugriff auf die unterjährigen
              Verbrauchsinformationen
              {"\n"}- eine übersichtliche, monatliche Darstellung Ihrer
              Verbräuche -{"\n"}und können so Einsparmöglichkeiten auch zwischen
              den Abrechnungen erkennen.
            </Text>
            <View>
              <View style={styles.gridRow}>
                <Text style={styles.bold as any}>Nutzer-ID:</Text>
                <Text>{mockData.userId}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.bold as any}>Sicherheitscode:</Text>
                <Text>{mockData.securityCode}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.colHalf, { alignItems: "flex-end" }]}>
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://heidi.systems/3303"
              style={{ width: 40, height: 40 }}
            />
            <Text style={[styles.bold, { marginTop: 4 }]}>
              Oder registrieren unter {mockData.portalLink}.
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ Contractors list */}
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.bold, { marginBottom: 8 }]}>
          Folgende Objekte sind in dieser Abrechnung berücksichtigt:
        </Text>
        <View style={styles.contractorsGrid}>
          {contractors?.map((contractor) => (
            <View key={contractor.id} style={styles.contractorItem}>
              <Text>
                {contractor.first_name} {contractor.last_name}
                {"\n"}
                {previewData.objektInfo.street}
                {"\n"}
                {previewData.objektInfo.zip}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
