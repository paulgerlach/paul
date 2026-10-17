<script lang="ts">
	import photo from "$lib/assets/landing/selbstabrechnung/beratung.webp?enhanced";
	import People from "$lib/landing/sections/People.svelte";
	import { people } from "../content";
</script>

<!--
  The photo needs a licence: see the go-live gate, plan §4.4. `spaced`: the
  design gives this section no top padding after the grey sample section, so
  the photo touches it; we pad it like the design's own `.pp-in` variant.
-->
<People
	title={people.title}
	text={people.text}
	checks={people.checks}
	{photo}
	objectPosition={people.photoPosition}
	spaced
/>
