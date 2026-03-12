# Sponge Global — Complete Backend Implementation Documentation

> **Purpose**: This document describes every backend feature in the Sponge Global project in enough detail for an AI agent to rebuild the exact same backend from scratch. It covers the tech stack, environment variables, database schema, API routes, AI agent tools, admin dashboard, and all client-side integrations.

---

## 1. Tech Stack & Core Dependencies

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 13.5.1 |
| Language | TypeScript | 5.2.2 |
| Database / Auth | Supabase (`@supabase/supabase-js`) | ^2.98.0 |
| AI / LLM | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) | ai ^6.0.106 |
| Email (Transactional) | Resend (`resend`) | ^6.9.3 |
| Email (Contact Form) | EmailJS (`@emailjs/browser`) | ^4.4.1 |
| Validation | Zod (`zod`) | ^3.25.76 |
| UI Components | Radix UI (full suite), shadcn/ui | Various |
| Styling | TailwindCSS | 3.3.3 |
| Animation | Framer Motion (`framer-motion`) | ^12.34.0 |
| Charts | Recharts (`recharts`) | ^2.12.7 |
| Markdown rendering | react-markdown + remark-gfm | ^10.1.0, ^4.0.1 |
| Smooth scroll | Lenis (`@studio-freight/lenis`) | ^1.0.42 |
| Deployment | Netlify (`@netlify/plugin-nextjs`) | ^5.15.1 |

---

## 2. Environment Variables (`.env.local`)

```env
# OpenAI — used by the AI chat agent (GPT-4o-mini)
OPENAI_API_KEY=sk-proj-...

# Supabase — public keys for client-side
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Resend — transactional email for AI-generated proposals
RESEND_API_KEY=re_...

# Supabase Service Role — server-side only, bypasses RLS
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

---

## 3. Supabase Client Setup

**File: `lib/supabase.ts`**

Creates and exports a single Supabase client using the public anon key:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

The API routes also create a **service-role admin client** inline for server-side operations that bypass RLS:

```typescript
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1. `chat_messages` — AI Chat Logs

```sql
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,           -- 'user', 'assistant', or 'proposal_sent'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: anonymous inserts allowed, authenticated users can read
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to read messages" ON chat_messages FOR SELECT USING (auth.role() = 'authenticated');
```

### 4.2. `contacts_archive` — Permanent Contact History

```sql
CREATE TABLE contacts_archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_lead_id UUID UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT,
    notes TEXT,
    source TEXT DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted_from_crm BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_contacts_email ON contacts_archive(email);
```

### 4.3. `pipelines` — CRM Pipelines

```sql
CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.4. `stages` — Pipeline Stages (Kanban Columns)

```sql
CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.5. `leads` — Active CRM Leads

```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT,
    notes TEXT,
    source TEXT DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb,
    pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE RESTRICT,
    stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE RESTRICT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.6. `email_subscriptions` — Newsletter Signups

```sql
CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    topic_interest TEXT NOT NULL,
    source TEXT DEFAULT 'popup',
    source_page TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_email_subscriptions_email_topic ON email_subscriptions(email, topic_interest);
```

### 4.7. `page_visits` — Website Analytics

```sql
CREATE TABLE page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_page_visits_visitor ON page_visits(visitor_id);
CREATE INDEX idx_page_visits_path ON page_visits(page_path);
CREATE INDEX idx_page_visits_created ON page_visits(created_at);
```

### 4.8. `admin_notes` — Quick Notes for Admin Dashboard

```sql
CREATE TABLE admin_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Database Triggers & Functions

### 5.1. `update_updated_at_column()` — Auto-update timestamps

Applied to: `pipelines`, `stages`, `leads`, `contacts_archive`, `admin_notes`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 5.2. `sync_lead_to_archive()` — Auto-sync leads to contacts_archive

Trigger fires AFTER INSERT OR UPDATE on `leads`. Inserts/upserts the lead record into `contacts_archive`, keyed by `original_lead_id`. On conflict, updates all fields and sets `is_deleted_from_crm = false`.

### 5.3. `mark_lead_deleted_in_archive()` — Soft-delete in archive

Trigger fires AFTER DELETE on `leads`. Sets `is_deleted_from_crm = true` and `deleted_at = now()` in the corresponding `contacts_archive` row.

---

## 6. RPC Functions (SECURITY DEFINER)

### 6.1. `submit_contact_form()`

**Used by**: Contact form component, AI agent's `saveLead` tool.

Parameters: `p_full_name`, `p_email`, `p_phone`, `p_company`, `p_subject`, `p_message`, `p_notes`, `p_source`, `p_metadata`.

Logic:
1. Gets or creates the first pipeline (default: "Default Pipeline").
2. Gets or creates the first stage in that pipeline (default: "New Leads").
3. Inserts a new lead into the `leads` table.
4. Returns the new lead UUID.

### 6.2. `subscribe_email_list()`

**Used by**: AI agent's `subscribeNewsletter` tool.

Parameters: `p_email`, `p_topic_interest`, `p_source`, `p_source_page`.

Logic: Inserts into `email_subscriptions`. On duplicate (email + topic), does nothing.

### 6.3. `move_lead()`

**Used by**: Kanban board drag-and-drop.

Parameters: `p_lead_id`, `p_new_stage_id`, `p_new_sort_order`.

Logic: Updates the lead's `stage_id` and `sort_order`.

### 6.4. `log_page_visit()`

**Used by**: Page tracking API route.

Parameters: `p_visitor_id`, `p_page_path`, `p_referrer`.

Logic: Inserts a row into `page_visits`. SECURITY DEFINER so anonymous users can trigger it.

---

## 7. Row-Level Security (RLS) Configuration

All tables have RLS enabled. Policies:

| Table | Policy | Access |
|-------|--------|--------|
| `chat_messages` | Anonymous inserts | `FOR INSERT WITH CHECK (true)` |
| `chat_messages` | Authenticated reads | `FOR SELECT USING (auth.role() = 'authenticated')` |
| `pipelines` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `stages` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `leads` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `contacts_archive` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `email_subscriptions` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `page_visits` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |
| `admin_notes` | Full admin access | `FOR ALL USING (auth.role() = 'authenticated')` |

Public/anonymous users interact ONLY through SECURITY DEFINER RPCs (`submit_contact_form`, `subscribe_email_list`, `log_page_visit`) and the `chat_messages` anonymous insert policy.

---

## 8. Seed Data

When the `pipelines` table is empty, seed with:

**Sales Pipeline** (sort_order: 0):
- Stages: New Leads (0), Contacted (1), In Negotiation (2), Closed Won (3), Closed Lost (4)

**Support Tickets** (sort_order: 1):
- Stages: Open (0), In Progress (1), Resolved (2)

**Sample Lead** in "New Leads" stage of Sales Pipeline:
- Name: "John Doe (Sample)"
- Email: john.doe@example.com
- Phone: +1-555-0123
- Company: Acme Corp
- Subject: "Interested in Corporate Training"
- Source: manual

---

## 9. API Routes

### 9.1. `POST /api/chat` — AI Chatbot Endpoint

**File**: `app/api/chat/route.ts`

**Request body**:
```json
{
  "messages": [{ "role": "user", "content": "..." }, ...],
  "sessionId": "uuid-string"
}
```

**Response**:
```json
{ "content": "AI response text in markdown" }
```

**What it does**:
1. Validates `OPENAI_API_KEY` exists.
2. Logs the latest user message to `chat_messages` in Supabase (async, non-blocking).
3. Calls OpenAI's `gpt-4o-mini` via Vercel AI SDK `generateText()` with:
   - A system prompt from `lib/ai-context.ts` (see Section 10).
   - Up to 5 steps (`stopWhen: stepCountIs(5)`) for multi-tool usage.
   - 3 tools (see Section 9.1.1–9.1.3 below).
4. Logs the AI response to `chat_messages` (async, non-blocking).
5. Returns the final text response.

**Rate limiting**: In-memory + Supabase-backed, 3 proposals per email per 24 hours.

#### 9.1.1. Tool: `sendProposal`

**Purpose**: Generates and emails a custom pricing proposal.

**Input Schema** (Zod):
- `name` (string) — prospect's full name
- `email` (string, email) — prospect's email
- `company` (string) — prospect's company
- `employeeCount` (number) — employees needing training
- `services` (string[]) — selected Sponge Global services

**Pricing Logic**:
| Service keyword | Base price | Per-employee |
|----------------|-----------|-------------|
| "mindset" | $5,000 | +$50 |
| "upskilling" | $7,500 | +$75 |
| "succession" | $10,000 | — |
| "lms" or "management" | $15,000 | — |
| Fallback (no match) | $3,000 | +$25 |

**Email**: Sent via Resend from `noreply@spongeglobal.com`. Uses an HTML template from `lib/email-template.ts` — premium black/red design with company branding.

**Rate limiting**:
- Layer 1: In-memory Map (email → count, resets after 24h).
- Layer 2: Checks `chat_messages` table for `role='proposal_sent'` entries within last 24h.
- Max 3 proposals per email per 24h window.

**Returns**:
- `{ success: true, proposalDetails: {...} }` on success
- `{ success: false, rateLimited: true, hoursUntilReset: N }` when rate limited
- `{ success: false, emailError: "...", proposalDetails: {...} }` on email failure

#### 9.1.2. Tool: `saveLead`

**Purpose**: Saves a prospect as a lead in the CRM.

**Input Schema**:
- `name` (string, required) — prospect's name
- `phone` (string, optional) — phone number
- `email` (string, optional) — email (defaults to "no-email-provided@pending.com")
- `company` (string, optional) — company name
- `notes` (string, required) — AI-generated summary of conversation interests

**Execution**: Calls `supabaseAdmin.rpc('submit_contact_form', ...)` with `p_source: 'ai_agent'` and `p_subject: 'AI Agent Lead'`.

#### 9.1.3. Tool: `subscribeNewsletter`

**Purpose**: Subscribes a user to the newsletter.

**Input Schema**:
- `email` (string, email) — user's email
- `topic_interest` (string) — specific service topic or "general"

**Execution**: Calls `supabaseAdmin.rpc('subscribe_email_list', ...)` with `p_source: 'ai_agent'`.

### 9.2. `POST /api/track` — Page Visit Tracker

**File**: `app/api/track/route.ts`

**Request body**:
```json
{
  "visitorId": "v_abc123...",
  "pagePath": "/about",
  "referrer": "https://google.com" // or null
}
```

**What it does**: Calls `supabaseAdmin.rpc('log_page_visit', ...)` using the service role key. Returns `{ ok: true }`.

---

## 10. AI System Prompt

**File**: `lib/ai-context.ts`

The system prompt defines "Sponge AI" — an elite sales-closing AI for Sponge Global. Key behavior rules:

**Identity**: Confident, consultative, premium tone. Uses "Acknowledge, Answer, Ask" framework.

**Company Facts**: Sponge Global is a learning/capability partner since 2011, 200+ global clients.

**8 Services**:
1. Mindset Shaping Sessions
2. Upskilling & Reskilling Workshops
3. Succession Planning Solutions
4. Competency Frameworks
5. Inhouse & Outbound Team Building
6. E-Learning Content Creation
7. LMS - Learning Management Solutions
8. Training Facilities & Locations

**Hard Rules**:
- ONLY discusses Sponge Global / corporate training topics.
- Never guesses or makes up information.
- Always provides a CTA (booking consultation, WhatsApp link, etc.).
- Uses markdown formatting, bolds service names, short paragraphs.

**Proposal Workflow**: Gathers 5 data points conversationally (1-2 at a time): Name, Email, Company, Employee Count, Services → then calls `sendProposal` tool.

**Lead Capture Workflow**: Naturally gathers Name + at least one of (Phone, Email, Company) during conversation → silently calls `saveLead` tool. Never tells the user they were saved as a lead.

**Newsletter Workflow**: Offers subscription once per conversation, mid-to-end. Tailors the offer based on detected interests → calls `subscribeNewsletter` tool.

**Contact Details**:
- Website: https://sponge-global.com/contact
- WhatsApp: https://api.whatsapp.com/send/?phone=94713687386

---

## 11. Email Template

**File**: `lib/email-template.ts`

Function `generateProposalEmail(name, company, employeeCount, services, totalPrice)` returns a full HTML email string.

**Design**: Premium dark theme (black background, white text, #E31E24 red accents). Contains:
- "SPONGE GLOBAL" header with red border.
- Custom proposal for `${company}` with greeting.
- Details box: Client Name, Company, Workforce count, Selected Services (bulleted), Estimated Investment (formatted USD).
- CTA button: "Schedule Strategy Call" linking to `/contact`.
- Footer: © year, "automated demo proposal generated by ARC AI".

---

## 12. Frontend Components That Interact with Backend

### 12.1. `AiChatWidget` — AI Chat Bubble

**File**: `components/ai-chat-widget.tsx`

- Floating bottom-right chat widget with open/close toggle.
- Auto-opens on desktop after 1.5s delay.
- Generates a unique `sessionId` per widget mount using `crypto.randomUUID()`.
- Sends messages to `POST /api/chat` with full conversation history + sessionId.
- Renders AI responses with `ReactMarkdown` (supports GFM: bold, links, lists).
- Animated with Framer Motion (bouncing dots loader, slide-in messages).
- Pulsing red ring animation on the toggle button when closed.
- "Powered by ARC AI" branding in footer.

### 12.2. `PageTracker` — Visitor Analytics Tracker

**File**: `components/PageTracker.tsx`

- Renders nothing (returns `null`).
- On every route change (`usePathname()`), sends a `POST /api/track` request.
- Generates a persistent `visitorId` stored in `localStorage` as `sponge_visitor_id`.
- Skips tracking for `/admin` routes.
- Fire-and-forget, silently ignores errors.

### 12.3. `ContactForm` — Website Contact Form

**File**: `components/ContactForm.tsx`

- Fields: Name (required), Email (required), Company (optional), Message (required).
- On submit:
  1. Sends email via **EmailJS** (`service_xikrthn`, `template_en0xkze`, public key `I3owt6y6776PbjgUy`).
  2. Then calls `supabase.rpc('submit_contact_form', ...)` to create a CRM lead with `p_source: 'website contact form'`.
- Success/error status with auto-reset after 5 seconds.

### 12.4. `GlobalLayoutWrapper` — Layout Router

**File**: `components/GlobalLayoutWrapper.tsx`

- If route starts with `/admin`, renders only children (no nav, footer, chat widget, or tracker).
- Otherwise, renders: SiteLogo → StaggeredMenu → children → Footer → AiChatWidget → PageTracker.

---

## 13. Admin Dashboard (Protected)

### 13.1. Authentication

**Login page**: `app/admin/login/page.tsx`
- Email/password form using `supabase.auth.signInWithPassword()`.
- On success, redirects to `/admin/dashboard`.

**Auth guard**: `app/admin/dashboard/layout.tsx`
- Checks `supabase.auth.getSession()` on mount.
- If no session, redirects to `/admin/login`.
- Shows loading spinner while checking auth.
- Provides sidebar navigation and sign-out button.

### 13.2. Dashboard Layout & Navigation

**File**: `app/admin/dashboard/layout.tsx`

Sidebar navigation items:
| Name | Path | Icon |
|------|------|------|
| Dashboard | `/admin/dashboard` | LayoutDashboard |
| CRM Pipeline | `/admin/dashboard/crm` | KanbanSquare |
| Contacts Archive | `/admin/dashboard/contacts` | Users |
| Email Newsletter | `/admin/dashboard/subscribers` | Mail |
| AI Chat History | `/admin/dashboard/chat` | MessageSquare |

Features:
- Fixed sidebar on desktop (w-72), slide-in drawer on mobile.
- Active nav state with animated indicator (Framer Motion `layoutId`).
- Sign Out button calls `supabase.auth.signOut()`.
- Top header bar with Bell and Settings icon buttons.
- "Admin Panel" branding with logo (`/new-logo.jpeg`).

### 13.3. Dashboard Overview Page

**File**: `app/admin/dashboard/page.tsx`

**4 Stat Cards** (fetched from Supabase):
1. **Total Active Leads** — count from `leads` table
2. **Pipelines Configured** — count from `pipelines` table
3. **Unique Visitors** — distinct `visitor_id` count from `page_visits`
4. **Email Subscribers** — count from `email_subscriptions`

**Page Views Section**: Bar chart showing unique visitors per known page path (Home `/`, About `/about`, Services `/services`, Our Clients `/clients`, Contact `/contact`). Uses horizontal progress bars with gradient fills.

**Engagement Overview Chart**: Custom bar chart of daily page visits over the last 30 days. Each bar has hover tooltips showing date and count. Uses CSS-based bars (not Recharts).

**Quick Notes Section**: CRUD notes stored in `admin_notes` table.
- Add note form (text input + submit button).
- Notes list with content, timestamp, and delete button.
- Fetches latest 20 notes ordered by `created_at DESC`.

### 13.4. CRM Pipeline (Kanban Board)

**Page**: `app/admin/dashboard/crm/page.tsx`
**Component**: `components/admin/KanbanBoard.tsx`

**Features**:
- **Pipeline selector**: Tab-like buttons at top. Can create new pipelines and delete non-default ones.
- **Stage columns**: Vertical columns within the active pipeline. Can create new stages and delete existing ones.
- **Lead cards**: Draggable cards within stage columns showing name, company, email, phone, message preview, notes, source, and date.
- **Drag and drop**: Native HTML5 drag-and-drop. On drop, calls `supabase.rpc('move_lead', ...)`.
- **Add lead form**: Inline form within a stage column (name*, email*, company).
- **Lead detail modal**: Full-view modal triggered by eye icon showing all lead details, AI notes, source, date. Delete button available.
- **Delete lead**: Optimistic UI update, then `supabase.from('leads').delete()`. Leads remain in contacts_archive via trigger.
- Uses `supabase.from('pipelines' | 'stages' | 'leads').select('*')` for data, all authenticated via Supabase session.

### 13.5. Contacts Archive

**Page**: `app/admin/dashboard/contacts/page.tsx`

- Table view of all `contacts_archive` records, newest first.
- Columns: Contact Info (name, email, phone, company), Source & Submission (source badge, timestamp), Message Overview (subject, message text), CRM Status (Active Lead or Archived with deletion date).
- Total records counter in header.

### 13.6. Email Newsletter (Subscribers)

**Page**: `app/admin/dashboard/subscribers/page.tsx`

- Table view of all `email_subscriptions` records, newest first.
- Columns: Subscriber Email, Selected Interest (with color-coded badges for "tech", "lms", etc.), Acquisition Source, Date Subscribed.
- **Export CSV** button: Downloads all subscriber data as a CSV file.
- Total count counter in header.

### 13.7. AI Chat History

**Page**: `app/admin/dashboard/chat/page.tsx`

- Split view: Session list sidebar (left) + Conversation view (right).
- Session list shows all unique `session_id` values from `chat_messages`, most recent first.
- Each session card shows: first message timestamp, session ID, and first user message preview.
- Conversation view shows all messages for the selected session as chat bubbles (user right-aligned, AI left-aligned).
- Refresh button to re-fetch data.

---

## 14. File Structure Summary (Backend-Relevant Files)

```
├── .env.local                              # Environment variables
├── lib/
│   ├── supabase.ts                         # Supabase client (anon key)
│   ├── ai-context.ts                       # AI system prompt
│   ├── email-template.ts                   # Proposal HTML email generator
│   └── utils.ts                            # Utility (cn helper for tailwind)
├── app/
│   ├── api/
│   │   ├── chat/route.ts                   # AI chatbot API (POST)
│   │   └── track/route.ts                  # Page visit tracker API (POST)
│   ├── admin/
│   │   ├── login/page.tsx                  # Admin login page
│   │   └── dashboard/
│   │       ├── layout.tsx                  # Auth guard + sidebar layout
│   │       ├── page.tsx                    # Dashboard overview
│   │       ├── crm/page.tsx                # CRM pipeline (Kanban)
│   │       ├── contacts/page.tsx           # Contacts archive table
│   │       ├── subscribers/page.tsx        # Newsletter subscribers table
│   │       └── chat/page.tsx               # AI chat history viewer
│   └── contact/page.tsx                    # Public contact page
├── components/
│   ├── ai-chat-widget.tsx                  # Floating AI chat bubble
│   ├── ContactForm.tsx                     # Contact form (EmailJS + Supabase)
│   ├── PageTracker.tsx                     # Visitor tracking component
│   ├── GlobalLayoutWrapper.tsx             # Layout router (admin vs public)
│   └── admin/
│       └── KanbanBoard.tsx                 # Kanban board component
├── supabase/
│   └── migrations/
│       ├── 20260306204000_crm_backend.sql  # Core CRM schema + RPC + RLS
│       ├── 20260306212000_seed_crm.sql     # Default pipeline/stage seed
│       ├── 20260312_add_notes_to_leads.sql # Added notes column + updated RPCs
│       └── 20260312_dashboard_analytics.sql # Page visits + admin notes tables
└── supabase_migration.sql                  # Original chat_messages table
```

---

## 15. Rebuild Checklist

To rebuild this backend from scratch, follow these steps in order:

1. **Create Next.js 13 project** with App Router, TypeScript, TailwindCSS.
2. **Install dependencies**: `@supabase/supabase-js`, `ai`, `@ai-sdk/openai`, `@ai-sdk/react`, `resend`, `@emailjs/browser`, `zod`, `react-markdown`, `remark-gfm`, `framer-motion`, `recharts`, `lucide-react`, all Radix UI packages.
3. **Set up Supabase project**: Create a new Supabase project, enable UUID extension.
4. **Run all SQL migrations** in order (Sections 4–6 above).
5. **Run seed data** (Section 8).
6. **Create Supabase Auth user** for admin access.
7. **Set up environment variables** (Section 2).
8. **Set up Resend**: Verify domain, get API key.
9. **Set up EmailJS**: Create service, template (variables: `from_name`, `from_email`, `company`, `message`), get public key.
10. **Create `lib/supabase.ts`** (Section 3).
11. **Create `lib/ai-context.ts`** with full system prompt (Section 10).
12. **Create `lib/email-template.ts`** with HTML proposal template (Section 11).
13. **Create `app/api/chat/route.ts`** with all 3 tools + rate limiting (Section 9.1).
14. **Create `app/api/track/route.ts`** (Section 9.2).
15. **Create `components/ai-chat-widget.tsx`** (Section 12.1).
16. **Create `components/PageTracker.tsx`** (Section 12.2).
17. **Create `components/ContactForm.tsx`** (Section 12.3).
18. **Create `components/GlobalLayoutWrapper.tsx`** (Section 12.4).
19. **Create admin login page** at `app/admin/login/page.tsx` (Section 13.1).
20. **Create admin dashboard layout** at `app/admin/dashboard/layout.tsx` (Section 13.2).
21. **Create all 5 admin dashboard pages** (Sections 13.3–13.7).
22. **Create `components/admin/KanbanBoard.tsx`** (Section 13.4).
23. **Deploy to Netlify** with `@netlify/plugin-nextjs`.

---

*Generated on 2026-03-12 for the Sponge Global project by ARC AI Agency.*
