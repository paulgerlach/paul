"use client";

import type { ContractorType, ContractType, InvoiceDocumentType, LocalType, ObjektType, OperatingCostDocumentType, UploadDocumentArgs } from "@/types";
import { getAuthenticatedUser } from "@/utils/auth";
import { sanitizeFileName } from "@/utils/client";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

async function getContractsByLocalID(localID?: string): Promise<ContractType[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("local_id", localID)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useContractsByLocalID(localID?: string) {
  return useQuery({
    queryKey: ["contracts", localID],
    queryFn: () => getContractsByLocalID(localID),
    refetchOnWindowFocus: false,
  });
}

async function getLocalsByObjektID(objektID?: string): Promise<LocalType[]> {

  const { data, error } = await supabase
    .from("locals")
    .select("*")
    .eq("objekt_id", objektID);

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useLocalsByObjektID(objektID?: string) {
  return useQuery({
    queryKey: ["locals", objektID],
    queryFn: () => getLocalsByObjektID(objektID),
    refetchOnWindowFocus: false,
  });
}

async function getContractorsByContractID(contractID?: string): Promise<ContractorType[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("contractors")
    .select("*")
    .eq("contract_id", contractID)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contractors: ${error.message}`);
  }

  return data;
}

export function useContractorsByContractID(contractID?: string) {
  return useQuery({
    queryKey: ["contractors", contractID],
    queryFn: () => getContractorsByContractID(contractID),
    refetchOnWindowFocus: false,
  });
}

export const useUploadDocuments = () => {
  return useMutation({
    mutationFn: async ({
      files,
      relatedId,
      relatedType,
    }: UploadDocumentArgs) => {
      const uploaded = [];

      const user = await getAuthenticatedUser();

      for (const file of files) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const fullFileName = `${relatedId}_${sanitizedFileName}`;
        const path = `${user.id}/${fullFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file, {
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { error: insertError } = await supabase.from("documents").insert({
          document_name: file.name,
          document_url: path,
          related_id: relatedId,
          related_type: relatedType,
          user_id: user.id,
        });

        if (insertError) {
          throw new Error(`Insert failed: ${insertError.message}`);
        }

        uploaded.push({ path, name: file.name });
      }

      return uploaded;
    },
  });
};

export const fetchStreetsByZip = async (zip: string): Promise<string[]> => {
  const res = await fetch(
    `https://openplzapi.org/de/Streets?postalCode=${zip}`
  );
  if (!res.ok) throw new Error("Failed to fetch streets");
  return res.json();
};

async function getObjektsWithLocals() {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("objekte")
    .select("*, locals(*)")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useObjektsWithLocals() {
  return useQuery({
    queryKey: ["objekts_with_locals"],
    queryFn: () => getObjektsWithLocals(),
    refetchOnWindowFocus: false,
  });
}

async function getDocCostCategoryTypes(documentType: "betriebskostenabrechnung" | "heizkostenabrechnung") {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("doc_cost_category")
    .select("*")
    .eq("document_type", documentType)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useDocCostCategoryTypes(documentType: "betriebskostenabrechnung" | "heizkostenabrechnung" = "betriebskostenabrechnung") {
  return useQuery({
    queryKey: ["doc_cost_user_category", documentType],
    queryFn: () => getDocCostCategoryTypes(documentType),
    refetchOnWindowFocus: false,
  });
}

async function getOperatingCostDocumentByID({ id }: { id: string }): Promise<OperatingCostDocumentType> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("operating_cost_documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useOperatingCostDocumentByID(docId: string) {
  return useQuery({
    queryKey: ["operating_cost_document", docId],
    queryFn: () => getOperatingCostDocumentByID({ id: docId }),
    refetchOnWindowFocus: false,
  });
}

async function getInvoicesByOperatingCostDocumentID({ id }: { id: string }): Promise<InvoiceDocumentType[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("invoice_documents")
    .select("*")
    .eq("operating_doc_id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useInvoicesByOperatingCostDocumentID(docId: string) {
  return useQuery({
    queryKey: ["invoice_documents", docId],
    queryFn: () => getInvoicesByOperatingCostDocumentID({ id: docId }),
    refetchOnWindowFocus: false,
  });
}

async function getLocalByID(localID: string): Promise<LocalType> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("locals")
    .select("*")
    .eq("id", localID)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch local: ${error.message}`);
  }

  return data;
}

export function useLocalByID(localID?: string) {
  return useQuery({
    queryKey: ["local", localID],
    queryFn: () => getLocalByID(localID!),
    enabled: !!localID,
    refetchOnWindowFocus: false,
  });
}

async function getObjectById(objectID: string): Promise<ObjektType> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("objekte")
    .select("*")
    .eq("id", objectID)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch local: ${error.message}`);
  }

  return data;
}

export function useObjectById(objectID?: string) {
  return useQuery({
    queryKey: ["local", objectID],
    queryFn: () => getObjectById(objectID!),
    enabled: !!objectID,
    refetchOnWindowFocus: false,
  });
}

async function getOperatingCostDocumentsByObjektID(objektID?: string): Promise<OperatingCostDocumentType[]> {

  const { data, error } = await supabase
    .from("operating_cost_documents")
    .select("*")
    .eq("objekt_id", objektID)
    .eq("submited", false);

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useOperatingCostDocumentsByObjektID(objektID?: string) {
  return useQuery({
    queryKey: ["operating_cost_documents", objektID],
    queryFn: () => getOperatingCostDocumentsByObjektID(objektID),
    refetchOnWindowFocus: false,
  });
}