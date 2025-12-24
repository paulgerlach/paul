# Heidi Systems - bved API Integration Documentation

## Overview

This document describes the implementation of the **bved (Bundesverband der Energie- und Wasserwirtschaft)** document web service API for exchanging documents and data between measurement service companies and property management companies.

### Version Information
- **API Specification**: bved documents v1.3
- **Last Updated**: October 25, 2025
- **Authentication**: BasicAuth over HTTPS

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Implementation Guide](#implementation-guide)
7. [Integration with 5 Platforms](#integration-with-5-platforms)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## Introduction

### What is bved API?

The bved API provides a standardized way to exchange documents between:
- **Measurement Service Companies (MSC)** - Companies that read and manage utility meters
- **Property Management Companies (PM)** - Companies managing buildings and tenants

### Communication Directions

- **OUT**: Measurement Service Company → Property Management (receiving documents)
- **IN**: Property Management → Measurement Service Company (sending documents)

### Use Cases

**OUT Direction (Receiving Documents):**
- Retrieve list of available documents
- Download billing documents (PDF, XML, CSV, etc.)
- Process meter reading data
- Confirm document receipt

**IN Direction (Sending Documents):**
- Upload tenant information
- Send cost data
- Submit orders to measurement service companies

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Heidi Systems App                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Next.js API Routes Layer                │  │
│  │    /api/bved/documents/out/*                      │  │
│  │    /api/bved/documents/in/*                       │  │
│  └───────────────────────────────────────────────────┘  │
│                         ↕                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │        Document Service Layer                     │  │
│  │  - Document transformation                        │  │
│  │  - Validation & hash verification                 │  │
│  │  - Status tracking                                │  │
│  └───────────────────────────────────────────────────┘  │
│                         ↕                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Supabase Database                       │  │
│  │  - bved_documents table                           │  │
│  │  - document metadata                              │  │
│  │  - status tracking                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕
            HTTPS with BasicAuth
                         ↕
┌─────────────────────────────────────────────────────────┐
│       External Measurement Service Companies            │
│  - Platform 1 (TBD)                                     │
│  - Platform 2 (TBD)                                     │
│  - Platform 3 (TBD)                                     │
│  - Platform 4 (TBD)                                     │
│  - Platform 5 (TBD)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication

### BasicAuth over HTTPS

All API requests must use:
- **Protocol**: HTTPS/SSL (required)
- **Authentication**: HTTP Basic Authentication
- **Headers**: `Authorization: Basic base64(username:password)`

### Implementation Example

```typescript
const credentials = Buffer.from(`${username}:${password}`).toString('base64');
const headers = {
  'Authorization': `Basic ${credentials}`,
  'Content-Type': 'application/json'
};
```

### Security Requirements

- ✅ All requests must be over HTTPS
- ✅ Credentials must be stored securely (environment variables)
- ✅ Each MSC will have unique credentials
- ✅ Credentials should be rotatable

---

## API Endpoints

### OUT Direction (Receiving Documents)

#### 1. List Documents
**GET** `/documents/out`

Retrieves a paginated list of documents available for download.

**Query Parameters:**
- `offset` (integer, optional): Number of items to skip (default: 0)
- `limit` (integer, optional): Number of items to return (default: 20, max: 100)

**Response:**
```json
{
  "_links": {
    "self": { "href": "https://api.msc.com/documents/out?offset=0&limit=20" },
    "next": { "href": "https://api.msc.com/documents/out?offset=20&limit=20" },
    "prev": null
  },
  "documents": [
    {
      "documentid": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "E898_example.dat",
      "filesize": 1024,
      "filesizecompressed": 256,
      "filedate": "2025-10-25T17:32:28Z",
      "doctype": "E898",
      "doctypeversion": "3.10",
      "mimetype": "text/plain",
      "propertymanagement": "0000123456",
      "hashvalue": "F1B3F012E0245A1...",
      "metadata": [
        {
          "reftype": "billingunit",
          "mscnumber": "012301234",
          "pmnumber": "1234-236-44",
          "from": "2024-01-01",
          "to": "2024-12-31"
        }
      ],
      "_links": {
        "self": { "href": "https://api.msc.com/documents/out/550e8400..." }
      }
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Not authorized
- `403`: Not allowed
- `500`: Technical error
- `501`: Method not supported

---

#### 2. Get Document Count
**GET** `/documents/out/count`

Returns the total number of documents available.

**Response:**
```json
{
  "count": 142
}
```

---

#### 3. Get Document with Metadata
**GET** `/documents/out/{documentid}`

Retrieves a specific document including content and metadata.

**Response:**
```json
{
  "documentid": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "E898_example.dat",
  "filesize": 1024,
  "filesizecompressed": 256,
  "filedate": "2025-10-25T17:32:28Z",
  "doctype": "E898",
  "mimetype": "text/plain",
  "propertymanagement": "0000123456",
  "content": "H4sIAAAAAAAAA...", 
  "hashvalue": "F1B3F012E0245A1...",
  "metadata": [...],
  "info": {
    "customField1": "value1",
    "customField2": "value2"
  }
}
```

**Content Format:**
- Compressed with gzip
- Encoded as base64 string

**Hash Verification:**
- Hash is calculated on the **uncompressed** file
- Supports MD5, SHA-1, or SHA-256

---

#### 4. Download Document (Direct)
**GET** `/documents/out/{documentid}/data`

Downloads document content without metadata wrapper.

**Response:** Binary file content
**Content-Types:**
- `application/gzip`
- `application/pdf`
- `application/json`
- `image/tiff`
- `text/plain`
- `text/xml`

---

#### 5. Set Document Status
**PUT** `/documents/out/{documentid}/status`

Reports the status of a downloaded document back to the MSC.

**Request Body:**
```json
{
  "statustype": "ok",
  "code": 0,
  "message": "Document received and processed successfully"
}
```

**Status Types:**
- `ok`: Successfully received and processed
- `error`: Error occurred
- `warning`: Warning (non-critical issue)
- `pending`: Processing in progress

**Status Codes:**
- `0000`: OK
- `1000`: Technical error
- `2000`: Functional error
- `2010`: Document content does not match specification
- `2011`: Error in document content
- `3000`: System error
- `4000`: Authentication/authorization failed
- `5000`: Other error

---

#### 6. Set Bulk Status (OK)
**PUT** `/documents/out/status/ok`

Sets OK status for multiple documents at once (max 1000).

**Request Body:**
```json
[
  { "documentid": "550e8400-e29b-41d4-a716-446655440000" },
  { "documentid": "660e8400-e29b-41d4-a716-446655440001" }
]
```

---

### IN Direction (Sending Documents)

#### 7. Send Document
**POST** `/documents/in`

Sends a document from property management to the measurement service company.

**Request Body:**
```json
{
  "filename": "residents_2025.xml",
  "filesize": 2048,
  "filesizecompressed": 512,
  "filedate": "2025-10-25T10:00:00Z",
  "doctype": "RUL",
  "mimetype": "text/xml",
  "propertymanagement": "0000123456",
  "content": "H4sIAAAAAAAAA...",
  "hashvalue": "A1F3B012E0245F1...",
  "metadata": [
    {
      "reftype": "building",
      "mscnumber": "012301234",
      "pmnumber": "BLDG-001"
    }
  ]
}
```

**Response:**
```json
{
  "documentid": "770e8400-e29b-41d4-a716-446655440002",
  "status": {
    "statustype": "ok",
    "code": 0,
    "message": "Document received successfully"
  }
}
```

---

## Data Models

### Document Types

| Code | Description (EN) | Description (DE) |
|------|------------------|------------------|
| `A` | Balance record | Abstimmsatz |
| `D` | Balance record | Saldensatz |
| `W` | Water balance record | Saldensatz Wasser |
| `E` | Result record | Ergebnissatz |
| `P` | Refund amounts | Erstattungsbeträge Preisbremsen |
| `E835` | Tax services portion | Anteil steuerliche Leistungen |
| `E898` | User billing images | Nutzer-/Abrechnung Bilddateien |
| `LM` | Property and user data | Liegenschafts- und Nutzerdaten |
| `BK` | Fuel and cost data | Brennstoff und Kostendaten |
| `RUL` | Residential unit list | Übersicht Nutzeinheiten |
| `HKA-G` | Heating billing (complete) | Heizkosten Gesamtabrechnung |
| `HKA-E` | Heating billing (tenant) | Heizkosten Einzelabrechnung |
| `UVI-G` | Annual consumption info (complete) | Unterjährige Verbrauchsinfo Gesamt |
| `UVI-E` | Annual consumption info (tenant) | Unterjährige Verbrauchsinfo Einzel |
| `OTHER` | Other (specify in `doctypedetail`) | Andere |

### Reference Types

| Code | Description |
|------|-------------|
| `billingunit` | Reference to billing unit |
| `residentialunit` | Reference to residential unit |
| `resident` | Reference to resident/tenant |
| `device` | Reference to device/meter |
| `building` | Reference to building |
| `package` | Reference to package |
| `transaction` | Reference to transaction |
| `order` | Reference to order |

---

## Implementation Guide

### Step 1: Database Schema

Create a table to store bved documents:

```sql
CREATE TABLE bved_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  
  -- Metadata
  filename TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  filesizecompressed INTEGER,
  filedate TIMESTAMP WITH TIME ZONE NOT NULL,
  doctype TEXT NOT NULL,
  doctypedetail TEXT,
  doctypeversion TEXT,
  mimetype TEXT NOT NULL,
  propertymanagement TEXT NOT NULL,
  
  -- Content
  content TEXT, -- base64 gzipped content
  hashvalue TEXT,
  metadata JSONB,
  info JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'pending',
  status_code INTEGER DEFAULT 0,
  status_message TEXT,
  
  -- MSC info
  msc_id TEXT,
  msc_endpoint TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  downloaded_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_bved_documents_user_id ON bved_documents(user_id);
CREATE INDEX idx_bved_documents_direction ON bved_documents(direction);
CREATE INDEX idx_bved_documents_status ON bved_documents(status);
CREATE INDEX idx_bved_documents_doctype ON bved_documents(doctype);
```

### Step 2: Create API Routes

Create the following API route files:

1. `src/app/api/bved/documents/out/route.ts` - List documents
2. `src/app/api/bved/documents/out/count/route.ts` - Get count
3. `src/app/api/bved/documents/out/[documentid]/route.ts` - Get document
4. `src/app/api/bved/documents/out/[documentid]/data/route.ts` - Download
5. `src/app/api/bved/documents/out/[documentid]/status/route.ts` - Set status
6. `src/app/api/bved/documents/out/status/ok/route.ts` - Bulk status
7. `src/app/api/bved/documents/in/route.ts` - Send document

### Step 3: Create Service Layer

Create `src/services/bvedService.ts`:

```typescript
import { supabaseServer } from '@/utils/supabase/server';
import * as zlib from 'zlib';
import { promisify } from 'util';
import * as crypto from 'crypto';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class BvedService {
  /**
   * Fetch documents from external MSC API
   */
  async fetchDocumentsFromMSC(
    mscEndpoint: string,
    credentials: { username: string; password: string },
    offset: number = 0,
    limit: number = 20
  ) {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString('base64');
    
    const response = await fetch(
      `${mscEndpoint}/documents/out?offset=${offset}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`MSC API error: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Download and verify a document
   */
  async downloadDocumentFromMSC(
    mscEndpoint: string,
    credentials: { username: string; password: string },
    documentId: string
  ) {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString('base64');
    
    const response = await fetch(
      `${mscEndpoint}/documents/out/${documentId}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`);
    }
    
    const document = await response.json();
    
    // Verify hash
    const isValid = await this.verifyDocumentHash(
      document.content,
      document.hashvalue
    );
    
    if (!isValid) {
      throw new Error('Document hash verification failed');
    }
    
    return document;
  }

  /**
   * Verify document hash
   */
  async verifyDocumentHash(
    base64GzipContent: string,
    expectedHash: string
  ): Promise<boolean> {
    try {
      // Decode base64
      const compressed = Buffer.from(base64GzipContent, 'base64');
      
      // Decompress
      const uncompressed = await gunzip(compressed);
      
      // Calculate hash (try SHA-256, SHA-1, MD5)
      const sha256 = crypto.createHash('sha256').update(uncompressed).digest('hex');
      const sha1 = crypto.createHash('sha1').update(uncompressed).digest('hex');
      const md5 = crypto.createHash('md5').update(uncompressed).digest('hex');
      
      return (
        sha256.toLowerCase() === expectedHash.toLowerCase() ||
        sha1.toLowerCase() === expectedHash.toLowerCase() ||
        md5.toLowerCase() === expectedHash.toLowerCase()
      );
    } catch (error) {
      console.error('Hash verification error:', error);
      return false;
    }
  }

  /**
   * Send document status back to MSC
   */
  async sendDocumentStatus(
    mscEndpoint: string,
    credentials: { username: string; password: string },
    documentId: string,
    status: {
      statustype: 'ok' | 'error' | 'warning' | 'pending';
      code: number;
      message?: string;
    }
  ) {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString('base64');
    
    const response = await fetch(
      `${mscEndpoint}/documents/out/${documentId}/status`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to send status: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Send document to MSC
   */
  async sendDocumentToMSC(
    mscEndpoint: string,
    credentials: { username: string; password: string },
    document: any
  ) {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString('base64');
    
    const response = await fetch(
      `${mscEndpoint}/documents/in`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to send document: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Compress and encode content
   */
  async compressAndEncode(content: string | Buffer): Promise<string> {
    const buffer = typeof content === 'string' 
      ? Buffer.from(content, 'utf-8') 
      : content;
    
    const compressed = await gzip(buffer);
    return compressed.toString('base64');
  }

  /**
   * Decode and decompress content
   */
  async decodeAndDecompress(base64Content: string): Promise<Buffer> {
    const compressed = Buffer.from(base64Content, 'base64');
    return await gunzip(compressed);
  }

  /**
   * Calculate hash for content
   */
  calculateHash(content: Buffer, algorithm: 'sha256' | 'sha1' | 'md5' = 'sha256'): string {
    return crypto.createHash(algorithm).update(content).digest('hex');
  }
}

export const bvedService = new BvedService();
```

### Step 4: Environment Variables

Add to `.env.local`:

```bash
# MSC Platform 1
MSC_1_ENDPOINT=https://api.msc1.com
MSC_1_USERNAME=heidi_systems
MSC_1_PASSWORD=secure_password_here

# MSC Platform 2
MSC_2_ENDPOINT=https://api.msc2.com
MSC_2_USERNAME=heidi_systems
MSC_2_PASSWORD=secure_password_here

# ... (platforms 3, 4, 5)
```

### Step 5: Implement Scheduled Jobs

Create a cron job or scheduled function to:
1. Poll each MSC for new documents (daily or as needed)
2. Download new documents
3. Parse and store in database
4. Send confirmation status back to MSC

---

## Integration with 5 Platforms

### Platform Integration Checklist

For each of the 5 measurement service company platforms, you need:

1. ✅ API endpoint URL
2. ✅ Authentication credentials (username/password)
3. ✅ Customer/Property Management ID
4. ✅ Supported document types
5. ✅ API version they support
6. ✅ Contact person for technical issues

### Configuration Structure

```typescript
interface MSCPlatform {
  id: string;
  name: string;
  endpoint: string;
  credentials: {
    username: string;
    password: string;
  };
  propertyManagementId: string;
  supportedDocTypes: string[];
  apiVersion: string;
  pollInterval: number; // minutes
  active: boolean;
}

const mscPlatforms: MSCPlatform[] = [
  {
    id: 'msc-1',
    name: 'Platform 1 Name',
    endpoint: process.env.MSC_1_ENDPOINT!,
    credentials: {
      username: process.env.MSC_1_USERNAME!,
      password: process.env.MSC_1_PASSWORD!
    },
    propertyManagementId: '0000123456',
    supportedDocTypes: ['E898', 'HKA-G', 'UVI-E'],
    apiVersion: '1.3',
    pollInterval: 1440, // once daily
    active: true
  },
  // ... platforms 2-5
];
```

---

## Error Handling

### Common Error Scenarios

1. **Authentication Failure (401)**
   - Check credentials
   - Verify endpoint URL
   - Check if account is active

2. **Document Not Found (404)**
   - Document may have been already acknowledged
   - Check document ID

3. **Document Already Acknowledged (410)**
   - Document was already processed
   - Remove from pending list

4. **Hash Verification Failed**
   - Re-download document
   - Check for network issues
   - Contact MSC if problem persists

5. **Rate Limiting**
   - Implement exponential backoff
   - Respect API rate limits

### Error Logging

Log all errors with:
- Timestamp
- MSC platform ID
- Document ID (if applicable)
- Error message
- Stack trace

---

## Testing

### Unit Tests

Test individual functions:
- Hash calculation
- Content compression/decompression
- Base64 encoding/decoding
- Document validation

### Integration Tests

Test API endpoints:
- Mock MSC API responses
- Test authentication
- Test pagination
- Test error handling

### End-to-End Tests

Test complete workflows:
1. Poll MSC for documents
2. Download document
3. Verify hash
4. Store in database
5. Send confirmation

---

## Next Steps

### Immediate Actions Needed:

1. **From Paul:**
   - [ ] Provide credentials for 5 MSC platforms
   - [ ] Specify which 5 platforms to integrate
   - [ ] Provide property management ID(s)
   - [ ] Define polling frequency

2. **From Development Team:**
   - [ ] Create database migration for bved_documents table
   - [ ] Implement API routes
   - [ ] Implement bvedService
   - [ ] Create scheduled job for polling
   - [ ] Set up monitoring and alerting
   - [ ] Write tests
   - [ ] Deploy to staging for testing

---

## Support & Contact

For technical questions or issues:
- Technical Lead: [Name]
- Email: [Email]
- Slack: #bved-integration

For bved specification questions:
- Visit: https://www.bved.de/
- Email: info@bved.de

---

*Last Updated: October 25, 2025*
*Version: 1.0*



