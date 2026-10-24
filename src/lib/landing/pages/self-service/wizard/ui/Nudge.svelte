<!-- "Bitte machen Sie so viele Angaben wie möglich." (`.ss-nudge`). -->
<script lang="ts">
	let { strong = false }: { strong?: boolean } = $props();
</script>

<div class={["ss-nudge", strong && "strong"]}>
	<b>Bitte machen Sie so viele Angaben wie möglich.</b> Eine individuelle Beratung
	ist derzeit aus Kapazitätsgründen leider nicht möglich. Mit genauen Angaben, einer
	Geräteliste oder Fotos erhalten Sie Ihr Angebot am schnellsten.
</div>
