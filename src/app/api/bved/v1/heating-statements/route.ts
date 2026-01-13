import { NextResponse } from "next/server";
import database from "@/db";
import {
  heating_bill_documents,
  heating_invoices,
  objekte,
  locals,
} from "@/db/drizzle/schema";
import { eq, inArray, and, gte, lte } from "drizzle-orm";
import { requireExternalAuth, formatError, createResponse } from "../_lib/auth";

/**
 * GET /api/bved/v1/heating-statements
 * 
 * Returns heating statements (heating bill documents) scoped to properties owned by the token's user.
 * Includes related invoices if available.
 * 
 * Query parameters:
 * - format: "internal" | "bved" (default: "internal")
 * - property_id: Optional filter by specific property UUID
 * - local_id: Optional filter by specific unit UUID
 * - start_date: Optional filter by start date (ISO 8601)
 * - end_date: Optional filter by end date (ISO 8601)
 * - limit: Maximum number of records (default: 100, max: 500)
 * 
 * Data Scoping:
 * Only returns heating statements for properties where objekte.user_id = token.user_id
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireExternalAuth(request);
    const { token, tokenRateLimit, ipRateLimit } = authResult;

    // Scoped access - require user_id from token
    if (!token || !token.user_id) {
      return createResponse(
        {
          error: {
            code: "UNAUTHORIZED",
            message:
              "Token does not include user context. Database tokens required for scoped access.",
          },
        },
        401,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "internal";
    const propertyId = url.searchParams.get("property_id");
    const localId = url.searchParams.get("local_id");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 100, 500) : 100;

    // Step 1: Get all properties owned by token user
    const userProperties = await database
      .select({ id: objekte.id })
      .from(objekte)
      .where(eq(objekte.user_id, token.user_id));

    if (userProperties.length === 0) {
      return createResponse(
        { heating_statements: [] },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    const propertyIds = userProperties.map((p) => p.id);

    // Step 2: Build query conditions
    const conditions = [inArray(heating_bill_documents.objekt_id, propertyIds)];

    if (propertyId) {
      // Validate that property belongs to user
      if (!propertyIds.includes(propertyId)) {
        return createResponse(
          {
            error: {
              code: "NOT_FOUND",
              message: "Property not found or access denied",
            },
          },
          404,
          tokenRateLimit,
          ipRateLimit
        );
      }
      conditions.push(eq(heating_bill_documents.objekt_id, propertyId));
    }

    if (localId) {
      conditions.push(eq(heating_bill_documents.local_id, localId));
    }

    if (startDate) {
      // Filter by start_date >= startDate
      conditions.push(
        gte(heating_bill_documents.start_date, startDate) as any
      );
    }

    if (endDate) {
      // Filter by end_date <= endDate
      conditions.push(
        lte(heating_bill_documents.end_date, endDate) as any
      );
    }

    // Step 3: Fetch heating bill documents
    const statements = await database
      .select({
        id: heating_bill_documents.id,
        created_at: heating_bill_documents.created_at,
        start_date: heating_bill_documents.start_date,
        end_date: heating_bill_documents.end_date,
        objekt_id: heating_bill_documents.objekt_id,
        user_id: heating_bill_documents.user_id,
        submited: heating_bill_documents.submited,
        local_id: heating_bill_documents.local_id,
        consumption_dependent: heating_bill_documents.consumption_dependent,
        living_space_share: heating_bill_documents.living_space_share,
        // Property fields
        property_street: objekte.street,
        property_zip: objekte.zip,
        property_type: objekte.objekt_type,
        // Unit fields (if local_id exists)
        unit_floor: locals.floor,
        unit_living_space: locals.living_space,
      })
      .from(heating_bill_documents)
      .leftJoin(objekte, eq(heating_bill_documents.objekt_id, objekte.id))
      .leftJoin(locals, eq(heating_bill_documents.local_id, locals.id))
      .where(and(...conditions))
      .limit(limit);

    if (statements.length === 0) {
      return createResponse(
        { heating_statements: [] },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Step 4: Fetch related invoices for each statement
    const statementIds = statements.map((s) => s.id);
    const invoices = await database
      .select()
      .from(heating_invoices)
      .where(inArray(heating_invoices.heating_doc_id, statementIds));

    // Group invoices by heating_doc_id
    const invoicesByStatement: Record<string, typeof invoices> = {};
    for (const invoice of invoices) {
      if (invoice.heating_doc_id) {
        if (!invoicesByStatement[invoice.heating_doc_id]) {
          invoicesByStatement[invoice.heating_doc_id] = [];
        }
        invoicesByStatement[invoice.heating_doc_id].push(invoice);
      }
    }

    // Step 5: Format response based on format parameter
    if (format === "bved") {
      // BVED format (simplified - adjust based on BVED spec requirements)
      const transformed = statements.map((stmt) => ({
        id: stmt.id,
        billing_unit: {
          reference: {
            mscnumber: stmt.objekt_id?.substring(0, 9).padStart(9, "0") || null, // Placeholder
            pmnumber: null,
          },
          address: {
            street: stmt.property_street || null,
            zip: stmt.property_zip || null,
          },
        },
        residential_unit: stmt.local_id
          ? {
              reference: {
                mscnumber: stmt.local_id.substring(0, 9).padStart(9, "0") || null, // Placeholder
                pmnumber: null,
              },
              floor: stmt.unit_floor || null,
              living_space: stmt.unit_living_space
                ? parseFloat(stmt.unit_living_space)
                : null,
            }
          : null,
        period: {
          start: stmt.start_date || null,
          end: stmt.end_date || null,
        },
        allocation: {
          consumption_dependent: stmt.consumption_dependent
            ? parseFloat(stmt.consumption_dependent)
            : null,
          living_space_share: stmt.living_space_share
            ? parseFloat(stmt.living_space_share)
            : null,
        },
        submitted: stmt.submited,
        invoices: (invoicesByStatement[stmt.id] || []).map((inv) => ({
          id: inv.id,
          document_name: inv.document_name || null,
          invoice_date: inv.invoice_date || null,
          total_amount: inv.total_amount ? parseFloat(inv.total_amount) : null,
          cost_type: inv.cost_type || null,
          purpose: inv.purpose || null,
          service_period: inv.service_period || null,
          for_all_tenants: inv.for_all_tenants || null,
        })),
        created_at: stmt.created_at,
      }));

      return createResponse(
        { heating_statements: transformed },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    } else {
      // Internal format (default)
      const response = statements.map((stmt) => ({
        id: stmt.id,
        created_at: stmt.created_at,
        start_date: stmt.start_date,
        end_date: stmt.end_date,
        objekt_id: stmt.objekt_id,
        user_id: stmt.user_id,
        submited: stmt.submited,
        local_id: stmt.local_id,
        consumption_dependent: stmt.consumption_dependent
          ? parseFloat(stmt.consumption_dependent)
          : null,
        living_space_share: stmt.living_space_share
          ? parseFloat(stmt.living_space_share)
          : null,
        property: stmt.objekt_id
          ? {
              id: stmt.objekt_id,
              street: stmt.property_street || null,
              zip: stmt.property_zip || null,
              type: stmt.property_type || null,
            }
          : null,
        unit: stmt.local_id
          ? {
              id: stmt.local_id,
              floor: stmt.unit_floor || null,
              living_space: stmt.unit_living_space
                ? parseFloat(stmt.unit_living_space)
                : null,
            }
          : null,
        invoices: (invoicesByStatement[stmt.id] || []).map((inv) => ({
          id: inv.id,
          document_name: inv.document_name,
          invoice_date: inv.invoice_date,
          total_amount: inv.total_amount ? parseFloat(inv.total_amount) : null,
          cost_type: inv.cost_type,
          purpose: inv.purpose,
          notes: inv.notes,
          service_period: inv.service_period,
          for_all_tenants: inv.for_all_tenants,
          created_at: inv.created_at,
        })),
      }));

      return createResponse(
        { heating_statements: response },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }
  } catch (error) {
    return formatError(error);
  }
}
