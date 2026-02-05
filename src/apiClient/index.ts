"use client";

import type { ContractorType, ContractType, HeatingBillDocumentType, InvoiceDocumentType, LocalType, ObjektType, OperatingCostDocumentType, UploadDocumentArgs, UserType } from "@/types";
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

async function getAdminContractsByLocalID(localID?: string, userID?: string): Promise<ContractType[]> {

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("local_id", localID)
    .eq("user_id", userID);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useAdminContractsByLocalID(localID?: string, userID?: string) {
  return useQuery({
    queryKey: ["contracts", localID],
    queryFn: () => getAdminContractsByLocalID(localID, userID),
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

async function getAdminContractorsByContractID(contractID?: string, userID?: string): Promise<ContractorType[]> {

  const { data, error } = await supabase
    .from("contractors")
    .select("*")
    .eq("contract_id", contractID)
    .eq("user_id", userID);

  if (error) {
    throw new Error(`Failed to fetch contractors: ${error.message}`);
  }

  return data;
}

export function useAdminContractorsByContractID(contractID?: string, userID?: string) {
  return useQuery({
    queryKey: ["contractors", contractID, userID],
    queryFn: () => getAdminContractorsByContractID(contractID, userID),
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

async function getUserDocuments(): Promise<any[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return data || [];
}

export function useUserDocuments() {
  return useQuery({
    queryKey: ["user_documents"],
    queryFn: () => getUserDocuments(),
    refetchOnWindowFocus: false,
  });
}

async function getUserDocumentsByType(documentType: string): Promise<any[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("related_type", documentType)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return data || [];
}

export function useUserDocumentsByType(documentType: string) {
  return useQuery({
    queryKey: ["user_documents", documentType],
    queryFn: () => getUserDocumentsByType(documentType),
    refetchOnWindowFocus: false,
  });
}

export const getDocumentDownloadUrl = async (documentPath: string): Promise<string> => {
  const data = await supabase.storage
    .from("documents")
    .createSignedUrl(documentPath, 60 * 60, {download: true});

    if (data.error) {
      throw new Error(`Failed to fetch document download URL: ${data.error.message}`);
    }

  return data.data.signedUrl;
};

export const getDocumentViewUrl = async (documentPath: string): Promise<string> => {
  const data = await supabase.storage
    .from("documents")
    .createSignedUrl(documentPath, 60 * 60);

    if (data.error) {
      throw new Error(`Failed to fetch document view URL: ${data.error.message}`);
    }

  return data.data.signedUrl;
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
    throw new Error(`Failed to fetch objekts: ${error.message}`);
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

async function getUsersObjektsWithLocals(user_id?: string) {

  if (!user_id) {
    throw new Error("User ID is required to fetch objekts");
  }

  const { data, error } = await supabase
    .from("objekte")
    .select("*, locals(*)")
    .eq("user_id", user_id);

  if (error) {
    throw new Error(`Failed to fetch objekts: ${error.message}`);
  }

  return data;
}

export function useUsersObjektsWithLocals(user_id?: string) {
  return useQuery({
    queryKey: ["objekts_with_locals", user_id],
    queryFn: () => getUsersObjektsWithLocals(user_id),
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

async function getAuthenticatedUserData(): Promise<UserType> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth_user"],
    queryFn: getAuthenticatedUserData,
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

async function getHeatingBillDocumentsByLocalID(localID?: string): Promise<HeatingBillDocumentType[]> {

  const { data, error } = await supabase
    .from("heating_bill_documents")
    .select("*")
    .eq("local_id", localID)
    .eq("submited", false);

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useHeatingBillDocumentsByLocalID(localID?: string) {
  return useQuery({
    queryKey: ["heating_bill_documents", localID],
    queryFn: () => getHeatingBillDocumentsByLocalID(localID),
    refetchOnWindowFocus: false,
  });
}

async function getHeatingBillDocumentsByObjektID(objectID?: string): Promise<HeatingBillDocumentType[]> {

  const { data, error } = await supabase
    .from("heating_bill_documents")
    .select("*")
    .eq("objekt_id", objectID)
    .eq("submited", false);

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useHeatingBillDocumentsByObjektID(objectID?: string) {
  return useQuery({
    queryKey: ["heating_bill_documents", objectID],
    queryFn: () => getHeatingBillDocumentsByObjektID(objectID),
    refetchOnWindowFocus: false,
  });
}

async function getHeatingBillBuildingDocumentsByObjektID(objectID?: string): Promise<HeatingBillDocumentType[]> {

  const { data, error } = await supabase
    .from("heating_bill_documents")
    .select("*")
    .eq("objekt_id", objectID)
    .is("local_id", null)
    .eq("submited", false);

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useHeatingBillBuildingDocumentsByObjektID(objectID?: string) {
  return useQuery({
    queryKey: ["heating_bill_building_documents", objectID],
    queryFn: () => getHeatingBillBuildingDocumentsByObjektID(objectID),
    refetchOnWindowFocus: false,
    enabled: !!objectID,
  });
}


export async function uploadObjektImage(file: File, objektId: string): Promise<string> {
  const filePath = `images/${objektId}/${file.name}`;

  const { error } = await supabase
    .storage
    .from("buildings")
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase
    .storage
    .from("buildings")
    .getPublicUrl(filePath);

  if (!data?.publicUrl) throw new Error("Could not get public URL");

  return data.publicUrl;
}

/**
 * Admin version of uploadObjektImage that uses server-side API route
 * to bypass RLS policies - allows super admins to upload images
 * for any building regardless of ownership
 */
export async function adminUploadObjektImage(file: File, objektId: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("objektId", objektId);

  const response = await fetch("/api/admin/upload-building-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data.publicUrl;
}

async function getBasicUsers(): Promise<UserType[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("permission", "user")

  if (error) {
    throw new Error(`Failed to fetch objects: ${error.message}`);
  }

  return data;
}

export function useBasicUsers() {
  return useQuery({
    queryKey: ["basic_users"],
    queryFn: getBasicUsers,
    refetchOnWindowFocus: false,
  });
}