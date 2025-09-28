# CSV Parser Edge Function

A Supabase Edge Function that parses CSV files with a specific format and returns JSON data.

## Features

- Parse CSV content from direct input or URL
- Convert string values to appropriate data types (integers, floats)
- Support for semicolon-delimited CSV files
- Handles paired header/data line format
- CORS enabled for cross-origin requests

## API Usage

### Endpoint
```
POST /functions/v1/csv-parser
```

### Request Body Options

#### Option 1: Parse from CSV content
```json
{
  "csvContent": "Name;Age\nJohn;30\nJane;25",
  "fileName": "people.csv"
}
```

#### Option 2: Parse from URL
```json
{
  "csvUrl": "https://example.com/data.csv",
  "fileName": "remote-data.csv"
}
```

### Response Format

#### Success Response (200)
```json
{
  "metadata": {
    "sourceFile": "raw-content",
    "fileName": "people.csv",
    "recordCount": 2,
    "processedAt": "2023-09-25T21:15:00.000Z"
  },
  "parsedData": [
    {
      "Name": "John",
      "Age": 30
    },
    {
      "Name": "Jane", 
      "Age": 25
    }
  ]
}
```

#### Error Response (400/500)
```json
{
  "error": "Missing required data. Provide either csvContent or csvUrl.",
  "timestamp": "2023-09-25T21:15:00.000Z"
}
```

## CSV Format Requirements

- Semicolon (`;`) delimited
- Alternating header/data line pairs
- Automatic type conversion for numbers
- Supports comma or dot decimal separators

## Local Development

```bash
# Serve the function locally
supabase functions serve csv-parser

# Test with curl
curl -X POST 'http://localhost:54321/functions/v1/csv-parser' \
  -H 'Content-Type: application/json' \
  -d '{"csvContent": "Name;Age\nJohn;30", "fileName": "test.csv"}'
```

## Deployment

```bash
# Deploy to Supabase
supabase functions deploy csv-parser
```