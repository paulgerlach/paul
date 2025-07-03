"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { formatEuro } from "@/utils";

// Styles
const styles = StyleSheet.create({
    page: {
        paddingVertical: 80,
        paddingHorizontal: 50,
        fontSize: 9,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    leftHeader: {
        flex: 1,
    },
    rightHeader: {
        flex: 1,
        alignItems: "flex-end",
    },
    summaryBox: {
        border: "1px solid black",
        marginBottom: 10,
        width: 200,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 4,
        fontWeight: "bold",
    },
    mainContent: {
        flexDirection: "row",
        gap: 20,
    },
    leftColumn: {
        flex: 1,
    },
    rightColumn: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
    },
    table: {
        border: "1px solid black",
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid black",
        minHeight: 20,
    },
    tableHeader: {
        fontWeight: "bold",
    },
    tableCell: {
        padding: 4,
        borderRight: "1px solid black",
        fontSize: 8,
        flex: 1,
        textAlign: "center",
    },
    text: {
        marginBottom: 4,
        fontSize: 9,
        lineHeight: 1.3,
    },
    bold: {
        fontWeight: "bold",
    },
    signatureArea: {
        marginTop: 20,
        marginBottom: 10,
    },
    signatureLine: {
        borderBottom: "1px solid black",
        width: 150,
        height: 50,
        marginBottom: 5,
    },
    pageNumber: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 50,
        textAlign: "right",
        fontSize: 8,
    },
    summaryTable: {
        border: '1px solid black',
        marginTop: 10,
        maxWidth: 300
    },
    summaryRow: {
        flexDirection: 'row',
        borderBottom: '1px solid black',
        minHeight: 15,
    },
    summaryCell: {
        padding: 3,
        borderRight: '1px solid black',
        fontSize: 8,
        flex: 1,
    },
});

// Component
export default function NebenkostenabrechnungPdf() {
    const { documentGroups, getFormattedDates } = useBetriebskostenabrechnungStore();
    const { start_date, end_date } = getFormattedDates();

    const totalSpreadedAmount = documentGroups.reduce((acc, group) => {
        const groupTotal =
            group.data?.reduce((sum, item) => {
                if (item.for_all_tenants) {
                    return sum + Number(item.total_amount || 0);
                }
                return sum;
            }, 0) || 0;
        return acc + groupTotal;
    }, 0);

    const totalDirectCosts = documentGroups.reduce((acc, group) => {
        const groupTotal =
            group.data?.reduce((sum, item) => {
                if (!item.for_all_tenants) {
                    return sum + Number(item.total_amount || 0);
                }
                return sum;
            }, 0) || 0;
        return acc + groupTotal;
    }, 0);

    const totalAmount = totalSpreadedAmount + totalDirectCosts;
    return (
        <PDFViewer width="100%" height="900">
            <Document>
                {/* Page 1 */}
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <View style={[styles.leftHeader, { paddingVertical: 20 }]}>
                            <Text style={styles.text}>Felix Gerlach UG (haftungsbeschränkt) Greizer Straße 16 07545</Text>
                            <Text style={styles.text}>Gera</Text>
                            <Text style={styles.text}>Jakob Berger, Virginia Rehnelt</Text>
                            <Text style={styles.text}>Altenburger Straße 9</Text>
                            <Text style={styles.text}>07546 Gera</Text>
                        </View>
                        <View style={styles.rightHeader}>
                            <View style={styles.summaryBox}>
                                <View style={[{ flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid black", padding: 8 }]}>
                                    <Text style={styles.text}>Ihr Nebenkostenanteil für den Nutzungszeitraum:</Text>
                                    <Text style={styles.text}>{formatEuro(totalAmount)}</Text>
                                </View>
                                <View style={[{ flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid black", padding: 8 }]}>
                                    <Text style={styles.text}>Ihre Nebenkostenvorauszahlung:</Text>
                                    <Text style={styles.text}>1.380,00 €</Text>
                                </View>
                                <View style={[{ flexDirection: "row", justifyContent: "space-between", padding: 8 }]}>
                                    <Text style={[styles.text, styles.bold]}>Nachzuzahlender Betrag:</Text>
                                    <Text style={[styles.text, styles.bold]}>354,48 €</Text>
                                </View>
                            </View>
                            <Text style={styles.text}>Erstellungsdatum: 13.02.2024</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Nebenkostenabrechnung</Text>
                    <Text style={styles.subtitle}>für den Abrechnungszeitraum {start_date} - {end_date}</Text>
                    <Text style={[styles.subtitle, { marginBottom: 15 }]}>Altenburger Straße 9, VH 20G rechts - Berger/Rehnelt</Text>

                    <View style={styles.mainContent}>
                        <View style={styles.leftColumn}>
                            <Text style={[styles.text, { marginBottom: 15 }]}>Sehr geehrter Herr Jakob Berger, Frau Virginia Rehnelt,</Text>
                            <Text style={styles.text}>
                                wir möchten Sie darüber informieren, dass es bundesweit zu einem signifikanten Anstieg der Strom- und Gaspreise
                                um über 48% gekommen ist. Diese Preissteigerung ist unabhängig von Ihrer Kaltmiete und basiert auf Ihrem
                            </Text>
                            <Text style={[styles.text, { marginBottom: 15 }]}>individuellen Verbrauch.</Text>
                            <Text style={styles.text}>
                                Wie Sie der beigefügten Nebenkostenabrechnung entnehmen können, decken die von Ihnen geleisteten
                                Vorauszahlungen leider nicht die tatsächlich angefallenen Kosten. Daraus ergibt sich für Sie ein Zahlungsrückstand
                                von 354,48 Euro. Bitte überweisen Sie den fälligen Betrag spätestens bis zum 15.03.2024 an unten genannte
                                Kontoverbindung.
                            </Text>
                            <Text style={[styles.text, { marginTop: 15 }]}>Kontoinhaber: Felix Gerlach UG (haftungsbeschränkt)</Text>
                            <Text style={styles.text}>IBAN: DE9310011230405222379</Text>
                            <Text style={styles.text}>BIC: QNTODEBEXXX</Text>
                            <Text style={styles.text}>Bank: Qonto Bank</Text>

                            <View style={styles.signatureArea}>
                                <Text style={[styles.text, { marginBottom: 10 }]}>Mit freundlichen Grüßen</Text>
                                <View style={styles.signatureLine}></View>
                            </View>
                        </View>
                    </View>

                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`}
                    />
                </Page>

                {/* Page 2 */}
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>Allgemeine Angaben zur Wohnung und zu den Verteilungsschlüsseln</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Ihr Nutzungszeitraum</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{start_date} - {end_date}</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Abrechnungszeitraum</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{start_date} - {end_date}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Ihr Nutzungstage</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>365</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Abrechnungstage</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>365</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Wohnfläche Ihrer Wohnung</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>36,30 m²</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Gesamtwohnfläche des Hauses</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>813,85 m²</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Kostenübersicht</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Kostenart</Text>
                            <Text style={styles.tableCell}>Gesamtkosten</Text>
                            <Text style={styles.tableCell}>Zeitraum</Text>
                            <Text style={styles.tableCell}>Verteilerschlüssel</Text>
                            <Text style={styles.tableCell}>Anteil</Text>
                            <Text style={styles.tableCell}>Ihr Anteil</Text>
                        </View>
                        {documentGroups.map((row) => {
                            const totalSpreadedAmount = row.data?.reduce((sum, item) => {
                                if (item.for_all_tenants) {
                                    return sum + Number(item.total_amount || 0);
                                }
                                return sum;
                            }, 0) || 0;

                            const totalDirectCosts = row.data?.reduce((sum, item) => {
                                if (!item.for_all_tenants) {
                                    return sum + Number(item.total_amount || 0);
                                }
                                return sum;
                            }, 0) || 0;

                            const totalAmount = totalSpreadedAmount + totalDirectCosts;

                            return (
                                <View style={styles.tableRow} key={row.id}>
                                    <Text style={styles.tableCell}>{row.name}</Text>
                                    <Text style={styles.tableCell}>{formatEuro(totalAmount)}</Text>
                                    <Text style={styles.tableCell}>365/365</Text>
                                    <Text style={styles.tableCell}>{row.allocation_key}</Text>
                                    <Text style={styles.tableCell}>365/365</Text>
                                </View>
                            )
                        })}
                    </View>

                    <View style={[styles.summaryTable, { marginRight: 0, marginLeft: "auto", minWidth: 300 }]}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryCell}>Ihr Nebenkostenanteil für den Nutzungszeitraum</Text>
                            <Text style={[styles.summaryCell, { maxWidth: 125, textAlign: "right" }]}>1.734,48 €</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryCell}>Ihre Nebenkostenvorauszahlung</Text>
                            <Text style={[styles.summaryCell, { maxWidth: 125, textAlign: "right" }]}>1.380,00 €</Text>
                        </View>
                        <View style={[styles.summaryRow, { borderBottom: 'none' }]}>
                            <Text style={[styles.summaryCell, styles.bold]}>Nachzuzahlender Betrag</Text>
                            <Text style={[styles.summaryCell, styles.bold, { maxWidth: 125, textAlign: "right" }]}>354,48 €</Text>
                        </View>
                    </View>

                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`}
                    />
                </Page>
            </Document>
        </PDFViewer >
    );
}
