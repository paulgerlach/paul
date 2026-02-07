import database from "@/db";
import {
  documents,
  contracts,
  contractors,
  objekte,
  locals,
  doc_cost_category,
  operating_cost_documents,
  invoice_documents,
  heating_bill_documents,
  users,
  local_meters,
  heating_invoices,
} from "@/db/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";
import { getUserAgencyId, getUserRole, isAdminUser } from "@/auth";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import type {
  ContractorType,
  ContractType,
  DocCostCategoryType,
  HeatingBillDocumentType,
  HeatingInvoiceType,
  InvoiceDocumentType,
  LocalMeterType,
  LocalType,
  ObjektType,
  OperatingCostDocumentType,
  UserType
} from "@/types";
import { parseCsv } from "@/utils/parser";
import { MASTER_DATA, MASTER_DATA_2 } from "./data";
import { writeFileSync } from "fs";
import { CSVParser } from "./parse_csv_to_json";

export type MeterReadingType = {
  "Frame Type": string;
  Manufacturer: string;
  ID: string;
  Version: string;
  "Device Type": "Heat" | "WWater" | string;
  "TPL-Config": string;
  "Access Number": number;
  Status: string;
  Encryption: number;
  "IV,0,0,0,,Date/Time"?: string; // OLD format - now optional
  "IV,0,0,0,Wh,E"?: number; // Energy in Wh (for heat meters) - OLD format
  "IV,0,0,0,m^3,Vol"?: number; // Volume in cubic meters - OLD format
  "IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"?: string;

  // NEW Engelmann CSV format fields
  "Number Meter"?: string | number; // NEW format device ID
  "Actual Date"?: string; // NEW format date (e.g., "29.10.2025")
  "Raw Date"?: string; // NEW format date alternative (e.g., "29-10-2025")
  "Actual Time"?: string; // NEW format time (e.g., "09:56 Winterzeit...")
  "Actual Energy / HCA"?: number | string; // NEW format energy in Wh
  "Actual Volume"?: number | string; // NEW format volume in m³
  "Actual Unit"?: string; // NEW format unit (e.g., "Wh", "m³")
  "Actual Unit Volume"?: string; // NEW format volume unit
  "Billing Date"?: string; // NEW format billing date
  "Billing Value"?: number | string; // NEW format billing value
  "Billing Unit"?: string; // NEW format billing unit
  "Telegram Type"?: string; // NEW format manufacturer (e.g., "EMH", "EFE_WaterStar M")

  // GROUP 2: Hint Code and RSSI fields
  "Hint Code"?: string | number; // Hint code (e.g., "5" for leakage, "12" for smoke detector)
  "Hint Code Description"?: string; // Human-readable hint description
  "RSSI Value"?: string | number; // Signal strength (e.g., "-85" dBm)
  "Status Byte"?: string; // Device status byte (e.g., "0x01")

  // GROUP 3: Monthly consumption data for trend analysis
  "Monthly Date 1"?: string;
  "Monthly Value 1"?: string | number;
  "Monthly Unit 1"?: string;
  "Monthly Date 2"?: string;
  "Monthly Value 2"?: string | number;
  "Monthly Unit 2"?: string;
  "Monthly Date 3"?: string;
  "Monthly Value 3"?: string | number;
  "Monthly Unit 3"?: string;
  "Monthly Date 4"?: string;
  "Monthly Value 4"?: string | number;
  "Monthly Unit 4"?: string;
  "Monthly Date 5"?: string;
  "Monthly Value 5"?: string | number;
  "Monthly Unit 5"?: string;
  "Monthly Date 6"?: string;
  "Monthly Value 6"?: string | number;
  "Monthly Unit 6"?: string;
  "Monthly Date 7"?: string;
  "Monthly Value 7"?: string | number;
  "Monthly Unit 7"?: string;
  "Monthly Date 8"?: string;
  "Monthly Value 8"?: string | number;
  "Monthly Unit 8"?: string;
  "Monthly Date 9"?: string;
  "Monthly Value 9"?: string | number;
  "Monthly Unit 9"?: string;
  "Monthly Date 10"?: string;
  "Monthly Value 10"?: string | number;
  "Monthly Unit 10"?: string;
  "Monthly Date 11"?: string;
  "Monthly Value 11"?: string | number;
  "Monthly Unit 11"?: string;
  "Monthly Date 12"?: string;
  "Monthly Value 12"?: string | number;
  "Monthly Unit 12"?: string;

  "IV,1,0,0,,Date"?: string; // OLD format - now optional
  "IV,1,0,0,Wh,E"?: number;
  "IV,1,0,0,m^3,Vol"?: number;
  "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)"?: number;
  "IV,2,0,0,,Date"?: string; // OLD format - now optional
  "IV,2,0,0,Wh,E"?: number;
  "IV,3,0,0,Wh,E"?: number;
  "IV,4,0,0,Wh,E"?: number;
  "IV,6,0,0,Wh,E"?: number;
  "IV,8,0,0,Wh,E"?: number;
  "IV,10,0,0,Wh,E"?: number;
  "IV,12,0,0,Wh,E"?: number;
  "IV,14,0,0,Wh,E"?: number;
  "IV,16,0,0,Wh,E"?: number;
  "IV,18,0,0,Wh,E"?: number;
  "IV,20,0,0,Wh,E"?: number;
  "IV,22,0,0,Wh,E"?: number;
  "IV,24,0,0,Wh,E"?: number;
  "IV,26,0,0,Wh,E"?: number;
  "IV,28,0,0,Wh,E"?: number;
  "IV,30,0,0,Wh,E"?: number;
  "IV,3,0,0,m^3,Vol"?: number;
  "IV,5,0,0,Wh,E"?: number;
  "IV,5,0,0,m^3,Vol"?: number;
  "IV,7,0,0,Wh,E"?: number;
  "IV,7,0,0,m^3,Vol"?: number;
  "IV,9,0,0,Wh,E"?: number;
  "IV,9,0,0,m^3,Vol"?: number;
  "IV,11,0,0,Wh,E"?: number;
  "IV,11,0,0,m^3,Vol"?: number;
  "IV,13,0,0,Wh,E"?: number;
  "IV,13,0,0,m^3,Vol"?: number;
  "IV,15,0,0,Wh,E"?: number;
  "IV,15,0,0,m^3,Vol"?: number;
  "IV,17,0,0,Wh,E"?: number;
  "IV,17,0,0,m^3,Vol"?: number;
  "IV,19,0,0,Wh,E"?: number;
  "IV,19,0,0,m^3,Vol"?: number;
  "IV,21,0,0,Wh,E"?: number;
  "IV,21,0,0,m^3,Vol"?: number;
  "IV,23,0,0,Wh,E"?: number;
  "IV,23,0,0,m^3,Vol"?: number;
  "IV,25,0,0,Wh,E"?: number;
  "IV,25,0,0,m^3,Vol"?: number;
  "IV,27,0,0,Wh,E"?: number;
  "IV,27,0,0,m^3,Vol"?: number;
  "IV,29,0,0,Wh,E"?: number;
  "IV,29,0,0,m^3,Vol"?: number;
  "IV,31,0,0,Wh,E"?: number;
  "IV,31,0,0,m^3,Vol"?: number;
  "IV,0,0,0,Model/Version"?: number; // OLD format - now optional
  "IV,0,0,0,,Parameter set ident"?: number; // OLD format - now optional
  // Additional historical volume readings for water meters
  "IV,2,0,0,m^3,Vol"?: number;
  "IV,4,0,0,m^3,Vol"?: number;
  "IV,6,0,0,m^3,Vol"?: number;
  "IV,8,0,0,m^3,Vol"?: number;
  "IV,10,0,0,m^3,Vol"?: number;
  "IV,12,0,0,m^3,Vol"?: number;
  "IV,14,0,0,m^3,Vol"?: number;
  "IV,16,0,0,m^3,Vol"?: number;

}

interface DeviceTypeSummary {
  type: string;
  count: number;
  manufacturer: string;
}

interface ParsedDataState {
  data: MeterReadingType[];
  loading: boolean;
  error: string | null;
}

export interface ParseResult {
  data: MeterReadingType[];
  errors: { row: number; error: string; rawRow: any }[];
}

// Helper function to fetch and parse a single CSV file
async function fetchAndParseCsv(url: string, fileName: string): Promise<ParseResult> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName} file: ${response.statusText}`);
    }
    const csvData = await response.text();

    // if filename includes .json then parse as json otherwise parse as csv
    const parseResult = fileName.endsWith('.txt') ? JSON.parse(csvData) : parseCsv(csvData);

    if (parseResult.errors.length > 0) {
      console.warn(`Parse errors found in ${fileName}:`, parseResult.errors);
    }

    return parseResult;
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    return { data: [], errors: [{ row: 0, error: `Failed to fetch ${fileName}: ${error}`, rawRow: null }] };
  }
}

export const parseCSVs = async (props?: { meterIds?: string[] }) => {
  const { meterIds } = props || {};

  try {
    const supabase = await supabaseServer();

    // Query the parsed_data table directly
    let query = supabase
      .from('parsed_data')
      .select('device_id, device_type, manufacturer, frame_type, version, access_number, status, encryption, parsed_data');

    // If specific meter IDs are provided, filter by them
    if (meterIds && meterIds.length > 0) {
      query = query.in('device_id', meterIds);
    }

    const { data: parsedData, error } = await query;

    if (error) {
      console.error('Error fetching data from database:', error);
      return {
        data: [],
        errors: [error.message]
      };
    }

    // Transform database records to match the expected MeterReadingType format
    const transformedData = (parsedData || []).map((record: any) => {
      // Parse the parsed_data JSON to get the original CSV structure
      const parsedDataJson = record.parsed_data;

      return {
        'Frame Type': record.frame_type || parsedDataJson['Frame Type'] || '',
        'Manufacturer': record.manufacturer || parsedDataJson['Manufacturer'] || '',
        'ID': record.device_id,
        'Version': record.version || parsedDataJson['Version'] || '',
        'Device Type': record.device_type,
        'TPL-Config': parsedDataJson['TPL-Config'] || '',
        'Access Number': record.access_number || parsedDataJson['Access Number'] || 0,
        'Status': record.status || parsedDataJson['Status'] || '',
        'Encryption': record.encryption || parsedDataJson['Encryption'] || 0,
        ...parsedDataJson // Include all the original CSV columns like "IV,0,0,0,Wh,E", "IV,0,0,0,,Date/Time", etc.
      };
    }) as MeterReadingType[];

    // Filter by device types (Heat, Water, WWater, Elec) and ensure DateTime exists
    // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date or Raw Date)
    const validDeviceTypes = ['Heat', 'Water', 'WWater', 'Elec'];
    const filteredData = transformedData.filter(item =>
      validDeviceTypes.includes(item['Device Type']) &&
      (item['IV,0,0,0,,Date/Time'] || item['Actual Date'] || item['Raw Date'])
    );

    // Separate by device type for processing
    const heatMetersReadings = filteredData.filter(dt => dt['Device Type'] === 'Heat');
    const coldwaterReadings = filteredData.filter(dt => dt['Device Type'] === 'Water');
    const hotwaterReadings = filteredData.filter(dt => dt['Device Type'] === 'WWater');
    const electricityMetersReadings = filteredData.filter(dt => dt['Device Type'] === 'Elec');

    // Combine all readings for charts (only those with valid DateTime)
    // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date or Raw Date)
    const dataSentToGraphsCombiningHeatWaterWWwaterHeat = [
      ...heatMetersReadings,
      ...coldwaterReadings,
      ...hotwaterReadings,
      ...electricityMetersReadings
    ].filter(item => item["IV,0,0,0,,Date/Time"] || item["Actual Date"] || item["Raw Date"]);

    // Check if all items have DateTime (either old or new format)
    const allHaveDateTime = dataSentToGraphsCombiningHeatWaterWWwaterHeat.every(
      item => item["IV,0,0,0,,Date/Time"] || item["Actual Date"] || item["Raw Date"]
    );

    if (!allHaveDateTime) {
      console.warn("Some items are missing date/time fields (checked: IV,0,0,0,,Date/Time, Actual Date, Raw Date).");
    }

    return {
      data: dataSentToGraphsCombiningHeatWaterWWwaterHeat,
      errors: []
    };
  } catch (err) {
    console.error('Unexpected error in parseCSVs:', err);
    return {
      data: [],
      errors: [err instanceof Error ? err.message : 'Unknown error']
    };
  }
};

export async function getSignedUrlsForObject(objectId: string) {
  const supabase = await supabaseServer();
  const user = await getAuthenticatedServerUser();

  const files = await database
    .select()
    .from(documents)
    .where(
      and(eq(documents.related_id, objectId), eq(documents.user_id, user.id))
    );

  if (!files) {
    console.error("Failed to fetch document records:");
    return [];
  }

  const signedUrlsPromises = files.map(async (file) => {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("documents")
        .createSignedUrl(file.document_url, 60 * 60); // 1 hour

    if (signedUrlError) {
      console.error(
        `Failed to get signed URL for ${file.document_url}:`,
        signedUrlError.message
      );
      return null;
    }

    return {
      name: file.document_name,
      url: signedUrlData.signedUrl,
      id: file.id,
      relatedId: file.related_id,
    };
  });

  const signedUrls = await Promise.all(signedUrlsPromises);
  return signedUrls.filter((url) => url !== null);
}

export async function getAdminSignedUrlsForObject(objectId: string, userId: string) {
  const supabase = await supabaseServer();

  const files = await database
    .select()
    .from(documents)
    .where(
      and(eq(documents.related_id, objectId), eq(documents.user_id, userId))
    );

  if (!files) {
    console.error("Failed to fetch document records:");
    return [];
  }

  const signedUrlsPromises = files.map(async (file) => {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("documents")
        .createSignedUrl(file.document_url, 60 * 60); // 1 hour

    if (signedUrlError) {
      console.error(
        `Failed to get signed URL for ${file.document_url}:`,
        signedUrlError.message
      );
      return null;
    }

    return {
      name: file.document_name,
      url: signedUrlData.signedUrl,
      id: file.id,
      relatedId: file.related_id,
    };
  });

  const signedUrls = await Promise.all(signedUrlsPromises);
  return signedUrls.filter((url) => url !== null);
}

export async function getContractByID(
  contractID: string,
  withContractor = false
): Promise<{ contract: ContractType; mainContractor?: ContractorType | null }> {

  const user = await getAuthenticatedServerUser();

  const contract = await database
    .select()
    .from(contracts)
    .where(and(eq(contracts.id, contractID), eq(contracts.user_id, user.id)));

  if (!contract.length) {
    throw new Error("Contract not found");
  }

  let mainContractor = null;

  if (withContractor) {
    const contractorResult = await database
      .select()
      .from(contractors)
      .where(
        and(
          eq(contractors.contract_id, contract[0].id),
          eq(contractors.user_id, user.id)
        )
      );

    mainContractor = contractorResult[0] || null;
  }

  return { contract: contract[0], mainContractor };
}

export async function getAdminContractByID(
  contractID: string,
  userID: string,
  withContractor = false
): Promise<{ contract: ContractType; mainContractor?: ContractorType | null }> {

  const contract = await database
    .select()
    .from(contracts)
    .where(and(eq(contracts.id, contractID), eq(contracts.user_id, userID)));

  if (!contract.length) {
    throw new Error("Contract not found");
  }

  let mainContractor = null;

  if (withContractor) {
    const contractorResult = await database
      .select()
      .from(contractors)
      .where(
        and(
          eq(contractors.contract_id, contract[0].id),
          eq(contractors.user_id, userID)
        )
      );

    mainContractor = contractorResult[0] || null;
  }

  return { contract: contract[0], mainContractor };
}

export async function getContractsByLocalID(
  localID?: string,
): Promise<ContractType[]> {
  if (!localID) {
    throw new Error("Missing localID");
  }

  const user = await getAuthenticatedServerUser();

  const result = await database
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.local_id, localID),
        eq(contracts.user_id, user.id)
      )
    );

  return result;
}

export async function getAdminContractsByLocalID(
  localID?: string,
  userID?: string,
): Promise<ContractType[]> {
  if (!localID || !userID) {
    throw new Error("Missing localID or userID");
  }

  const result = await database
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.local_id, localID),
        eq(contracts.user_id, userID)
      )
    );

  return result;
}

export async function getContractsWithContractorsByLocalID(
  localID?: string,
): Promise<(ContractType & { contractors: ContractorType[] })[]> {
  if (!localID) {
    throw new Error("Missing localID");
  }

  const user = await getAuthenticatedServerUser();

  const results = await database
    .select()
    .from(contracts)
    .leftJoin(contractors, eq(contractors.contract_id, contracts.id))
    .where(
      and(
        eq(contracts.local_id, localID),
        eq(contracts.user_id, user.id)
      )
    );

  const contractsWithContractors: Record<string, ContractType & { contractors: ContractorType[] }> = {};

  for (const row of results) {
    const contract = row.contracts;
    const contractor = row.contractors;

    if (!contractsWithContractors[contract.id]) {
      contractsWithContractors[contract.id] = {
        ...contract,
        contractors: [],
      };
    }

    if (contractor) {
      contractsWithContractors[contract.id].contractors.push(contractor);
    }
  }

  return Object.values(contractsWithContractors);
}

export async function getAdminContractsWithContractorsByLocalID(
  localID?: string,
  userID?: string,
): Promise<(ContractType & { contractors: ContractorType[] })[]> {
  if (!localID || !userID) {
    throw new Error("Missing localID or userID");
  }

  const results = await database
    .select()
    .from(contracts)
    .leftJoin(contractors, eq(contractors.contract_id, contracts.id))
    .where(
      and(
        eq(contracts.local_id, localID),
        eq(contracts.user_id, userID)
      )
    );

  const contractsWithContractors: Record<string, ContractType & { contractors: ContractorType[] }> = {};

  for (const row of results) {
    const contract = row.contracts;
    const contractor = row.contractors;

    if (!contractsWithContractors[contract.id]) {
      contractsWithContractors[contract.id] = {
        ...contract,
        contractors: [],
      };
    }

    if (contractor) {
      contractsWithContractors[contract.id].contractors.push(contractor);
    }
  }

  return Object.values(contractsWithContractors);
}

export async function getActiveContractByLocalID(
  localID?: string,
): Promise<ContractType> {
  if (!localID) {
    throw new Error("Missing localID");
  }

  const user = await getAuthenticatedServerUser();

  const result = await database
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.local_id, localID),
        eq(contracts.user_id, user.id),
        eq(contracts.is_current, true),
      )
    ).then((res) => res[0]);

  return result;
}

export async function getRelatedContractors(contractID?: string): Promise<ContractorType[]> {
  if (!contractID) {
    throw new Error("Missing contractID");
  }

  const user = await getAuthenticatedServerUser();

  const contractorsData = await database
    .select()
    .from(contractors)
    .where(
      and(
        eq(contractors.contract_id, contractID),
        eq(contractors.user_id, user.id)
      )
    );

  return contractorsData;
}

export async function getAdminRelatedContractors(contractID?: string, userID?: string): Promise<ContractorType[]> {
  if (!contractID || !userID) {
    throw new Error("Missing contractID");
  }

  const contractorsData = await database
    .select()
    .from(contractors)
    .where(
      and(
        eq(contractors.contract_id, contractID),
        eq(contractors.user_id, userID)
      )
    );

  return contractorsData;
}

export async function getObjekts(): Promise<ObjektType[]> {
  const user = await getAuthenticatedServerUser();

  // Get user role and agency_id
  const [userResult] = await database
    .select({
      permission: users.permission,
      agency_id: users.agency_id
    })
    .from(users)
    .where(eq(users.id, user.id));

  const userRole = userResult?.permission || 'user';
  const agencyId = userResult?.agency_id;

  let objekts: ObjektType[];

  if (userRole === 'super_admin') {
    // Super admin: return ALL properties
    objekts = await database
      .select()
      .from(objekte);
  }
  else if ((userRole === 'agency_admin' || userRole === 'admin') && agencyId) {
    // Agency admin & admin: return properties assigned to their agency or properties they own
    objekts = await database
      .select()
      .from(objekte)
      .where(eq(objekte.agency_id, agencyId));
  }
  else {
    // Regular user: return only their own properties
    objekts = await database
      .select()
      .from(objekte)
      .where(eq(objekte.user_id, user.id));
  }

  return objekts;
}



export async function getObjektsByUserID(userID: string): Promise<ObjektType[]> {
  const [userResult] = await database
    .select({
      permission: users.permission,
      agency_id: users.agency_id
    })
    .from(users)
    .where(eq(users.id, userID));

  const userRole = userResult?.permission || 'user';
  const agencyId = userResult?.agency_id;

  // If querying own data, return owned properties
  // If querying another user, only super/agency admin should call this
  if (userRole === 'user') {
    return database
      .select()
      .from(objekte)
      .where(eq(objekte.user_id, userID));
  }

  // Agency admin or admin: return their agency's or user's properties
  if ((userRole === 'agency_admin' || userRole === 'admin') && agencyId) {
    return database
      .select()
      .from(objekte)
      .where(eq(objekte.agency_id, agencyId));
  }

  // Super admin: return all
  return database
    .select()
    .from(objekte);
}


export async function getObjektsWithLocalsByUserID(userID: string): Promise<any[]> {
  const objekts = await database
    .select()
    .from(objekte)
    .where(eq(objekte.user_id, userID));

  if (!objekts || objekts.length === 0) {
    return [];
  }
  const objektsWithLocals = await Promise.all(
    objekts.map(async (objekt) => {
      const localsData = await database
        .select()
        .from(locals)
        .where(eq(locals.objekt_id, objekt.id));

      return { ...objekt, locals: localsData || [] };
    })
  );

  return objektsWithLocals;
}

export async function getObjektsWithLocals(): Promise<any[]> {
  const user = await getAuthenticatedServerUser();
  const objekts = await database
    .select()
    .from(objekte)
    .where(eq(objekte.user_id, user.id));

  if (!objekts || objekts.length === 0) {
    return [];
  }
  const objektsWithLocals = await Promise.all(
    objekts.map(async (objekt) => {
      const localsData = await database
        .select()
        .from(locals)
        .where(eq(locals.objekt_id, objekt.id));

      return { ...objekt, locals: localsData || [] };
    })
  );

  return objektsWithLocals;
}

export async function getDocumentsByUserId(userId: string): Promise<any[]> {
  const userDocuments = await database
    .select()
    .from(documents)
    .where(eq(documents.user_id, userId))
    .orderBy(documents.created_at);

  if (!userDocuments || userDocuments.length === 0) {
    return [];
  }
  const heatingBillIds = userDocuments
    .filter(doc => doc.related_type === "heating_bill")
    .map(doc => doc.related_id);

  let heatingBillObjekts: Record<string, string> = {};
  if (heatingBillIds.length > 0) {
    const heatingBills = await database
      .select({ id: heating_bill_documents.id, objekt_id: heating_bill_documents.objekt_id })
      .from(heating_bill_documents)
      .where(inArray(heating_bill_documents.id, heatingBillIds));

    heatingBillObjekts = heatingBills.reduce((acc, bill) => {
      if (bill.objekt_id) {
        acc[bill.id] = bill.objekt_id;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  const operatingCostIds = userDocuments
    .filter(doc => doc.related_type === "operating_costs")
    .map(doc => doc.related_id);

  let operatingCostObjekts: Record<string, string> = {};
  if (operatingCostIds.length > 0) {
    const operatingCosts = await database
      .select({ id: operating_cost_documents.id, objekt_id: operating_cost_documents.objekt_id })
      .from(operating_cost_documents)
      .where(inArray(operating_cost_documents.id, operatingCostIds));

    operatingCostObjekts = operatingCosts.reduce((acc, cost) => {
      if (cost.objekt_id) {
        acc[cost.id] = cost.objekt_id;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  return userDocuments.map(doc => ({
    ...doc,
    objekt_id: doc.related_type === "heating_bill"
      ? heatingBillObjekts[doc.related_id] || null
      : doc.related_type === "operating_costs"
        ? operatingCostObjekts[doc.related_id] || null
        : null
  }));
}

export async function getCurrentUserDocuments(): Promise<any[]> {
  // Get current user
  const user = await getAuthenticatedServerUser();

  // Get documents for the current user using direct database query
  const userDocuments = await database
    .select()
    .from(documents)
    .where(eq(documents.user_id, user.id))
    .orderBy(documents.created_at);

  if (!userDocuments || userDocuments.length === 0) {
    return [];
  }
  const heatingBillIds = userDocuments
    .filter(doc => doc.related_type === "heating_bill")
    .map(doc => doc.related_id);

  let heatingBillObjekts: Record<string, string> = {};
  if (heatingBillIds.length > 0) {
    const heatingBills = await database
      .select({ id: heating_bill_documents.id, objekt_id: heating_bill_documents.objekt_id })
      .from(heating_bill_documents)
      .where(inArray(heating_bill_documents.id, heatingBillIds));

    heatingBillObjekts = heatingBills.reduce((acc, bill) => {
      if (bill.objekt_id) {
        acc[bill.id] = bill.objekt_id;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  const operatingCostIds = userDocuments
    .filter(doc => doc.related_type === "operating_costs")
    .map(doc => doc.related_id);

  let operatingCostObjekts: Record<string, string> = {};
  if (operatingCostIds.length > 0) {
    const operatingCosts = await database
      .select({ id: operating_cost_documents.id, objekt_id: operating_cost_documents.objekt_id })
      .from(operating_cost_documents)
      .where(inArray(operating_cost_documents.id, operatingCostIds));

    operatingCostObjekts = operatingCosts.reduce((acc, cost) => {
      if (cost.objekt_id) {
        acc[cost.id] = cost.objekt_id;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  return userDocuments.map(doc => ({
    ...doc,
    objekt_id: doc.related_type === "heating_bill"
      ? heatingBillObjekts[doc.related_id] || null
      : doc.related_type === "operating_costs"
        ? operatingCostObjekts[doc.related_id] || null
        : null
  }));
}

export async function getUsers(): Promise<UserType[]> {

  const basicUsers = await database
    .select()
    .from(users)
    .where(eq(users.permission, "user"));

  return basicUsers;
}

export async function getUserData(): Promise<UserType> {
  const user = await getAuthenticatedServerUser();

  const data = await database
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .then((res) => res[0]);

  return data;
}

export async function getAdminUserData(userID: string): Promise<UserType> {

  const data = await database
    .select()
    .from(users)
    .where(eq(users.id, userID))
    .then((res) => res[0]);

  return data;
}

export async function getObjectById(objectId: string): Promise<ObjektType> {
  const object = await database
    .select()
    .from(objekte)
    .where(eq(objekte.id, objectId))
    .then((res) => res[0]);

  return object;
}

export async function getRelatedLocalsByObjektId(objektID: string): Promise<LocalType[]> {
  const relatedLocals = await database
    .select()
    .from(locals)
    .where(eq(locals.objekt_id, objektID));

  return relatedLocals;
}

export async function getRelatedLocalsWithContractsByObjektId(objektID: string): Promise<
  (LocalType & { contracts: ContractType[] })[]
> {
  const results = await database
    .select()
    .from(locals)
    .leftJoin(contracts, and(
      eq(contracts.local_id, locals.id)
    ))
    .where(eq(locals.objekt_id, objektID));

  const localsWithContracts: Record<string, LocalType & { contracts: ContractType[] }> = {};

  for (const row of results) {
    const local = row.locals;
    const contract = row.contracts;

    if (!localsWithContracts[local.id]) {
      localsWithContracts[local.id] = {
        ...local,
        contracts: [],
      };
    }

    if (contract) {
      localsWithContracts[local.id].contracts.push(contract);
    }
  }

  return Object.values(localsWithContracts);
}


export async function getLocalById(localId: string): Promise<LocalType> {

  const local = await database
    .select()
    .from(locals)
    .where(eq(locals.id, localId))
    .then((res) => res[0]);

  return local;
}

export async function getLocalWithContractsById(
  localId: string
): Promise<(LocalType & { contracts: ContractType[] }) | null> {
  const local = await database
    .select()
    .from(locals)
    .where(eq(locals.id, localId))
    .then((res) => res[0]);

  if (!local) return null;

  const relatedContracts = await database
    .select()
    .from(contracts)
    .where(eq(contracts.local_id, localId));

  return {
    ...local,
    contracts: relatedContracts,
  };
}

export async function getMetersByLocalId(localId: string): Promise<LocalMeterType[]> {

  const meters = await database
    .select()
    .from(local_meters)
    .where(eq(local_meters.local_id, localId));

  return meters;
}

export async function getMetersByLocalIds(localIds: string[]): Promise<LocalMeterType[]> {
  if (localIds.length === 0) {
    return [];
  }

  const meters = await database
    .select()
    .from(local_meters)
    .where(inArray(local_meters.local_id, localIds));

  return meters;
}

export async function getDocCostCategoryTypes(
  documentType: "betriebskostenabrechnung" | "heizkostenabrechnung" = "betriebskostenabrechnung",
  userIdParam?: string
): Promise<DocCostCategoryType[]> {
  const user = await getAuthenticatedServerUser();

  const isAdmin = await isAdminUser(user.id);

  const userIdToQuery = isAdmin && userIdParam ? userIdParam : user.id;

  const types = await database
    .select()
    .from(doc_cost_category)
    .where(
      and(
        eq(doc_cost_category.document_type, documentType),
        eq(doc_cost_category.user_id, userIdToQuery)
      )
    );

  return types;
}

export async function getOperatingCostDocumentByID(docId: string): Promise<OperatingCostDocumentType> {
  const user = await getAuthenticatedServerUser();

  const document = await database
    .select()
    .from(operating_cost_documents)
    .where(and(eq(operating_cost_documents.id, docId), eq(operating_cost_documents.user_id, user.id)))
    .then((res) => res[0]);

  return document;
}

export async function getInvoicesByOperatingCostDocumentID(docId: string): Promise<InvoiceDocumentType[]> {
  const user = await getAuthenticatedServerUser();

  const invoices = await database
    .select()
    .from(invoice_documents)
    .where(and(eq(invoice_documents.operating_doc_id, docId), eq(invoice_documents.user_id, user.id)));

  return invoices;
}

export async function getHeatingBillDocumentByID(docId: string): Promise<HeatingBillDocumentType> {
  const user = await getAuthenticatedServerUser();

  const document = await database
    .select()
    .from(heating_bill_documents)
    .where(and(eq(heating_bill_documents.id, docId), eq(heating_bill_documents.user_id, user.id)))
    .then((res) => res[0]);

  return document;
}

export async function getAdminHeatingBillDocumentByID(docId: string, userId: string): Promise<HeatingBillDocumentType> {

  const document = await database
    .select()
    .from(heating_bill_documents)
    .where(and(eq(heating_bill_documents.id, docId), eq(heating_bill_documents.user_id, userId)))
    .then((res) => res[0]);

  return document;
}

export async function getInvoicesByHeatingBillDocumentID(docId: string): Promise<InvoiceDocumentType[]> {
  const user = await getAuthenticatedServerUser();

  const invoices = await database
    .select()
    .from(invoice_documents)
    .where(and(eq(invoice_documents.operating_doc_id, docId), eq(invoice_documents.user_id, user.id)));

  return invoices;
}

export async function getAdminInvoicesByHeatingBillDocumentID(docId: string, userId: string): Promise<InvoiceDocumentType[]> {

  const invoices = await database
    .select()
    .from(invoice_documents)
    .where(and(eq(invoice_documents.operating_doc_id, docId), eq(invoice_documents.user_id, userId)));

  return invoices;
}

export async function getHeatingInvoicesByHeatingBillDocumentID(docId: string): Promise<HeatingInvoiceType[]> {
  const user = await getAuthenticatedServerUser();

  const invoices = await database
    .select()
    .from(heating_invoices)
    .where(and(eq(heating_invoices.heating_doc_id, docId), eq(heating_invoices.user_id, user.id)));

  return invoices;
}

export async function getAdminHeatingInvoicesByHeatingBillDocumentID(docId: string, userId: string): Promise<HeatingInvoiceType[]> {

  const invoices = await database
    .select()
    .from(heating_invoices)
    .where(and(eq(heating_invoices.heating_doc_id, docId), eq(heating_invoices.user_id, userId)));

  return invoices;
}
