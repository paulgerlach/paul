<!--
  The cookie banner: a card fixed to the bottom of the screen, in the landing
  design (Geist, the ink and green tokens, the floating CTA's shadow). It
  doesn't block the page. "Nur notwendige" and "Alle akzeptieren" are equally
  prominent; "Einstellungen" lists the categories (only "Statistik", Google
  Analytics, is optional). Shown until a choice is made, and again from the
  footer's "Cookie-Einstellungen". Rendered only after mount, so without JS
  (where GA can't load) it never shows. State in `$lib/analytics/consent.svelte`.
-->
<script lang="ts">
	import { onMount, tick } from "svelte";
	import { consent } from "$lib/analytics/consent.svelte";
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";

	let heading = $state<HTMLHeadingElement>();
	/** The "Statistik" switch; starts at the current choice. */
	let stats = $derived(consent.analytics);

	onMount(() => consent.restore());

	// Reopened from the footer: move the focus into the banner.
	let wasOpen = false;
	$effect(() => {
		const open = consent.open;
		if (open && !wasOpen && consent.choice)
			void tick().then(() => heading?.focus());
		wasOpen = open;
	});
</script>

{#if consent.open}
	<section class="lp cb" aria-labelledby="cb-h">
		<div class={["card", consent.details && "open"]}>
			<div class="tx">
				<h2 id="cb-h" tabindex="-1" bind:this={heading}>
					Cookies und Datenschutz
				</h2>
				<p>
					Wir verwenden technisch notwendige Cookies, damit die Website
					funktioniert. Mit Ihrer Einwilligung nutzen wir zusätzlich Google
					Analytics, um zu verstehen, wie unsere Seiten genutzt werden. Ihre
					Auswahl können Sie jederzeit unter „Cookie-Einstellungen“ am Ende der
					Seite ändern. Mehr in der
					<a href={ROUTE_DATENSCHUTZHINWEISE}>Datenschutzerklärung</a>.
				</p>
			</div>
			{#if consent.details}
				<ul class="cats">
					<li>
						<span class="ct">
							<b>Notwendig</b>
							<small
								>Für den Betrieb der Website erforderlich. Immer aktiv.</small
							>
						</span>
						<input
							type="checkbox"
							role="switch"
							class="sw"
							checked
							disabled
							aria-label="Notwendig"
						/>
					</li>
					<li>
						<label class="ct" for="cb-stats">
							<b>Statistik</b>
							<small
								>Google Analytics: welche Seiten aufgerufen und welche
								Formularschritte erreicht werden.</small
							>
						</label>
						<input
							id="cb-stats"
							type="checkbox"
							role="switch"
							class="sw"
							bind:checked={stats}
						/>
					</li>
				</ul>
			{/if}
			<div class="act">
				{#if consent.details}
					<button class="btn btn-ghost" onclick={() => consent.set(stats)}
						>Auswahl speichern</button
					>
				{:else}
					<button class="btn btn-ghost" onclick={() => (consent.details = true)}
						>Einstellungen</button
					>
				{/if}
				<button class="btn btn-ink" onclick={() => consent.set(false)}
					>Nur notwendige</button
				>
				<button class="btn btn-accent" onclick={() => consent.set(true)}
					>Alle akzeptieren</button
				>
			</div>
		</div>
	</section>
{/if}

<style>
	/* `.lp` paints a background; the wrapper itself stays clear. */
	.cb {
		position: fixed;
		inset: auto 0 0;
		z-index: 1001; /* over the floating CTA (29) and the chat (999) */
		background: none;
		padding: 0 16px calc(16px + env(safe-area-inset-bottom, 0px));
		pointer-events: none;
	}
	.card {
		pointer-events: auto;
		max-width: 920px;
		margin: 0 auto;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 22px 24px;
		box-shadow:
			0 18px 40px -16px rgba(30, 50, 45, 0.45),
			0 2px 6px rgba(30, 50, 45, 0.12);
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 16px 32px;
		align-items: end;
		animation: cb-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes cb-in {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			animation: none;
		}
	}
	/* `.cb h2`: beats the landing heading reset. */
	.cb h2 {
		font-size: 18px;
		line-height: 1.3;
		margin-bottom: 6px;
		outline: none;
	}
	.tx p {
		margin: 0;
		color: var(--muted);
		font-size: 14px;
		line-height: 1.55;
	}
	.tx a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.cats {
		grid-column: 1;
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.cats li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
	}
	.ct {
		display: grid;
		gap: 2px;
		font-size: 14px;
	}
	.ct b {
		font-weight: 500;
	}
	.ct small {
		color: var(--muted);
		font-size: 13px;
	}
	.sw {
		appearance: none;
		flex: none;
		position: relative;
		width: 40px;
		height: 24px;
		margin: 0;
		border-radius: 999px;
		background: #d5dad8;
		cursor: pointer;
		transition: background 0.2s ease;
	}
	.sw::after {
		content: "";
		position: absolute;
		top: 3px;
		left: 3px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.25);
		transition: transform 0.2s ease;
	}
	.sw:checked {
		background: var(--accent-deep);
	}
	.sw:checked::after {
		transform: translateX(16px);
	}
	.sw:disabled {
		cursor: default;
		opacity: 0.6;
	}
	.act {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: end;
		display: flex;
		gap: 8px;
	}
	.act .btn {
		padding: 11px 16px;
		font-size: 14px;
	}
	.act .btn-ink:hover {
		background: #2c4741;
	}
	.act .btn-ghost:hover {
		color: var(--ink);
		border-color: var(--faint);
	}

	/* With the categories: one column, the buttons under them on the right. */
	.card.open {
		grid-template-columns: minmax(0, 1fr);
		max-width: 720px;
	}
	.card.open .act {
		grid-column: 1;
		grid-row: auto;
		justify-content: flex-end;
	}

	@media (max-width: 860px) {
		.card {
			grid-template-columns: minmax(0, 1fr);
			padding: 18px;
		}
		.act {
			grid-column: 1;
			grid-row: auto;
			flex-wrap: wrap;
		}
		.act .btn {
			flex: 1 1 auto;
		}
	}
	@media (max-width: 520px) {
		.act {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
		/* "Alle akzeptieren" and "Nur notwendige" side by side, the third under them. */
		.act .btn-ghost {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}
</style>
