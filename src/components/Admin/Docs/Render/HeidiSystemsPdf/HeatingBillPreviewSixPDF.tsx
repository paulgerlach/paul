// "use client";

// import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
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
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#2563EB",
//     borderBottomWidth: 2,
//     borderBottomColor: "#2563EB",
//     paddingBottom: 4,
//     marginBottom: 8,
//   },
//   paragraph: {
//     fontSize: 8,
//     marginBottom: 12,
//   },
//   subSectionHeader: {
//     backgroundColor: "#E5E7EB",
//     fontWeight: "bold",
//     padding: 2,
//     paddingLeft: 4,
//     fontSize: 8,
//     marginBottom: 4,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   table: {
//     width: "100%",
//     fontSize: 7,
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableCell: {
//     paddingVertical: 2,
//     flex: 1,
//   },
//   tableCellRight: {
//     paddingVertical: 2,
//     flex: 1,
//     textAlign: "right",
//   },
//   tableRowBorderTop: {
//     borderTopWidth: 2,
//     borderTopColor: "#000000",
//     marginTop: 4,
//   },
//   chartPlaceholder: {
//     width: 200,
//     height: 120,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#cccccc",
//   },
//   chartContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   chartColumn: {
//     width: "48%",
//     alignItems: "center",
//   },
//   chartTitle: {
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 4,
//     fontSize: 8,
//   },
//   footerText: {
//     fontSize: 7,
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   link: {
//     color: "#2563EB",
//     textDecoration: "underline",
//   },
// });

// const HeatingBillPreviewSixPDF = () => {
//   return (
//     // <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>6/6 355703/0010</Text>
//         <Image style={styles.logo} src={admin_logo} />
//       </View>

//       <View style={{ marginBottom: 10 }}>
//         <Text style={styles.sectionTitle}>
//           Ergänzende Informationen in der Abrechnung
//         </Text>
//       </View>

//       <Text style={styles.paragraph}>
//         Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
//         sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
//         um Ihren Energieverbrauch bewerten zu können.
//       </Text>

//       <View style={styles.subSectionHeader}>
//         <Text>Energieträger der Liegenschaft</Text>
//         <Text>🏠</Text>
//       </View>
//       <View style={{ fontSize: 9, marginBottom: 15 }}>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               Eingesetzte Energieträger
//             </Text>
//             <Text style={styles.tableCellRight}>Nah-/Fernwärme</Text>
//             <Text style={styles.tableCellRight}>761.123,0 kWh</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               CO2-Emissionsfaktor¹ des Nah-/Fernwärmenetzes
//             </Text>
//             <Text style={styles.tableCellRight}>0,21010 kg CO2/kWh</Text>
//             <Text style={styles.tableCell}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               Primärenergiefaktoren² für Nah-/Fernwärmenetze laut DIN V 18599³
//             </Text>
//             <Text style={styles.tableCell}></Text>
//             <Text style={styles.tableCell}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
//               Heizwerke und fossile Brennstoffe
//             </Text>
//             <Text style={styles.tableCellRight}>1,30</Text>
//             <Text style={styles.tableCell}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
//               KWK-Anlage mit fossilen Brennstoffen
//             </Text>
//             <Text style={styles.tableCellRight}>1,00</Text>
//             <Text style={styles.tableCell}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { paddingLeft: 10 }]}>
//               KWK-Anlage mit erneuerbaren Brennstoffen
//             </Text>
//             <Text style={styles.tableCellRight}>0,70</Text>
//             <Text style={styles.tableCell}></Text>
//           </View>
//           <View style={[styles.tableRow, styles.tableRowBorderTop]}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               CO2-Emissionen der Liegenschaft
//             </Text>
//             <Text style={styles.tableCellRight}>Nah-/Fernwärme</Text>
//             <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
//               159.911,9 kg
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.subSectionHeader}>
//         <Text>Ihr Energieverbrauch</Text>
//         <Text>👤</Text>
//       </View>
//       <Text style={styles.paragraph}>
//         Die hier dargestellten Werte berücksichtigen neben Ihren individuellen
//         Verbrauchswerten u.a. den Wirkungsgrad der Heizungsanlage und
//         Leitungsverluste im Gebäude.⁴
//       </Text>
//       <View style={styles.chartContainer}>
//         <View style={styles.chartColumn}>
//           <Text style={styles.chartTitle}>Heizung in kWh</Text>
//           <View style={styles.chartPlaceholder}>
//             <Text style={{ fontSize: 10, textAlign: "center" }}>
//               Chart Placeholder
//             </Text>
//             <Text style={{ fontSize: 8, textAlign: "center" }}>
//               (Recharts not supported)
//             </Text>
//           </View>
//         </View>
//         <View style={styles.chartColumn}>
//           <Text style={styles.chartTitle}>Warmwasser in kWh</Text>
//           <View style={styles.chartPlaceholder}>
//             <Text style={{ fontSize: 10, textAlign: "center" }}>
//               Chart Placeholder
//             </Text>
//             <Text style={{ fontSize: 8, textAlign: "center" }}>
//               (Recharts not supported)
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View style={{ fontSize: 8, marginTop: 10 }}>
//         <Text style={{ marginBottom: 5 }}>* Keine Werte verfügbar</Text>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               Ihr Heizungsverbrauch
//             </Text>
//             <Text
//               style={[
//                 styles.tableCellRight,
//                 { borderBottomWidth: 2, borderBottomColor: "#000000" },
//               ]}
//             >
//               5.945,0 kWh
//             </Text>
//             <Text style={[styles.tableCell, { width: "33%" }]}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               Ihr Warmwasserverbrauch
//             </Text>
//             <Text
//               style={[
//                 styles.tableCellRight,
//                 { borderBottomWidth: 2, borderBottomColor: "#000000" },
//               ]}
//             >
//               1.534,0 kWh
//             </Text>
//             <Text style={[styles.tableCell, { width: "33%" }]}></Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               GESAMT
//             </Text>
//             <Text
//               style={[
//                 styles.tableCellRight,
//                 { borderBottomWidth: 2, borderBottomColor: "#000000" },
//               ]}
//             >
//               7.479,1 kWh
//             </Text>
//             <Text
//               style={[styles.tableCell, { width: "33%", textAlign: "center" }]
//             >
//               Vergleichswerte⁶
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
//               Ihre Wohnfläche
//             </Text>
//             <Text
//               style={[
//                 styles.tableCellRight,
//                 { borderBottomWidth: 2, borderBottomColor: "#000000" },
//               ]}
//             >
//               77,0 m²
//             </Text>
//             <Text
//               style={[styles.tableCell, { width: "33%", textAlign: "center" }]
//             >
//               Bundesweiter Vergleichsnutzer
//             </Text>
//             <Text
//               style={[styles.tableCell, { width: "33%", textAlign: "center" }]
//             >
//               Liegenschafts-durchschnitt
//             </Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text
//               style={[
//                 styles.tableCell,
//                 { color: "#2563EB", fontWeight: "bold" },
//               ]}
//             >
//               Ihr Energieverbrauch je\nQuadratmeter Wohnfläche
//             </Text>
//             <Text style={[styles.tableCellRight, { color: "#2563EB" }]}>
//               97,1 kWh / m²
//             </Text>
//             <Text
//               style={[styles.tableCell, { width: "33%", textAlign: "center", color: "#2563EB" }]
//             >
//               92,9 kWh / m²
//             </Text>
//             <Text
//               style={[styles.tableCell, { width: "33%", textAlign: "center", color: "#2563EB" }]
//             >
//               68,0 kWh / m²
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={[styles.subSectionHeader, { marginTop: 20 }]}>
//         <Text>Weitere Informationen und Informationsquellen</Text>
//         <Text>ℹ️</Text>
//       </View>
//       <View style={{ fontSize: 9, marginBottom: 15 }}>
//         <Text style={{ marginBottom: 10 }}>
//           Entgelte für die Gebrauchsüberlassung, für die Verwendung der
//           Ausstattung zur Verbrauchserfassung einschließlich der Eichung, sowie
//           für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vorliegenden
//           Heizkostenabrechnung unter dem Punkt &quot;Aufstellung der Kosten /
//           Weitere Heizungsbetriebskosten&quot;.
//         </Text>
//         <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
//           <View style={styles.chartPlaceholder}>
//             <Text style={{ fontSize: 8, textAlign: "center" }}>
//               QR Code Placeholder
//             </Text>
//           </View>
//           <Text style={{ flex: 1 }}>
//             Informationen zu Verbraucherorganisationen, Energiespartipps zur
//             Reduzierung der Heizkosten und des Energieverbrauches sowie Hinweise
//             zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizkörper
//             finden Sie unter{
