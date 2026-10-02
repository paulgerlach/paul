<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { cellphone, logo } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN, ROUTE_HOME } from "$lib/routes";
	import type { PostSummary } from "$lib/server/blog";
	import HeaderButton from "./HeaderButton.svelte";
	import LoginDropdown from "./LoginDropdown.svelte";
	import Nav from "./Nav.svelte";
	import { menu } from "./menu.svelte";

	let { posts }: { posts: PostSummary[] } = $props();

	let header = $state<HTMLElement>();
	let scrollY = $state(0);
	const scrolled = $derived(
		header ? scrollY >= header.clientHeight + 250 : false,
	);

	$effect(() => {
		document.documentElement.classList.toggle("_lock", menu.open);
	});

	afterNavigate(() => menu.close());
</script>

<svelte:window bind:scrollY />

<header
	id="header"
	bind:this={header}
	class={[
		"fixed top-2.5 left-1/2 mx-auto w-full -translate-x-1/2 !px-[72px] duration-300 max-megalarge:!px-16 max-large:!px-6 max-medium:!px-5",
		scrolled && "scrolled",
	]}
>
	<div
		class={[
			"flex w-full items-center justify-between rounded-full px-5 backdrop-blur-lg duration-300 ease-in-out max-large:py-4 max-large:[.scrolled_&]:py-3",
			scrolled ? "bg-white/95 shadow-md" : "bg-white/30",
			menu.open && "active",
		]}
	>
		<a
			href={ROUTE_HOME}
			class="flex h-5 w-full max-w-16 items-center justify-start gap-3"
		>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				style="width: 100%; height: auto"
				class="colored-to-black h-5 w-full max-w-16"
				src={logo}
				alt="logo"
			/>
		</a>
		<div
			class="flex flex-grow items-center justify-end duration-300 max-large:fixed max-large:top-0 max-large:left-0 max-large:h-screen max-large:w-screen max-large:translate-x-full max-large:flex-col max-large:items-center max-large:justify-start max-large:bg-card_dark_bg max-large:px-6 max-large:pt-6 max-large:pb-6 [.active_&]:translate-x-0"
		>
			<!-- Mobile: Login options + Close button row -->
			<div
				class="hidden max-large:mb-6 max-large:flex max-large:w-full max-large:flex-col max-large:gap-2 max-large:px-4"
			>
				<div class="flex w-full gap-2">
					<div class="flex-1">
						<LoginDropdown isMobile />
					</div>
					<button
						onclick={() => menu.close()}
						class="flex aspect-square min-h-[48px] cursor-pointer items-center justify-center rounded-halfbase border border-gray-300 bg-white p-4 text-lg text-dark_text transition hover:opacity-80"
					>
						✕
					</button>
				</div>
			</div>
			<!-- Navigation links -->
			<div
				class="flex flex-grow items-center justify-center max-large:w-full max-large:flex-grow-0"
			>
				<Nav {posts} />
			</div>
			<!-- Phone + CTA button -->
			<div
				class="flex items-center justify-end gap-1.5 max-large:mt-6 max-large:w-full max-large:flex-col max-large:items-center max-large:justify-center max-large:gap-3 max-large:px-4"
			>
				<LoginDropdown class="max-large:hidden" />
				<a
					href="tel:+493052001352"
					class="flex items-center justify-center gap-1.5 p-2 text-base text-dark_text max-xl:text-sm max-large:text-lg"
				>
					<Image
						width={16}
						height={16}
						class="max-h-4 min-h-4 w-full max-w-4 min-w-4"
						style="width: 100%; height: auto"
						src={cellphone}
						alt="cellphone"
					/>
					+49 30 52001352
				</a>
				<a
					href={ROUTE_FRAGEBOGEN}
					class="flex items-center justify-center rounded-halfbase border border-green bg-green px-4 py-2 text-base text-dark_text duration-300 hover:opacity-80 max-xl:text-sm max-large:w-full max-large:py-4 max-large:text-lg"
				>
					Angebot einholen
				</a>
			</div>
		</div>
		<a
			href={ROUTE_FRAGEBOGEN}
			class="mr-3 ml-auto hidden items-center justify-center rounded-halfbase border border-border_base bg-green px-4 py-2 text-base text-dark_text duration-300 hover:opacity-80 max-xl:text-sm max-large:flex"
		>
			Angebot einholen
		</a>
		<HeaderButton {scrolled} />
	</div>
</header>
