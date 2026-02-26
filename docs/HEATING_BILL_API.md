# Heating Bill PDF API

## Endpoint

`POST /api/heating-bill/generate`

Generates a Heizkostenabrechnung PDF from the database and uploads it to Supabase storage. Returns a presigned download URL.

### Request

```json
{
  "docId": "required - heating bill document ID",
  "objektId": "optional - for storage path",
  "localId": "optional - for storage path",
  "debug": "optional boolean - returns debugModel, debugComputedModel, debugValidation"
}
```

### Response

```json
{
  "documentId": "uuid",
  "presignedUrl": "https://...",
  "metadata": { "storagePath": "..." }
}
```

With `debug: true`:

```json
{
  "documentId": "...",
  "presignedUrl": "...",
  "debugModel": { ... },
  "debugComputedModel": { ... },
  "debugValidation": {
    "valid": true,
    "errors": [],
    "warnings": []
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HEATING_BILL_USE_MOCK` | Set to `"true"` or `"1"` to force mock data (for testing/rollback). Omit or set to `false` to use computed model from database. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for storage upload |

## Client Integration

The `LocalPDFDownloadButton` component calls this API with `docId`, `objektId`, and `localId` from the heating bill context. The API uses the authenticated user's ID for authorization and storage path.

## Validation

When using the computed model, `validateModel()` runs before rendering. Errors and warnings are logged. With `debug: true`, the validation result is included in the response.
