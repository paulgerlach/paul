import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

export const fetchCsvData = async (): Promise<Record<string, string>[]> => {
  const filePath = path.resolve(
    process.cwd(),
    "public/data/cleaned_heat_meter_data.csv"
  );

  try {
    const text = await fs.readFile(filePath, "utf-8");

    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(text, {
        skipEmptyLines: true,
        header: true, // Enable header parsing
        delimiter: ",",
        quoteChar: '"',
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors);
          } else {
            resolve(results.data);
          }
        },
        error: reject,
      });
    });
  } catch (err) {
    console.error("CSV file not found at:", filePath);
    throw err;
  }
};
