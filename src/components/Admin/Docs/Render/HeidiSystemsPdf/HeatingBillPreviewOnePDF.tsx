"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { admin_logo } from "@/static/icons";

const colors = {
  accent: "#DDE9E0",
  accent2: "#7F9D86",
  dark: "#083123",
  text: "#0D282FCC",
  title: "#5A917F",
  link: "#6BCAAA",
};

// Mock data for the bill, as provided in the original component
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
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
  boxDark: {
    backgroundColor: colors.dark,
    color: "white",
    borderRadius: 12,
    padding: 12,
    marginVertical: 20,
  },
  hintRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  square: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#F3F8F5",
    marginRight: 10,
  },
  accessBox: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  qr: { width: 100, height: 100, alignSelf: "flex-end" },
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

export default function HeatingBillPreviewOnePDF() {
  return (
    // <Document>
    <Page size="A4" style={styles.page}>
      {/* ✅ Header */}
      <View style={styles.headerBox}>
        <View style={styles.flexRow}>
          <Text style={{ fontSize: 8 }}>1/6 {mockData.billNumber}</Text>
          {/* <Image src={admin_logo} style={styles.logo} /> */}
        </View>

        <View style={[styles.flexRow, { marginTop: 20 }]}>
          {/* Customer */}
          <View>
            <Text style={[styles.bold, { borderBottom: "1px solid #000" }]}>
              Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
            </Text>
            <Text style={{ fontSize: 14, marginTop: 20, fontWeight: "bold" }}>
              {mockData.customerName}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {mockData.customerAddress}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {mockData.city}
            </Text>
          </View>

          {/* Right Side Title */}
          <View>
            <Text style={[styles.title]}>
              Ihre Heidi Systems® Abrechnung für Heizung, Warmwasser,
              Kaltwasser
            </Text>
            <Text style={styles.subTitle}>Zusammenstellung Ihrer Kosten</Text>
          </View>
        </View>
      </View>

      {/* ✅ General Info Grid */}
      <View style={styles.section}>
        <View style={styles.gridRow}>
          <Text>Erstellt im Auftrag von</Text>
          <Text>
            {mockData.createdBy} {"\n"}
            Immobilienmanagement {"\n"}
            {mockData.createdByAddress} {"\n"}
            {mockData.createdByCity}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text>Abrechnungszeitraum</Text>
          <Text>{mockData.billingPeriod.heating}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text>Ihr Nutzungszeitraum</Text>
          <Text>{mockData.billingPeriod.usage}</Text>
        </View>
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
            {mockData.totalAmount}
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
          Im Zuge der Energiekrise sind die Energiepreise gestiegen. Unter
        </Text>
      </View>
    </Page>
  );
}
