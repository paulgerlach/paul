import { NextResponse } from "next/server";
import database from "@/db";
import {
  heating_bill_documents,
  heating_invoices,
  objekte,
  locals,
} from "@/db/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { requireExternalAuth, formatError, createResponse } from "../../_lib/auth";

interface ValidationError {
  field: string;
  message: string;
}

interface HeatingStatementRequest {
  objekt_id?: string;
  local_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  consumption_dependent?: string | number | null;
  living_space_share?: string | number | null;
  submited?: boolean;
  invoices?: HeatingInvoiceRequest[];
}

interface HeatingInvoiceRequest {
  document_name?: string | null;
  invoice_date?: string | null;
  total_amount?: string | number | null;
  cost_type?: string | null;
  purpose?: string | null;
  notes?: string | null;
  service_period?: boolean | null;
  for_all_tenants?: boolean | null;
  direct_local_id?: string[] | null;
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate ISO 8601 date string
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate ISO 8601 date string (date only, YYYY-MM-DD)
 */
function isValidDateOnly(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate numeric string or number
 */
function isValidNumeric(value: string | number): boolean {
  if (typeof value === "number") return !isNaN(value) && isFinite(value);
  if (typeof value === "string") {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
}

/**
 * GET /api/bved/v1/heating-statements/:id
 * 
 * Returns a single heating statement by ID.
 * 
 * Query parameters:
 * - format: "internal" | "bved" (default: "internal")
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let authResult;
  try {
    authResult = await requireExternalAuth(request);
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

    const { id } = await params;
    const statementId = id;

    if (!statementId || !isValidUUID(statementId)) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid statement ID",
            errors: [{ field: "id", message: "Statement ID must be a valid UUID" }],
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Verify statement exists and belongs to user
    const statement = await database
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
        property_street: objekte.street,
        property_zip: objekte.zip,
        property_type: objekte.objekt_type,
        unit_floor: locals.floor,
        unit_living_space: locals.living_space,
      })
      .from(heating_bill_documents)
      .leftJoin(objekte, eq(heating_bill_documents.objekt_id, objekte.id))
      .leftJoin(locals, eq(heating_bill_documents.local_id, locals.id))
      .where(
        and(
          eq(heating_bill_documents.id, statementId),
          eq(heating_bill_documents.user_id, token.user_id)
        )
      )
      .limit(1);

    if (statement.length === 0) {
      return createResponse(
        {
          error: {
            code: "NOT_FOUND",
            message: "Heating statement not found or access denied",
          },
        },
        404,
        tokenRateLimit,
        ipRateLimit
      );
    }

    const stmt = statement[0];
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "internal";

    // Fetch related invoices
    const invoices = await database
      .select()
      .from(heating_invoices)
      .where(eq(heating_invoices.heating_doc_id, statementId));

    // Format response based on format parameter
    if (format === "bved") {
      const transformed = {
        id: stmt.id,
        billing_unit: {
          reference: {
            mscnumber: stmt.objekt_id?.substring(0, 9).padStart(9, "0") || null,
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
                mscnumber: stmt.local_id.substring(0, 9).padStart(9, "0") || null,
                pmnumber: null,
              },
              floor: stmt.unit_floor || null,
              living_space: stmt.unit_living_space ? parseFloat(stmt.unit_living_space) : null,
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
        invoices: invoices.map((inv) => ({
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
      };

      return createResponse({ heating_statement: transformed }, 200, tokenRateLimit, ipRateLimit);
    } else {
      // Internal format (default)
      const response = {
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
              living_space: stmt.unit_living_space ? parseFloat(stmt.unit_living_space) : null,
            }
          : null,
        invoices: invoices.map((inv) => ({
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
      };

      return createResponse({ heating_statement: response }, 200, tokenRateLimit, ipRateLimit);
    }
  } catch (error) {
    return formatError(error, authResult);
  }
}

/**
 * PUT /api/bved/v1/heating-statements/:id
 * PATCH /api/bved/v1/heating-statements/:id
 * 
 * Updates an existing heating statement.
 * PATCH allows partial updates, PUT requires all fields (but we treat them the same for simplicity).
 * 
 * Request body: Same structure as POST, but all fields are optional (except you can't change objekt_id)
 * 
 * Supports updating invoices by providing an invoices array (replaces existing invoices)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleUpdate(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleUpdate(request, id);
}

async function handleUpdate(request: Request, statementId: string) {
  let authResult;
  try {
    authResult = await requireExternalAuth(request);
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

    if (!statementId || !isValidUUID(statementId)) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid statement ID",
            errors: [{ field: "id", message: "Statement ID must be a valid UUID" }],
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Verify statement exists and belongs to user
    const existingStatement = await database
      .select({
        id: heating_bill_documents.id,
        objekt_id: heating_bill_documents.objekt_id,
        user_id: heating_bill_documents.user_id,
      })
      .from(heating_bill_documents)
      .where(eq(heating_bill_documents.id, statementId))
      .limit(1);

    if (existingStatement.length === 0) {
      return createResponse(
        {
          error: {
            code: "NOT_FOUND",
            message: "Heating statement not found",
          },
        },
        404,
        tokenRateLimit,
        ipRateLimit
      );
    }

    if (existingStatement[0].user_id !== token.user_id) {
      return createResponse(
        {
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to update this heating statement",
          },
        },
        403,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Parse request body
    let body: Partial<HeatingStatementRequest>;
    try {
      body = await request.json();
    } catch (error) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid JSON in request body",
            errors: [{ field: "body", message: "Request body must be valid JSON" }],
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Validate update data (objekt_id cannot be changed)
    if (body.objekt_id && body.objekt_id !== existingStatement[0].objekt_id) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            errors: [
              {
                field: "objekt_id",
                message: "Property ID cannot be changed after creation",
              },
            ],
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};

    if (body.start_date !== undefined) {
      if (body.start_date === null || isValidDate(body.start_date)) {
        updateData.start_date = body.start_date;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "start_date",
                  message: "Start date must be a valid ISO 8601 timestamp",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    if (body.end_date !== undefined) {
      if (body.end_date === null || isValidDate(body.end_date)) {
        updateData.end_date = body.end_date;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "end_date",
                  message: "End date must be a valid ISO 8601 timestamp",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    if (body.local_id !== undefined) {
      if (body.local_id === null) {
        updateData.local_id = null;
      } else if (isValidUUID(body.local_id)) {
        // Validate local_id belongs to objekt_id
        const local = await database
          .select({ id: locals.id, objekt_id: locals.objekt_id })
          .from(locals)
          .where(eq(locals.id, body.local_id))
          .limit(1);

        if (local.length === 0) {
          return createResponse(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: [
                  {
                    field: "local_id",
                    message: "Unit not found",
                  },
                ],
              },
            },
            400,
            tokenRateLimit,
            ipRateLimit
          );
        }

        if (local[0].objekt_id !== existingStatement[0].objekt_id) {
          return createResponse(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: [
                  {
                    field: "local_id",
                    message: "Unit does not belong to the property",
                  },
                ],
              },
            },
            400,
            tokenRateLimit,
            ipRateLimit
          );
        }

        updateData.local_id = body.local_id;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "local_id",
                  message: "Unit ID must be a valid UUID",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    if (body.consumption_dependent !== undefined) {
      if (body.consumption_dependent === null || isValidNumeric(body.consumption_dependent)) {
        updateData.consumption_dependent = body.consumption_dependent
          ? String(body.consumption_dependent)
          : null;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "consumption_dependent",
                  message: "Consumption dependent must be a valid number",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    if (body.living_space_share !== undefined) {
      if (body.living_space_share === null || isValidNumeric(body.living_space_share)) {
        updateData.living_space_share = body.living_space_share
          ? String(body.living_space_share)
          : null;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "living_space_share",
                  message: "Living space share must be a valid number",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    if (body.submited !== undefined) {
      if (typeof body.submited === "boolean") {
        updateData.submited = body.submited;
      } else {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "submited",
                  message: "Submitted must be a boolean value",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }
    }

    // Update heating bill document
    try {
      if (Object.keys(updateData).length > 0) {
        await database
          .update(heating_bill_documents)
          .set(updateData)
          .where(eq(heating_bill_documents.id, statementId));
      }
    } catch (dbError: any) {
      console.error("[BVED API] Error updating heating statement:", dbError);
      return createResponse(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to update heating statement",
          },
        },
        500,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Handle invoice updates if provided
    if (body.invoices !== undefined) {
      // Delete existing invoices
      await database
        .delete(heating_invoices)
        .where(eq(heating_invoices.heating_doc_id, statementId));

      // Create new invoices
      if (Array.isArray(body.invoices) && body.invoices.length > 0) {
        for (const invoice of body.invoices) {
          try {
            const invoiceData: any = {
              objekt_id: existingStatement[0].objekt_id,
              user_id: token.user_id,
              heating_doc_id: statementId,
              document_name: invoice.document_name || null,
              invoice_date: invoice.invoice_date || null,
              total_amount: invoice.total_amount ? String(invoice.total_amount) : null,
              cost_type: invoice.cost_type || null,
              purpose: invoice.purpose || null,
              notes: invoice.notes || null,
              service_period: invoice.service_period ?? null,
              for_all_tenants: invoice.for_all_tenants ?? null,
              direct_local_id:
                invoice.direct_local_id && invoice.direct_local_id.length > 0
                  ? invoice.direct_local_id
                  : null,
            };

            await database.insert(heating_invoices).values(invoiceData);
          } catch (invoiceError: any) {
            console.error("[BVED API] Error creating invoice:", invoiceError);
            // Continue with other invoices
          }
        }
      }
    }

    // Fetch updated document with joins for response
    const [statement] = await database
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
        property_street: objekte.street,
        property_zip: objekte.zip,
        property_type: objekte.objekt_type,
        unit_floor: locals.floor,
        unit_living_space: locals.living_space,
      })
      .from(heating_bill_documents)
      .leftJoin(objekte, eq(heating_bill_documents.objekt_id, objekte.id))
      .leftJoin(locals, eq(heating_bill_documents.local_id, locals.id))
      .where(eq(heating_bill_documents.id, statementId))
      .limit(1);

    // Fetch invoices
    const invoices = await database
      .select()
      .from(heating_invoices)
      .where(eq(heating_invoices.heating_doc_id, statementId));

    // Format response
    const response = {
      id: statement.id,
      created_at: statement.created_at,
      start_date: statement.start_date,
      end_date: statement.end_date,
      objekt_id: statement.objekt_id,
      user_id: statement.user_id,
      submited: statement.submited,
      local_id: statement.local_id,
      consumption_dependent: statement.consumption_dependent
        ? parseFloat(statement.consumption_dependent)
        : null,
      living_space_share: statement.living_space_share
        ? parseFloat(statement.living_space_share)
        : null,
      property: statement.objekt_id
        ? {
            id: statement.objekt_id,
            street: statement.property_street || null,
            zip: statement.property_zip || null,
            type: statement.property_type || null,
          }
        : null,
      unit: statement.local_id
        ? {
            id: statement.local_id,
            floor: statement.unit_floor || null,
            living_space: statement.unit_living_space
              ? parseFloat(statement.unit_living_space)
              : null,
          }
        : null,
      invoices: invoices.map((inv) => ({
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
    };

    return createResponse({ heating_statement: response }, 200, tokenRateLimit, ipRateLimit);
  } catch (error) {
    return formatError(error, authResult);
  }
}

/**
 * DELETE /api/bved/v1/heating-statements/:id
 * 
 * Deletes a heating statement and all associated invoices.
 * 
 * Data Scoping:
 * - Statement must belong to token.user_id
 * - Cascade deletes related invoices automatically (via foreign key)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let authResult;
  try {
    authResult = await requireExternalAuth(request);
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

    const { id } = await params;
    const statementId = id;

    if (!statementId || !isValidUUID(statementId)) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid statement ID",
            errors: [{ field: "id", message: "Statement ID must be a valid UUID" }],
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Verify statement exists and belongs to user
    const existingStatement = await database
      .select({
        id: heating_bill_documents.id,
        user_id: heating_bill_documents.user_id,
      })
      .from(heating_bill_documents)
      .where(eq(heating_bill_documents.id, statementId))
      .limit(1);

    if (existingStatement.length === 0) {
      return createResponse(
        {
          error: {
            code: "NOT_FOUND",
            message: "Heating statement not found",
          },
        },
        404,
        tokenRateLimit,
        ipRateLimit
      );
    }

    if (existingStatement[0].user_id !== token.user_id) {
      return createResponse(
        {
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to delete this heating statement",
          },
        },
        403,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Delete heating bill document (invoices cascade delete via foreign key)
    try {
      const deleted = await database
        .delete(heating_bill_documents)
        .where(eq(heating_bill_documents.id, statementId))
        .returning();

      if (deleted.length === 0) {
        return createResponse(
          {
            error: {
              code: "INTERNAL_ERROR",
              message: "Failed to delete heating statement",
            },
          },
          500,
          tokenRateLimit,
          ipRateLimit
        );
      }

      return createResponse(
        {
          success: true,
          message: "Heating statement deleted successfully",
          id: statementId,
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    } catch (dbError: any) {
      console.error("[BVED API] Error deleting heating statement:", dbError);
      return createResponse(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to delete heating statement",
          },
        },
        500,
        tokenRateLimit,
        ipRateLimit
      );
    }
  } catch (error) {
    return formatError(error, authResult);
  }
}
