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
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#2563EB",
//     borderBottomWidth: 2,
//     borderBottomColor: "#2563EB",
//     paddingBottom: 4,
//     marginBottom: 8,
//   },
//   costSummary: {
//     backgroundColor: "#E5E7EB",
//     padding: 4,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     fontSize: 9,
//     fontWeight: "bold",
//   },
//   table: {
//     width: "100%",
//     marginTop: 4,
//     fontSize: 8,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//     paddingVertical: 2,
//   },
//   tableCell: {
//     flex: 1,
//     paddingRight: 4,
//   },
//   tableCellRight: {
//     textAlign: "right",
//     flex: 1,
//     paddingHorizontal: 1,
//   },
//   totalDistributedCosts: {
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
// });

// const HeatingBillPreviewThreePDF = () => {
//   return (
//     // <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>3/6 355703/0010</Text>
//         <Image style={styles.logo} src={admin_logo} />
//       </View>

//       <View style={{ marginBottom: 15 }}>
//         <Text style={styles.sectionTitle}>
//           Berechnung und Aufteilung der Kosten für Kaltwasser
//         </Text>
//       </View>

//       <View style={styles.costSummary}>
//         <Text>Kosten für Kaltwasser</Text>
//         <Text>41.468,88 €</Text>
//       </View>
//       <View style={styles.table}>
//         <View style={styles.tableRow}>
//           <Text style={styles.tableCell}>Kaltwasser Gesamt</Text>
//           <Text style={styles.tableCellRight}>17.036,69 € :</Text>
//           <Text style={styles.tableCellRight}>9.943,14 m³</Text>
//           <Text style={styles.tableCellRight}>=</Text>
//           <Text style={styles.tableCellRight}>1,713411 €/m³</Text>
//         </View>
//         <View style={styles.tableRow}>
//           <Text style={styles.tableCell}>Abwasser Gesamt</Text>
//           <Text style={styles.tableCellRight}>20.030,62 € :</Text>
//           <Text style={styles.tableCellRight}>9.943,14 m³</Text>
//           <Text style={styles.tableCellRight}>=</Text>
//           <Text style={styles.tableCellRight}>2,014517 €/m³</Text>
//         </View>
//         <View style={styles.tableRow}>
//           <Text style={styles.tableCell}>Gerätemiete Kaltwasser</Text>
//           <Text style={styles.tableCellRight}>2.274,90 € :</Text>
//           <Text style={styles.tableCellRight}>9.943,14 m³</Text>
//           <Text style={styles.tableCellRight}>=</Text>
//           <Text style={styles.tableCellRight}>0,228791 €/m³</Text>
//         </View>
//         <View style={styles.tableRow}>
//           <Text style={styles.tableCell}>Abrechnung Kaltwasser</Text>
//           <Text style={styles.tableCellRight}>2.126,67 € :</Text>
//           <Text style={styles.tableCellRight}>123,00 Nutzeinh.</Text>
//           <Text style={styles.tableCellRight}>=</Text>
//           <Text style={styles.tableCellRight}>17,290000 €/Nutzeinh.</Text>
//         </View>
//       </View>

//       <View style={styles.totalDistributedCosts}>
//         <Text>Summe der verteilten Kosten</Text>
//         <Text>165.485,59 €</Text>
//       </View>
//     </Page>
//     // </Document>
//   );
// };

// export default HeatingBillPreviewThreePDF;
