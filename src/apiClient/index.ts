"use client";

import type { UploadDocumentArgs } from "@/types";
import { sanitizeFileName } from "@/utils/client";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

async function getTenantsByLocalID(localID: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("local_id", localID)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch tenants: ${error.message}`);
  }

  return data;
}

export function useTenantsByLocalID(localID: string) {
  return useQuery({
    queryKey: ["tenants", localID],
    queryFn: () => getTenantsByLocalID(localID),
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
