import { supabase } from "@/utils/supabase/client";
import { getAuthenticatedUser } from "@/utils/auth";

export interface DocumentUploadResult {
  id: string;
  document_name: string;
  document_url: string;
  publicUrl: string;
  related_id: string;
  related_type: string;
  created_at: string;
}

export interface DocumentMetadata {
  id: string;
  document_name: string;
  document_url: string;
  related_id: string;
  related_type: string;
  created_at: string;
  user_id: string;
  objekt_id?: string | null;
  local_id?: string | null;
}

export class DocumentService {

  /**
   * Get all documents for the current user with objekt information
   */
  static async getUserDocuments(): Promise<DocumentMetadata[]> {
    try {
      const user = await getAuthenticatedUser();

      // Get basic documents first
      const { data: documents, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }
      
      if (!documents || documents.length === 0) {
        return [];
      }

      // Get objekt information for heating bill documents using separate query
      const heatingBillIds = documents
        .filter(doc => doc.related_type === "heating_bill")
        .map(doc => doc.related_id);

      let heatingBillData: Record<string, { objekt_id: string; local_id: string | null }> = {};
      if (heatingBillIds.length > 0) {
        const { data: heatingBills, error: heatingError } = await supabase
          .from("heating_bill_documents")
          .select("id, objekt_id, local_id")
          .in("id", heatingBillIds);

        if (!heatingError && heatingBills) {
          heatingBillData = heatingBills.reduce((acc, bill) => {
            if (bill.objekt_id) {
              acc[bill.id] = { objekt_id: bill.objekt_id, local_id: bill.local_id };
            }
            return acc;
          }, {} as Record<string, { objekt_id: string; local_id: string | null }>);
        }
      }

      // Get objekt information for operating cost documents using separate query
      const operatingCostIds = documents
        .filter(doc => doc.related_type === "operating_costs")
        .map(doc => doc.related_id);

      let operatingCostObjekts: Record<string, string> = {};
      if (operatingCostIds.length > 0) {
        const { data: operatingCosts, error: operatingError } = await supabase
          .from("operating_cost_documents")
          .select("id, objekt_id")
          .in("id", operatingCostIds);

        if (!operatingError && operatingCosts) {
          operatingCostObjekts = operatingCosts.reduce((acc, cost) => {
            if (cost.objekt_id) {
              acc[cost.id] = cost.objekt_id;
            }
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Combine documents with objekt information
      return documents.map(doc => ({
        ...doc,
        objekt_id: doc.related_type === "heating_bill" 
          ? heatingBillData[doc.related_id]?.objekt_id || null
          : doc.related_type === "operating_costs"
          ? operatingCostObjekts[doc.related_id] || null
          : null,
        local_id: doc.related_type === "heating_bill"
          ? heatingBillData[doc.related_id]?.local_id || null
          : null
      }));
    } catch (error) {
      console.error("Error fetching user documents:", error);
      throw error;
    }
  }

  /**
   * Get documents by type for the current user
   */
  static async getUserDocumentsByType(documentType: string): Promise<DocumentMetadata[]> {
    try {
      const user = await getAuthenticatedUser();

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("related_type", documentType)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch documents by type: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching documents by type:", error);
      throw error;
    }
  }

  static async getDocumentsByUserId(targetUserId: string): Promise<DocumentMetadata[]> {
    try {
      const currentUser = await getAuthenticatedUser();
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("permission")
        .eq("id", currentUser.id)
        .single();

      if (userError || !userData || userData.permission !== "admin") {
        throw new Error("Unauthorized: Only admin users can access other users' documents");
      }

      const { data: documents, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }
      
      if (!documents || documents.length === 0) {
        return [];
      }

      const heatingBillIds = documents
        .filter(doc => doc.related_type === "heating_bill")
        .map(doc => doc.related_id);

      let heatingBillData: Record<string, { objekt_id: string; local_id: string | null }> = {};
      if (heatingBillIds.length > 0) {
        const { data: heatingBills, error: heatingError } = await supabase
          .from("heating_bill_documents")
          .select("id, objekt_id, local_id")
          .in("id", heatingBillIds);

        if (!heatingError && heatingBills) {
          heatingBillData = heatingBills.reduce((acc, bill) => {
            if (bill.objekt_id) {
              acc[bill.id] = { objekt_id: bill.objekt_id, local_id: bill.local_id };
            }
            return acc;
          }, {} as Record<string, { objekt_id: string; local_id: string | null }>);
        }
      }

      const operatingCostIds = documents
        .filter(doc => doc.related_type === "operating_costs")
        .map(doc => doc.related_id);

      let operatingCostObjekts: Record<string, string> = {};
      if (operatingCostIds.length > 0) {
        const { data: operatingCosts, error: operatingError } = await supabase
          .from("operating_cost_documents")
          .select("id, objekt_id")
          .in("id", operatingCostIds);

        if (!operatingError && operatingCosts) {
          operatingCostObjekts = operatingCosts.reduce((acc, cost) => {
            if (cost.objekt_id) {
              acc[cost.id] = cost.objekt_id;
            }
            return acc;
          }, {} as Record<string, string>);
        }
      }

      return documents.map(doc => ({
        ...doc,
        objekt_id: doc.related_type === "heating_bill" 
          ? heatingBillData[doc.related_id]?.objekt_id || null
          : doc.related_type === "operating_costs"
          ? operatingCostObjekts[doc.related_id] || null
          : null,
        local_id: doc.related_type === "heating_bill"
          ? heatingBillData[doc.related_id]?.local_id || null
          : null
      }));
    } catch (error) {
      console.error("Error fetching user documents by ID:", error);
      throw error;
    }
  }
  
  static async getDocumentFileSize(documentPath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .list(documentPath.split('/').slice(0, -1).join('/'), {
          limit: 100,
          offset: 0,
        });

      if (error) {
        throw new Error(`Failed to get file info: ${error.message}`);
      }

      const fileName = documentPath.split('/').pop();
      const file = data?.find(item => item.name === fileName);
      
      if (file && file.metadata?.size) {
        const sizeInBytes = parseInt(file.metadata.size);
        return this.formatFileSize(sizeInBytes);
      }

      return '--';
    } catch (error) {
      console.error("Error getting file size:", error);
      return '--';
    }
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
