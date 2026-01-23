import { NextResponse } from "next/server";
import database from "@/db";
import {
  heating_bill_documents,
  heating_invoices,
  objekte,
  locals,
} from "@/db/drizzle/schema";
import { eq, inArray, and, gte, lte, desc, lt, or } from "drizzle-orm";
import { requireExternalAuth, formatError, createResponse } from "../_lib/auth";
import {
  parsePaginationParams,
  createPaginatedResponse,
  decodeCursor,
  SORT_FIELDS,
  type PaginatedResponse,
  type SortField,
} from "../_lib/pagination";

interface ValidationError {
  field: string;
  message: string;
}

interface HeatingStatementRequest {
  objekt_id: string; // Required: Property UUID
  local_id?: string | null; // Optional: Unit UUID
  start_date?: string | null; // Optional: ISO 8601 timestamp
  end_date?: string | null; // Optional: ISO 8601 timestamp
  consumption_dependent?: string | number | null; // Optional: numeric, default '70'
  living_space_share?: string | number | null; // Optional: numeric, default '30'
  submited?: boolean; // Optional: default false
  invoices?: HeatingInvoiceRequest[]; // Optional: array of invoices
}

interface HeatingInvoiceRequest {
  document_name?: string | null;
  invoice_date?: string | null; // ISO 8601 date (YYYY-MM-DD)
  total_amount?: string | number | null;
  cost_type?: string | null;
  purpose?: string | null;
  notes?: string | null;
  service_period?: boolean | null;
  for_all_tenants?: boolean | null;
  direct_local_id?: string[] | null; // Array of UUIDs
}

/**
 * GET /api/bved/v1/heating-statements
 * GET /api/bved/v1/heating-statements/:id
 * 
 * Returns heating statements (heating bill documents) scoped to properties owned by the token's user.
 * Includes related invoices if available.
 * 
 * If an ID is provided in the URL path, returns a single statement.
 * Otherwise, returns a list of statements with optional filtering.
 * 
 * Query parameters (for list endpoint):
 * - format: "internal" | "bved" (default: "internal")
 * - property_id: Optional filter by specific property UUID
 * - local_id: Optional filter by specific unit UUID
 * - start_date: Optional filter by start date (ISO 8601)
 * - end_date: Optional filter by end date (ISO 8601)
 * - cursor: Optional cursor for pagination (from previous response)
 * - limit: Maximum number of records (default: 100, max: 1000)
 * 
 * Data Scoping:
 * Only returns heating statements for properties where objekte.user_id = token.user_id
 */
export async function GET(request: Request) {
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

    // Parse URL to check if we're fetching a single statement by ID
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const statementId = pathParts[pathParts.length - 1];

    // Handle as list endpoint (single statement by ID is handled in [id]/route.ts)
    const format = url.searchParams.get("format") || "internal";
    const propertyId = url.searchParams.get("property_id");
    const localId = url.searchParams.get("local_id");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    
    // Parse pagination parameters
    const paginationParams = parsePaginationParams(url);
    const { cursor, limit } = paginationParams;
    // Ensure limit is always defined (parsePaginationParams always returns a number)
    const pageLimit = limit || 100;

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

    // Handle cursor-based pagination
    if (cursor) {
      const cursorData = decodeCursor(cursor);
      if (cursorData) {
        // Apply cursor filter: fetch items where (created_at, id) < (cursor.created_at, cursor.id)
        if (cursorData.created_at || cursorData.id) {
          const cursorConditions = [];
          if (cursorData.created_at) {
            cursorConditions.push(
              or(
                lt(heating_bill_documents.created_at, cursorData.created_at),
                and(
                  eq(heating_bill_documents.created_at, cursorData.created_at),
                  cursorData.id ? lt(heating_bill_documents.id, cursorData.id) : undefined
                )
              ) as any
            );
          } else if (cursorData.id) {
            cursorConditions.push(lt(heating_bill_documents.id, cursorData.id));
          }
          if (cursorConditions.length > 0) {
            conditions.push(and(...cursorConditions) as any);
          }
        }
      }
    }

    // Step 3: Fetch heating bill documents with cursor pagination
    // Fetch limit + 1 to check if there are more items
    const fetchLimit = pageLimit + 1;
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
      .orderBy(desc(heating_bill_documents.created_at), desc(heating_bill_documents.id))
      .limit(fetchLimit);
    
    // Check if there are more items
    const hasMore = statements.length > pageLimit;
    const actualStatements = hasMore ? statements.slice(0, pageLimit) : statements;

    if (actualStatements.length === 0) {
      return createResponse(
        {
          heating_statements: [],
          pagination: {
            cursor: null,
            has_more: false,
            limit: pageLimit,
            count: 0,
          },
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Step 4: Fetch related invoices for each statement
    const statementIds = actualStatements.map((s) => s.id);
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
      const transformed = actualStatements.map((stmt) => ({
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

      const paginatedResponse = createPaginatedResponse(
        transformed,
        pageLimit,
        SORT_FIELDS.HEATING_STATEMENTS as readonly SortField[],
        hasMore
      );

      return createResponse(
        { heating_statements: paginatedResponse.data, pagination: paginatedResponse.pagination },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    } else {
      // Internal format (default)
      const response = actualStatements.map((stmt) => ({
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

      const paginatedResponse = createPaginatedResponse(
        response,
        pageLimit,
        SORT_FIELDS.HEATING_STATEMENTS as readonly SortField[],
        hasMore
      );

      return createResponse(
        { heating_statements: paginatedResponse.data, pagination: paginatedResponse.pagination },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }
  } catch (error) {
    return formatError(error, authResult);
  }
}

// GET single statement by ID is handled in [id]/route.ts

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
 * Validate heating statement request
 */
async function validateHeatingStatementRequest(
  data: any,
  tokenUserId: string,
  userPropertyIds: string[]
): Promise<{ valid: boolean; errors: ValidationError[] }> {
  const errors: ValidationError[] = [];

  // Validate objekt_id (required)
  if (!data.objekt_id || typeof data.objekt_id !== "string") {
    errors.push({ field: "objekt_id", message: "Property ID (objekt_id) is required" });
  } else if (!isValidUUID(data.objekt_id)) {
    errors.push({ field: "objekt_id", message: "Property ID must be a valid UUID" });
  } else if (!userPropertyIds.includes(data.objekt_id)) {
    errors.push({
      field: "objekt_id",
      message: "Property not found or access denied. Property must belong to your account.",
    });
  }

  // Validate local_id (optional)
  if (data.local_id !== undefined && data.local_id !== null) {
    if (typeof data.local_id !== "string") {
      errors.push({ field: "local_id", message: "Unit ID (local_id) must be a string or null" });
    } else if (!isValidUUID(data.local_id)) {
      errors.push({ field: "local_id", message: "Unit ID must be a valid UUID" });
    }
    // Note: local_id FK validation happens during insert (will fail if invalid)
  }

  // Validate start_date (optional)
  if (data.start_date !== undefined && data.start_date !== null) {
    if (typeof data.start_date !== "string") {
      errors.push({ field: "start_date", message: "Start date must be a valid ISO 8601 timestamp string" });
    } else if (!isValidDate(data.start_date)) {
      errors.push({ field: "start_date", message: "Start date must be a valid ISO 8601 timestamp" });
    }
  }

  // Validate end_date (optional)
  if (data.end_date !== undefined && data.end_date !== null) {
    if (typeof data.end_date !== "string") {
      errors.push({ field: "end_date", message: "End date must be a valid ISO 8601 timestamp string" });
    } else if (!isValidDate(data.end_date)) {
      errors.push({ field: "end_date", message: "End date must be a valid ISO 8601 timestamp" });
    }
  }

  // Validate consumption_dependent (optional, numeric)
  if (data.consumption_dependent !== undefined && data.consumption_dependent !== null) {
    if (!isValidNumeric(data.consumption_dependent)) {
      errors.push({
        field: "consumption_dependent",
        message: "Consumption dependent must be a valid number",
      });
    }
  }

  // Validate living_space_share (optional, numeric)
  if (data.living_space_share !== undefined && data.living_space_share !== null) {
    if (!isValidNumeric(data.living_space_share)) {
      errors.push({
        field: "living_space_share",
        message: "Living space share must be a valid number",
      });
    }
  }

  // Validate submited (optional, boolean)
  if (data.submited !== undefined && typeof data.submited !== "boolean") {
    errors.push({ field: "submited", message: "Submitted must be a boolean value" });
  }

  // Validate invoices array (optional)
  if (data.invoices !== undefined && data.invoices !== null) {
    if (!Array.isArray(data.invoices)) {
      errors.push({ field: "invoices", message: "Invoices must be an array" });
    } else {
      data.invoices.forEach((invoice: any, index: number) => {
        const prefix = `invoices[${index}]`;

        // Validate invoice_date
        if (invoice.invoice_date !== undefined && invoice.invoice_date !== null) {
          if (typeof invoice.invoice_date !== "string") {
            errors.push({
              field: `${prefix}.invoice_date`,
              message: "Invoice date must be a valid date string (YYYY-MM-DD)",
            });
          } else if (!isValidDateOnly(invoice.invoice_date)) {
            errors.push({
              field: `${prefix}.invoice_date`,
              message: "Invoice date must be a valid date in YYYY-MM-DD format",
            });
          }
        }

        // Validate total_amount (optional, numeric)
        if (invoice.total_amount !== undefined && invoice.total_amount !== null) {
          if (!isValidNumeric(invoice.total_amount)) {
            errors.push({
              field: `${prefix}.total_amount`,
              message: "Total amount must be a valid number",
            });
          }
        }

        // Validate direct_local_id (optional, UUID array)
        if (invoice.direct_local_id !== undefined && invoice.direct_local_id !== null) {
          if (!Array.isArray(invoice.direct_local_id)) {
            errors.push({
              field: `${prefix}.direct_local_id`,
              message: "Direct local ID must be an array of UUIDs",
            });
          } else {
            invoice.direct_local_id.forEach((id: any, idIndex: number) => {
              if (typeof id !== "string" || !isValidUUID(id)) {
                errors.push({
                  field: `${prefix}.direct_local_id[${idIndex}]`,
                  message: "Each direct local ID must be a valid UUID",
                });
              }
            });
          }
        }

        // Validate boolean fields
        if (
          invoice.service_period !== undefined &&
          invoice.service_period !== null &&
          typeof invoice.service_period !== "boolean"
        ) {
          errors.push({
            field: `${prefix}.service_period`,
            message: "Service period must be a boolean value",
          });
        }

        if (
          invoice.for_all_tenants !== undefined &&
          invoice.for_all_tenants !== null &&
          typeof invoice.for_all_tenants !== "boolean"
        ) {
          errors.push({
            field: `${prefix}.for_all_tenants`,
            message: "For all tenants must be a boolean value",
          });
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * POST /api/bved/v1/heating-statements
 * 
 * Creates a new heating statement (heating bill document) with optional invoices.
 * 
 * Request body (internal format):
 * {
 *   "objekt_id": "uuid",              // Required: Property UUID
 *   "local_id": "uuid",               // Optional: Unit UUID
 *   "start_date": "2024-01-01T00:00:00Z", // Optional: ISO 8601 timestamp
 *   "end_date": "2024-12-31T23:59:59Z",   // Optional: ISO 8601 timestamp
 *   "consumption_dependent": "70",    // Optional: numeric (default: '70')
 *   "living_space_share": "30",       // Optional: numeric (default: '30')
 *   "submited": false,                // Optional: boolean (default: false)
 *   "invoices": [                     // Optional: array of invoices
 *     {
 *       "document_name": "Invoice 1",
 *       "invoice_date": "2024-06-15", // YYYY-MM-DD format
 *       "total_amount": "1500.50",
 *       "cost_type": "heating",
 *       "purpose": "Monthly heating costs",
 *       "notes": "Additional notes",
 *       "service_period": true,
 *       "for_all_tenants": false,
 *       "direct_local_id": ["uuid1", "uuid2"] // Optional: array of unit UUIDs
 *     }
 *   ]
 * }
 * 
 * Data Scoping:
 * - objekt_id must belong to token.user_id
 * - local_id (if provided) must belong to objekt_id
 * - All invoices are scoped to the same objekt_id
 */
export async function POST(request: Request) {
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

    // Parse request body
    let body: HeatingStatementRequest;
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

    // Get user's properties for validation
    const userProperties = await database
      .select({ id: objekte.id })
      .from(objekte)
      .where(eq(objekte.user_id, token.user_id));

    const userPropertyIds = userProperties.map((p) => p.id);

    // Validate request
    const validation = await validateHeatingStatementRequest(body, token.user_id, userPropertyIds);
    if (!validation.valid) {
      return createResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            errors: validation.errors,
          },
        },
        400,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Validate local_id belongs to objekt_id (if provided)
    if (body.local_id) {
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
                  message: "Unit not found. The provided local_id does not exist.",
                },
              ],
            },
          },
          400,
          tokenRateLimit,
          ipRateLimit
        );
      }

      if (local[0].objekt_id !== body.objekt_id) {
        return createResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: [
                {
                  field: "local_id",
                  message: "Unit does not belong to the specified property",
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

    // Prepare heating bill document data
    const documentData = {
      objekt_id: body.objekt_id,
      user_id: token.user_id,
      local_id: body.local_id || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      consumption_dependent: body.consumption_dependent
        ? String(body.consumption_dependent)
        : "70",
      living_space_share: body.living_space_share ? String(body.living_space_share) : "30",
      submited: body.submited ?? false,
    };

    // Create heating bill document
    let createdDocument;
    try {
      const [doc] = await database
        .insert(heating_bill_documents)
        .values(documentData)
        .returning();

      createdDocument = doc;
    } catch (dbError: any) {
      // Handle foreign key constraint violations
      if (dbError.code === "23503") {
        // Foreign key violation
        const constraint = dbError.constraint;
        if (constraint?.includes("objekt_id")) {
          return createResponse(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: [
                  {
                    field: "objekt_id",
                    message: "Property not found or invalid foreign key reference",
                  },
                ],
              },
            },
            400,
            tokenRateLimit,
            ipRateLimit
          );
        }
        if (constraint?.includes("local_id")) {
          return createResponse(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: [
                  {
                    field: "local_id",
                    message: "Unit not found or invalid foreign key reference",
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

      console.error("[BVED API] Error creating heating statement:", dbError);
      return createResponse(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to create heating statement",
          },
        },
        500,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Create invoices if provided
    const createdInvoices = [];
    if (body.invoices && Array.isArray(body.invoices) && body.invoices.length > 0) {
      for (const invoice of body.invoices) {
        try {
          const invoiceData: any = {
            objekt_id: body.objekt_id,
            user_id: token.user_id,
            heating_doc_id: createdDocument.id,
            document_name: invoice.document_name || null,
            invoice_date: invoice.invoice_date || null,
            total_amount: invoice.total_amount ? String(invoice.total_amount) : null,
            cost_type: invoice.cost_type || null,
            purpose: invoice.purpose || null,
            notes: invoice.notes || null,
            service_period: invoice.service_period ?? null,
            for_all_tenants: invoice.for_all_tenants ?? null,
            direct_local_id: invoice.direct_local_id && invoice.direct_local_id.length > 0
              ? invoice.direct_local_id
              : null,
          };

          const [createdInvoice] = await database
            .insert(heating_invoices)
            .values(invoiceData)
            .returning();

          createdInvoices.push(createdInvoice);
        } catch (invoiceError: any) {
          console.error("[BVED API] Error creating invoice:", invoiceError);
          // Continue with other invoices, but log the error
        }
      }
    }

    // Fetch created document with joins for response
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
      .where(eq(heating_bill_documents.id, createdDocument.id))
      .limit(1);

    // Format response (internal format, matching GET response)
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
      invoices: createdInvoices.map((inv) => ({
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

    return createResponse({ heating_statement: response }, 201, tokenRateLimit, ipRateLimit);
  } catch (error) {
    return formatError(error, authResult);
  }
}
