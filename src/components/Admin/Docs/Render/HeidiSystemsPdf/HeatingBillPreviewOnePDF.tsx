import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { HeatingBillPdfModel } from "@/app/api/generate-heating-bill/_lib";

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
    padding: 20,
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

export default function HeatingBillPreviewOnePDF({
  cover,
  logoSrc = "/admin_logo.png",
}: {
  cover: HeatingBillPdfModel["cover"];
  logoSrc?: string;
}) {
  const contractors = cover.contractors ?? [];
  const hasContractors = contractors.length > 0;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <View style={styles.flexRow}>
          <Text style={{ fontSize: 8 }}>
            1/5 {cover.propertyNumber}/{cover.heidiCustomerNumber}
          </Text>
          <View>
            <Image
              style={{ width: 80, height: 20, alignSelf: "center" }}
              src={logoSrc}
            />
          </View>
        </View>

        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={{ flex: 1, maxWidth: "55%" }}>
            <Text style={[styles.bold, { borderBottom: "1px solid #000" }]}>
              Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
            </Text>
            <Text style={{ fontSize: 14, marginTop: 20, fontWeight: "bold" }}>
              {cover.contractorsNames}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {cover.street}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {cover.zip}
            </Text>
          </View>

          <View style={{ flexShrink: 0 }}>
            <Text style={[styles.title]}>Ihre Heidi Systems®</Text>
            <Text style={[styles.title]}>Abrechnung für Heizung,</Text>
            <Text style={[styles.title]}>Warmwasser, Kaltwasser</Text>
            <Text style={styles.subTitle}>Zusammenstellung Ihrer Kosten</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, styles.twoColsRow]}>
        <View style={styles.colHalf}>
          <View style={styles.gridRow}>
            <Text>Erstellt im Auftrag von</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {cover.ownerFirstName} {cover.ownerLastName}
              {"\n"}
              Immobilienmanagement {"\n"}
              {cover.street}
              {"\n"}
              {cover.zip}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Abrechnungszeitraum</Text>
            <Text>
              {cover.billingPeriodStart} - {cover.billingPeriodEnd}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Ihr Nutzungszeitraum</Text>
            <Text>
              {cover.usagePeriodStart} - {cover.usagePeriodEnd}
            </Text>
          </View>
        </View>

        <View style={styles.colHalf}>
          <View style={styles.gridRow}>
            <Text>Erstellt am</Text>
            <Text>{cover.createdAt}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Liegenschaft</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {cover.contractorsNames}
              {"\n"}
              {cover.street}
              {"\n"}
              {cover.zip}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.bold as any}>Liegenschaftsnummer</Text>
            <Text>{cover.propertyNumber}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text>Heidi Nutzernummer</Text>
            <Text>{cover.heidiCustomerNumber}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text>Ihre Nutzernummer</Text>
            <Text>{cover.userNumber}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text>Sehr geehrte Damen und Herren,</Text>
        <Text>
          wir haben die Kosten, die im vergangenen Abrechnungszeitraum
          angefallen sind, abgerechnet. Unsere Abrechnung ist auf den folgenden
          {"\n"}
          Seiten dieses Schreibens detailliert beschrieben.
        </Text>
      </View>

      <View style={styles.boxDark}>
        <Text style={{ fontSize: 10, textAlign: "right", marginBottom: 6 }}>
          Betrag
        </Text>
        <View style={{ borderTop: "1px solid white", marginBottom: 6 }} />
        <View style={styles.flexRow}>
          <Text style={{ fontSize: 12 }}>Gesamtbetrag</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {cover.totalAmountFormatted}
          </Text>
        </View>
      </View>

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
          Unter {cover.portalLink} können Sie prüfen, wie sehr sich die
          Energiepreise in Ihrer Liegenschaft und für Sie persönlich
          {"\n"}
          verändert haben.
        </Text>
      </View>
      <View style={styles.hintRow}>
        <View style={styles.square} />
        <Text>
          Allgemeine Hinweise und Informationen zur Abrechnung finden Sie unter:{" "}
          {cover.portalLink}
        </Text>
      </View>

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
                <Text>{cover.userId}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.bold as any}>Sicherheitscode:</Text>
                <Text>{cover.securityCode}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.colHalf, { alignItems: "flex-end" }]}>
            <Image src={cover.qrCodeUrl} style={{ width: 40, height: 40 }} />
            <Text style={[styles.bold, { marginTop: 4 }]}>
              Oder registrieren unter {cover.portalLink}.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={[styles.bold, { marginBottom: 8 }]}>
          Folgende Objekte sind in dieser Abrechnung berücksichtigt:
        </Text>
        <View style={styles.contractorsGrid}>
          {hasContractors
            ? contractors.map((c) => (
              <View key={c.id} style={styles.contractorItem}>
                <Text>
                  {c.firstName} {c.lastName}
                  {"\n"}
                  {cover.street}
                  {"\n"}
                  {cover.zip}
                </Text>
              </View>
            ))
            : (
              <View style={styles.contractorItem}>
                <Text>
                  {cover.contractorsNames}
                  {"\n"}
                  {cover.street}
                  {"\n"}
                  {cover.zip}
                </Text>
              </View>
            )}
        </View>
      </View>
    </Page>
  );
}
