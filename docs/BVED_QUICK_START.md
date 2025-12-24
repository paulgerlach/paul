# bved API Integration - Quick Start Guide

## For Paul: What We Need From You

To start implementing the bved API integration, we need the following information for each of the 5 measurement service company platforms:

### Platform Information Form

Please fill out this form for each platform:

```yaml
Platform Name: _______________________

# API Access
Endpoint URL: https://_______________
API Version: _______________________
Username: __________________________
Password: __________________________

# Company Information
Property Management ID: ____________
Customer Number: ___________________
Contact Person: ____________________
Contact Email: _____________________
Contact Phone: _____________________

# Technical Details
Supported Document Types: 
  - [ ] E898 (Tenant billing images)
  - [ ] HKA-G (Heating billing - complete)
  - [ ] HKA-E (Heating billing - tenant)
  - [ ] UVI-G (Annual consumption info - complete)
  - [ ] UVI-E (Annual consumption info - tenant)
  - [ ] D (Balance record)
  - [ ] E (Result record)
  - [ ] Other: _____________________

Poll Frequency: 
  - [ ] Hourly
  - [ ] Every 6 hours
  - [ ] Daily (recommended)
  - [ ] Weekly

Buildings/Properties Covered:
  - Property 1: _____________________
  - Property 2: _____________________
  - Property 3: _____________________

Priority Level:
  - [ ] High (implement first)
  - [ ] Medium
  - [ ] Low

Test Environment Available:
  - [ ] Yes (URL: __________________)
  - [ ] No

Notes/Special Requirements:
_________________________________
_________________________________
```

---

## For Developers: Getting Started

### Prerequisites

- Node.js 18+
- Access to Heidi Systems Supabase project
- Access to Vercel deployment
- Platform credentials (from Paul)

### Step 1: Clone and Setup

```bash
cd "Utility FullStack App Monitor"
pnpm install
```

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# MSC Platform 1
MSC_1_NAME="Platform Name"
MSC_1_ENDPOINT="https://api.platform1.com"
MSC_1_USERNAME="heidi_systems"
MSC_1_PASSWORD="secure_password"
MSC_1_PM_ID="0000123456"
MSC_1_ACTIVE="true"

# MSC Platform 2
MSC_2_NAME="Platform Name"
MSC_2_ENDPOINT="https://api.platform2.com"
MSC_2_USERNAME="heidi_systems"
MSC_2_PASSWORD="secure_password"
MSC_2_PM_ID="0000123456"
MSC_2_ACTIVE="true"

# ... (platforms 3, 4, 5)

# bved Configuration
BVED_POLL_INTERVAL="1440" # minutes (daily)
BVED_BATCH_SIZE="100"
BVED_RETRY_ATTEMPTS="3"
BVED_RETRY_DELAY="5" # minutes
```

### Step 3: Create Database Tables

Run migration:

```bash
# Create migration file
pnpm supabase migration new create_bved_tables

# Apply migration
pnpm supabase db push
```

Migration SQL:

```sql
-- bved_documents table
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
  content TEXT,
  hashvalue TEXT,
  metadata JSONB,
  info JSONB,
  
  -- Status
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

-- bved_platforms table
CREATE TABLE bved_platforms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  username TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  pm_id TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  supported_doc_types TEXT[],
  poll_interval INTEGER DEFAULT 1440,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- bved_sync_log table
CREATE TABLE bved_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id TEXT REFERENCES bved_platforms(id),
  sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL,
  documents_fetched INTEGER DEFAULT 0,
  documents_processed INTEGER DEFAULT 0,
  documents_failed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bved_documents_user_id ON bved_documents(user_id);
CREATE INDEX idx_bved_documents_direction ON bved_documents(direction);
CREATE INDEX idx_bved_documents_status ON bved_documents(status);
CREATE INDEX idx_bved_documents_doctype ON bved_documents(doctype);
CREATE INDEX idx_bved_documents_msc_id ON bved_documents(msc_id);
CREATE INDEX idx_bved_documents_created_at ON bved_documents(created_at DESC);
CREATE INDEX idx_bved_sync_log_platform_id ON bved_sync_log(platform_id);
CREATE INDEX idx_bved_sync_log_created_at ON bved_sync_log(created_at DESC);

-- RLS Policies
ALTER TABLE bved_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bved_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bved_sync_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY "Users can view own documents" ON bved_documents
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see all documents
CREATE POLICY "Admins can view all documents" ON bved_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.permission = 'admin'
    )
  );

-- Only admins can view platforms and sync logs
CREATE POLICY "Admins can view platforms" ON bved_platforms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.permission = 'admin'
    )
  );

CREATE POLICY "Admins can view sync logs" ON bved_sync_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.permission = 'admin'
    )
  );
```

### Step 4: Create Service Layer

Create `src/services/bvedService.ts`:

```typescript
import { supabaseServer } from '@/utils/supabase/server';
import * as zlib from 'zlib';
import { promisify } from 'util';
import * as crypto from 'crypto';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// ... (see API_DOCUMENTATION.md for full implementation)
```

Create `src/types/bved.ts`:

```typescript
export type BvedDocumentType = 
  | 'A' | 'D' | 'E' | 'W' | 'P' 
  | 'E835' | 'E898' | 'LM' | 'BK' | 'RUL'
  | 'HKA-G' | 'HKA-E' | 'UVI-G' | 'UVI-E' 
  | 'OTHER';

export type BvedReferenceType = 
  | 'billingunit' | 'residentialunit' | 'resident'
  | 'device' | 'building' | 'package' 
  | 'transaction' | 'order';

export type BvedStatusType = 'ok' | 'error' | 'warning' | 'pending';

export interface BvedDocument {
  documentid?: string;
  filename: string;
  filesize: number;
  filesizecompressed?: number;
  filedate: string;
  doctype: BvedDocumentType;
  doctypedetail?: string;
  doctypeversion?: string;
  mimetype: string;
  propertymanagement: string;
  content?: string;
  hashvalue?: string;
  metadata?: BvedMetadata[];
  info?: Record<string, any>;
  _links?: {
    self?: { href: string };
  };
}

export interface BvedMetadata {
  reftype: BvedReferenceType;
  mscnumber?: string;
  pmnumber?: string;
  from?: string;
  to?: string;
}

export interface BvedStatus {
  statustype: BvedStatusType;
  code: number;
  message?: string;
}

export interface BvedPlatformConfig {
  id: string;
  name: string;
  endpoint: string;
  credentials: {
    username: string;
    password: string;
  };
  propertyManagementId: string;
  supportedDocTypes: BvedDocumentType[];
  apiVersion: string;
  pollInterval: number;
  active: boolean;
}
```

### Step 5: Create API Routes

Create directory structure:

```bash
mkdir -p src/app/api/bved/documents/out/[documentid]/data
mkdir -p src/app/api/bved/documents/out/[documentid]/status
mkdir -p src/app/api/bved/documents/out/count
mkdir -p src/app/api/bved/documents/out/status/ok
mkdir -p src/app/api/bved/documents/in
```

Example endpoint (`src/app/api/bved/documents/out/count/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getAuthenticatedServerUser } from '@/utils/auth/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedServerUser();
    const supabase = await supabaseServer();

    const { count, error } = await supabase
      .from('bved_documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('direction', 'out')
      .eq('status', 'pending');

    if (error) {
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6: Test Connection

Create a test script (`scripts/test-bved-connection.ts`):

```typescript
import { BvedService } from '@/services/bvedService';

async function testConnection() {
  const service = new BvedService();
  
  const config = {
    endpoint: process.env.MSC_1_ENDPOINT!,
    credentials: {
      username: process.env.MSC_1_USERNAME!,
      password: process.env.MSC_1_PASSWORD!
    }
  };

  try {
    console.log('Testing connection to MSC...');
    const result = await service.fetchDocumentsFromMSC(
      config.endpoint,
      config.credentials,
      0,
      1
    );
    console.log('✅ Connection successful!');
    console.log('Documents available:', result.documents?.length || 0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run test:

```bash
npx tsx scripts/test-bved-connection.ts
```

### Step 7: Create Sync Job

Create scheduled function:

```bash
mkdir -p supabase/functions/bved-sync
```

Create `supabase/functions/bved-sync/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get active platforms
    const { data: platforms } = await supabase
      .from('bved_platforms')
      .select('*')
      .eq('active', true);

    const results = [];
    
    for (const platform of platforms || []) {
      // Sync logic here
      results.push({
        platform: platform.name,
        status: 'success'
      });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

Deploy function:

```bash
pnpm supabase functions deploy bved-sync
```

Set up cron job (in Supabase dashboard):
- Navigate to Database → Cron Jobs
- Create new job: `0 2 * * *` (daily at 2 AM)
- Command: Call the edge function

---

## Testing Checklist

### Unit Tests
- [ ] Document hash verification
- [ ] Content compression/decompression
- [ ] Base64 encoding/decoding
- [ ] Document validation

### Integration Tests
- [ ] Fetch documents from MSC
- [ ] Download specific document
- [ ] Verify hash
- [ ] Send status back to MSC
- [ ] Upload document to MSC

### End-to-End Tests
- [ ] Full sync cycle
- [ ] Error handling
- [ ] Retry logic
- [ ] Data persistence

---

## Common Issues & Solutions

### Issue: Authentication Failed (401)

**Cause:** Invalid credentials or expired token

**Solution:**
1. Verify credentials in `.env.local`
2. Check if account is active with MSC
3. Contact MSC support

### Issue: Hash Verification Failed

**Cause:** Document corrupted during transfer

**Solution:**
1. Re-download document
2. Check network stability
3. Verify decompression logic

### Issue: Document Not Found (404)

**Cause:** Document already acknowledged

**Solution:**
1. Check if document was already processed
2. Update local status
3. Move to next document

### Issue: Rate Limited (429)

**Cause:** Too many requests to MSC API

**Solution:**
1. Implement exponential backoff
2. Reduce poll frequency
3. Use batch operations

---

## Monitoring & Logging

### What to Monitor

1. **Sync Success Rate**
   - Target: >99%
   - Alert if: <95% over 24 hours

2. **Document Processing Time**
   - Target: <5 seconds per document
   - Alert if: >30 seconds

3. **Hash Verification Failures**
   - Target: 0%
   - Alert if: >1%

4. **Authentication Failures**
   - Target: 0%
   - Alert immediately

### Logging

Log all events to:
- Supabase `bved_sync_log` table
- Application logs (Vercel)
- Slack notifications (for errors)

Example log entry:

```typescript
await supabase.from('bved_sync_log').insert({
  platform_id: 'msc-1',
  sync_started_at: new Date().toISOString(),
  status: 'success',
  documents_fetched: 10,
  documents_processed: 10,
  documents_failed: 0
});
```

---

## Deployment Checklist

### Development
- [ ] Code implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Code reviewed
- [ ] Documentation updated

### Staging
- [ ] Deploy to staging
- [ ] Configure test credentials
- [ ] Run full test suite
- [ ] Performance testing
- [ ] Security review

### Production
- [ ] Stakeholder approval
- [ ] Production credentials configured
- [ ] Database migrations run
- [ ] Application deployed
- [ ] Monitoring configured
- [ ] Team notified
- [ ] First sync verified

---

## Support & Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Implementation Roadmap](./API_IMPLEMENTATION_ROADMAP.md)
- [bved Specification](../bved-documents-1-3.openapi.yaml)

### Team Contacts
- **Backend Lead:** Saad
- **Product Owner:** Paul
- **Tech Lead:** Nic

### External Resources
- bved Website: https://www.bved.de/
- bved Support: info@bved.de

---

## Next Steps

1. **Paul:** Fill out platform information forms (above)
2. **Dev Team:** Set up development environment
3. **Dev Team:** Create database schema
4. **Dev Team:** Implement service layer
5. **Dev Team:** Test with first platform
6. **Everyone:** Review and iterate

---

*Last Updated: October 25, 2025*
*Version: 1.0*



