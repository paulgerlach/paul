// "use client";

// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";
// import { admin_logo } from "@/static/icons";

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#ffffff",
//     padding: 40,
//     fontFamily: "Helvetica",
//     fontSize: 9,
//     color: "#000000",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },
//   headerText: {
//     fontSize: 7,
//   },
//   logo: {
//     width: 70,
//     height: 22,
//   },
//   addressInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     fontSize: 8,
//     marginBottom: 15,
//   },
//   addressLeft: {
//     width: "50%",
//   },
//   addressRight: {
//     width: "50%",
//   },
//   addressBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#000000",
//     paddingBottom: 1,
//     marginBottom: 4,
//   },
//   boldText: {
//     fontWeight: "bold",
//   },
//   mainTitle: {
//     fontWeight: "bold",
//     fontSize: 12,
//     marginBottom: 8,
//   },
//   detailGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   detailItem: {
//     width: "48%",
//     marginBottom: 6,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#2563EB",
//     borderBottomWidth: 2,
//     borderBottomColor: "#2563EB",
//     paddingBottom: 4,
//     marginBottom: 8,
//   },
//   costSection: {
//     marginTop: 15,
//     fontSize: 8,
//   },
//   costHeader: {
//     backgroundColor: "#E5E7EB",
//     fontWeight: "bold",
//     padding: 2,
//     paddingLeft: 4,
//   },
//   table: {
//     width: "100%",
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableCell: {
//     paddingVertical: 2,
//     paddingRight: 4,
//   },
//   tableCellRight: {
//     textAlign: "right",
//     paddingVertical: 2,
//     paddingHorizontal: 4,
//   },
//   tableBorderTop: {
//     borderTopWidth: 2,
//     borderTopColor: "#000000",
//     marginTop: 4,
//   },
//   totalAmount: {
//     backgroundColor: "#1E40AF",
//     color: "#ffffff",
//     padding: 6,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 8,
//     fontWeight: "bold",
//     fontSize: 11,
//   },
//   stateRelief: {
//     marginTop: 15,
//     fontSize: 8,
//   },
//   stateReliefHeader: {
//     backgroundColor: "#E5E7EB",
//     fontWeight: "bold",
//     padding: 2,
//     paddingLeft: 4,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   stateReliefTable: {
//     width: "100%",
//   },
//   stateReliefTableHeader: {
//     flexDirection: "row",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//   },
//   stateReliefTableHeaderCell: {
//     fontWeight: "normal",
//     paddingVertical: 2,
//   },
//   stateReliefTableHeaderCellLeft: {
//     width: "33%",
//     textAlign: "left",
//   },
//   stateReliefTableHeaderCellRight: {
//     width: "33%",
//     textAlign: "right",
//   },
//   stateReliefTableRow: {
//     flexDirection: "row",
//   },
//   stateReliefTableCell: {
//     paddingVertical: 2,
//   },
//   stateReliefTableCellLeft: {
//     width: "33%",
//     textAlign: "left",
//   },
//   stateReliefTableCellRight: {
//     width: "33%",
//     textAlign: "right",
//   },
//   consumptionValues: {
//     marginTop: 15,
//   },
//   consumptionTableHeader: {
//     flexDirection: "row",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//   },
//   consumptionTableHeaderCell: {
//     fontWeight: "normal",
//     paddingVertical: 2,
//     flex: 1,
//   },
//   consumptionTableHeaderCellRight: {
//     fontWeight: "normal",
//     paddingVertical: 2,
//     flex: 1,
//     textAlign: "right",
//   },
//   consumptionTableRow: {
//     flexDirection: "row",
//   },
//   consumptionTableCell: {
//     paddingVertical: 2,
//     flex: 1,
//   },
//   consumptionTableCellRight: {
//     paddingVertical: 2,
//     flex: 1,
//     textAlign: "right",
//   },
//   footer: {
//     marginTop: 15,
//     fontSize: 7,
//     color: "#6B7280",
//   },
// });

// const HeatingBillPreviewFourPDF = () => {
//   return (
//     // <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>4/6 355703/0010</Text>
//         <Image style={styles.logo} src={admin_logo} />
//       </View>

//       <View style={styles.addressInfo}>
//         <View style={styles.addressLeft}>
//           <Text style={styles.addressBorder}>
//             BRUNATA-METRONA GmbH & Co. KG - 81366 München
//           </Text>
//           <Text style={styles.boldText}>Andreas Preissler Eigennutzer</Text>
//           <Text>Lindenstraße 49</Text>
//           <Text>12589 Berlin</Text>
//         </View>
//         <View style={styles.addressRight}>
//           <Text style={styles.mainTitle}>
//             Ihre BRUNATA® Abrechnung für\nHeizung, Warmwasser, Kaltwasser
//           </Text>
//           <View style={styles.detailGrid}>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>Liegenschaft</Text>
//               <Text>Rungestr. 21 u.a.</Text>
//               <Text>10179 Berlin</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>Erstellt im Auftrag von</Text>
//               <Text>Braun & Hubertus GmbH</Text>
//               <Text>Immobilienmanagement</Text>
//               <Text>Keithstr. 2-4</Text>
//               <Text>10787 Berlin</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>Liegenschaftsnummer</Text>
//               <Text>355703</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>BRUNATA Nutzernummer</Text>
//               <Text>0010</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>Abrechnungszeitraum</Text>
//               <Text>01.01.2023 - 31.12.2023</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.boldText}>erstellt am</Text>
//               <Text>14.11.2024</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.costSection}>
//         <Text style={styles.sectionTitle}>Ihre Kosten</Text>
//         <View style={styles.costHeader}>
//           <Text>Kosten für Heizung</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Grundkosten
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               77,02 m² Wohnfläche
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               1,869733 € je m²
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               144,01 €
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Verbrauchskosten
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               7,00 MWh
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               120,895580 € je MWh
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               846,27 €
//             </Text>
//           </View>
//         </View>

//         <View style={[styles.costHeader, { marginTop: 10 }]}>
//           <Text>Kosten für Warmwasser</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Grundkosten
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               77,02 m² Wohnfläche
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               1,453210 € je m²
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               111,93 €
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Verbrauchskosten
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               10,88 m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               12,059077 € je m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               131,20 €
//             </Text>
//           </View>
//           <View style={[styles.tableRow, styles.tableBorderTop]}>
//             <Text style={[styles.tableCell, styles.boldText, { width: "80%" }]}>
//               Summe Kosten für Heizung und Warmwasser
//             </Text>
//             <Text
//               style={[styles.tableCellRight, styles.boldText, { width: "20%" }]}
//             >
//               1.233,41 €
//             </Text>
//           </View>
//         </View>

//         <View style={[styles.costHeader, { marginTop: 10 }]}>
//           <Text>Kosten für Kaltwasser</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Kaltwasser Gesamt
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               45,20 m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               1,713411 € je m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               77,45 €
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Abwasser Gesamt
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               45,20 m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               2,014517 € je m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               91,06 €
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Gerätemiete Kaltwasser
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               45,20 m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               0,228791 € je m³
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               10,34 €
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { width: "20%" }]}>
//               Abrechnung Kaltwasser
//             </Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               1,00 Nutzeinh.
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>x</Text>
//             <Text style={[styles.tableCellRight, { width: "30%" }]}>
//               17,290569 € je Nutzeinh.
//             </Text>
//             <Text style={[styles.tableCell, { width: "5%" }]}>=</Text>
//             <Text style={[styles.tableCellRight, { width: "20%" }]}>
//               17,29 €
//             </Text>
//           </View>
//           <View style={[styles.tableRow, styles.tableBorderTop]}>
//             <Text style={[styles.tableCell, styles.boldText, { width: "80%" }]}>
//               Summe Kosten für Kaltwasser
//             </Text>
//             <Text
//               style={[styles.tableCellRight, styles.boldText, { width: "20%" }]}
//             >
//               196,14 €
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.totalAmount}>
//         <Text>Gesamtbetrag</Text>
//         <Text>1.429,55 €</Text>
//       </View>

//       <View style={styles.stateRelief}>
//         <View style={styles.stateReliefHeader}>
//           <Text>
//             Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)
//           </Text>
//         </View>
//         <View style={styles.stateReliefTable}>
//           <View style={styles.stateReliefTableHeader}>
//             <Text style={styles.stateReliefTableHeaderCellLeft}></Text>
//             <Text style={styles.stateReliefTableHeaderCellRight}>Betrag</Text>
//             <Text style={styles.stateReliefTableHeaderCellRight}>
//               Ihr Anteil
//             </Text>
//           </View>
//           <View style={styles.stateReliefTableRow}>
//             <Text style={styles.stateReliefTableCellLeft}>
//               Preisbremse Energie
//             </Text>
//             <Text style={styles.stateReliefTableCellRight}>21.035,94 €</Text>
//             <Text style={styles.stateReliefTableCellRight}>209,21 €</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.consumptionValues}>
//         <Text style={styles.sectionTitle}>Ihre Verbrauchswerte</Text>
//         <View style={styles.costHeader}>
//           <Text>Heizung in MWh</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.consumptionTableHeader}>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               RAUMBEZEICHNUNG
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "20%" }]}>
//               GERÄTENUMMER
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               GERÄTEART
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ANF.-STAND
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ABLESUNG
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               FAKTOR
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               VERBRAUCH
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "10%" }]}>
//               BEMERKUNG
//             </Text>
//           </View>
//           <View style={styles.consumptionTableRow}>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Flur
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "20%" }]}>
//               6EFE0121755587
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Wärmezähler
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               1,918
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               8,916
//             </Text>
//             <Text
//               style={[styles.consumptionTableCellRight, { width: "10%" }]}
//             ></Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               7,000
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//           <View style={[styles.consumptionTableRow, styles.tableBorderTop]}>
//             <Text
//               style={[
//                 styles.consumptionTableCell,
//                 styles.boldText,
//                 { width: "80%" },
//               ]}
//               // colSpan={6}
//             >
//               Summe Heizung
//             </Text>
//             <Text
//               style={[
//                 styles.consumptionTableCellRight,
//                 styles.boldText,
//                 { width: "10%" },
//               ]}
//             >
//               7,000
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//         </View>

//         <View style={[styles.costHeader, { marginTop: 10 }]}>
//           <Text>Warmwasser in m³</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.consumptionTableHeader}>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               RAUMBEZEICHNUNG
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "20%" }]}>
//               GERÄTENUMMER
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               GERÄTEART
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ANF.-STAND
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ABLESUNG
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               FAKTOR
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               VERBRAUCH
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "10%" }]}>
//               BEMERKUNG
//             </Text>
//           </View>
//           <View style={styles.consumptionTableRow}>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Bad
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "20%" }]}>
//               9DWZ0122156287
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Warmwasserzähler
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               3,52
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               11,381
//             </Text>
//             <Text
//               style={[styles.consumptionTableCellRight, { width: "10%" }]}
//             ></Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               7,86
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//           <View style={styles.consumptionTableRow}>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Bad
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "20%" }]}>
//               9DWZ0122156297
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Warmwasserzähler
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               1,04
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               4,051
//             </Text>
//             <Text
//               style={[styles.consumptionTableCellRight, { width: "10%" }]}
//             ></Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               3,02
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//           <View style={[styles.consumptionTableRow, styles.tableBorderTop]}>
//             <Text
//               style={[
//                 styles.consumptionTableCell,
//                 styles.boldText,
//                 { width: "80%" },
//               ]}
//               // colSpan={6}
//             >
//               Summe Warmwasser
//             </Text>
//             <Text
//               style={[
//                 styles.consumptionTableCellRight,
//                 styles.boldText,
//                 { width: "10%" },
//               ]}
//             >
//               10,88
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//         </View>

//         <View style={[styles.costHeader, { marginTop: 10 }]}>
//           <Text>Kaltwasser in m³</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.consumptionTableHeader}>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               RAUMBEZEICHNUNG
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "20%" }]}>
//               GERÄTENUMMER
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "15%" }]}>
//               GERÄTEART
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ANF.-STAND
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               ABLESUNG
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               FAKTOR
//             </Text>
//             <Text
//               style={[styles.consumptionTableHeaderCellRight, { width: "10%" }]}
//             >
//               VERBRAUCH
//             </Text>
//             <Text style={[styles.consumptionTableHeaderCell, { width: "10%" }]}>
//               BEMERKUNG
//             </Text>
//           </View>
//           <View style={styles.consumptionTableRow}>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Bad
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "20%" }]}>
//               8DWZ0122033399
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Kaltwasserzähler
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               7,56
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               23,291
//             </Text>
//             <Text
//               style={[styles.consumptionTableCellRight, { width: "10%" }]}
//             ></Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               15,73
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//           <View style={styles.consumptionTableRow}>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Bad
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "20%" }]}>
//               8DWZ0122033396
//             </Text>
//             <Text style={[styles.consumptionTableCell, { width: "15%" }]}>
//               Kaltwasserzähler
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               11,91
//             </Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               30,494
//             </Text>
//             <Text
//               style={[styles.consumptionTableCellRight, { width: "10%" }]}
//             ></Text>
//             <Text style={[styles.consumptionTableCellRight, { width: "10%" }]}>
//               18,59
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//           <View style={[styles.consumptionTableRow, styles.tableBorderTop]}>
//             <Text
//               style={[
//                 styles.consumptionTableCell,
//                 styles.boldText,
//                 { width: "80%" },
//               ]}
//               // colSpan={6}
//             >
//               Summe Kaltwasser
//             </Text>
//             <Text
//               style={[
//                 styles.consumptionTableCellRight,
//                 styles.boldText,
//                 { width: "10%" },
//               ]}
//             >
//               34,32
//             </Text>
//             <Text
//               style={[styles.consumptionTableCell, { width: "10%" }]}
//             ></Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.footer}>
//         <Text>
//           Detaillierte Berechnung und Verteilung auf alle Nutzeinheiten des
//           Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte wenden Sie
//           sich bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder
//           Verwalter. Informationen zur verbrauchsabhängigen Abrechnung finden
//           Sie unter www.brunata-metrona.de.
//         </Text>
//       </View>
//     </Page>
//     // </Document>
//   );
// };

// export default HeatingBillPreviewFourPDF;
