<!--
  A paid consultation as a cart button (`button.ss-ber`, `aria-pressed`):
  "Beratungstermin mit Zähleridentifikation" (`smoke` off) or "Beratung zur
  Rauchwarnmelderpflicht". In the cart it becomes a position of the offer
  (39 € netto, once).
-->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { ICONS } from "../svg";

	let {
		on,
		ontoggle,
		smoke = false,
		top,
	}: {
		on: boolean;
		ontoggle: () => void;
		smoke?: boolean;
		/** The design's inline top margin, px. */
		top?: number;
	} = $props();
</script>

<button
	type="button"
	class={["ss-ber", on && "on"]}
	aria-pressed={on}
	onclick={ontoggle}
	style:margin-top={top ? `${top}px` : undefined}
>
	<span class="ss-ber-i"><Markup html={ICONS.phone} /></span>
	<span class="ss-ber-t"
		>{#if smoke}<small class="ss-ber-k"
				>Unsicher, wie viele Rauchwarnmelder Sie brauchen?</small
			><b>Beratung zur Rauchwarnmelderpflicht</b><small
				>Die Vorgaben unterscheiden sich je nach Bundesland. Wir klären mit
				Ihnen, wie viele Melder Ihre Liegenschaft braucht und wo sie hinmüssen.
				Wird als Position in Ihr Angebot übernommen.</small
			>{:else}<small class="ss-ber-k"
				>Nicht sicher, welche Zähler verbaut sind?</small
			><b>Beratungstermin mit Zähleridentifikation</b><small
				>Wir bestimmen Ihre Zähler gemeinsam mit Ihnen am Telefon, auch wenn
				keine Unterlagen vorliegen. Wird als Position in Ihr Angebot übernommen.</small
			>{/if}</span
	>
	<span class="ss-ber-p"
		><b>39 €</b><small class="nt">netto</small><small class="go"
			>{on ? "✓ Im Warenkorb" : "+ In den Warenkorb"}</small
		></span
	>
</button>
