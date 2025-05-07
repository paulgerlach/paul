import Papa from "papaparse";

export const fetchCsvData = async () => {
  const response = await fetch("/data/Gateway.csv");
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      delimiter: ",",
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        const data = results.data as string[][];

        const record: Record<string, string> = {};

        data.forEach(([key, ...valueParts]) => {
          if (!key) return;
          const value = valueParts.join(",").trim();
          record[key.trim()] = value;
        });

        resolve(record);
      },
      error: (err: never) => reject(err),
    });
  });
};
