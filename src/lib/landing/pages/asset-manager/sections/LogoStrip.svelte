<script lang="ts">
	import LogoStrip from "$lib/landing/sections/LogoStrip.svelte";
	import { logos } from "../content";
</script>

<!-- The logos are unconfirmed: see the go-live gate, plan §4.20. -->
<LogoStrip text={logos.text} logos={logos.order} />
