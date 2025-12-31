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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsageData = async () => {
            if (!localId || !startDate || !endDate || (Array.isArray(localId) && localId.length === 0)) {
                setConsumption({ waterCold: 0, waterHot: 0, heat: 0 });
                setMeters([]);
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
                            "WWater",
                            "Warmwasserzähler",
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

                    const deviceMap = new Map<string, any[]>();
                    data.forEach((d) => {
                        const id = d.ID || d["Number Meter"];
                        if (!id) return;
                        if (!deviceMap.has(String(id))) deviceMap.set(String(id), []);
                        deviceMap.get(String(id))?.push(d);
                    });

                    let cold = 0;
                    let hot = 0;
                    let ht = 0;
                    const processedMeters: MeterDetail[] = [];

                    deviceMap.forEach((readings, id) => {
                        readings.sort((a, b) => {
                            const dateA = new Date(a["Actual Date"] || a["Raw Date"] || a["IV,0,0,0,,Date/Time"] || 0);
                            const dateB = new Date(b["Actual Date"] || b["Raw Date"] || b["IV,0,0,0,,Date/Time"] || 0);
                            return dateA.getTime() - dateB.getTime();
                        });

                        if (readings.length < 2) return;

                        const first = readings[0];
                        const last = readings[readings.length - 1];
                        const type = first["Device Type"];
                        const location = first["Location"] || first["Property Name"] || "";

                        const getVol = (item: any) => {
                            const val = item["Actual Volume"] ?? item["IV,0,0,0,m^3,Vol"] ?? item["Actual Energy / HCA"] ?? item["IV,0,0,0,Wh,E"] ?? 0;
                            return typeof val === "number" ? val : parseFloat(String(val).replace(",", "."));
                        };

                        const firstVol = getVol(first);
                        const lastVol = getVol(last);
                        const consumptionVal = lastVol - firstVol;

                        processedMeters.push({
                            id,
                            type,
                            location,
                            firstReading: firstVol,
                            lastReading: lastVol,
                            consumption: consumptionVal
                        });

                        if (["Water", "Kaltwasserzähler"].includes(type)) {
                            cold += consumptionVal;
                        } else if (["WWater", "Warmwasserzähler"].includes(type)) {
                            hot += consumptionVal;
                        } else if (["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"].includes(type)) {
                            ht += consumptionVal;
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
    }, [localId, startDate, endDate]);

    return { consumption, meters, isLoading, error };
};
