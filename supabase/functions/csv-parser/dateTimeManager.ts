import { ParsedRecord } from "./models.ts";

export const extractHCA = (record: ParsedRecord): string | undefined => {
  const hcaDateTime = record["IV,0,0,0,,Date/Time"];
  if (hcaDateTime && typeof hcaDateTime === "string") {
    console.log(`[HCA DATE] Found IV,0,0,0,,Date/Time: "${hcaDateTime}"`);

    // Extract the date part (before any space)
    const datePart = hcaDateTime.split(" ")[0].trim();
    console.log(`[HCA DATE] Extracted date part: "${datePart}"`);

    // Parse DD.MM.YYYY format
    const dotMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (dotMatch) {
      const [_, day, month, year] = dotMatch;
      const result = `${year}-${month}-${day}`;
      console.log(
        `[HCA DATE SUCCESS] Using date from IV,0,0,0,,Date/Time: ${result}`,
      );
      return result;
    }
  }
};
