"use client";

import { useState, useEffect } from "react";
import { MeterReadingType } from "@/api";
import { fetchMeterUUIDs, fetchSingleLocalMeterUUIDs } from "@/utils/meterUtils";

export interface ConsumptionData {
    waterCold: number;
    waterHot: number;
    heat: number;
}

export interface MeterDetail {
    id: string;
    type: string;
    location: string;
    firstReading: number;
    lastReading: number;
    consumption: number;
}

export interface UseConsumptionDataResult {
    consumption: ConsumptionData;
    meters: MeterDetail[];
    isLoading: boolean;
    error: string | null;
    coldWaterData: MeterReadingType[];
    hotWaterData: MeterReadingType[];
    heatingData: MeterReadingType[];
}

export const useConsumptionData = (
    localId: string | string[] | undefined,
    startDate: Date | null,
    endDate: Date | null
): UseConsumptionDataResult => {
    const [consumption, setConsumption] = useState<ConsumptionData>({
        waterCold: 0,
        waterHot: 0,
        heat: 0,
    });
    const [meters, setMeters] = useState<MeterDetail[]>([]);
    const [coldWaterData, setColdWaterData] = useState<MeterReadingType[]>([]);
    const [hotWaterData, setHotWaterData] = useState<MeterReadingType[]>([]);
    const [heatingData, setHeatingData] = useState<MeterReadingType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsageData = async () => {
            if (!localId || !startDate || !endDate || (Array.isArray(localId) && localId.length === 0)) {
                setConsumption({ waterCold: 0, waterHot: 0, heat: 0 });
                setMeters([]);
                setColdWaterData([]);
                setHotWaterData([]);
                setHeatingData([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            const adjustedStartDate = new Date(startDate);
            adjustedStartDate.setDate(adjustedStartDate.getDate() - 7);

            try {
                const meterUUIDs = Array.isArray(localId)
                    ? await fetchMeterUUIDs(localId)
                    : await fetchSingleLocalMeterUUIDs(localId);

                if (meterUUIDs.length === 0) {
                    setConsumption({ waterCold: 0, waterHot: 0, heat: 0 });
                    setMeters([]);
                    setColdWaterData([]);
                    setHotWaterData([]);
                    setHeatingData([]);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch("/api/dashboard-data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        meterIds: meterUUIDs,
                        deviceTypes: [
                            "Water",
                            "Kaltwasserzähler",
                            "Kaltwasser",
                            "WWater",
                            "Warmwasserzähler",
                            "Warmwasser",
                            "Heat",
                            "WMZ Rücklauf",
                            "Heizkostenverteiler",
                            "Wärmemengenzähler",
                        ],
                        startDate: adjustedStartDate.toISOString(),
                        endDate: endDate.toISOString(),
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    const data: MeterReadingType[] = result.data || [];



                    // Separate data by device type
                    const coldWater = data.filter((d) =>
                        ["Water", "Kaltwasserzähler", "Kaltwasser"].includes(d["Device Type"])
                    );
                    const hotWater = data.filter((d) =>
                        ["WWater", "Warmwasserzähler", "Warmwasser"].includes(d["Device Type"])
                    );
                    const heating = data.filter((d) =>
                        ["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"].includes(d["Device Type"])
                    );

                    // Set the separated data
                    setColdWaterData(coldWater);
                    setHotWaterData(hotWater);
                    setHeatingData(heating);



                    const deviceMap = new Map<string, any[]>();
                    data.forEach((d) => {
                        const id = d.ID || d["Number Meter"];
                        const type = d["Device Type"];
                        if (!id) return;

                        // Create a unique key combining ID and Type to handle distinct meters with same ID
                        const uniqueKey = `${id}_${type}`;

                        if (!deviceMap.has(uniqueKey)) deviceMap.set(uniqueKey, []);
                        deviceMap.get(uniqueKey)?.push(d);
                    });

                    let cold = 0;
                    let hot = 0;
                    let ht = 0;
                    const processedMeters: MeterDetail[] = [];

                    // Utility to parse dates robustly (from WaterChart)
                    const parseDate = (item: any): Date => {
                        try {
                            const dateStr = item["Actual Date"] || item["Raw Date"] || item["IV,0,0,0,,Date/Time"];
                            if (!dateStr) return new Date(0);

                            // Handle "29.09.2025 09:57 invalid..."
                            const parts = String(dateStr).split(" ");
                            if (parts.length >= 1) {
                                // Try parsing "dd.mm.yyyy"
                                const datePart = parts[0];
                                // Handle "yyyy-mm-dd" or "dd-mm-yyyy" if needed, but primary format seems to be German
                                if (datePart.includes(".")) {
                                    const [day, month, year] = datePart.split(".").map(Number);
                                    // Check for time
                                    let hour = 0, minute = 0;
                                    if (parts[1] && parts[1].includes(":")) {
                                        const [h, m] = parts[1].split(":").map(Number);
                                        if (!isNaN(h)) hour = h;
                                        if (!isNaN(m)) minute = m;
                                    }
                                    if (day && month && year) return new Date(year, month - 1, day, hour, minute);
                                }
                                // Handle "dd-mm-yyyy"
                                if (datePart.includes("-")) {
                                    const normalized = datePart.replace(/-/g, ".");
                                    const [day, month, year] = normalized.split(".").map(Number);
                                    if (day && month && year) return new Date(year, month - 1, day);
                                }
                            }
                            return new Date(dateStr);
                        } catch (e) {
                            return new Date(0);
                        }
                    };

                    // Utility to parse values (Volume or Energy)
                    const getVal = (item: any) => {
                        // Check for Energy first if it exists (for Heat)
                        const energy = item["Actual Energy / HCA"] ?? item["IV,0,0,0,Wh,E"];
                        if (energy !== undefined && energy !== null) {
                            return typeof energy === "number" ? energy : parseFloat(String(energy).replace(",", "."));
                        }
                        // Fallback to Volume
                        const vol = item["Actual Volume"] ?? item["IV,0,0,0,m^3,Vol"] ?? 0;
                        return typeof vol === "number" ? vol : parseFloat(String(vol).replace(",", "."));
                    };

                    // Utility to validate reading (from HeatingCosts)
                    const isValidReading = (val: number) => {
                        // Filter out error codes
                        if (val >= 10000000) return false;
                        // Filter out distinct error patterns (777.777 etc)
                        if (val >= 777 && (
                            Math.abs(val - 777.777) < 0.001 ||
                            Math.abs(val - 888.888) < 0.001 ||
                            Math.abs(val - 999.999) < 0.001
                        )) return false;
                        return true;
                    };

                    deviceMap.forEach((readings, id) => {
                        // Sort by Date
                        readings.sort((a, b) => {
                            return parseDate(a).getTime() - parseDate(b).getTime();
                        });

                        if (readings.length < 2) return;

                        const first = readings[0];
                        const last = readings[readings.length - 1];
                        const type = first["Device Type"];
                        const location = first["Location"] || first["Property Name"] || "";

                        const firstReadVal = getVal(first);
                        const lastReadVal = getVal(last);

                        // Calculate Consumption using Sum of Positive Deltas
                        let calculatedConsumption = 0;
                        for (let i = 1; i < readings.length; i++) {
                            const prev = readings[i - 1];
                            const curr = readings[i];

                            const vPrev = getVal(prev);
                            const vCurr = getVal(curr);

                            if (!isValidReading(vPrev) || !isValidReading(vCurr)) continue;

                            const diff = vCurr - vPrev;
                            if (diff >= 0) {
                                calculatedConsumption += diff;
                            }
                        }

                        processedMeters.push({
                            id,
                            type,
                            location,
                            firstReading: firstReadVal,
                            lastReading: lastReadVal,
                            consumption: calculatedConsumption
                        });

                        if (["Water", "Kaltwasserzähler", "Kaltwasser"].includes(type)) {
                            cold += calculatedConsumption;
                        } else if (["WWater", "Warmwasserzähler", "Warmwasser"].includes(type)) {
                            hot += calculatedConsumption;
                        } else if (["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"].includes(type)) {
                            ht += calculatedConsumption;
                        }
                    });

                    setConsumption({ waterCold: cold, waterHot: hot, heat: ht });
                    setMeters(processedMeters);
                } else {
                    setError(`API Error: ${response.statusText}`);
                }
            } catch (err) {
                console.error("Failed to fetch consumption data", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsageData();
    }, []);

    console.log("meters", meters);

    return { consumption, meters, isLoading, error, coldWaterData, hotWaterData, heatingData };
};
