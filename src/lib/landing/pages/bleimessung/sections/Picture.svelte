<!-- The full-width microscope photo (the template's picture; the design's #lab-css position). -->
<script lang="ts">
	import photo from "$lib/assets/landing/bleimessung/microscope.webp?enhanced";
	import SvcPicture from "$lib/landing/sections/svc/Picture.svelte";
	import { picture } from "../content";
</script>

<SvcPicture
	content={picture}
	{photo}
	width={1440}
	height={1440}
	position="60% 32%"
/>
