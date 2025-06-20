"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
    page: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        fontSize: 9,
        fontFamily: "Helvetica",
        backgroundColor: "#f8f8f8",
    },
    pageNumber: {
        position: "absolute",
        top: 20,
        left: 50,
        fontSize: 8,
    },
    heidiLogo: {
        position: "absolute",
        top: 40,
        right: 50,
        fontSize: 16,
        fontWeight: "bold",
    },
    header: {
        marginTop: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 8,
        padding: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: "#e8e8e8",
        padding: 5,
    },
    addressSection: {
        flexDirection: "row",
        marginBottom: 20,
    },
    leftAddress: {
        flex: 1,
        marginRight: 20,
    },
    rightAddress: {
        flex: 1,
    },
    grayBox: {
        backgroundColor: "#d0d0d0",
        width: 150,
        height: 60,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 9,
        marginBottom: 3,
        lineHeight: 1.3,
    },
    bold: {
        fontWeight: "bold",
    },
    table: {
        border: "1px solid black",
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid black",
        minHeight: 18,
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
    },
    tableCell: {
        padding: 4,
        borderRight: "1px solid black",
        fontSize: 8,
        flex: 1,
        textAlign: "left",
    },
    tableCellRight: {
        padding: 4,
        borderRight: "1px solid black",
        fontSize: 8,
        flex: 1,
        textAlign: "right",
    },
    tableCellCenter: {
        padding: 4,
        borderRight: "1px solid black",
        fontSize: 8,
        flex: 1,
        textAlign: "center",
    },
    summaryBox: {
        backgroundColor: "#e8f5e8",
        border: "1px solid #4CAF50",
        padding: 8,
        marginBottom: 15,
    },
    infoBox: {
        backgroundColor: "#f0f8ff",
        border: "1px solid #87CEEB",
        padding: 8,
        marginBottom: 15,
    },
    qrCode: {
        width: 50,
        height: 50,
        backgroundColor: "#000",
        marginTop: 10,
    },
    costBreakdown: {
        marginBottom: 20,
    },
    energySection: {
        marginBottom: 20,
    },
    chart: {
        width: 100,
        height: 60,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
    },
    chartSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    chartContainer: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: "center",
    },
    chartTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    chartPlaceholder: {
        width: 150,
        height: 100,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    chartValues: {
        alignItems: "center",
    },
    smallText: {
        fontSize: 7,
        marginBottom: 2,
        textAlign: "center",
    },
    comparisonTable: {
        border: "1px solid black",
        marginBottom: 15,
    },
});

// Sample data structure
const propertyData = {
    documentNumber: "1 / 6 3557030010",
    property: "Liegenschaft",
    propertyNumber: "0010",
    heidiNumber: "WGr7464717112",
    period: "01.01.2024 - 31.12.2024",
    createdDate: "05.01.2025",
    totalAmount: "1.429,65 €",
};

const energyData = [
    { type: "Preisbrems Energie", date: "31.12.2024", amount: "761.123", unit: "kWh", cost: "21.035,94 €" },
];

const heatingCosts = [
    { item: "Grundkosten", area: "77,02m² Wohnfläche", factor: "1,869733 €g m²", amount: "144,01 €" },
    { item: "Verbrauchskosten", consumption: "7,03 MWh", factor: "120,895580 €g kWh", amount: "849,77 €" },
    { item: "Kosten für Warmwasser", area: "77,02m² Wohnfläche", factor: "1,453210 €g m²", amount: "111,89 €" },
];

const waterCosts = [
    { item: "Kaltwasser Gesamt", volume: "45,28m³", rate: "2,018517 €g m³", amount: "91,96 €" },
    { item: "Abwasser Gesamt", volume: "45,28m³", rate: "2,018517 €g m³", amount: "91,96 €" },
];

export default function HeidiSystemsPdf() {
    return (
        <PDFViewer width="100%" height="900">
            <Document>
                {/* Page 1 - Cover Letter */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>{propertyData.documentNumber}</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Ihre Heidi Systems Abrechnung für Warmwasser, Kaltwasser und Heizung{'\n'}
                            Zusammenstellung Ihrer Kosten
                        </Text>
                    </View>

                    <View style={styles.addressSection}>
                        <View style={styles.leftAddress}>
                            <View style={styles.grayBox}>
                                <Text style={[styles.text, { textAlign: "center" }]}>Erstellt im Auftrag von</Text>
                            </View>
                            <View style={styles.grayBox}>
                                <Text style={[styles.text, { textAlign: "center" }]}>Address Block</Text>
                            </View>

                            <Text style={styles.text}>Abrechnungszeitraum: {propertyData.period}</Text>
                            <Text style={styles.text}>Ihr Nutzungszeitraum: {propertyData.period}</Text>
                        </View>

                        <View style={styles.rightAddress}>
                            <Text style={styles.text}>Erstellt am: {propertyData.createdDate}</Text>
                            <Text style={styles.text}>Liegenschaft</Text>
                            <View style={styles.grayBox}>
                                <Text style={[styles.text, { textAlign: "center" }]}>Property Info</Text>
                            </View>
                            <Text style={styles.text}>Liegenschaftsnummer</Text>
                            <Text style={styles.text}>Heidi Systems Nutzernummer: {propertyData.heidiNumber}</Text>
                            <Text style={styles.text}>Ihre Nutzernummer: {propertyData.propertyNumber}</Text>
                        </View>
                    </View>

                    <Text style={[styles.text, { marginBottom: 15 }]}>Sehr geehrte Damen und Herren,</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.text}>
                            wir haben die Kosten, die im vergangenen Abrechnungszeitraum angefallen sind, abgerechnet. Unsere Abrechnung ist auf den
                            folgenden Seiten dieses Schreibens detailliert beschrieben.
                        </Text>
                    </View>

                    <View style={styles.summaryBox}>
                        <Text style={[styles.text, styles.bold]}>Gesamtbetrag: {propertyData.totalAmount}</Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={[styles.text, styles.bold]}>Beachten Sie bitte folgende Hinweise:</Text>
                        <Text style={styles.text}>
                            Bitte rechnen Sie Nachzahlungen oder Guthaben ausschließlich mit Ihrem Vermieter/Verwalter ab. Leisten Sie keine
                            Zahlungen an Heidi Systems.
                        </Text>
                        <Text style={styles.text}>
                            Die Energiekosten lagen im Abrechnungszeitraum 2024 (insgesamt leicht unter dem Niveau des Vorjahres. Dennoch können
                            individuelle Verbrauchsveränderungen und vertragliche Unterschiede zu abweichenden Entwicklungen bei den Gesamtkosten
                            führen.
                        </Text>
                        <Text style={styles.text}>
                            Allgemeine Hinweise und Informationen zur Abrechnung finden Sie unter:
                        </Text>
                        <Text style={styles.text}>www.heidisystems.com/353se9</Text>

                        <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>Ihr persönlicher Link zu Ihrer Heidi Systems Verbrauchsübersicht:</Text>
                        <Text style={styles.text}>
                            Heidi Systems bringt volle Transparenz in Ihren Energieverbrauch und Ihre Abrechnung. Sie zahlen nur, was
                            Sie wirklich verbrauchen – ohne versteckte Kosten.
                        </Text>
                        <Text style={styles.text}>
                            Dank moderner Messgeräte und digitalem Zugang sehen Sie Ihre Verbräuche täglich und übersichtlich
                            dargestellt. So lassen sich Einsparpotenziale frühzeitig erkennen nicht erst zur Jahresabrechnung.
                        </Text>

                        <View style={styles.qrCode}></View>
                    </View>
                </Page>

                {/* Page 2 - Cost Breakdown */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>2 / 6 3557030010</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <Text style={[styles.title, { backgroundColor: "transparent", padding: 0 }]}>
                        Ihre Heidi Systems Abrechnung für Warmwasser, Kaltwasser und Heizung
                    </Text>

                    <View style={styles.addressSection}>
                        <View style={styles.leftAddress}>
                            <Text style={styles.text}>Die Gesamtabrechnung bildet die Aufteilung der Kosten</Text>
                            <Text style={styles.text}>für das gesamte Gebäude ab. Die anteiligen Kosten</Text>
                            <Text style={styles.text}>für Ihre Nutzeinheit entnehmen Sie bitte dem Formular</Text>
                            <Text style={styles.text}>&quot;Ihre Abrechnung&quot;.</Text>
                        </View>
                        <View style={styles.rightAddress}>
                            <Text style={styles.text}>Liegenschaft</Text>
                            <Text style={styles.text}>Liegenschaftsnummer</Text>
                            <Text style={styles.text}>Abrechnungszeitraum: {propertyData.period}</Text>
                            <Text style={styles.text}>erstellt am: {propertyData.createdDate}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Aufstellung der Kosten</Text>

                    <View style={styles.energySection}>
                        <Text style={[styles.text, styles.bold]}>Energieart: Nah-/Fernwärme kWh</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>POSITION</Text>
                                <Text style={styles.tableCell}>DATUM</Text>
                                <Text style={styles.tableCell}>BETRAG</Text>
                                <Text style={styles.tableCell}>Weitere Heizungsbetriebskosten</Text>
                                <Text style={styles.tableCell}>DATUM</Text>
                                <Text style={styles.tableCell}>BETRAG</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Preisbrems Energie</Text>
                                <Text style={styles.tableCell}>31.12.2024</Text>
                                <Text style={styles.tableCellRight}>21.035,94 €</Text>
                                <Text style={styles.tableCell}>Übertrag</Text>
                                <Text style={styles.tableCell}>-</Text>
                                <Text style={styles.tableCellRight}>103.206,53€</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>260020672169</Text>
                                <Text style={styles.tableCell}>31.12.2024</Text>
                                <Text style={styles.tableCellRight}>761.123 kWh 124.242,47 €</Text>
                                <Text style={styles.tableCell}>Verbrauchsabrechnung</Text>
                                <Text style={styles.tableCell}>-</Text>
                                <Text style={styles.tableCellRight}>7.155,11€</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Kosten für gesonderte Verteilung</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>VERTEILUNG NACH</Text>
                            <Text style={styles.tableCell}>POSITION</Text>
                            <Text style={styles.tableCell}>DATUM</Text>
                            <Text style={styles.tableCell}>BETRAG</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Heizung</Text>
                            <Text style={styles.tableCell}>Gemeinsame Heizung/Warmwasser</Text>
                            <Text style={styles.tableCell}>31.12.2024</Text>
                            <Text style={styles.tableCellRight}>4.210,80€</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Warmwasser/Kaltwasser</Text>
                            <Text style={styles.tableCell}>Kaltwasser</Text>
                            <Text style={styles.tableCell}>31.12.2024</Text>
                            <Text style={styles.tableCellRight}>77.036,69€</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Aufteilung der Kosten</Text>

                    <View style={styles.costBreakdown}>
                        <Text style={[styles.text, styles.bold]}>Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung</Text>
                        <Text style={styles.text}>2,5 kWh/m³ K. x 3.149,25 m³ (80-10°C) = +342.201,09 kWh Nah-/Fernwärme = 44,96 % d. Gesamtverb.</Text>

                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>44,96 % aus 115.489,07 € Energie- und Heizungsbetriebskosten entspricht Kosten für Erwärmung Warmwasser</Text>
                                <Text style={styles.tableCellRight}>51.927,84 €</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Gemeinsame Heizungsumwälzkosten</Text>
                                <Text style={styles.tableCellRight}>2.307,77 €</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Kosten für Warmwasser</Text>
                                <Text style={styles.tableCellRight}>54.235,71 €</Text>
                            </View>
                        </View>
                    </View>
                </Page>

                {/* Page 3 - Cold Water Costs */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>3 / 6 3557030010</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <Text style={styles.sectionTitle}>Berechnung und Aufteilung der Kosten für Kaltwasser</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Kosten für Kaltwasser</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>41.468,88 €</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Kaltwasser Gesamt</Text>
                            <Text style={styles.tableCell}>17.036,69 €</Text>
                            <Text style={styles.tableCell}>9.943,14 m³</Text>
                            <Text style={styles.tableCellRight}>1,713411 €/m³</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Abwasser Gesamt</Text>
                            <Text style={styles.tableCell}>20.030,02 €</Text>
                            <Text style={styles.tableCell}>9.943,14 m³</Text>
                            <Text style={styles.tableCellRight}>2,014517 €/m³</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Gemeinsame Kaltwasser</Text>
                            <Text style={styles.tableCell}>2.274,30 €</Text>
                            <Text style={styles.tableCell}>9.943,14 m³</Text>
                            <Text style={styles.tableCellRight}>0,228791 €/m³</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Abrechnung Kaltwasser</Text>
                            <Text style={styles.tableCell}>2.126,87 €</Text>
                            <Text style={styles.tableCell}>129,04 Nutzeinh.</Text>
                            <Text style={styles.tableCellRight}>17,290006 €/Nutzeinh.</Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Summe der verteilten Kosten</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCellRight}>165.485,59€</Text>
                        </View>
                    </View>
                </Page>

                {/* Page 4 - Your Costs Summary */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>4 / 6 3557030010</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <Text style={styles.title}>
                        Ihre Heidi Systems Abrechnung für Warmwasser, Kaltwasser und Heizung
                    </Text>

                    <View style={styles.addressSection}>
                        <View style={styles.leftAddress}>
                            <View style={styles.grayBox}>
                                <Text style={[styles.text, { textAlign: "center" }]}>Erstellt im Auftrag von</Text>
                            </View>
                            <View style={styles.grayBox}>
                                <Text style={[styles.text, { textAlign: "center" }]}>Address Block</Text>
                            </View>
                        </View>
                        <View style={styles.rightAddress}>
                            <Text style={styles.text}>Liegenschaft</Text>
                            <Text style={styles.text}>Liegenschaftsnummer: {propertyData.propertyNumber}</Text>
                            <Text style={styles.text}>Heidi Systems Nutzernummer</Text>
                            <Text style={styles.text}>Abrechnungszeitraum: {propertyData.period}</Text>
                            <Text style={styles.text}>erstellt am: {propertyData.createdDate}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ihre Kosten</Text>

                    <View style={styles.costBreakdown}>
                        <Text style={[styles.text, styles.bold]}>Kosten für Heizung</Text>
                        <View style={styles.table}>
                            {heatingCosts.map((cost, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{cost.item}</Text>
                                    <Text style={styles.tableCell}>{cost.area || cost.consumption}</Text>
                                    <Text style={styles.tableCell}>x</Text>
                                    <Text style={styles.tableCell}>{cost.factor}</Text>
                                    <Text style={styles.tableCell}>=</Text>
                                    <Text style={styles.tableCellRight}>{cost.amount}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={[styles.text, styles.bold]}>Kosten für Kaltwasser</Text>
                        <View style={styles.table}>
                            {waterCosts.map((cost, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{cost.item}</Text>
                                    <Text style={styles.tableCell}>{cost.volume}</Text>
                                    <Text style={styles.tableCell}>x</Text>
                                    <Text style={styles.tableCell}>{cost.rate}</Text>
                                    <Text style={styles.tableCell}>=</Text>
                                    <Text style={styles.tableCellRight}>{cost.amount}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.summaryBox}>
                            <Text style={[styles.text, styles.bold]}>Gesamtbetrag: {propertyData.totalAmount}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Preisbrems Energie</Text>
                            <Text style={styles.tableCellRight}>21.035,94 €</Text>
                            <Text style={styles.tableCellRight}>209,21 €</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ihre Verbrauchswerte</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Heizung in MWh</Text>
                            <Text style={styles.tableCell}>GERÄTENUMMER</Text>
                            <Text style={styles.tableCell}>GERÄTETYP</Text>
                            <Text style={styles.tableCell}>ANF-STAND</Text>
                            <Text style={styles.tableCell}>ABLESUNG</Text>
                            <Text style={styles.tableCell}>FAKTOR</Text>
                            <Text style={styles.tableCell}>VERBRAUCH</Text>
                            <Text style={styles.tableCell}>BEWERTUNG</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Raumheizkosten</Text>
                            <Text style={styles.tableCell}>RN/2022/789887</Text>
                            <Text style={styles.tableCell}>Wärmemesser</Text>
                            <Text style={styles.tableCell}>1349</Text>
                            <Text style={styles.tableCell}>8.379</Text>
                            <Text style={styles.tableCell}>1</Text>
                            <Text style={styles.tableCell}>7.030</Text>
                            <Text style={styles.tableCell}>-</Text>
                        </View>
                    </View>

                    <Text style={styles.text}>
                        Detaillierte Berechnung und Verteilung zu alle Nutzeinheiten des Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte
                        werden Sie sich bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder Verwalter. Informationen zur
                        verbrauchsabhängigen Abrechnung finden Sie unter www.heidisystems.com
                    </Text>
                </Page>

                {/* Page 5 - Supplementary Information */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>5 / 6 3557030010</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <Text style={styles.title}>Ergänzende Informationen in der Abrechnung</Text>

                    <Text style={styles.text}>
                        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem sie sparsames Heizen fördert. Ergänzend erhalten Sie
                        hier Informationen, um Ihren Energieverbrauch bewerten zu können.
                    </Text>

                    <Text style={styles.sectionTitle}>Energieträger der Liegenschaft</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Eingesetzte Energieträger</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>Nah-/Fernwärme</Text>
                            <Text style={styles.tableCellRight}>761.123,0 kWh</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>CO2-Emissionsfaktor des Nah-/Fernwärmenetzes</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>0,21019 kg CO2/kWh</Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Primärenergiefaktoren für Nah-/Fernwärmenetze laut DIN V 18599</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Heizwärke und fossile Brennstoffe</Text>
                            <Text style={styles.tableCell}>1,30</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>KWK-Anlage mit fossilen Brennstoffen</Text>
                            <Text style={styles.tableCell}>1,00</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>KWK-Anlage mit erneuerbaren Brennstoffen</Text>
                            <Text style={styles.tableCell}>0,70</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>CO2-Emissionen der Liegenschaft</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>Nah-/Fernwärme</Text>
                            <Text style={styles.tableCellRight}>159.911,9 kg</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ihr Energieverbrauch</Text>

                    <Text style={styles.text}>
                        Die folgenden Werte berücksichtigen neben Ihren individuellen Verbrauchswerten u.a. den Wirkungsgrad der
                        Heizungsanlage und Leitungswärmeverluste im Gebäude.4
                    </Text>

                    <View style={styles.chartSection}>
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Heizung in kWh</Text>
                            <View style={styles.chartPlaceholder}>
                                <Text style={styles.smallText}>Chart Placeholder</Text>
                            </View>
                            <View style={styles.chartValues}>
                                <Text style={styles.smallText}>7.030</Text>
                                <Text style={styles.smallText}>6.000</Text>
                                <Text style={styles.smallText}>5.000</Text>
                                <Text style={styles.smallText}>4.000    4.200    4.451</Text>
                                <Text style={styles.smallText}>3.000</Text>
                                <Text style={styles.smallText}>2.000</Text>
                                <Text style={styles.smallText}>1.000</Text>
                                <Text style={styles.smallText}>0</Text>
                                <Text style={styles.smallText}>31.12.2022  31.12.2023</Text>
                            </View>
                        </View>
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Warmwasser in kWh</Text>
                            <View style={styles.chartPlaceholder}>
                                <Text style={styles.smallText}>Chart Placeholder</Text>
                            </View>
                            <View style={styles.chartValues}>
                                <Text style={styles.smallText}>1.800</Text>
                                <Text style={styles.smallText}>1.600    1.676</Text>
                                <Text style={styles.smallText}>1.400</Text>
                                <Text style={styles.smallText}>1.200</Text>
                                <Text style={styles.smallText}>1.000</Text>
                                <Text style={styles.smallText}>800</Text>
                                <Text style={styles.smallText}>600</Text>
                                <Text style={styles.smallText}>400</Text>
                                <Text style={styles.smallText}>200</Text>
                                <Text style={styles.smallText}>0</Text>
                                <Text style={styles.smallText}>31.12.2022  31.12.2023</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.comparisonTable}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Verbrauchsarten</Text>
                            <Text style={styles.tableCell}>Bilanziller Zeitraum</Text>
                            <Text style={styles.tableCell}>witterungsbereinigt ³</Text>
                            <Text style={styles.tableCell}>Keine Werte verfügbar</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Ihr Heizungsverbrauch für</Text>
                            <Text style={styles.tableCellRight}>6.943,0 kWh</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Warmwasserverbrauch</Text>
                            <Text style={styles.tableCellRight}>1.534,0 kWh</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>GESAMT</Text>
                            <Text style={styles.tableCellRight}>7.479,1 kWh</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Ihr m² Wohnfläche</Text>
                            <Text style={styles.tableCellRight}>77,0 m²</Text>
                            <Text style={styles.tableCell}>Vergleichswerte⁵</Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Ihr Energieverbrauch je</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>Bundesweiter</Text>
                            <Text style={styles.tableCell}>Liegenschafts-</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Quadratmeter Wohnfläche</Text>
                            <Text style={styles.tableCellRight}>97,1 kWh / m²</Text>
                            <Text style={styles.tableCell}>Vergleichswert</Text>
                            <Text style={styles.tableCell}>durchschnitt</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCellRight}>92,9 kWh / m²</Text>
                            <Text style={styles.tableCellRight}>68,0 kWh / m²</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Weitere Informationen und Informationsquellen</Text>

                    <Text style={styles.text}>
                        Entgelte für die Gebäudeabschleuserfassung, für die Verwendung der Ausstattung zur Verbrauchserfassung einschließlich der Eichung,
                        sowie für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vollständigen Heizkostenabrechnung unter dem Punkt
                        &quot;Aufstellung der Kosten / Weitere Heizungsbetriebskosten&quot;.
                    </Text>

                    <Text style={styles.text}>
                        Informationen zu Verbrauchsoptimierung sowie Hinweisen, Energiespartipps zur Reduzierung der Heizkosten und des
                        Energieverbrauchs sowie Hinweise zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizgewohnheiten Sie
                        unter www.heidisystems.com/Barrierefrei.
                    </Text>

                    <Text style={styles.text}>
                        Hier finden Sie auch weitere Informationen zu Steuern, Abgaben und Zöllen der eingesetzten Energieträger, sowie
                        zur Möglichkeit eines Streitbeilegungsverfahrens, falls sich hierzu Informieren möchten.
                    </Text>

                    <View style={styles.qrCode}></View>
                </Page>

                {/* Page 6 - CO2 Cost Distribution */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.pageNumber}>6/6 3557030010</Text>
                    <Text style={styles.heidiLogo}>Heidi |||</Text>

                    <Text style={styles.title}>CO2-Kostenaufteilung</Text>

                    <Text style={styles.text}>
                        Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz (BEHG) für fossile Brennstoffe erhoben, welche
                        Kohlenstoffdioxid (CO2) emittieren. Das zum 01.01.2023 in Kraft getretene Kohlenstoffdioxidkostenaufteilungsgesetz (CO2KostAufG)
                        regelt die Aufteilung der CO2-Kosten zwischen Mieter und Vermieter.
                    </Text>

                    <Text style={styles.sectionTitle}>CO2-Kosten der Liegenschaft</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Energieart: Nah-/Fernwärme</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>POSITION</Text>
                            <Text style={styles.tableCell}>DATUM</Text>
                            <Text style={styles.tableCell}>Menge in kWh</Text>
                            <Text style={styles.tableCell}>CO2-Emissionen in kg</Text>
                            <Text style={styles.tableCell}>CO2-Kosten in EUR</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>260020672169</Text>
                            <Text style={styles.tableCell}>31.12.2024</Text>
                            <Text style={styles.tableCellRight}>761.123</Text>
                            <Text style={styles.tableCellRight}>159.911,9</Text>
                            <Text style={styles.tableCellRight}>4.318,13</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Summe Verbrauch</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCellRight}>761.123</Text>
                            <Text style={styles.tableCellRight}>159.911,9</Text>
                            <Text style={styles.tableCellRight}>4.318,13</Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Gesamt</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCellRight}>761.123</Text>
                            <Text style={styles.tableCellRight}>159.911,9</Text>
                            <Text style={styles.tableCellRight}>4.318,13</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>CO2-Emissionen der Liegenschaft</Text>
                            <Text style={styles.tableCellRight}>159.911kg CO2</Text>
                            <Text style={styles.tableCell}>CO2-Kosten der Liegenschaft</Text>
                            <Text style={styles.tableCellRight}>14.318,13 €</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Gesamtwohnfläche der Liegenschaft</Text>
                            <Text style={styles.tableCellRight}>11.196,3 m²</Text>
                            <Text style={styles.tableCell}>CO2-Emissionsfaktor</Text>
                            <Text style={styles.tableCellRight}>0,21 kg CO2/kWh</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>CO2-Emission pro m² Wohnfläche</Text>
                            <Text style={styles.tableCellRight}>14,3kg CO2/m²a</Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                        </View>
                    </View>

                    <Text style={[styles.text, styles.bold]}>CO2-Emission pro m²</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Wohnfläche und Jahr</Text>
                            <Text style={styles.tableCell}>Anteil Mieter</Text>
                            <Text style={styles.tableCell}>Anteil Vermieter</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}> 12 bis CO2/m²a</Text>
                            <Text style={styles.tableCell}>100 %</Text>
                            <Text style={styles.tableCell}>0 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>12 bis  17 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>90 %</Text>
                            <Text style={styles.tableCell}>10 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>17 bis 22 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>80 %</Text>
                            <Text style={styles.tableCell}>20 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>22 bis 27 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>70 %</Text>
                            <Text style={styles.tableCell}>30 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>27 bis 32 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>60 %</Text>
                            <Text style={styles.tableCell}>40 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>32 bis 37 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>50 %</Text>
                            <Text style={styles.tableCell}>50 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>37 bis 42 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>40 %</Text>
                            <Text style={styles.tableCell}>60 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>42 bis 47 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>30 %</Text>
                            <Text style={styles.tableCell}>70 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>47 bis 52 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>20 %</Text>
                            <Text style={styles.tableCell}>80 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>≥ 52 kg CO2/m²a</Text>
                            <Text style={styles.tableCell}>5 %</Text>
                            <Text style={styles.tableCell}>95 %</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>CO2-Kostenaufteilung für Ihre Nutzeinheit</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Aufteilung der CO2-Kosten</Text>
                            <Text style={styles.tableCell}>Anteil Mieter</Text>
                            <Text style={styles.tableCell}>Anteil Vermieter</Text>
                            <Text style={styles.tableCell}>Summe</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Gesamte Aufteilung entsprechend</Text>
                            <Text style={styles.tableCell}>90 %</Text>
                            <Text style={styles.tableCell}>10 %</Text>
                            <Text style={styles.tableCell}>100 %</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>für die Liegenschaft</Text>
                            <Text style={styles.tableCellRight}>12.886,32 €</Text>
                            <Text style={styles.tableCellRight}>1.431,81 €</Text>
                            <Text style={styles.tableCellRight}>14.318,13 €</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>für Ihre Nutzeinheit (anteilig)</Text>
                            <Text style={styles.tableCellRight}>129,80 €</Text>
                            <Text style={styles.tableCellRight}>14,06 €</Text>
                            <Text style={styles.tableCellRight}>140,86 €</Text>
                        </View>
                    </View>

                    <Text style={styles.text}>
                        Der Abzug des Vermieteranteils an den CO2-Kosten wurde in der Heizkostenabrechnung noch nicht berücksichtigt.
                    </Text>

                    <Text style={styles.text}>
                        Im Falle einer Vermietung dieser Nutzeinheit ist gemäß CO2KostAufG nach die Kostenumlage durch den Vermieter in Höhe
                        von 14,06 € zu mindern.
                    </Text>

                    <Text style={styles.sectionTitle}>Weitere Informationen und Informationsquellen</Text>

                    <Text style={styles.text}>
                        Informationen rund um das Thema CO2-Kostenaufteilung finden Sie unter www.heidisystems.com/co2.
                    </Text>

                    <View style={styles.qrCode}></View>
                </Page>
            </Document>
        </PDFViewer>
    )
}