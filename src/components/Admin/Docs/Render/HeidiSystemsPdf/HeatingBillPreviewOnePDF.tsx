"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
// import { admin_logo } from "@/static/icons"; // This import is commented out in the original code, keeping it commented.

type BillDataType = {
  billNumber: string;
  customerName: string;
  customerAddress: string;
  city: string;
  createdBy: string;
  createdByAddress: string;
  createdByCity: string;
  createdDate: string;
  billingPeriod: {
    heating: string;
    usage: string;
  };
  propertyAccount: string;
  propertyCity: string;
  propertyNumber: string;
  heidiCustomerNumber: string;
  userNumber: string;
  totalAmount: string;
  userId: string;
  securityCode: string;
  portalLink: string;
  properties: string[];
};

const mockData: BillDataType = {
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
  portalLink: "heidi.systems/34053",
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 7,
  },
  logo: {
    width: 70,
    height: 22,
  },
  addressLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
    marginBottom: 8,
    fontSize: 7,
  },
  customerAndInvoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  customerInfo: {
    width: '50%',
  },
  invoiceInfo: {
    width: '50%',
    textAlign: 'left',
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 1,
  },
  customerAddress: {
    fontSize: 9,
  },
  invoiceTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  invoiceSubtitle: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  billingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    fontSize: 8,
  },
  billingColumn: {
    width: '50%',
  },
  billingSection: {
    marginBottom: 8,
  },
  billingRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  billingLabel: {
    fontWeight: 'bold',
    width: '50%',
  },
  billingValue: {
    width: '50%',
  },
  greeting: {
    marginTop: 15,
    fontSize: 8,
  },
  greetingHeader: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  greetingText: {
    lineHeight: 1.3,
  },
  totalAmountSection: {
    marginTop: 8,
    backgroundColor: '#E5E7EB',
  },
  totalAmountHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
  },
  totalAmountHeaderText: {
    fontWeight: 'bold',
  },
  totalAmount: {
    backgroundColor: '#1E40AF',
    color: '#ffffff',
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontWeight: 'bold',
  },
  totalAmountValue: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  importantNotice: {
    marginTop: 12,
    fontSize: 8,
  },
  importantNoticeHeader: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  noticeItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 8,
  },
  noticeText: {
    flex: 1,
  },
  qrCodeSection: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accessInfo: {
    flex: 1,
    fontSize: 8,
  },
  accessInfoHeader: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  accessInfoText: {
    marginBottom: 1,
  },
  accessData: {
    marginTop: 6,
    flexDirection: 'row',
  },
  accessDataColumn: {
    width: '50%',
  },
  accessDataLabel: {
    fontWeight: 'bold',
  },
  accessDataValue: {
    fontFamily: 'Courier',
  },
  qrCode: {
    marginLeft: 8,
    alignItems: 'center',
  },
  portalLink: {
    fontSize: 7,
    marginTop: 3,
    color: '#2563EB',
    textDecoration: 'underline',
  },
  propertiesSection: {
    marginTop: 12,
    fontSize: 8,
  },
  propertiesHeader: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyItem: {
    width: '33.33%',
    paddingRight: 4,
    marginBottom: 1,
  },
});

export default function HeatingBillPreviewOnePDF() {
  return (
    // <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>1/6 {mockData.billNumber}</Text>
        {/* <Image style={styles.logo} src={admin_logo} /> */}
      </View>

      <View style={styles.addressLine}>
        <Text>Heidi Systems GmbH, Runge Straße 21, 10974 Berlin</Text>
      </View>

      <View style={styles.customerAndInvoiceInfo}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{mockData.customerName}</Text>
          <Text style={styles.customerAddress}>{mockData.customerAddress}</Text>
          <Text style={styles.customerAddress}>{mockData.city}</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>
            Ihre Abrechnung für Heizung,{"\n"}
            Warmwasser, Kaltwasser von Heidi
          </Text>
          <Text style={styles.invoiceSubtitle}>
            Zusammenstellung Ihrer Kosten
          </Text>
        </View>
      </View>

      <View style={styles.billingDetails}>
        <View style={styles.billingColumn}>
          <View style={styles.billingSection}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
              Erstellt im Auftrag von
            </Text>
            <Text>{mockData.createdBy}</Text>
            <Text>Immobilienmanagement</Text>
            <Text>{mockData.createdByAddress}</Text>
            <Text>{mockData.createdByCity}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Abrechnungszeitraum</Text>
            <Text style={styles.billingValue}>
              {mockData.billingPeriod.heating}
            </Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Ihr Nutzungszeitraum</Text>
            <Text style={styles.billingValue}>
              {mockData.billingPeriod.usage}
            </Text>
          </View>
        </View>
        <View style={styles.billingColumn}>
          <View style={styles.billingRow}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold" }}>Erstellt am</Text>
              <Text>{mockData.createdDate}</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold" }}>Liegenschaft</Text>
              <Text>{mockData.propertyAccount}</Text>
              <Text>{mockData.propertyCity}</Text>
            </View>
          </View>
          <View style={[styles.billingRow, { marginTop: 10 }]}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold" }}>Liegenschaftsnummer</Text>
              <Text>{mockData.propertyNumber}</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold" }}>Heidi Nutzernummer</Text>
              <Text>{mockData.heidiCustomerNumber}</Text>
              <Text style={{ fontWeight: "bold" }}>Ihre Nutzernummer</Text>
              <Text>{mockData.userNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetingHeader}>
          Sehr geehrte Damen und Herren,
        </Text>
        <Text style={styles.greetingText}>
          wir haben die Kosten, die im vergangenen Abrechnungszeitraum
          angefallen sind, abgerechnet. Unsere Abrechnung ist auf den{"\n"}
          folgenden Seiten dieses Schreibens detailliert beschrieben.
        </Text>
      </View>

      <View style={styles.totalAmountSection}>
        <View style={styles.totalAmountHeader}>
          <Text style={styles.totalAmountHeaderText}>Betrag</Text>
        </View>
        <View style={styles.totalAmount}>
          <Text style={styles.totalAmountLabel}>Gesamtbetrag</Text>
          <Text style={styles.totalAmountValue}>{mockData.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.importantNotice}>
        <Text style={styles.importantNoticeHeader}>
          Beachten Sie bitte folgende Hinweise:
        </Text>
        <View style={styles.noticeItem}>
          <Text style={styles.bullet}>·</Text>
          <Text style={styles.noticeText}>
            Bitte rechnen Sie Nachzahlungen oder Guthaben{" "}
            <Text style={{ fontWeight: "bold" }}>ausschließlich</Text> mit Ihrem
            Vermieter/Verwalter ab. Leisten Sie keine Zahlungen an
          </Text>
        </View>
        <View style={styles.noticeItem}>
          <Text style={styles.bullet}>·</Text>
          <Text style={styles.noticeText}>
            Im Zuge der Energiekrise sind die Energiepreise gegenüber dem
            Vorjahr extrem gestiegen. Dies kann dazu führen, dass Ihre
            Energiekosten in diesem Abrechnungszeitraum höher liegen als bisher
            - selbst bei reduziertem Verbrauch.{"\n"}
            Unter www.brudirekt.de/3600 können Sie prüfen, wie sehr sich die
            Energiepreise in Ihrer Liegenschaft und für Sie persönlich verändert
            haben.
          </Text>
        </View>
        <View style={styles.noticeItem}>
          <Text style={styles.bullet}>·</Text>
          <Text style={styles.noticeText}>
            Allgemeine Hinweise und Informationen zur Abrechnung finden Sie
          </Text>
        </View>
      </View>

      <View style={styles.qrCodeSection}>
        <View style={styles.accessInfo}>
          <Text style={styles.accessInfoHeader}>
            Ihre persönlichen Zugangsdaten für - Das Nutzerportal.
          </Text>
          <Text style={styles.accessInfoText}>
            Mit BRUdirekt bekommen Sie Zugriff auf die unterjährigen
            Verbrauchsinformationen
          </Text>
          <Text style={styles.accessInfoText}>
            - eine übersichtliche, monatliche Darstellung Ihrer Verbräuche -
          </Text>
          <Text style={styles.accessInfoText}>
            und können so Einsparmöglichkeiten auch zwischen den Abrechnungen
            erkennen.
          </Text>
          <View style={styles.accessData}>
            <View style={styles.accessDataColumn}>
              <Text style={styles.accessDataLabel}>Nutzer-ID:</Text>
              <Text style={styles.accessDataValue}>{mockData.userId}</Text>
            </View>
            <View style={styles.accessDataColumn}>
              <Text style={styles.accessDataLabel}>Sicherheitscode:</Text>
              <Text style={styles.accessDataValue}>
                {mockData.securityCode}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.qrCode}>
          <Text style={styles.portalLink}>
            Oder registrieren unter {mockData.portalLink}
          </Text>
        </View>
      </View>

      <View style={styles.propertiesSection}>
        <Text style={styles.propertiesHeader}>
          Folgende Objekte sind in dieser Abrechnung berücksichtigt:
        </Text>
        <View style={styles.propertiesGrid}>
          {mockData.properties.map((property, index) => (
            <View key={index} style={styles.propertyItem}>
              <Text>{property}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
    // </Document>
  );
}
