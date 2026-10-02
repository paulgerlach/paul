# Phase 7: Forms & Fragebogen

**Goal:** replace `react-hook-form`, `@hookform/resolvers`, `@tanstack/react-query` `useMutation` and `zustand` across the 4 forms.

| Form | Location | Today | Target |
|---|---|---|---|
| Contact | `Kontakt/ContactForm` → `/api/contact` | RHF + zod + useMutation, honeypot, timestamp | **Form action + superforms** (works without JS) |
| Newsletter (×2) | `Footer/FooterEmailForm`, `Basic/Subscription` → `/api/send-email` | RHF + useMutation | One shared `NewsletterForm.svelte` with `fetch`. It lives in the global footer, so a page-level action would need to exist on every route |
| Lead capture | `ChatBot/VisitorEmailFormContainer` → `/api/leads` | axios | `fetch` (phase 8) |
| Fragebogen | `(service)/fragebogen` → `/api/fragebogen` | RHF **and** a Zustand store (dual state) + useMutation | One runes class plus zod; submit with `fetch` |

## 7.1 Contact form (superforms)

```ts
// src/lib/forms/contact.ts  (shared by client + server)
import { z } from 'zod';
export const contactSchema = z.object({
  name: z.string().min(3, 'Name muss mindestens 3 Zeichen lang sein').max(100),
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben').max(254),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen enthalten').max(5000),
  infoChecked: z.literal(true, { errorMap: () => ({ message: 'Bitte akzeptieren Sie die Datenschutzbestimmungen' }) }),
  website: z.string().optional(),   // honeypot
  _t: z.coerce.number().optional()  // render timestamp
});
```
```ts
// routes/(base)/kontakt/+page.server.ts
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { runContactPipeline } from '$lib/server/contact';

export const load = async () => ({ form: await superValidate(zod(contactSchema), { defaults: { _t: Date.now() } }) });

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(contactSchema));
    if (!form.valid) return fail(400, { form });
    await runContactPipeline(form.data, event.getClientAddress());  // honeypot/timing/gibberish/rate-limit → silent success
    return message(form, { type: 'success', text: '…' });
  }
};
```
- Set `_t` on the server at render time (a hidden input). That is more robust than the client `useRef(Date.now())`.
- Client side: `const { form, errors, enhance, message, submitting } = superForm(data.form, { validators: zod(contactSchema) })` gives the same inline errors as RHF. Show a toast on `message`.
- Keep `/api/contact` alive until cutover (phase 6) in case anything external posts to it. After that, delete it.
- Prerendering: `/kontakt` can no longer be prerendered once it has an action.

## 7.2 Newsletter form

```svelte
<script lang="ts">
  import { toast } from 'svelte-sonner';
  let email = $state(''); let pending = $state(false);
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    pending = true;
    const res = await fetch('/api/send-email', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    pending = false;
    res.ok ? (toast.success('…'), (email = '')) : toast.error('…');
  }
</script>
```
Copy the exact toast and inline messages from both existing components, and keep each one's styling through a `variant` prop.

## 7.3 Fragebogen

Today's state is split between react-hook-form (field values and validation) and `useQuestionareStore` (step index, totals, `formData` duplicates, `onChangeForvard` auto-advance). Steps read from both. Merge them into **one** class:

```ts
// src/lib/fragebogen/questionnaire.svelte.ts
import { getContext, setContext } from 'svelte';
import { questionnaireSchema, defaults, type QuestionnaireData } from './schema';

export class Questionnaire {
  data = $state<QuestionnaireData>(structuredClone(defaults));
  step = $state(0);
  errors = $state<Partial<Record<keyof QuestionnaireData, string>>>({});
  status = $state<'idle' | 'submitting' | 'done' | 'error'>('idle');

  isUnder50 = $derived(this.data.property_count_category === '1-50 Immobilien');
  lastStep = $derived(this.isUnder50 ? 5 : 6);
  totalSteps = $derived(this.lastStep + 1);
  isSubmitStep = $derived(this.step === this.lastStep);

  set<K extends keyof QuestionnaireData>(k: K, v: QuestionnaireData[K]) { this.data[k] = v; }
  setAndNext<K extends keyof QuestionnaireData>(k: K, v: QuestionnaireData[K]) { this.set(k, v); this.next(); }
  next() { if (this.step < this.totalSteps - 1) this.step++; }
  prev() { if (this.step > 0) this.step--; }
  increment(k: 'appartment_number' | 'wohnungen_count' | 'messdienstleister_count') { this.data[k] = (this.data[k] ?? 0) + 1; }
  decrement(k: …) { this.data[k] = Math.max((this.data[k] ?? 0) - 1, 1); }

  async submit() {
    const parsed = questionnaireSchema.safeParse(this.data);
    if (!parsed.success) { this.errors = flatten(parsed.error); return; }
    this.status = 'submitting';
    const res = await fetch('/api/fragebogen', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed.data) });
    this.status = res.ok ? 'done' : 'error';
  }
}

const KEY = Symbol('questionnaire');
export const setQuestionnaire = () => setContext(KEY, new Questionnaire());
export const getQuestionnaire = () => getContext<Questionnaire>(KEY);
```
- `+page.svelte` calls `setQuestionnaire()`. Steps call `getQuestionnaire()` and use `bind:value={q.data.postleitzahl}`.
- Context per page instance means state resets on every visit. That replaces the `useEffect(resetQuestionnaire)` and avoids module-level state leaking between SSR requests.
- **Watch for this:** `resetFormData` and `resetQuestionnaire` in the Zustand store have **different** defaults (`wohnungen_count: 3` and `funkzaehler_status` only exist in one; the RHF defaults are a third copy). Pick the RHF `defaultValues` as the single source of truth in `schema.ts` and confirm with the business owner.
- Phone transform (`replace(/[\s-]/g, '')`) and all German error messages move into `schema.ts`, which is shared with the `/api/fragebogen` server validation (phase 6).
- Step validation: today only the final submit validates (plus a `step0Error` flag). Keep that behaviour; don't add per-step validation during the port.
- The step components (`StepZero` … `StepSixOver50`, `StepFourUnder50`) are mostly card grids of choices. Port them mechanically, replacing `register(...)` / `setValue` / `onChangeForvard` with `q.set` / `q.setAndNext`.
- `StepWrapper` (progress bar, back/next) reads `q.step` / `q.totalSteps`.
- Consider adding `beforeNavigate` to warn when leaving mid-questionnaire. It is optional and not in the current site.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [ ] **KI-17** (Med): Fragebogen state split between RHF and Zustand, with 3 diverging default sets
- [ ] **KI-18** (Low): `QuestionareFormData` type exported from a page file

## Exit criteria
- Contact form: client errors match the current German messages. It submits without JS. Spam layers silently succeed. The webhook payload is identical.
- Both newsletter forms submit and toast as before.
- Fragebogen: both flows (Under50 → 6 steps, Over50 → 7 steps) reach the success screen. Payloads are byte-identical to Next's for the same answers (compare with the phase 6 request-bin method).
- No `react-hook-form`, `zustand`, or `@tanstack/*` imports remain.
- All known issues listed above are fixed.
