<!--
  The offer step: "Angebot per E-Mail erhalten" above the finished offer's
  documents (the billing in its own when chosen); once requested, the
  confirmation with the offer's number.
-->
<script lang="ts">
	import Markup from "../ui/Markup.svelte";
	import { DEMO_HREF } from "$lib/landing/cta";
	import { OFFER_COMPANY } from "../data";
	import {
		calc,
		offerDates,
		offerParts,
		positions,
		propertyLines,
	} from "../model";
	import { CHECK } from "../svg";
	import { getSelfService } from "../wizard.svelte";
	import OfferDoc from "./OfferDoc.svelte";

	const w = getSelfService();
	const offer = $derived(w.s.ang);
	const dates = $derived(offer ? offerDates(offer) : null);
	const parts = $derived(offer ? offerParts(positions(calc(w.s)), offer) : []);
	const mail = $derived(w.s.k.mail.trim());
</script>

{#if offer && dates}
	{#if offer.sent}
		<div class="ss-conf">
			<div class="ss-conf-i">
				<svg viewBox="0 0 52 52" aria-hidden="true"
					><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg
				>
			</div>
			<h3>Ihr Angebot ist unterwegs.</h3>
			<p>
				Wir senden Ihr Angebot <b>{offer.nr}</b> als PDF an <b>{mail}</b>. Bitte
				prüfen Sie auch Ihren Spam-Ordner.
			</p>
			<dl class="ss-conf-d">
				<div>
					<dt>Angebotsnummer</dt>
					<dd>{offer.nr}</dd>
				</div>
				<div>
					<dt>Gültig bis</dt>
					<dd>{dates.valid}</dd>
				</div>
				<div>
					<dt>Liegenschaft</dt>
					<dd>{propertyLines(w.s).join(", ")}</dd>
				</div>
			</dl>
		</div>
		<div class="ss-ends">
			<a class="pg-ghost" href={DEMO_HREF}>Termin vereinbaren</a>
			<button type="button" class="ss-restart" onclick={() => w.restart()}
				>Neuen Zählercheck starten</button
			>
		</div>
	{:else}
		<div class="ss-res-ok">
			<span class="okb"><Markup html={CHECK} /></span><span
				><b>Ihr Angebot ist fertig.</b> Angebotsnummer {offer.nr}, gültig bis
				einschließlich {dates.valid}.</span
			>
		</div>
		<div class="ss-send1 top">
			<button
				type="button"
				class="bk-next"
				disabled={w.sending}
				onclick={() => w.requestOffer()}
				>Angebot per E-Mail erhalten <span class="ar" aria-hidden="true">→</span
				></button
			>
			<small>an {mail}</small>
		</div>
		<p class={["ss-msg", w.sendFailed && "err"]} role="status">
			{#if w.sendFailed}
				Das Senden hat leider nicht geklappt. Bitte versuchen Sie es noch einmal
				oder schreiben Sie an <a
					href="mailto:{OFFER_COMPANY.mailbox}?subject={encodeURIComponent(
						`Angebot ${offer.nr}`,
					)}">{OFFER_COMPANY.mailbox}</a
				>.
			{/if}
		</p>
		{#each parts as part (part.kind)}<OfferDoc {offer} {part} />{/each}
		<div class="ss-ends">
			<button type="button" class="ss-restart" onclick={() => w.restart()}
				>Neuen Zählercheck starten</button
			>
		</div>
	{/if}
{/if}
