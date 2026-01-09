# Paul's Task Breakdown - Detailed Requirements

> **Purpose:** Clarify vague Notion tasks with proper requirements, complexity ratings, and time estimates
> **Date:** November 27, 2025
> **Based on:** Current system architecture + recent conversations

---

## Task Analysis Summary

| Task | Before Score | After Score | Accuracy Score | Complexity | Est. Time | Assignee Suggestion |
|------|--------------|-------------|----------------|------------|-----------|---------------------|
| 1. PDF Automation | 3/10 | 8/10 | 9/10 | Very High | 3-5 days | Senior Dev (Paul/Nic) |
| 2. Document Management | 2/10 | 9/10 | 9/10 | High | 2-3 days | Mid-Senior Dev |
| 3. Text Changes | 1/10 | 9/10 | 8/10 | Low | 2-4 hours | Junior Dev/Designer |
| 4. Carousel Changes | 2/10 | 8/10 | 8/10 | Low | 2-3 hours | Junior Dev/Designer |
| 5. Mobile Ready | 4/10 | 9/10 | 9/10 | High | 3-4 days | Mid-Senior Dev |
| 6. New Landing Pages | 1/10 | 7/10 | 6/10 | Medium | 2-3 days | Mid Dev + Designer |
| 7. Apartment Sort/Filter | 5/10 | 9/10 | 9/10 | Low | 3-4 hours | Junior-Mid Dev |
| 8. Chatbot Implementation | 2/10 | 8/10 | 7/10 | Very High | 5-7 days | Senior Dev + Integration |
| 9. Make.com Integrations | 3/10 | 8/10 | 8/10 | Medium | 1-2 days | Mid Dev (Make.com exp) |
| 10. New Email Template | 4/10 | 9/10 | 9/10 | Low | 3-4 hours | Junior-Mid Dev |
| 11. Logo Replacement | 2/10 | 9/10 | 9/10 | Very Low | 1 hour | Designer/Junior Dev |
| 12. Notification System | 6/10 | 9/10 | 9/10 | Medium | 1-2 days | Mid Dev |

**Scoring Legend:**
- **Before Score:** How clear is the original Notion task? (1=very vague, 10=crystal clear)
- **After Score:** How clear is our interpretation? (1=still unclear, 10=actionable spec)
- **Accuracy Score:** Confidence we understood Paul's intent (1=guessing, 10=certain)

---

## 1. PDF Automation

### Original Task (3/10 Clarity)
> "PDF automation" - Dashboard - High Priority - Building

### Our Interpretation (8/10 → 9/10 Accuracy)

**Requirement:**
Automate the generation and management of PDF documents for heating bills (Heizkostenabrechnung) and utility bills (Betriebskostenabrechnung).

**Current State:**
- ✅ PDF generation exists (`HeatingBillPreviewFourPDF.tsx`)
- ✅ Manual triggers available
- ❌ No automated scheduling
- ❌ No batch generation for multiple units
- ❌ No email delivery automation

**What Paul Likely Wants:**
1. **Automated Monthly/Yearly PDF Generation**
   - Schedule: Generate bills automatically at month/year end
   - Batch processing: Generate for all locals/apartments in one action
   - Error handling: Retry failed generations

2. **Auto-delivery System**
   - Email PDFs to tenants automatically
   - Make.com webhook trigger for PDF generation complete
   - Store generated PDFs in Supabase storage

3. **Admin Dashboard Controls**
   - Bulk generate button (all apartments)
   - Preview before sending
   - Generation history/logs
   - Regenerate failed PDFs

**Technical Approach:**
```typescript
// 1. Create scheduled function
// supabase/functions/auto-generate-pdfs/index.ts
- Cron job (runs monthly)
- Fetch all apartments due for billing
- Generate PDFs in batches (10 at a time)
- Upload to Supabase storage
- Trigger Make.com webhook for email delivery

// 2. Admin UI components
// src/components/Admin/BulkPDFGeneration.tsx
- Select date range
- Select buildings/apartments
- Preview mode toggle
- Generate & Send button
```

**Complexity:** Very High
- Involves PDF generation, scheduling, batch processing, email integration, error handling

**Time Estimate:** 3-5 days
- Day 1: Cron job setup + batch PDF generation logic
- Day 2: Supabase storage integration + download URLs
- Day 3: Make.com webhook for email delivery
- Day 4: Admin UI for manual triggers
- Day 5: Testing + error handling

**Assignee:** Senior Developer (Paul or Nic)
- Requires knowledge of: PDF generation, Supabase functions, Make.com, batch processing

**Dependencies:**
- Make.com webhook for email delivery (Task #9)
- Document storage structure (Task #2)

---

## 2. Document Adjustments, Editing, Adding, Downloading

### Original Task (2/10 Clarity)
> "document adjustments, editing, adding, downloading. Different files and folder" - Dashboard/Documents - High Priority

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Improve the document management system for admin and user documents (PDFs, images, contracts, bills).

**Current State:**
- ✅ Upload exists (`/dokumente` page)
- ✅ Download works
- ✅ Delete function exists
- ❌ No editing capability
- ❌ No folder organization
- ❌ No version control
- ❌ No batch operations

**What Paul Likely Wants:**

1. **Folder/Category System**
   - Organize by: Contracts, Bills, Reports, Images, Other
   - Building-level folders
   - Apartment-level subfolders
   - Breadcrumb navigation

2. **Document Operations**
   - ✅ Upload (existing)
   - ✅ Download (existing)
   - ✅ Delete (existing)
   - 🆕 Rename documents
   - 🆕 Move to different folder
   - 🆕 Replace/update (versioning)
   - 🆕 Bulk delete/move
   - 🆕 Preview (PDF viewer in modal)

3. **Metadata Management**
   - Document type (contract, bill, etc.)
   - Upload date
   - Related apartment/building
   - Document period (for bills)
   - Tags/labels

4. **Search & Filter**
   - Search by filename
   - Filter by type, date, building
   - Sort by date, name, size

**Technical Approach:**
```typescript
// 1. Update database schema
// Add tables:
- document_folders (id, name, parent_id, building_id)
- document_metadata (doc_id, type, tags, period_start, period_end)

// 2. Create components
// src/components/Admin/Docs/FolderTree.tsx
// src/components/Admin/Docs/DocumentGrid.tsx
// src/components/Admin/Docs/DocumentOperations.tsx

// 3. Update Supabase storage structure
// From: flat storage
// To: organized by building/apartment/type
```

**Files to Modify:**
- `src/app/(admin)/dokumente/page.tsx`
- `src/components/Admin/Docs/DokumenteLayout/DokumenteLayout.tsx`
- `src/hooks/useDocumentService.ts`
- New: `src/db/schema/documents.ts`

**Complexity:** High
- File system design, database schema updates, UI/UX for file management

**Time Estimate:** 2-3 days
- Day 1: Database schema + folder structure
- Day 2: CRUD operations + file operations
- Day 3: UI components + search/filter

**Assignee:** Mid-Senior Developer
- Requires: Supabase storage, React, database design

---

## 3. Text Changes - See List

### Original Task (1/10 Clarity)
> "Text changes - see list" - Pricepage - Medium Priority - Bug

### Our Interpretation (9/10 → 8/10 Accuracy)

**Requirement:**
Update text content on the pricing page (`/preise`).

**Current State:**
- Page exists at `src/app/(base)/preise/page.tsx`
- Likely has outdated pricing or text

**What Paul Likely Wants:**
❓ **NEEDS CLARIFICATION FROM PAUL:**
- What specific text needs to change?
- Is there a list somewhere? (Slack, email, document?)
- Is it pricing numbers or description text?

**Assumption (Most Likely):**
Based on German market focus, probably:
1. Update pricing tiers
2. Fix German grammar/spelling
3. Update feature descriptions
4. Add/remove pricing options

**Action Required:**
1. **Ask Paul for the list** (Slack/email)
2. Once received, update text in:
   - `src/app/(base)/preise/page.tsx`
   - Or if using Prismic CMS: update in Prismic dashboard

**Technical Approach:**
```typescript
// If hardcoded:
// Just update text in src/app/(base)/preise/page.tsx

// If from CMS:
// Update in Prismic dashboard, no code changes
```

**Complexity:** Very Low
- Simple text updates

**Time Estimate:** 2-4 hours
- Includes: Getting list, making changes, testing, deploying

**Assignee:** Junior Developer or Designer
- Basic Next.js/React knowledge sufficient

**BLOCKER:** Need the actual list from Paul ⚠️

---

## 4. Carousel Image and Text Changes

### Original Task (2/10 Clarity)
> "Carousell image and text changes" - Mainpage - Medium Priority - Bug

### Our Interpretation (8/10 → 8/10 Accuracy)

**Requirement:**
Update the homepage carousel/testimonials section.

**Current State:**
- Homepage has:
  - `PersonSwiper` component (testimonials)
  - `NewsSwiper` / `NewsList` component
  - Various image carousels
- Located in `src/app/(base)/page.tsx`

**What Paul Likely Wants:**

Likely referring to **PersonSwiper** (testimonials section):
- Current: Shows "Fabian Höhne, Vitolus" testimonial
- Update needed: New testimonial images/text

**Possible Changes:**
1. **Replace testimonial images**
   - New customer photos
   - Partner company logos
   
2. **Update testimonial text**
   - New customer quotes
   - Updated company names

3. **Update partner logos carousel**
   - Add new partners (flyla, sameday, wemolo, etc.)
   - Remove old partners

**Files to Check:**
- `src/components/Swipers/PersonSwiper.tsx`
- `src/components/Swipers/NewsSwiper.tsx`
- `src/app/(base)/page.tsx` (lines 351-400)
- Image assets in `public/` or `src/asset/`

**Technical Approach:**
```typescript
// Update PersonSwiper component
// src/components/Swipers/PersonSwiper.tsx

// Replace images in /public or import new assets
// Update testimonial text strings
```

**Complexity:** Low
- Image replacement + text updates

**Time Estimate:** 2-3 hours
- Includes: Getting new images/text, updating code, testing responsive

**Assignee:** Junior Developer or Designer
- Requires: Basic React, image optimization

**NEEDS FROM PAUL:**
- New images (customer photos, logos)
- New testimonial text
- Which specific carousel section?

---

## 5. Mobile Ready

### Original Task (4/10 Clarity)
> "Mobile ready" - all pages; Dashboard - Medium Priority - Building

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Ensure all pages are fully responsive and mobile-optimized.

**Current State:**
- ✅ Homepage has mobile styles (Tailwind responsive classes)
- ⚠️ Dashboard partially responsive
- ❌ Some admin pages not mobile-optimized
- ❌ Charts may overflow on mobile

**What Paul Likely Wants:**

**Priority Pages to Fix:**
1. **User Dashboard** (`/dashboard`)
   - Charts should stack vertically on mobile
   - Date picker should be touch-friendly
   - Apartment dropdown accessible
   - Gauges should resize properly

2. **Shared Dashboard** (`/shared/dashboard`)
   - Same as user dashboard
   - QR code display on mobile

3. **Admin Pages**
   - `/admin` - admin dashboard
   - `/objekte` - buildings management
   - `/heizkostenabrechnung` - heating bill creation flow
   - `/dokumente` - document management

4. **Public Pages** (already mostly done)
   - Homepage ✅
   - `/funktionen` ✅
   - `/kontakt` ✅
   - `/blog` ✅

**Specific Issues to Fix:**

```typescript
// 1. Dashboard Charts
// src/components/Admin/DashboardCharts/DashboardCharts.tsx
- Charts overflow on small screens
- Need: grid-cols-1 on mobile, grid-cols-2 on tablet

// 2. Data Tables
// Various admin pages with tables
- Tables need horizontal scroll on mobile
- Or: Card view on mobile instead of table

// 3. Date Pickers
// src/components/Basic/Dropdown/AdminDatetimeDropdown.tsx
- Calendar popup goes off-screen
- Need: bottom positioning check

// 4. Navigation/Sidebar
// src/components/Header/Header.tsx
// src/components/Admin/Sidebar/AdminSidebar.tsx
- Mobile menu hamburger
- Collapsible sidebar on mobile
```

**Testing Checklist:**
- [ ] iPhone SE (375px) - smallest common mobile
- [ ] iPhone 12/13 (390px)
- [ ] Samsung Galaxy (412px)
- [ ] iPad Mini (768px) - tablet
- [ ] iPad (810px) - tablet

**Technical Approach:**
1. **Audit all pages** (use Chrome DevTools responsive mode)
2. **Apply Tailwind responsive classes:**
   - `max-small:`, `max-medium:`, `max-large:` (already in use)
   - Check all hardcoded widths/heights
3. **Test touch interactions:**
   - Buttons large enough (min 44px)
   - No hover-only interactions
4. **Chart responsiveness:**
   - Recharts responsive container
   - Font sizes scale down

**Complexity:** High
- Requires testing many pages, multiple device sizes

**Time Estimate:** 3-4 days
- Day 1: Dashboard + charts mobile optimization
- Day 2: Admin pages (objekte, docs, billing)
- Day 3: Forms and input components
- Day 4: Testing + edge cases

**Assignee:** Mid-Senior Developer
- Requires: CSS/Tailwind expertise, responsive design knowledge

---

## 6. New Landing Pages

### Original Task (1/10 Clarity)
> "New Landing pages" - Medium Priority - Building

### Our Interpretation (7/10 → 6/10 Accuracy)

**Requirement:**
Create new landing pages (purpose unclear).

**Possible Interpretations:**

**Option A: New Public Pages** (60% likely)
- `/produkte` - Products page (different devices)
- `/dienstleistungen` - Services page
- `/standorte` - Locations page (72 locations mentioned)
- `/partner` - Partners page

**Option B: Marketing Landing Pages** (30% likely)
- Campaign-specific pages for ads
- `/warmwasserzaehler` - Specific product landing
- `/heizkostenabrechnung-software` - Service landing
- SEO-optimized for specific keywords

**Option C: Internal Landing Pages** (10% likely)
- Dashboard onboarding pages
- Welcome pages for new users

**What We Need from Paul:**
1. ❓ How many landing pages?
2. ❓ What topics/products?
3. ❓ Design references or wireframes?
4. ❓ Copy/content provided or need to write?
5. ❓ SEO keywords to target?

**Assumed Approach (Best Guess):**

Create 3-4 product-focused landing pages:

1. **`/warmwasserzaehler`** - Warm water meters
2. **`/kaltwasserzaehler`** - Cold water meters  
3. **`/heizkosten`** - Heating cost meters
4. **`/rauchmelder`** - Smoke detectors

**Each page structure:**
- Hero section with product image
- Features/benefits
- Technical specs
- Pricing
- Installation process
- CTA (Jetzt installieren lassen)
- FAQ section

**Technical Approach:**
```typescript
// Create new pages
// src/app/(base)/warmwasserzaehler/page.tsx
// src/app/(base)/kaltwasserzaehler/page.tsx
// etc.

// Reusable components
// src/components/LandingPage/ProductHero.tsx
// src/components/LandingPage/FeatureGrid.tsx
// src/components/LandingPage/TechSpecs.tsx

// Add to sitemap
// src/app/sitemap.ts
```

**Complexity:** Medium
- Requires design + copywriting + implementation

**Time Estimate:** 2-3 days per page
- Or: 2-3 days for reusable template + 4 hours per page instance

**Assignee:** Mid Developer + Designer
- Developer: Next.js pages, components
- Designer: Page designs, copy

**BLOCKER:** Need specifications from Paul ⚠️

---

## 7. Apartments Sort Alphabetic - Filter Function

### Original Task (5/10 Clarity)
> "apartments sort alphabetic - filter function" - Dashboard - Medium Priority - Bug

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Add sorting and filtering to apartment/local selection dropdown in admin dashboard.

**Current State:**
- Dropdown exists: `AdminApartmentsDropdown.tsx`
- Shows apartments but no sorting/filtering
- Hard to find specific apartment in long lists

**What Paul Wants:**

**1. Alphabetic Sorting:**
```typescript
// Sort apartments by name (A-Z)
// Currently unsorted or sorted by ID
apartments.sort((a, b) => a.name.localeCompare(b.name, 'de'))
```

**2. Filter/Search:**
```typescript
// Search input above dropdown
// Filter by apartment name or number
<input 
  placeholder="Suche Wohnung..." 
  onChange={(e) => filterApartments(e.target.value)}
/>
```

**3. Additional Filters (nice-to-have):**
- Filter by building
- Filter by active/inactive
- Filter by has errors

**File to Modify:**
- `src/components/Basic/Dropdown/AdminApartmentsDropdown.tsx`

**Technical Implementation:**
```typescript
// src/components/Basic/Dropdown/AdminApartmentsDropdown.tsx

export function AdminApartmentsDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const filteredAndSorted = useMemo(() => {
    let result = apartments;
    
    // Filter by search
    if (searchTerm) {
      result = result.filter(apt => 
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.unit_number?.includes(searchTerm)
      );
    }
    
    // Sort alphabetically
    result = result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'de');
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [apartments, searchTerm, sortOrder]);
  
  return (
    <div>
      <input 
        type="text"
        placeholder="Wohnung suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
      {/* Dropdown with filteredAndSorted */}
    </div>
  );
}
```

**Complexity:** Low
- Simple array sorting and filtering logic

**Time Estimate:** 3-4 hours
- 2 hours: Implementation
- 1 hour: Testing
- 1 hour: Edge cases (empty state, no results)

**Assignee:** Junior-Mid Developer
- Requires: React hooks (useState, useMemo), basic sorting algorithms

**Benefits:**
- Faster apartment lookup for admins
- Better UX with many apartments
- Reduces errors from selecting wrong apartment

---

## 8. Chatbot Implementation
Hi Paul,

Here’s the simplified structure for the chatbot planning.
You only need to answer Level 1 unless you want a more advanced version.

LEVEL 1 — BASIC (5 minutes, required)

What I need from you:

Main purpose (FAQ, leads, support, navigation?)

Budget (€0, €50, €200+?)

Timeline (ASAP, 2–3 weeks, 1–2 months?)

Type (Third-party tool vs custom build)

Audience (Users, visitors, everyone?)

→ If you want something simple, we stop here.

LEVEL 2 — MEDIUM (Optional, only if custom)

If you want more control:

Features (AI or pre-written replies, languages, live chat)

User experience (placement, data collection)

Data access (what it can “see”)

Analytics (what we track)

LEVEL 3 — ADVANCED (Optional, only for AI-heavy)

For high-end AI chatbot:

Intelligence level (basic → expert)

Knowledge base setup

System integrations (billing, consumption data, appointments)

GDPR/privacy rules

Escalation & error handling

Branding

Success metrics & maintenance
### Original Task (2/10 Clarity)
> "Chatbot implementation" - all pages; Dashboard - Medium Priority - Building

### Our Interpretation (8/10 → 7/10 Accuracy)

**Requirement:**
Add a chatbot widget to assist users with questions and navigation.

**What Paul Likely Wants:**

**Purpose:**
- Answer FAQ about devices, installation, billing
- Help users navigate dashboard
- Reduce support tickets
- Lead generation (for non-customers)

**Chatbot Type Options:**

**Option A: AI Chatbot** (OpenAI, Claude)
- Smart, contextual responses
- Can answer complex questions
- More expensive
- Requires AI integration

**Option B: Rule-based Chatbot**
- Predefined Q&A flows
- Button-based navigation
- Cheaper
- Easier to implement

**Option C: Third-party Widget** (Intercom, Drift, Tawk.to)
- Ready-made solution
- Includes live chat option
- Subscription cost
- Fastest to implement

**Recommended Approach:** Option C + B
- Use **Tawk.to** (free tier) or **Crisp** (affordable)
- Pre-configure FAQ answers
- Option for live chat if needed
- Low development effort

**Alternative (Custom AI):**
If Paul wants custom solution:

```typescript
// 1. Create chatbot component
// src/components/Chatbot/ChatWidget.tsx
- Floating button (bottom right)
- Chat window modal
- Message history
- Input box

// 2. Backend API
// src/app/api/chatbot/route.ts
- Integrate OpenAI API
- Context: FAQ docs, user's current page
- Streaming responses

// 3. Knowledge Base
// Create FAQ document database
- Common questions about devices
- Installation process
- Billing questions
- Dashboard help
```

**Integration Points:**
- All public pages: FAQ-focused (products, installation)
- Dashboard: Help with navigation, reading charts
- Admin: Support for admin functions

**Technical Approach (Third-party):**
```typescript
// 1. Sign up for Tawk.to or Crisp
// 2. Get embed code
// 3. Add to root layout

// src/app/layout.tsx
export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Script id="tawk-to">
          {`
            var Tawk_API = Tawk_API || {};
            // Tawk.to embed code
          `}
        </Script>
      </body>
    </html>
  );
}
```

**Technical Approach (Custom AI):**
- Much more complex
- Requires: OpenAI API, database for chat history, streaming implementation
- See estimate below

**Complexity:**
- Third-party: Very Low
- Custom basic: Medium
- Custom AI: Very High

**Time Estimate:**
- **Third-party:** 2-3 hours (setup + config)
- **Custom basic:** 2-3 days
- **Custom AI:** 5-7 days

**Assignee:**
- Third-party: Junior Developer
- Custom AI: Senior Developer

**Cost Consideration:**
- Tawk.to: FREE
- Crisp: $25/month
- OpenAI API: ~$20-100/month (depends on usage)

**Recommendation:**
Start with Tawk.to (free), configure FAQ, evaluate effectiveness before building custom.

**NEEDS FROM PAUL:**
See detailed questionnaire below in 3 levels (Easy → Medium → Complex)

---

### 🎯 Chatbot Recommendation (CEO Brief)

**My Recommendation:** Start with **Option A** (Free Third-Party). It's instant, zero risk, and proves value. We can upgrade later if users actually use it.

#### **Decision Required: Choose One Option**

| Option | Best For | Time | Monthly Cost | My CTO Score |
|--------|----------|------|--------------|--------------|
| **A) Tawk.to / Crisp (Free)** | Testing demand instantly | 3 hours | €0 | ⭐⭐⭐⭐⭐ |
| **B) Custom FAQ Bot** | Full control & branding | 2-3 days | €0 | ⭐⭐⭐ |
| **C) AI Chatbot (OpenAI)** | Complex support automation | 1 week+ | €50+ | ⭐⭐ |

---

**Why Option A?**
1. **Speed:** Live today, not next week.
2. **Cost:** Free forever tier is enough for now.
3. **Features:** Has live chat + simple bot + mobile app for you to reply on the go.
4. **Risk:** None. If no one chats, we lost nothing.

**Action:**
- If you agree with Option A: **Give me a thumbs up**, and I'll install Tawk.to today.
- If you hate third-party widgets: **Tell me "Go Custom"**, and I'll schedule 3 days dev time.

---

## 9. Additional Make.com Integrations

### Original Task (3/10 Clarity)
> "Additional Make.com integrations" - overall - Medium Priority - Building

### Our Interpretation (8/10 → 8/10 Accuracy)

**Requirement:**
Expand Make.com webhook integrations for more automation.

**Current State:**
- ✅ Contact form webhook (recently implemented)
- ✅ Newsletter webhook
- ✅ Auth events webhook (registration, password reset)
- ✅ Questionnaire (fragebogen) webhook

**What Paul Likely Wants:**

**New Webhooks to Add:**

1. **PDF Generation Complete**
   - Trigger: When PDF is generated
   - Action: Email PDF to tenant
   - Related to: Task #1 (PDF automation)

2. **Device Error Notifications**
   - Trigger: Device error detected
   - Action: Email admin + tenant
   - Data: Device ID, error type, building/apartment

3. **New Document Upload**
   - Trigger: Admin uploads document
   - Action: Notify relevant tenant
   - Data: Document type, download link

4. **Monthly Consumption Report**
   - Trigger: End of month
   - Action: Email consumption summary to tenants
   - Data: Water, heat, electricity usage

5. **Appointment Scheduling**
   - Trigger: User requests installation
   - Action: Create calendar event, notify team
   - Integration: Google Calendar or Calendly

6. **User Registration Notifications**
   - Trigger: New user signs up
   - Action: Welcome email sequence (3 emails over 3 days)

**Technical Approach:**

```typescript
// 1. Create webhook endpoints
// src/utils/webhooks.ts (already exists, extend it)

export async function triggerMakeWebhook(event: string, data: any) {
  const webhookUrls = {
    'pdf-generated': process.env.MAKE_PDF_WEBHOOK_URL,
    'device-error': process.env.MAKE_ERROR_WEBHOOK_URL,
    'document-upload': process.env.MAKE_DOCUMENT_WEBHOOK_URL,
    'monthly-report': process.env.MAKE_MONTHLY_WEBHOOK_URL,
    'appointment': process.env.MAKE_APPOINTMENT_WEBHOOK_URL,
    // existing ones...
  };
  
  await fetch(webhookUrls[event], {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 2. Call from relevant locations
// Example: When PDF generated
// src/actions/generate-pdf.ts
await generatePDF(apartmentId);
await triggerMakeWebhook('pdf-generated', {
  apartmentId,
  pdfUrl,
  tenantEmail,
});
```

**Make.com Scenario Setup:**
For each webhook:
1. Create new scenario in Make.com
2. Webhook trigger
3. Email module or other action
4. Error handling
5. Get webhook URL
6. Add to `.env` file

**Files to Modify:**
- `src/utils/webhooks.ts` - add new webhook functions
- `supabase/functions/csv-parser/index.ts` - add error webhook
- PDF generation code - add completion webhook
- Document upload code - add upload webhook

**Complexity:** Medium
- Each webhook: 1-2 hours
- Make.com scenarios: 30 min each
- Total: 1-2 days for all

**Time Estimate:** 1-2 days
- 6 webhooks × 2 hours = 12 hours
- Testing: 4 hours

**Assignee:** Mid Developer (with Make.com experience)
- Requires: Webhook knowledge, Make.com platform experience

**Dependencies:**
- Need Make.com account access
- Need to define email templates in Make.com

---

## 10. Implementation of the New Email Template

### Original Task (4/10 Clarity)
> "Implementation of the new email template" - Make.com - Medium Priority - Building

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Update email templates sent via Make.com to match new brand design.

**Current State:**
- Emails sent from Make.com webhooks
- Basic text emails or simple HTML
- No consistent branding

**What Paul Likely Wants:**

**Email Types to Update:**
1. Welcome email (new user registration)
2. Password reset email
3. Contact form confirmation
4. Newsletter confirmation
5. PDF delivery email (bills)
6. Device error notification
7. Appointment confirmation

**New Template Should Have:**
- Heidi Systems branding (logo, colors)
- Responsive design (mobile-friendly)
- Professional layout
- CTA buttons styled properly
- Footer with company info + social links
- German language

**Design Requirements:**
- Colors: Green (#primary from your design system)
- Logo: admin_logo.png
- Typography: Exo 2 font (matching website)
- Footer: Address, phone, social media, unsubscribe

**Technical Approach:**

**Option A: MJML Templates** (Recommended)
```html
<!-- MJML is email-specific markup that compiles to responsive HTML -->
<mjml>
  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff">
      <!-- Header with logo -->
      <mj-column>
        <mj-image src="https://heidisystems.com/admin_logo.png" alt="Heidi Systems" width="150px"/>
      </mj-column>
    </mj-section>
    
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" font-family="Exo 2, Arial">
          {EMAIL_TITLE}
        </mj-text>
        <mj-text>
          {EMAIL_BODY}
        </mj-text>
        <mj-button background-color="#4CAF50" href="{CTA_URL}">
          {CTA_TEXT}
        </mj-button>
      </mj-column>
    </mj-section>
    
    <mj-section background-color="#333">
      <mj-column>
        <mj-text color="#ffffff" font-size="12px">
          Heidi Systems GmbH | Rungestrasse 21, 10179 Berlin
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

**Workflow:**
1. **Create MJML templates** (use MJML playground)
2. **Compile to HTML**
3. **Upload HTML to Make.com** (each scenario)
4. **Use variables** for dynamic content

**Option B: React Email** (if we want version control)
```typescript
// emails/WelcomeEmail.tsx
import { Html, Head, Body, Container } from '@react-email/components';

export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <h1>Willkommen, {userName}!</h1>
          {/* Rest of template */}
        </Container>
      </Body>
    </Html>
  );
}

// Then export to HTML and upload to Make.com
```

**Files to Create:**
```
/emails (new folder)
  ├── templates/
  │   ├── welcome.mjml
  │   ├── password-reset.mjml
  │   ├── pdf-delivery.mjml
  │   ├── device-error.mjml
  │   └── appointment.mjml
  ├── compiled/ (HTML output)
  └── README.md (instructions for Make.com upload)
```

**Implementation Steps:**
1. Create MJML templates (3-4 hours)
2. Test in Email on Acid or Litmus
3. Compile to HTML
4. Upload each template to Make.com scenarios
5. Test end-to-end (send test emails)

**Complexity:** Low
- Mostly design work, simple implementation

**Time Estimate:** 3-4 hours
- 2 hours: Create templates
- 1 hour: Upload to Make.com
- 1 hour: Testing

**Assignee:** Junior-Mid Developer or Designer
- Requires: HTML/CSS email knowledge, Make.com access

**Deliverables:**
- 7 email templates (MJML + HTML)
- Screenshots of test emails
- Make.com scenarios updated

**NEEDS FROM PAUL:**
- ❓ Design mockup or reference?
- ❓ Make.com account access?

---

## 11. Replace Some Logos on the Mainpage

### Original Task (2/10 Clarity)
> "Replace some logos on the mainpage" - Mainpage - Medium Priority - Bug

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Update partner/client logos on homepage.

**Current State:**
Homepage shows client logos:
- flyla, sameday, wemolo, parkdepot, vitolos, ki_akademie, fewocare, haus_hirst

**What Paul Likely Wants:**
Replace outdated logos with new client/partner logos.

**Logos Section Location:**
```typescript
// src/app/(base)/page.tsx (lines ~275-348)
<div className="grid col-span-2 items-center justify-center grid-cols-4">
  <Image src={flyla} alt="flyla" />
  <Image src={sameday} alt="sameday" />
  <Image src={wemolo} alt="wemolo" />
  // ... etc
</div>
```

**Import statements:**
```typescript
// src/static/icons (imported at top of page.tsx)
import {
  fewocare,
  flyla,
  haus_hirst,
  ki_akademie,
  parkdepot,
  sameday,
  vitolos,
  wemolo,
} from "@/static/icons";
```

**Implementation Steps:**
1. **Get new logo files from Paul**
   - Format: SVG or PNG (transparent background)
   - Size: ~200x100px (width x height)
   - Quality: High-res for retina displays

2. **Add logos to project**
   - Place in `src/asset/icons/` or `public/`
   - Export from `src/static/icons.ts`

3. **Replace in homepage**
   - Update imports
   - Update Image components
   - Ensure responsive sizing matches existing

4. **Test**
   - Check logos display correctly
   - Verify alt text for accessibility
   - Test on mobile (logos should shrink appropriately)

**Technical Steps:**
```typescript
// 1. Add new logo to src/static/icons.ts
import newClientLogo from "@/asset/icons/new-client-logo.svg";
export { newClientLogo };

// 2. Update src/app/(base)/page.tsx
import { newClientLogo } from "@/static/icons";

// Replace old logo
<Image 
  src={newClientLogo} 
  alt="New Client Name"
  className="inline-block mx-auto h-10"
/>
```

**Complexity:** Very Low
- Simple image replacement

**Time Estimate:** 1 hour
- 15 min: Add logo files
- 15 min: Update code
- 15 min: Test
- 15 min: Deploy

**Assignee:** Designer or Junior Developer
- Requires: Basic file management, Next.js Image component knowledge

**NEEDS FROM PAUL:**
- ❓ Which logos to replace? (list)
- ❓ New logo files (SVG/PNG)

---

## 12. Notification Implementation

### Original Task (6/10 Clarity)
> "Notification Implementation" - Dashboard - (No priority shown)

### Our Interpretation (9/10 → 9/10 Accuracy)

**Requirement:**
Improve or extend the existing notification system in the dashboard.

**Current State:**
- ✅ Notifications exist (`NotificationsChart.tsx`)
- ✅ Shows device errors
- ✅ Detects errors from CSV data (error flags)
- ⚠️ Notifications may not be real-time
- ❌ No notification center/history
- ❌ No mark as read/unread
- ❌ No push notifications

**What Paul Likely Wants:**

**Option A: Notification Center UI** (70% likely)
Create a notification dropdown/panel:
```
🔔 (3)  ← Click to open
└── Panel opens:
    ├── Gerät 53157195: Leckage erkannt [•]
    ├── Warmwasser Verbrauch +32% [•]
    └── Kaltwasser Verbrauch +42% [•]
    
    [Alle als gelesen markieren]
```

**Option B: Real-time Notifications** (20% likely)
- WebSocket or Server-Sent Events
- Instant notifications when device error occurs
- Browser notifications (with permission)

**Option C: Email Notifications** (10% likely)
- Already covered in Task #9 (Make.com integrations)

**Assumed Requirement: Option A**

**Implementation Plan:**

1. **Database Schema Update**
```sql
-- Add notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT, -- 'device-error', 'consumption-spike', etc.
  title TEXT,
  message TEXT,
  severity TEXT, -- 'info', 'warning', 'error'
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- device_id, apartment_id, etc.
);

-- Add index for user queries
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
```

2. **Create Notification Components**
```typescript
// src/components/Basic/NotificationCenter/NotificationBell.tsx
export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();
  
  return (
    <div className="relative">
      <button onClick={togglePanel}>
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <NotificationPanel 
          notifications={notifications}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
        />
      )}
    </div>
  );
}

// src/components/Basic/NotificationCenter/NotificationPanel.tsx
// List of notifications with mark as read functionality

// src/hooks/useNotifications.ts
// Fetch notifications from Supabase
// Real-time subscription to new notifications
```

3. **Generate Notifications**
```typescript
// When device error detected (CSV parser)
// supabase/functions/csv-parser/index.ts

if (deviceHasError) {
  await createNotification({
    user_id: apartmentOwnerId,
    type: 'device-error',
    title: 'Gerätfehler erkannt',
    message: `Leckage bei Gerät ${deviceId}`,
    severity: 'error',
    metadata: { deviceId, apartmentId, errorCode },
  });
}

// Also:
// - Consumption spike notifications
// - Maintenance reminders
// - Bill ready notifications
```

4. **Add to Header**
```typescript
// src/components/Header/Header.tsx
// Add NotificationBell next to login button

<Header>
  <NotificationBell />
  <LoginButton />
</Header>
```

**Features:**
- ✅ Unread count badge
- ✅ Dropdown panel
- ✅ Mark as read/unread
- ✅ Mark all as read
- ✅ Filter by type (errors, info, etc.)
- ✅ Real-time updates (Supabase subscriptions)
- ✅ Persistent (stored in database)

**Complexity:** Medium
- Database schema, API routes, UI components, real-time subscriptions

**Time Estimate:** 1-2 days
- Day 1: Database schema + API routes + notification creation logic
- Day 2: UI components (bell, panel, items) + real-time subscriptions

**Assignee:** Mid Developer
- Requires: Supabase, React, real-time subscriptions, state management

**Nice-to-haves (Future):**
- Browser push notifications (requires service worker)
- Email digest (daily summary)
- SMS notifications (critical errors)

---

## Summary & Recommendations

### Priority Matrix (Nic's Suggested Order)

**Week 1 - High Priority & Quick Wins:**
1. ✅ **SEO Optimization** (COMPLETED - 9.8/10)
2. 🔴 **Logo Replacement** (1 hour) - Junior Dev
3. 🔴 **Apartment Sort/Filter** (3-4 hours) - Junior/Mid Dev
4. 🔴 **Email Templates** (3-4 hours) - Designer/Junior Dev
5. 🟡 **Notification Center** (1-2 days) - Mid Dev

**Week 2 - Medium Priority:**
6. 🟡 **Document Management** (2-3 days) - Mid/Senior Dev
7. 🟡 **Make.com Integrations** (1-2 days) - Mid Dev
8. 🟡 **Mobile Optimization** (3-4 days) - Mid/Senior Dev

**Week 3-4 - High Complexity:**
9. 🔴 **PDF Automation** (3-5 days) - Senior Dev (Paul/Nic)
10. 🟡 **Chatbot** (depends on approach)
11. ❓ **New Landing Pages** (needs clarification)
12. ❓ **Text Changes** (needs list from Paul)
13. ❓ **Carousel Changes** (needs assets from Paul)

### Blockers Requiring Paul's Input

| Task | What We Need | Urgency |
|------|-------------|---------|
| Text Changes | List of specific text changes | High |
| Carousel Changes | New images + text content | High |
| New Landing Pages | Number, topics, designs | Medium |
| Chatbot | Budget, custom vs third-party | Medium |
| Email Templates | Design reference | Medium |
| Logo Replacement | New logo files | Low |

### Team Allocation Suggestions

**Junior Developer(s):**
- Logo replacement (1hr)
- Text changes once list provided (2-4hr)
- Carousel updates once assets provided (2-3hr)
- Email template implementation (3-4hr)

**Mid Developer(s):**
- Apartment sort/filter (3-4hr)
- Notification center (1-2 days)
- Make.com integrations (1-2 days)
- Mobile optimization (3-4 days)

**Senior Developer (Paul or Nic):**
- PDF automation (3-5 days)
- Document management system (2-3 days)
- Chatbot (if custom AI: 5-7 days)
- Code review for all tasks

**Designer:**
- Email templates (design)
- Landing page designs
- Logo preparation
- Mobile UX review

### Cost/Time Summary

**Total Estimated Time:** ~25-35 days of development work

**With team of 3 (Junior + Mid + Senior):**
- **Realistic completion:** 2-3 weeks

**Recommended Sprint Plan:**
- **Sprint 1 (Week 1):** Quick wins + blockers cleared
- **Sprint 2 (Week 2):** Medium complexity tasks
- **Sprint 3 (Week 3):** High complexity tasks

---

## Questions for Paul

Before starting, we need clarification on:

1. **Text Changes (Task #3):**
   - Where is the list of text changes?
   - Which page sections exactly?

2. **Carousel Changes (Task #4):**
   - Which carousel? (testimonials, partners, news?)
   - Can you provide new images/text?

3. **New Landing Pages (Task #6):**
   - How many pages?
   - What products/topics?
   - Do you have designs or should we create them?

4. **Chatbot (Task #8):**
   - Budget for chatbot service?
   - Custom vs third-party preferred?
   - Need AI or simple FAQ is okay?

5. **Email Templates (Task #10):**
   - Do you have design mockups?
   - Make.com account access available?

6. **Logo Replacement (Task #11):**
   - Which specific logos to replace?
   - New logo files ready?

---

## Next Steps

1. **Nic:** Send this document to Paul for review
2. **Paul:** Answer questions above
3. **Team:** Start with tasks that don't need clarification:
   - SEO (already done ✅)
   - Apartment sort/filter
   - Notification center
   - Mobile optimization
4. **Paul:** Prioritize task order based on business needs
5. **Weekly sync:** Review progress, adjust priorities

---

*Document created: November 27, 2025*
*Last updated: November 27, 2025*
*Version: 1.0*

