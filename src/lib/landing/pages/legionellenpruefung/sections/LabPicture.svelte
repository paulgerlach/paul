<!-- The full-width lab photo with its caption (the template's picture). -->
<script lang="ts">
	import photo from "$lib/assets/landing/legionellenpruefung/lab.webp?enhanced";
	import Picture from "$lib/landing/sections/svc/Picture.svelte";
	import { lab } from "../content";
</script>

<Picture content={lab} {photo} width={1900} height={1069} />
