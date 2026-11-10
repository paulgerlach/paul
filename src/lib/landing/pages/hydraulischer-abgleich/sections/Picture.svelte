<!-- The full-width photo of the actuators (the template's picture; #ha-img's position at every width). -->
<script lang="ts">
	import photo from "$lib/assets/landing/hydraulischer-abgleich/actuators.webp?enhanced";
	import SvcPicture from "$lib/landing/sections/svc/Picture.svelte";
	import { picture } from "../content";
</script>

<SvcPicture
	content={picture}
	{photo}
	width={1100}
	height={734}
	position="50% 40%"
	mobilePosition="50% 40%"
/>
