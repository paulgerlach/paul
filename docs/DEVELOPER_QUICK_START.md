# Developer Quick Start - Heidi Systems

**Read Time:** 5 minutes  
**Last Updated:** November 28, 2025

---

## What We're Building

**Heidi Systems** = Smart utility monitoring platform for German property managers.

**Flow:** Email with CSV → Automated parsing → Real-time dashboard → PDF billing

---

## Tech Stack

```
Frontend:  Next.js 15 + React 19 + TypeScript + TailwindCSS
Backend:   Supabase (PostgreSQL + Edge Functions + Auth)
Charts:    Recharts
Hosting:   Vercel
```

---

## Project Structure (Key Folders)

```
src/
├── app/
│   ├── dashboard/           # Main user dashboard
│   ├── shared/              # Public shared dashboards
│   └── api/                 # API routes
│
├── components/Basic/Charts/ # ⭐ Heat, Water, Electricity charts
├── hooks/useChartData.ts    # ⭐ Data fetching logic
├── utils/errorFlagInterpreter.ts # ⭐ Error detection
│
supabase/functions/csv-parser/ # ⭐ CSV processing Edge Function
```

---

## Database (Key Table)

### `csv_text` - Main data table

All meter readings stored here as JSONB:

```sql
- id, user_id, apartment_id
- device_type → "Heat", "Water", "Electricity", "Gas"
- data (jsonb) → Full CSV row
- date → Reading timestamp
```

**Important JSONB fields:**
- `"IV,0,0,0,Wh,E"` → Energy value
- `"IV,0,0,0,m³,V"` → Volume
- `"IV,0,0,0,,ErrorFlags(binary)"` → Error codes
- `"IV,0,0,0,,Status"` → Device status

---

## How Data Flows

```
1. Email (CSV) → Make.com → Webhook
2. Supabase Edge Function parses CSV
3. Insert into csv_text table
4. Dashboard fetches and displays
```

---


## Your Assignment: BVED API Integration

**Goal:** Integrate with 5 property management platforms

**What to build:**
1. REST endpoints (BVED standard)
2. Middleware (our data → BVED format)
3. Auth layer (OAuth/API keys)
4. Bi-directional flow:
   - PULL cost data from platforms
   - PUSH generated PDFs back

**Resources:**
- BVED Spec: https://bved.info/datenaustausch/spezifikationen/
- Kalo Example: https://developers.kalo.de
- Project Docs: `docs/BVED_INTEGRATION_SUMMARY.md`

**Next Steps:**
1. Read BVED spec
2. Draft technical design doc
3. Review with Nic
4. Start implementation

-
## Questions?

Ping **@Nic** on Slack

Welcome aboard! 🚀










