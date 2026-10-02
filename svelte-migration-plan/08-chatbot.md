# Phase 8: ChatBot (AI + Slack live chat)

**Goal:** port the floating chat widget shown on `/fragebogen`: AI assistant (Vercel AI SDK, streaming), Slack live chat (send + poll), and visitor email capture.

## 8.1 Pre-port findings

The current chat has several bugs: KI-19 to KI-24 in [known-issues.md](known-issues.md). The biggest is that `useSlackChat` is instantiated 6 times, which creates 6 parallel Slack polling loops. The port uses **one shared chat state instance** provided via context. That design fixes KI-19 to KI-22 structurally. KI-23 needs a decision from the product owner: for a visitor, "Neue Unterhaltung" should probably clear the localStorage thread. KI-24 is handled by lazy-loading the widget (8.4).

## 8.2 State

```ts
// src/lib/chat/slackChat.svelte.ts
export class SlackChat {
  messages = $state<SlackMessage[]>([]);
  status = $state<'ready' | 'sending' | 'waiting_for_human' | 'fetching_messages'>('ready');
  input = $state('');
  threadTs = $state<string | undefined>();
  lastSentTs = $state<string | null>(null);
  now = $state(new Date());
  isOutOfOffice = $derived(!isWithinBusinessHours(this.now));
  #oooAdded = new Set<string>();

  constructor(private userId?: string) {
    // Wrap in $effect.root because this is created in a component but outlives its children
    $effect.root(() => {
      $effect(() => {                      // office-hours clock
        const t = setInterval(() => (this.now = new Date()), 60_000);
        return () => clearInterval(t);
      });
      $effect(() => {                      // polling: depends ONLY on threadTs + waiting flag
        const ts = this.threadTs;
        if (!ts) return;
        const fast = this.status === 'waiting_for_human';
        const t = setInterval(() => this.poll(ts), fast ? 1000 : 2000);
        return () => clearInterval(t);
      });
    });
  }
  // restore(), poll(), send(): logic ported from useSlackChat, using fetch instead of axios
}
```
- `poll()` must not write `status = 'fetching_messages'` on every tick, or it restarts the interval. Use a separate non-reactive `#inFlight` flag.
- Pause polling when the widget is closed or the tab is hidden (`document.visibilityState`). Today's behaviour is "always poll once a thread exists", so this is an optional improvement.
- The 5-minute fallback becomes `setTimeout(() => { if (this.status === 'waiting_for_human') this.status = 'ready'; }, 300_000)`. Reading `this.status` at fire time fixes the stale closure.
- `localStorage` / `sessionStorage` reads go in `onMount` / `restore()` (client only). Don't use `typeof window` checks inside `$state` initialisers, because that causes hydration mismatches.

```ts
// src/lib/chat/context.ts
export const setChatContext = (userId?: string) => setContext(KEY, { slack: new SlackChat(userId), ai: createAiChat() });
export const getChatContext = () => getContext<…>(KEY);
```
`ChatBot.svelte` calls `setChatContext`. Every child calls `getChatContext()`, so there is a single instance.

## 8.3 AI chat

**Server:** `src/routes/api/chat/+server.ts`
```ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { salesPersona } from '$lib/server/ai/personas';
export const config = { maxDuration: 30 };
export const POST = async ({ request }) => {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({ model: 'xai/grok-4.1-fast-reasoning', system: salesPersona, messages: convertToModelMessages(messages) });
  return result.toUIMessageStreamResponse();
};
```
The `"xai/…"` string model id goes through the **Vercel AI Gateway**. On Vercel it authenticates through OIDC automatically. Locally, or on `adapter-node`, set `AI_GATEWAY_API_KEY`. Check this early because it is the most likely thing to break silently.

**Client:** `@ai-sdk/svelte`
```ts
import { Chat } from '@ai-sdk/svelte';
import { DefaultChatTransport } from 'ai';
const chat = new Chat({ transport: new DefaultChatTransport({ api: '/api/chat' }), messages: storedMessages });
// chat.messages, chat.status, chat.sendMessage({ text }), chat.stop()
```
- `chat.messages` is reactive, so it can be read directly in markup. There is no hook-return destructuring. **Don't destructure** (`const { messages } = chat`), because that breaks reactivity.
- `useAIMessagesStore` (Zustand, holds `storedMessages` across mounts) becomes a field on the chat context. Persist it to `sessionStorage` only if the current behaviour depends on that. Currently it doesn't; it's in-memory only.
- Keep the `ai` version aligned with `@ai-sdk/svelte`'s peer range (both v5 today).

## 8.4 Components

| React | Svelte notes |
|---|---|
| `index.tsx` (container) | Click-outside → `clickOutside` attachment from phase 3. The open/closed toggle and the `animate-from-right` class are kept. Drop the duplicate `Exo_2` font |
| `ChatHeader` | reads `slack.isOutOfOffice` from context |
| `AiMessagesContainer` / `SlackMessagesContainer` | `{#each}` over messages. Auto-scroll with an attachment that scrolls to the bottom whenever `messages.length` changes (`$effect` inside the attachment) |
| `Message` (AI parts) | `{#each message.parts as part}{#if part.type === 'text'}<Markdown md={part.text} plugins={[gfm]} />{/if}{/each}` |
| `SlackMessage` | `svelte-exmarkdown` + `remark-gfm`. Port the custom `components` overrides (links → `target="_blank"`, etc.) as exmarkdown snippet renderers |
| `AIChatInput` / `SlackChatInput` | `bind:value`, Enter-to-send. Lucide icons |
| `VisitorEmailFormContainer` | email capture → `fetch('/api/leads')`, then `slack.send(...)` for the intro message. Writes `sessionStorage.anonymousUserEmail` |
| `AnonymousChatBanner`, `DefaultChatMessage`, `LoadingMessage`, `icons` | trivial |
| `AIChatBot.css` | import inside `ChatBot.svelte` or convert it to a `<style>` block |

Lazy-load the widget. It is not needed for first paint: render only the launcher button, and `import()` the panel on first click. This keeps `ai`, `@ai-sdk/svelte` and exmarkdown out of the initial bundle on `/fragebogen`.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [ ] **KI-19** (High): `useSlackChat` instantiated 6×, giving 6 parallel Slack polling loops
- [ ] **KI-20** (Med): Polling interval recreated on every tick
- [ ] **KI-21** (Med): 5-minute "no human reply" timeout never fires (stale closure)
- [ ] **KI-22** (Med): Chat always starts in Slack mode, even outside office hours
- [ ] **KI-23** (Med): "New conversation" clears sessionStorage, but the thread id is in localStorage
- [ ] **KI-24** (Low): Chat widget code is in the initial `/fragebogen` bundle

## Exit criteria
- AI chat streams responses token by token. Stop works.
- Slack: the first message creates a thread. A human reply in Slack appears within 2s. Reloading restores the thread from localStorage.
- Inside and outside office hours, the banner and auto-reply behave as today (mock the clock in a Playwright test).
- DevTools Network shows **one** polling loop, not six.
- All known issues listed above are fixed.
