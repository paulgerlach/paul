"use client";

import type { UploadDocumentArgs } from "@/types";
import { sanitizeFileName } from "@/utils/client";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

async function getContractsByLocalID(localID?: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

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

async function getContractorsByContractID(contractID?: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

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

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Unauthorized");
      }

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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

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

async function getBasicBetriebskostenabrechnungDocCostCategoryTypes() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("doc_cost_category")
    .select("*")
    .eq("document_type", "betriebskostenabrechnung")
    .eq("user_id", null);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useBasicBetriebskostenabrechnungDocCostCategoryTypes() {
  return useQuery({
    queryKey: ["doc_cost_category_betriebskostenabrechnung"],
    queryFn: () => getBasicBetriebskostenabrechnungDocCostCategoryTypes(),
    refetchOnWindowFocus: false,
  });
}

async function getBasicHeizkostenabrechnungDocCostCategoryTypes() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("doc_cost_category")
    .select("*")
    .eq("document_type", "heizkostenabrechnung")
    .eq("user_id", null);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useBasicHeizkostenabrechnungDocCostCategoryTypes() {
  return useQuery({
    queryKey: ["doc_cost_category_heizkostenabrechnung"],
    queryFn: () => getBasicHeizkostenabrechnungDocCostCategoryTypes(),
    refetchOnWindowFocus: false,
  });
}

async function getUserBetriebskostenabrechnungDocCostCategoryTypes() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("doc_cost_category")
    .select("*")
    .eq("document_type", "betriebskostenabrechnung")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useUserBetriebskostenabrechnungDocCostCategoryTypes() {
  return useQuery({
    queryKey: ["doc_cost_user_category_betriebskostenabrechnung"],
    queryFn: () => getUserBetriebskostenabrechnungDocCostCategoryTypes(),
    refetchOnWindowFocus: false,
  });
}

async function getUserHeizkostenabrechnungDocCostCategoryTypes() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("doc_cost_category")
    .select("*")
    .eq("document_type", "heizkostenabrechnung")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`);
  }

  return data;
}

export function useUserHeizkostenabrechnungDocCostCategoryTypes() {
  return useQuery({
    queryKey: ["doc_cost_user_category_heizkostenabrechnung"],
    queryFn: () => getUserHeizkostenabrechnungDocCostCategoryTypes(),
    refetchOnWindowFocus: false,
  });
}
