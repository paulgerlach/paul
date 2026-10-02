<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { logo } from "$lib/assets/icons";
	import { ROUTE_HOME } from "$lib/routes";

	let header = $state<HTMLElement>();
	let scrollY = $state(0);
	const scrolled = $derived(
		header ? scrollY >= header.clientHeight + 250 : false,
	);
</script>

<svelte:window bind:scrollY />

<header
	id="header"
	bind:this={header}
	class={["sticky top-0 w-full duration-300", scrolled && "scrolled"]}
>
	<div
		class="flex w-full items-center justify-between bg-white px-10 py-4 duration-300 ease-in-out max-medium:px-5 [.scrolled_&]:py-3"
	>
		<a href={ROUTE_HOME} class="flex items-center justify-start gap-3">
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="colored-to-black max-h-5 max-w-16"
				src={logo}
				alt="logo"
			/>
		</a>
	</div>
</header>
