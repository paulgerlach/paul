<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import Header from "$lib/components/Header/Header.svelte";
	import Footer from "$lib/components/Footer/Footer.svelte";

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />
<Toaster
	theme="system"
	class="toaster group"
	style="--normal-bg: #ffffff; --normal-text: var(--popover-foreground); --normal-border: #1e322d;"
/>
