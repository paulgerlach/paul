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
//     marginBottom: 15,
//   },
//   headerText: {
//     fontSize: 7,
//   },
//   logo: {
//     width: 70,
//     height: 22,
//   },
//   titleSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   titleLeft: {
//     width: "50%",
//   },
//   titleRight: {
//     width: "50%",
//     fontSize: 8,
//   },
//   mainTitle: {
//     fontWeight: "bold",
//     fontSize: 14,
//     lineHeight: 1.2,
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: 8,
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
//   detailLabel: {
//     fontWeight: "bold",
//   },
//   costBreakdown: {
//     marginTop: 15,
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
//   tableContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   table: {
//     width: "48%",
//     fontSize: 8,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000000",
//     paddingBottom: 4,
//     marginBottom: 4,
//   },
//   tableHeaderCell: {
//     fontWeight: "bold",
//     textAlign: "left",
//     flex: 1,
//   },
//   tableHeaderCellRight: {
//     fontWeight: "bold",
//     textAlign: "right",
//     flex: 1,
//   },
//   tableRow: {
//     flexDirection: "row",
//     marginBottom: 1,
//   },
//   tableCell: {
//     flex: 1,
//   },
//   tableCellRight: {
//     flex: 1,
//     textAlign: "right",
//   },
//   tableRowBorderTop: {
//     borderTopWidth: 1,
//     borderTopColor: "#000000",
//     paddingTop: 4,
//     marginTop: 4,
//   },
//   tableRowBg: {
//     backgroundColor: "#E5E7EB",
//   },
//   costAllocation: {
//     marginTop: 15,
//   },
//   allocationTitle: {
//     fontWeight: "bold",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000000",
//     paddingBottom: 4,
//     marginBottom: 8,
//   },
//   allocationRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   allocationRowBg: {
//     backgroundColor: "#E5E7EB",
//     padding: 4,
//     fontWeight: "bold",
//   },
//   allocationGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 4,
//   },
//   allocationGridItem: {
//     width: "25%",
//     textAlign: "right",
//   },
//   allocationGridItemLeft: {
//     width: "25%",
//     textAlign: "left",
//   },
//   totalRow: {
//     backgroundColor: "#1E40AF",
//     color: "#ffffff",
//     padding: 4,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     fontWeight: "bold",
//   },
// });

// const HeatingBillPreviewTwoPDF = () => {
//   return (
//     // <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>2/6 355703/0010</Text>
//         <Image style={styles.logo} src={admin_logo} />
//       </View>

//       <View style={styles.titleSection}>
//         <View style={styles.titleLeft}>
//           <Text style={styles.mainTitle}>
//             Ihre Abrechnung für Heizung, Warmwasser, Kaltwasser von Heidi
//           </Text>
//           <Text style={styles.subtitle}>
//             Die Gesamtabrechnung bildet die Aufteilung der Kosten für das
//             gesamte Gebäude ab. Die anteiligen Kosten für Ihre Nutzeinheit
//             entnehmen Sie bitte dem Formular "Ihre Abrechnung".
//           </Text>
//         </View>
//         <View style={styles.titleRight}>
//           <View style={styles.detailGrid}>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Liegenschaft</Text>
//               <Text>Rungestr. 21 u.a.</Text>
//               <Text>10179 Berlin</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Liegenschaftsnummer</Text>
//               <Text>355703</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Abrechnungszeitraum</Text>
//               <Text>01.01.2023 - 31.12.2023</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>erstellt am</Text>
//               <Text>14.11.2024</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.costBreakdown}>
//         <Text style={styles.sectionTitle}>Aufstellung der Kosten</Text>
//         <View style={styles.tableContainer}>
//           <View style={styles.table}>
//             <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
//               Energieart: Nah-/Fernwärme kWh
//             </Text>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableHeaderCell}>POSITION</Text>
//               <Text style={styles.tableHeaderCell}>DATUM</Text>
//               <Text style={styles.tableHeaderCell}>kWh</Text>
//               <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Preisbremse Energie</Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={styles.tableCellRight}>-21.035,94 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Rechnung\n260002673166</Text>
//               <Text style={styles.tableCell}>31.12.2023</Text>
//               <Text style={styles.tableCell}>761.123</Text>
//               <Text style={styles.tableCellRight}>124.242,47 €</Text>
//             </View>
//             <View style={[styles.tableRow, styles.tableRowBorderTop]}>
//               <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//                 Summe Verbrauch
//               </Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//                 761.123
//               </Text>
//               <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
//                 103.206,53 €
//               </Text>
//             </View>
//           </View>
//           <View style={styles.table}>
//             <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
//               Weitere Heizungsbetriebskosten
//             </Text>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableHeaderCell}>POSITION</Text>
//               <Text style={styles.tableHeaderCell}>DATUM</Text>
//               <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Übertrag</Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={styles.tableCellRight}>103.206,53 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Verbrauchsabrechnung</Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={styles.tableCellRight}>7.155,11 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Betriebsstrom</Text>
//               <Text style={styles.tableCell}>31.12.2023</Text>
//               <Text style={styles.tableCellRight}>4.128,26 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Wartungskosten</Text>
//               <Text style={styles.tableCell}>31.12.2023</Text>
//               <Text style={styles.tableCellRight}>1.008,17 €</Text>
//             </View>
//             <View style={[styles.tableRow, styles.tableRowBg]}>
//               <Text
//                 style={[
//                   styles.tableCell,
//                   { fontWeight: "bold", paddingLeft: 5 },
//                 ]}
//                 // colSpan={2}
//               >
//                 Summe Energie- und Heizungsbetriebskosten
//               </Text>
//               <Text
//                 style={[
//                   styles.tableCellRight,
//                   { fontWeight: "bold", paddingRight: 5 },
//                 ]}
//               >
//                 115.498,07 €
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.costBreakdown}>
//         <Text style={styles.sectionTitle}>
//           Kosten für gesonderte Verteilung
//         </Text>
//         <View style={styles.tableContainer}>
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableHeaderCell}>VERTEILUNG NACH</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Heizung</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Warmwasser/Kaltwasser</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Warmwasser/Kaltwasser</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Warmwasser/Kaltwasser</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Nutzeinheit</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Warmwasser</Text>
//             </View>
//           </View>
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableHeaderCell}>POSITION</Text>
//               <Text style={styles.tableHeaderCell}>DATUM</Text>
//               <Text style={styles.tableHeaderCellRight}>BETRAG</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>
//                 Gerätemiete Heizung/Warmwasser
//               </Text>
//               <Text style={styles.tableCell}>04.08.2023</Text>
//               <Text style={styles.tableCellRight}>6.210,80 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Kaltwasser</Text>
//               <Text style={styles.tableCell}>31.12.2023</Text>
//               <Text style={styles.tableCellRight}>17.036,69 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Abwasser</Text>
//               <Text style={styles.tableCell}>31.12.2023</Text>
//               <Text style={styles.tableCellRight}>20.030,62 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Gerätemiete Kaltwasser</Text>
//               <Text style={styles.tableCell}>04.08.2023</Text>
//               <Text style={styles.tableCellRight}>2.274,90 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>Abrechnung Kaltwasser</Text>
//               <Text style={styles.tableCell}></Text>
//               <Text style={styles.tableCellRight}>2.126,74 €</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>
//                 Gerätemiete Heizung/Warmwasser
//               </Text>
//               <Text style={styles.tableCell}>04.08.2023</Text>
//               <Text style={styles.tableCellRight}>2.307,77 €</Text>
//             </View>
//             <View style={[styles.tableRow, styles.tableRowBg]}>
//               <Text
//                 style={[
//                   styles.tableCell,
//                   { fontWeight: "bold", paddingLeft: 5 },
//                 ]}
//                 // colSpan={2}
//               >
//                 Summe Kosten zur gesonderten Verteilung
//               </Text>
//               <Text
//                 style={[
//                   styles.tableCellRight,
//                   { fontWeight: "bold", paddingRight: 5 },
//                 ]}
//               >
//                 49.987,52 €
//               </Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={{ paddingLeft: 5 }}>
//                 Summe der zu verteilenden Kosten
//               </Text>
//               <Text style={{ paddingRight: 5 }}>165.485,59 €</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.costAllocation}>
//         <Text style={[styles.sectionTitle, { fontSize: 14 }]}>
//           Aufteilung der Kosten
//         </Text>
//         <View style={styles.allocationTitle}>
//           <Text>
//             Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
//           </Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>
//             2,5 kWh/m³/K x 3.148,25 m³ x (60-10°C) = 342.201,09 kWh
//             Nah-/Fernwärme = 44,96 % d. Gesamtverbr.
//           </Text>
//           <Text style={{ fontWeight: "bold" }}>1,15</Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>
//             44,96 % aus 115.498,07 € Energie- und Heizungsbetriebskosten
//             entspricht Kosten für Erwärmung Warmwasser
//           </Text>
//           <Text>51.927,94 €</Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>Gerätemiete Heizung/Warmwasser</Text>
//           <Text>2.307,77 €</Text>
//         </View>
//         <View style={[styles.allocationRow, styles.allocationRowBg]}>
//           <Text>Kosten für Warmwasser</Text>
//           <Text>54.235,71 €</Text>
//         </View>
//         <View style={styles.allocationGrid}>
//           <Text style={styles.allocationGridItemLeft}>
//             davon 30 % Grundkosten
//           </Text>
//           <Text style={styles.allocationGridItem}>16.270,72 € :</Text>
//           <Text style={styles.allocationGridItem}>11.196,40 m²</Text>
//           <Text style={styles.allocationGridItem}>= 1,453210 €/m²</Text>
//         </View>
//         <View style={styles.allocationGrid}>
//           <Text style={styles.allocationGridItemLeft}>
//             davon 70 % Verbrauchskosten
//           </Text>
//           <Text style={styles.allocationGridItem}>37.964,99 € :</Text>
//           <Text style={styles.allocationGridItem}>3.148,25 m³</Text>
//           <Text style={styles.allocationGridItem}>= 12,059077 €/m³</Text>
//         </View>
//       </View>

//       <View style={styles.costAllocation}>
//         <View style={styles.allocationTitle}>
//           <Text>Berechnung und Aufteilung der Kosten für Heizung</Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>Summe Energie- und Heizungsbetriebskosten</Text>
//           <Text>115.498,07 €</Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>abzüglich Kosten für Erwärmung Warmwasser</Text>
//           <Text>-51.927,94 €</Text>
//         </View>
//         <View style={styles.allocationRow}>
//           <Text>Gerätemiete Heizung/Warmwasser</Text>
//           <Text>6.210,80 €</Text>
//         </View>
//         <View style={[styles.allocationRow, styles.allocationRowBg]}>
//           <Text>Kosten für Heizung</Text>
//           <Text>69.780,93 €</Text>
//         </View>
//         <View style={styles.allocationGrid}>
//           <Text style={styles.allocationGridItemLeft}>
//             davon 30 % Grundkosten
//           </Text>
//           <Text style={styles.allocationGridItem}>20.934,28 € :</Text>
//           <Text style={styles.allocationGridItem}>11.196,40 m²</Text>
//           <Text style={styles.allocationGridItem}>= 1,869733 €/m²</Text>
//         </View>
//         <View style={styles.allocationGrid}>
//           <Text style={styles.allocationGridItemLeft}>
//             davon 70 % Verbrauchskosten
//           </Text>
//           <Text style={styles.allocationGridItem}>48.846,65 € :</Text>
//           <Text style={styles.allocationGridItem}>404,04 MWh</Text>
//           <Text style={styles.allocationGridItem}>= 120,895580 €/MWh</Text>
//         </View>
//       </View>
//     </Page>
//     // </Document>
//   );
// };

// export default HeatingBillPreviewTwoPDF;
