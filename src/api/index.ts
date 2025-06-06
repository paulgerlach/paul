import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import database from "@/db";
import { documents, contracts, contractors } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";

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

export async function getContractsByLocalIDWithAuth(localID: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const result = await database
    .select()
    .from(contracts)
    .where(
      and(eq(contracts.local_id, localID), eq(contracts.user_id, user.id))
    );

  return result;
}

export async function getSignedUrlsForObject(objectId: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

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

export async function getContractByID(
  contractID: string,
  withContractor = false
) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

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

export async function getRelatedContractors(contractID: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

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
