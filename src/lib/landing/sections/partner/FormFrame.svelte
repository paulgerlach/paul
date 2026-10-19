<!--
  The white partner form of the "Partner" pages (the designs' .ipf-f): the
  page's fields (`children`) between the timing field and honeypot and the
  button with its message line. The page owns the superForm (schema,
  validation, action) and passes its `enhance` and state; this frame holds
  the markup they share and the design's styles for every field kind
  (`:global`, since the fields are the page's markup). Works without JS: the
  form posts to the page's action and the response renders the line.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Action } from "svelte/action";
	import type { FormTexts } from "./types";

	let {
		action,
		enhance,
		t,
		msgId,
		texts,
		submitting,
		invalid,
		sent,
		sendError,
		message,
		children,
	}: {
		/** The section's anchor, so a no-JS post lands on the form. */
		action: string;
		/** superForm's `enhance`. */
		enhance: Action<HTMLFormElement>;
		/** The render (or hydration) time for the "too fast" check. */
		t: number;
		/** The message line's id, for the invalid fields' `aria-describedby`. */
		msgId: string;
		texts: FormTexts;
		submitting: boolean;
		invalid: boolean;
		sent: boolean;
		sendError: boolean;
		/** The success line's text (from the action). */
		message?: string;
		children: Snippet;
	} = $props();
</script>

<form method="POST" {action} class="ipf-f" novalidate use:enhance>
	<input type="hidden" name="_t" value={t} />
	<!-- Honeypot — hidden from real users, bots auto-fill this -->
	<div aria-hidden="true" class="hp">
		<label>
			Website
			<input name="website" tabindex={-1} autocomplete="off" type="text" />
		</label>
	</div>

	{@render children()}

	<button type="submit" class="submit" disabled={submitting}
		>{texts.submit} <span class="ar" aria-hidden="true">→</span></button
	>
	{#if sent}
		<p class="msg ok" role="status">{message}</p>
	{:else}
		<p class={["msg", (invalid || sendError) && "err"]} id={msgId} role="alert">
			{#if invalid}
				{texts.missing}
			{:else if sendError}
				{texts.sendError.text}
				<a href={texts.sendError.phoneHref}>{texts.sendError.phone}</a>
			{:else if submitting}
				{texts.sending}
			{/if}
		</p>
	{/if}
</form>

<style>
	.ipf-f {
		background: #fff;
		color: var(--ink);
		border-radius: 22px;
		padding: clamp(20px, 3vw, 34px);
		display: grid;
		gap: 16px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	/* The fields are the page's markup: every rule below is `:global` under
	   the form, in the order (and with the relations) of the design. */
	.ipf-f :global(.r2) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.ipf-f :global(label) {
		display: grid;
		gap: 6px;
		font-size: 13.5px;
		font-weight: 600;
	}
	/* The browser's "smaller" (Tailwind's preflight sets 80 %). */
	.ipf-f :global(label small) {
		font-size: smaller;
		font-weight: 400;
		color: #7a8783;
	}
	.ipf-f :global(input:not([type="checkbox"]):not([type="radio"])),
	.ipf-f :global(select),
	.ipf-f :global(textarea) {
		font: inherit;
		font-size: 15px;
		font-weight: 400;
		color: var(--ink);
		border: 1px solid #dce2df;
		border-radius: 10px;
		padding: 11px 12px;
		background: #fff;
		width: 100%;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.ipf-f :global(input:focus),
	.ipf-f :global(select:focus),
	.ipf-f :global(textarea:focus) {
		outline: 0;
		border-color: #3e9a57;
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	/* The design's .bad (!important there): it beats the focus colour too. */
	.ipf-f :global(input.bad:not([type="checkbox"])),
	.ipf-f :global(select.bad),
	.ipf-f :global(textarea.bad) {
		border-color: #c2410c;
	}
	.ipf-f :global(fieldset) {
		border: 0;
		margin: 0;
		padding: 0;
		min-width: 0;
	}
	.ipf-f :global(legend) {
		font-size: 13.5px;
		font-weight: 600;
		margin-bottom: 8px;
		/* The browser's legend padding (Tailwind's preflight zeroes it). */
		padding: 0 2px;
	}
	.ipf-f :global(.ch) {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.ipf-f :global(.ch label) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #dce2df;
		border-radius: 999px;
		padding: 8px 14px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.ipf-f :global(.ch label:has(input:checked)) {
		border-color: #3e9a57;
		background: #eef8ef;
	}
	.ipf-f :global(.ch label:has(input:focus-visible)) {
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.ipf-f :global(.ch input) {
		accent-color: #3e9a57;
		margin: 0;
	}
	.ipf-f :global(.consent) {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-weight: 400;
		color: #5b6b66;
		line-height: 1.45;
	}
	/* The browser's checkbox margins (Tailwind's preflight zeroes them). */
	.ipf-f :global(.consent input) {
		accent-color: #3e9a57;
		margin: 3px 3px 3px 4px;
		flex: none;
	}
	/* The design marks the box; its label text keeps its colour. */
	.ipf-f :global(.consent.bad input) {
		outline: 2px solid #c2410c;
		outline-offset: 1px;
	}
	.submit {
		justify-self: start;
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
		font-weight: 600;
		font-size: 16px;
		border-radius: 12px;
		padding: 15px 22px;
		cursor: pointer;
		display: inline-flex;
		gap: 10px;
		transition: background 0.2s;
	}
	.submit:hover {
		background: #2c4640;
	}
	.submit[disabled] {
		opacity: 0.6;
		cursor: default;
	}
	.msg {
		font-size: 14.5px;
		line-height: 1.5;
		color: #5b6b66;
		min-height: 1em;
		margin: 0;
	}
	.msg.ok {
		color: #245f33;
		background: #e6f5e7;
		border-radius: 12px;
		padding: 12px 14px;
	}
	.msg.err {
		color: #8a3a10;
	}
	.msg a {
		color: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	@media (max-width: 900px) {
		.ipf-f :global(.r2) {
			grid-template-columns: 1fr;
		}
	}
</style>
