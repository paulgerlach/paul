export const outdoorOptions = ["Balkon", "Terrasse", "Loggia", "Sonstige"];

export const floorOptions = [
  "Erdgeschoss",
  "1. Obergeschoss",
  "2. Obergeschoss",
  "3. Obergeschoss",
  "4. Obergeschoss",
  "5. Obergeschoss",
  "6. Obergeschoss",
  "7. Obergeschoss",
  "8. Obergeschoss",
  "9. Obergeschoss",
  "10. Obergeschoss",
  "11. Obergeschoss",
  "12. Obergeschoss",
  "13. Obergeschoss",
  "14. Obergeschoss",
  "15. Obergeschoss",
];

export const floorShortcuts: Record<(typeof floorOptions)[number], string> = {
  Erdgeschoss: "EG",
  "1. Obergeschoss": "1. OG",
  "2. Obergeschoss": "2. OG",
  "3. Obergeschoss": "3. OG",
  "4. Obergeschoss": "4. OG",
  "5. Obergeschoss": "5. OG",
  "6. Obergeschoss": "6. OG",
  "7. Obergeschoss": "7. OG",
  "8. Obergeschoss": "8. OG",
  "9. Obergeschoss": "9. OG",
  "10. Obergeschoss": "10. OG",
  "11. Obergeschoss": "11. OG",
  "12. Obergeschoss": "12. OG",
  "13. Obergeschoss": "13. OG",
  "14. Obergeschoss": "14. OG",
  "15. Obergeschoss": "15. OG",
};

export const houseLocatonOptions = [
  "Vorderhaus",
  "Hinterhaus",
  "Seitenflügel",
  "Gartenhaus",
  "Remise",
  "-",
];

export const residentialAreaOptions = ["rechts", "mitte", "links", "-"];

export const apartmentTypeOptions = [
  "Dachgeschoss",
  "Erdgeschoss",
  "Etagenwohnung",
  "Hochparterre",
  "Loft",
  "Maisonette",
  "Penthouse",
  "Souterrain",
  "Terrassenwohnung",
  "Andere Wohnungstypen",
];

export const heatingSystemOptions = [
  "Fernwärme",
  "Gas",
  "Wärmepumpe",
  "Fußbodenheizung",
  "Solaranlage",
  "Strom",
  "Sonstige",
];

export const hotWaterPreparationOptions = [
  "Zentrale Wassererwärmung",
  "Dezentrale Wassererwärmung",
];

export const administrationTypeOptions = [
  "WEG Verwaltung",
  "Mietverwaltung",
  "Sondereigentumsverwaltung",
];

export const custodyTypeOptions = [
  "Mietertreuhandkonto",
  "Verpfändungssparkonto",
  "Bürgschaft",
  "Kautionsversicherung",
  "Sonstige",
];

export const fuelCostTypes = ["Gas", "Öl", "Fernwärme"];
export const operatingCurrentTypes = ["Strom für Umwälzpumpen", "Regeltechnik"];
export const maintenanceCostsTypes = [
  "Regelmäßige Wartung der Heizungsanlage (z. B. Brennerprüfung",
  "Reinigung",
];
export const meteringServiceCostsTypes = [
  "Ablesung",
  "Auswertung",
  "Gerätebereitstellung",
];
export const meteringDeviceRentalTypes = [
  "Für Heizkostenverteiler",
  "Wärmemengenzähler",
];
export const chimneySweepCostsTypes = [
  "Kosten für die Emissionsmessung",
  "Nur der auf die Heizung entfallende Teil",
];
export const otherOperatingCostsTypes = [
  "Z. B. Legionellenprüfung bei Warmwasserbereitung",
  "Kosten für die Reinigung des Heizraums",
];
export const propertyTaxTypes = [
  "Deichabgaben",
  "Regionale Abgaben",
  "Wasser- und Bodenverband Beiträge",
  "Grundsteuer",
];
export const liabilityInsuranceTypes = [
  "Fahrstuhlhaftpflichtversicherung",
  "Schwamm- Hausbockversicherung",
  "Öltankhaftpflichtversicherung",
  "Wasserschadenversicherung",
  "Gastankhaftpflichtversicherung",
  "Elementarschädenversicherung (wirtschaftlich relevant)",
  "Terrorschadenversicherung (wirtschaftlich sinnvoll)",
];
export const streetCleaningTypes = [
  "Streusalz",
  "Beseitung von Eis und Schnee",
  "Wartung und Treibstoff für Straßenreinigungsgeräte",
  "Straßenreinigung",
  "Reinigung der Mülltonnen",
  "Uneinbringliche Kosten illegaler Sperrmüllablagerung",
  "Sperrmüllbeseitung",
  "Rückerstattung Müllabfuhrgebühren",
  "Betriebskosten von Müllbeseitungsanlagen",
];
