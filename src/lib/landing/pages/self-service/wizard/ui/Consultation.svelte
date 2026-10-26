<!--
  "Beratungstermin mit Zähleridentifikation" (`.ss-ber`): the paid phone
  appointment, booked separately, under the nudge when the devices are unclear.
-->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { DEMO_HREF } from "$lib/landing/cta";
	import { ICONS } from "../svg";
</script>

<a class="ss-ber" href={DEMO_HREF} target="_blank" rel="noopener">
	<span class="ss-ber-i"><Markup html={ICONS.phone} /></span>
	<span class="ss-ber-t"
		><small class="ss-ber-k">Nicht sicher, welche Zähler verbaut sind?</small><b
			>Beratungstermin mit Zähleridentifikation</b
		><small
			>Wir bestimmen Ihre Zähler gemeinsam mit Ihnen am Telefon, auch wenn keine
			Unterlagen vorliegen. Separat buchbar, unabhängig von diesem Zählercheck.</small
		></span
	>
	<span class="ss-ber-p"
		><b>39 €</b><small class="nt">netto</small><small class="go"
			>Termin buchen →</small
		></span
	>
</a>
