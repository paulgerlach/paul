/**
 * Cursor-based Pagination Utilities
 * 
 * Provides cursor-based pagination for BVED API endpoints.
 * Cursors are base64-encoded JSON objects containing the last item's sort key.
 */

export interface CursorPaginationParams {
  cursor?: string; // Base64-encoded cursor from previous response
  limit?: number; // Number of items to return (default: 100, max: 1000)
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor: string | null; // Next cursor for pagination (null if no more items)
    has_more: boolean; // Whether more items are available
    limit: number; // Number of items requested
    count: number; // Number of items in this response
  };
}

export interface SortField {
  readonly field: string;
  readonly direction: "asc" | "desc";
}

/**
 * Decode a cursor string to get pagination parameters
 * 
 * @param cursor Base64-encoded cursor string
 * @returns Decoded cursor object or null if invalid
 */
export function decodeCursor(cursor: string): Record<string, any> | null {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

/**
 * Encode pagination parameters into a cursor string
 * 
 * @param params Object containing sort key values
 * @returns Base64-encoded cursor string
 */
export function encodeCursor(params: Record<string, any>): string {
  return Buffer.from(JSON.stringify(params)).toString("base64");
}

/**
 * Parse pagination parameters from query string
 * 
 * @param url Request URL
 * @returns Parsed pagination parameters
 */
export function parsePaginationParams(url: URL): { cursor?: string; limit: number } {
  const cursor = url.searchParams.get("cursor") || undefined;
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam, 10) || 100, 1), 1000)
    : 100;

  return { cursor, limit };
}

/**
 * Create a paginated response
 * 
 * @param data Array of data items
 * @param limit Requested limit
 * @param sortFields Fields used for sorting (to extract cursor)
 * @param hasMore Whether more items are available
 * @returns Paginated response object
 */
export function createPaginatedResponse<T extends Record<string, any>>(
  data: T[],
  limit: number,
  sortFields: readonly SortField[],
  hasMore: boolean
): PaginatedResponse<T> {
  // Extract cursor from last item if there are items and more are available
  let cursor: string | null = null;
  if (data.length > 0 && hasMore) {
    const lastItem = data[data.length - 1];
    const cursorData: Record<string, any> = {};
    
    for (const sortField of sortFields) {
      const value = lastItem[sortField.field];
      if (value !== undefined && value !== null) {
        cursorData[sortField.field] = value;
      }
    }
    
    // Also include primary key if available (for stable sorting)
    if (lastItem.id) {
      cursorData.id = lastItem.id;
    }
    
    cursor = encodeCursor(cursorData);
  }

  return {
    data,
    pagination: {
      cursor,
      has_more: hasMore,
      limit,
      count: data.length,
    },
  };
}

/**
 * Common sort fields for different endpoints
 */
export const SORT_FIELDS = {
  METER_READINGS: [
    { field: "created_at", direction: "desc" as const },
    { field: "id", direction: "desc" as const },
  ],
  HEATING_STATEMENTS: [
    { field: "created_at", direction: "desc" as const },
    { field: "id", direction: "desc" as const },
  ],
  PROPERTIES: [
    { field: "created_at", direction: "desc" as const },
    { field: "id", direction: "desc" as const },
  ],
  UNITS: [
    { field: "created_at", direction: "desc" as const },
    { field: "id", direction: "desc" as const },
  ],
} as const;
