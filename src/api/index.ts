import Papa from "papaparse";
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
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";
import { isAdminUser } from "@/auth";
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
  "IV,0,0,0,,Date/Time": string;
  "IV,0,0,0,Wh,E"?: number; // Energy in Wh (for heat meters)
  "IV,0,0,0,m^3,Vol": number; // Volume in cubic meters
  "IV,0,0,0,,ErrorFlags(binary)(deviceType specific)": string;
  "IV,1,0,0,,Date": string;
  "IV,1,0,0,Wh,E"?: number;
  "IV,1,0,0,m^3,Vol"?: number;
  "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)"?: number;
  "IV,3,0,0,Wh,E"?: number;
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
  "IV,0,0,0,Model/Version": number;
  "IV,0,0,0,,Parameter set ident": number;
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

export const parseCSV = async () => {
  const fileId = '17iIcdqghLw5n7fpomYK-Fyl41iQqP-Rl';
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  try {
    // Read the CSV file
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const csvData = await response.text();

    const parseResult = Papa.parse<MeterReadingType>(csvData, {
      header: true, // First row contains headers
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: ";", // Your data uses semicolon delimiter
      transformHeader: (header) => header.trim(), // Clean whitespace from headers
    });

    if (parseResult.errors.length > 0) {
      console.warn("Parse warnings:", parseResult.errors);
    }

    // The parsed data is already an array of objects
    const dataArray = parseResult.data.filter(
      (row) =>
        // Filter out any empty rows or rows without Frame Type
        row && row["Frame Type"] && row["Frame Type"] !== ""
    );

    return dataArray;
  } catch (err) {
    console.log(err);
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

  const [result] = await database
    .select({ permission: users.permission })
    .from(users)
    .where(eq(users.id, user.id));

  const userPermission = result?.permission;

  let objekts;

  if (userPermission === 'admin') {
    objekts = await database
      .select()
      .from(objekte);
  } else {
    objekts = await database
      .select()
      .from(objekte)
      .where(eq(objekte.user_id, user.id));
  }

  return objekts;
}

export async function getObjektsByUserID(userID: string): Promise<ObjektType[]> {

  const objekts = await database
    .select()
    .from(objekte)
    .where(eq(objekte.user_id, userID));


  return objekts;
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

export async function getInvoicesByHeatingBillDocumentID(docId: string): Promise<InvoiceDocumentType[]> {
  const user = await getAuthenticatedServerUser();

  const invoices = await database
    .select()
    .from(invoice_documents)
    .where(and(eq(invoice_documents.operating_doc_id, docId), eq(invoice_documents.user_id, user.id)));

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
