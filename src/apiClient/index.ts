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
