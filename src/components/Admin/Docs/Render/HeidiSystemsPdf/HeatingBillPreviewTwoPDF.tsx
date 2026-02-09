import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPreviewData } from "../HeatingBillPreview/HeatingBillPreview";
import { formatDateGerman, formatEuro } from "@/utils";

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
		backgroundColor: "#ffffff",
		padding: 20,
		fontFamily: "Helvetica",
		fontSize: 8,
		color: colors.text,
	},
	headerBox: {
		backgroundColor: colors.accent,
		borderRadius: 12,
		padding: 16,
		marginBottom: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	headerText: { fontSize: 7 },
	titleSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	titleLeft: { width: "50%" },
	titleRight: { width: "50%", fontSize: 8 },
	mainTitle: {
		fontWeight: "bold",
		fontSize: 14,
		lineHeight: 1.2,
		marginBottom: 6,
	},
	subtitle: { fontSize: 8 },
	detailGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	detailItem: { width: "48%", marginBottom: 6 },
	detailLabel: { fontWeight: "bold", color: "#083123" },
	costBreakdown: { marginTop: 7 },
	sectionTitle: {
		fontSize: 10,
		fontWeight: "bold",
		color: colors.title,
		borderBottomWidth: 1,
		borderBottomColor: colors.dark,
		paddingBottom: 4,
		marginBottom: 8,
	},
	tableContainer: { flexDirection: "row", justifyContent: "space-between" },
	table: { width: "48%", fontSize: 8 },
	tableHeader: {
		flexDirection: "row",
		backgroundColor: colors.accent2,
		borderRadius: 6,
		color: "#FFFFFF",
		paddingVertical: 4,
		paddingHorizontal: 2,
		marginBottom: 4,
	},
	tableHeaderCell: {
		fontWeight: "bold",
		textAlign: "left",
		flex: 1,
		color: "#FFFFFF",
	},
	tableHeaderCellRight: {
		fontWeight: "bold",
		textAlign: "right",
		flex: 1,
		color: "#FFFFFF",
	},
	tableRow: { flexDirection: "row", marginBottom: 1 },
	tableCell: { flex: 1 },
	tableCellRight: { flex: 1, textAlign: "right" },
	sumRow: {
		backgroundColor: colors.accent,
		borderRadius: 6,
		paddingVertical: 4,
		paddingHorizontal: 5,
		marginTop: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	sumRowAccent2: {
		backgroundColor: colors.accent2,
		borderRadius: 6,
		paddingVertical: 4,
		paddingHorizontal: 5,
		marginTop: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	totalRow: {
		backgroundColor: colors.accent2,
		color: "#ffffff",
		padding: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 6,
		fontWeight: "bold",
	},
	costAllocationBox: {
		borderRadius: 12,
		padding: 10,
		marginVertical: 10,
		backgroundColor: colors.accent2,
	},
	costAllocationHeader: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#ffffff",
		borderBottomWidth: 2,
		borderBottomColor: "#FFFFFF",
		marginBottom: 6,
	},
	allocationRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 2,
	},
	allocationLabelBold: { fontWeight: "700", color: colors.dark },
	allocationBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: colors.accent,
		borderRadius: 6,
		padding: 4,
		marginTop: 4,
		fontWeight: "bold",
	},
	formulaBox: {
		flexDirection: "column",
		justifyContent: "space-between",
		color: "#FFFFFF",
		padding: 4,
		marginTop: 4,
		fontWeight: "bold",
	},
	allocationGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 2,
	},
});

export default function HeatingBillPreviewTwoPDF({
	previewData,
}: {
	previewData: HeatingBillPreviewData;
}) {
	return (
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.headerBox}>
				<View style={styles.header}>
					<Text style={styles.headerText}>
						2/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
					</Text>
					<Image
						style={{ width: 80, height: 20 }}
						src={previewData.logoSrc || "/admin_logo.png"}
					/>
				</View>
				<View style={styles.titleSection}>
					<View style={styles.titleLeft}>
						<Text style={styles.mainTitle}>
							Heidi Systems® Gesamtrechnung{"\n"}Heizung, Warmwasser, Kaltwasser
						</Text>
						<Text style={styles.subtitle}>
							Die Gesamtabrechnung bildet die Aufteilung der Kosten für das
							gesamte Gebäude ab. Die anteiligen Kosten Ihrer Nutzeinheit
							entnehmen Sie bitte dem Formular &quot;Ihre Abrechnung&quot;.
						</Text>
					</View>
					<View style={styles.titleRight}>
						<View style={styles.detailGrid}>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Liegenschaft</Text>
								<Text>{previewData.contractorsNames}</Text>
								<Text>{previewData.generalInfo.street}</Text>
								<Text>{previewData.generalInfo.zip}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Liegenschaftsnummer</Text>
								<Text>{previewData.propertyNumber}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Abrechnungszeitraum</Text>
								<Text>
									{formatDateGerman(previewData.generalInfo.billingStartDate)} -{" "}
									{formatDateGerman(previewData.generalInfo.billingEndDate)}
								</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>erstellt am</Text>
								<Text>
									{formatDateGerman(
										formatDateGerman(
											previewData.generalInfo.documentCreationDate,
										),
									)}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>

			{/* Cost breakdown tables */}
			<View style={styles.costBreakdown}>
				<Text style={styles.sectionTitle}>Aufstellung der Kosten</Text>
				<View style={styles.tableContainer}>
					{/* Energy table */}
					<View style={styles.table}>
						<Text
							style={{
								fontWeight: "bold",
								marginBottom: 5,
								color: colors.dark,
							}}
						>
							Energieart: "Nah-/Fernwärme kWh"
						</Text>
						<View style={styles.tableHeader}>
							<Text style={styles.tableHeaderCell}>POSITION</Text>
							<Text style={styles.tableHeaderCell}>DATUM</Text>
							<Text style={styles.tableHeaderCell}>kWh</Text>
							<Text style={styles.tableHeaderCellRight}>BETRAG</Text>
						</View>
						{/* Dynamic energy line items */}
						{previewData.billingInvoices.fuelInvoices.map((item, index) => (
							<View key={index} style={styles.tableRow}>
								<Text style={styles.tableCell}>{item.purpose}</Text>
								<Text style={styles.tableCell}>
									{item.invoiceDate ? formatDateGerman(item.invoiceDate) : ""}
								</Text>
								<Text style={styles.tableCell}>
									{item.notes ? item?.notes.toLocaleString() : ""}
								</Text>
								<Text style={styles.tableCellRight}>
									{formatEuro(item.totalAmount)}
								</Text>
							</View>
						))}
						{/* Sum row */}
						<View style={[styles.tableRow, styles.sumRow]}>
							<Text
								style={[
									styles.tableCell,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								Summe Verbrauch
							</Text>
							<Text style={styles.tableCell}></Text>
							<Text
								style={[
									styles.tableCell,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								{/* 
									TODO @KarimHesham:  this should be the total consumption amounts which currently is read from notes as a string 								
								{previewData.energyConsumption?.totalKwh
									? previewData.energyConsumption.totalKwh.toLocaleString()
									: ""} */}
							</Text>
							<Text
								style={[
									styles.tableCellRight,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								{formatEuro(previewData.billingInvoices.fuelTotal ?? 0)}
							</Text>
						</View>
					</View>

					{/* Heating costs table */}
					<View style={styles.table}>
						<Text
							style={{
								fontWeight: "bold",
								marginBottom: 5,
								color: colors.dark,
							}}
						>
							Weitere Heizungsbetriebskosten
						</Text>
						<View style={styles.tableHeader}>
							<Text style={styles.tableHeaderCell}>POSITION</Text>
							<Text style={styles.tableHeaderCell}>DATUM</Text>
							<Text style={styles.tableHeaderCellRight}>BETRAG</Text>
						</View>

						{/* Carrier over from Energy Consumption */}
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Übertrag</Text>
							<Text style={styles.tableCell}></Text>
							<Text style={styles.tableCellRight}>
								{formatEuro(previewData.billingInvoices.fuelTotal || 0)}
							</Text>
						</View>

						{/* Dynamic additional cost line items */}
						{previewData.billingInvoices.operationalInvoices.map(
							(item, index) => (
								<View key={index} style={styles.tableRow}>
									<Text style={styles.tableCell}>{item.purpose}</Text>
									<Text style={styles.tableCell}>
										{item.invoiceDate ? formatDateGerman(item.invoiceDate) : ""}
									</Text>
									<Text style={styles.tableCellRight}>
										{formatEuro(item.totalAmount)}
									</Text>
								</View>
							),
						)}

						<View style={[styles.tableRow, styles.sumRow]}>
							<Text
								style={[
									styles.tableCell,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								Summe Energie- und Heizungsbetriebskosten
							</Text>
							<Text
								style={
									(styles.tableCellRight,
									{ fontWeight: "bold", color: colors.dark })
								}
							>
								{formatEuro(previewData.billingInvoices.operationalTotal || 0)}
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Costs for separate distribution */}
			<View style={styles.costBreakdown}>
				<Text style={styles.sectionTitle}>
					Kosten für gesonderte Verteilung
				</Text>
				<View style={styles.tableContainer}>
					{/* Distribution types */}
					<View style={styles.table}>
						<View style={styles.tableHeader}>
							<Text style={styles.tableHeaderCell}>VERTEILUNG NACH</Text>
						</View>
						{previewData.billingInvoices.heatingInvoices.map((item, i) => (
							<View style={styles.tableRow} key={i}>
								<Text style={styles.tableCell}>{item.costType || "-"}</Text>
							</View>
						))}
					</View>

					{/* Distribution costs */}
					<View style={styles.table}>
						<View style={styles.tableHeader}>
							<Text style={styles.tableHeaderCell}>POSITION</Text>
							<Text style={styles.tableHeaderCell}>DATUM</Text>
							<Text style={styles.tableHeaderCellRight}>BETRAG</Text>
						</View>
						{previewData.billingInvoices.heatingInvoices.map((item, i) => (
							<View style={styles.tableRow} key={i}>
								<Text style={styles.tableCell}>{item.costType}</Text>
								<Text style={styles.tableCell}>
									{item.invoiceDate ? formatDateGerman(item.invoiceDate) : ""}
								</Text>
								<Text style={styles.tableCellRight}>
									{formatEuro(item.totalAmount)}
								</Text>
							</View>
						))}
						{/* Sum row */}
						<View style={[styles.sumRow]}>
							<Text
								style={[
									styles.tableCell,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								Summe Kosten zur gesonderten Verteilung
							</Text>
							<Text
								style={[
									styles.tableCellRight,
									{ fontWeight: "bold", color: colors.dark },
								]}
							>
								{formatEuro(previewData.billingInvoices.heatingTotal || 0)}
							</Text>
						</View>
						<View style={styles.totalRow}>
							<Text>Summe der zu verteilenden Kosten</Text>
							<Text>
								{formatEuro(
									previewData.billingInvoices.heatingTotal +
										previewData.billingInvoices.fuelTotal || 0,
								)}
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Cost allocation – Warmwasser */}
			<View style={styles.costAllocationBox}>
				<Text style={styles.costAllocationHeader}>Aufteilung der Kosten</Text>
				<Text style={{ fontWeight: "bold", marginBottom: 4, color: "#FFFFFF" }}>
					Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
				</Text>
				<View style={styles.allocationRow}>
					<View style={styles.formulaBox}>
						<Text
							style={{
								borderBottomWidth: 1,
								borderBottomColor: "#FFFFFF",
								fontWeight: 400,
							}}
						>
							2,5 kWh/m³/K x {previewData.consumptionData.hotWater.consumption}{" "}
							m³ x (60-10°C)
						</Text>
						<Text style={{ textAlign: "center" }}>1,15</Text>
					</View>
					<Text style={{ color: "#FFFFFF" }}>
						=
						{
							previewData.hotWaterHeatingAllocation.consumptionAllocation
								.consumption
						}
						kWh Nah-/Fernwärme
					</Text>
					<Text style={{ color: "#FFFFFF" }}>
						={" "}
						{
							previewData.hotWaterHeatingAllocation.consumptionAllocation
								.percentageOfGas
						}{" "}
						% d. Gesamtverbr.
					</Text>
				</View>
			</View>
			<View style={styles.allocationRow}>
				<Text>
					{
						previewData.hotWaterHeatingAllocation.consumptionAllocation
							.percentageOfGas
					}{" "}
					% aus{" "}
					{formatEuro(
						previewData.billingInvoices.fuelTotal +
							previewData.billingInvoices.operationalTotal || 0,
					)}
					Energie- und Heizungsbetriebskosten entspricht Kosten für Erwärmung
					Warmwasser
				</Text>
				<Text>
					{formatEuro(
						previewData.hotWaterHeatingAllocation.costAllocation.cost || 0,
					)}
				</Text>
			</View>
			<View style={styles.allocationRow}>
				<Text style={styles.allocationLabelBold}>
					Gerätemiete Heizung/Warmwasser
				</Text>
				<Text>
					{formatEuro(
						previewData.hotWaterHeatingAllocation.costAllocation
							.metersRentingCost || 0,
					)}
				</Text>
			</View>
			<View style={styles.allocationBox}>
				<Text>Kosten für Warmwasser</Text>
				<Text>
					{formatEuro(
						previewData.hotWaterHeatingAllocation.costAllocation.cost +
							previewData.hotWaterHeatingAllocation.costAllocation
								.metersRentingCost || 0,
					)}
				</Text>
			</View>
			<View style={styles.allocationGrid}>
				<Text style={styles.allocationLabelBold}>
					davon {previewData.generalInfo.livingSpaceShare}% Grundkosten
				</Text>
				<Text>16.270,72 € :</Text>
				<Text>11.196,40 m²</Text>
				<Text>= 1,453210 €/m²</Text>
			</View>
			<View style={styles.allocationGrid}>
				<Text style={styles.allocationLabelBold}>
					davon {previewData.generalInfo.consumptionDependent}% Verbrauchskosten
				</Text>
				<Text>37.964,99 € :</Text>
				<Text>3.148,25 m³</Text>
				<Text>= 12,059077 €/m³</Text>
			</View>

			{/* Cost allocation – Heizung */}
			<View style={styles.costBreakdown}>
				<Text style={[styles.sectionTitle, { marginTop: 10 }]}>
					Berechnung und Aufteilung der Kosten für Heizung
				</Text>
				<View style={styles.allocationRow}>
					<Text style={styles.allocationLabelBold}>
						Summe Energie- und Heizungsbetriebskosten
					</Text>
					<Text>{`${formatEuro(previewData.billingInvoices.operationalTotal + previewData.billingInvoices.fuelTotal || 0)}`}</Text>
				</View>
				<View style={styles.allocationRow}>
					<Text style={styles.allocationLabelBold}>
						abzüglich Kosten für Erwärmung Warmwasser
					</Text>
					<Text>
						-
						{formatEuro(
							previewData.hotWaterHeatingAllocation.costAllocation.cost,
						)}
					</Text>
				</View>
				<View style={styles.allocationRow}>
					<Text style={styles.allocationLabelBold}>
						Gerätemiete Heizung/Warmwasser
					</Text>
					<Text>
						{formatEuro(
							previewData.hotWaterHeatingAllocation.costAllocation
								.metersRentingCost,
						)}
					</Text>
				</View>
				<View style={styles.allocationBox}>
					<Text>Kosten für Heizung</Text>
					<Text>69.780,93 €</Text>
				</View>
				<View style={styles.allocationGrid}>
					<Text style={styles.allocationLabelBold}>
						davon {previewData.generalInfo.livingSpaceShare}% Grundkosten
					</Text>
					<Text>20.934,28 € :</Text>
					<Text>11.196,40 m²</Text>
					<Text>= 1,869733 €/m²</Text>
				</View>
				<View style={styles.allocationGrid}>
					<Text style={styles.allocationLabelBold}>
						davon {previewData.generalInfo.consumptionDependent}%
						Verbrauchskosten
					</Text>
					<Text>48.846,65 € :</Text>
					<Text>404,04 MWh</Text>
					<Text>= 120,895580 €/MWh</Text>
				</View>
			</View>
		</Page>
	);
}
