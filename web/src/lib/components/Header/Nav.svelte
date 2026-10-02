<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		arrow,
		blog_group_link,
		modal_bell,
		modal_building,
		modal_chart,
		modal_cooler,
		modal_counter,
		modal_gear,
		modal_grid,
		modal_heater,
		modal_list,
		modal_shower,
		modal_water,
		modal_wifi,
	} from "$lib/assets/icons";
	import {
		ROUTE_BLOG,
		ROUTE_FUNKTIONEN,
		ROUTE_GERAETE,
		ROUTE_PREISE,
	} from "$lib/routes";
	import type { NavPost } from "$lib/server/blog";
	import type { NavGroupType } from "$lib/types";
	import NavFunktionenRightSide from "./NavFunktionenRightSide.svelte";
	import NavGroup from "./NavGroup.svelte";
	import { menu } from "./menu.svelte";

	let { posts }: { posts: NavPost[] } = $props();

	const lastPost = $derived(posts[0]);

	const navGroups: NavGroupType[] = $derived([
		{
			groupLinks: [
				{ icon: modal_heater, title: "Heizungszähler" },
				{ title: "Warmwasserzähler", icon: modal_water },
				{ title: "Kaltwasserzähler", icon: modal_shower },
				{ icon: modal_wifi, title: "Rauchmelder" },
				{ title: "Feuerlöscher", icon: modal_cooler },
				{ icon: modal_heater, title: "Sonstiges" },
			],
			route: ROUTE_GERAETE,
			title: "Geräte",
			groupTitle: "Unsere Produkte",
			rightSide: geraeteRightSide,
		},
		{
			route: ROUTE_FUNKTIONEN,
			title: "Funktionen",
			groupTitle: "Funktionen",
			rightSide: funktionenRightSide,
			groupLinks: [
				{ title: "Betriebskosten", icon: modal_gear },
				{ title: "Heizkostenabrechnung", icon: modal_list },
				{ title: "Echtzeit Verbrauch", icon: modal_chart },
				{ title: "Dashboard", icon: modal_grid },
				{ title: "Immobilienmanagement", icon: modal_building },
				{ title: "Benachrichtigungen", icon: modal_bell },
			],
		},
		...(lastPost
			? [
					{
						route: ROUTE_BLOG,
						title: "Blog",
						groupTitle: "Unsere Blog Artikel",
						rightSide: blogRightSide,
						groupLinks: posts
							.filter((post) => post.title)
							.map((post) => ({
								title: post.title,
								icon: blog_group_link,
								link: `${ROUTE_BLOG}/${post.uid}`,
							})),
					},
				]
			: []),
	]);
</script>

{#snippet highlightTitle(text: string)}
	<p class="mb-5 flex items-center justify-between text-xl text-dark_text">
		{text}
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="size-2.5 max-h-2.5 max-w-2.5"
			style="width: 100%; height: auto"
			alt="arrow"
			src={arrow}
		/>
	</p>
{/snippet}

{#snippet geraeteRightSide()}
	<a class="group" href={ROUTE_GERAETE}>
		{@render highlightTitle("Produkthighlight")}
		<div
			class="mb-2.5 flex items-center justify-center rounded-base bg-[#D9D9D9]/50 px-12 py-5"
		>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				style="width: 100%; height: auto"
				src={modal_counter}
				alt="counter mobile"
			/>
		</div>
		<p class="mb-3 text-[15px] font-bold text-dark_text">
			Neue Warmwasserzähler
		</p>
		<p class="text-xs text-dark_text">
			Neuste Funktechnik erlaubt das Ablesen des Warmwasserverbrauchs in
			Echtzeit
		</p>
	</a>
{/snippet}

{#snippet funktionenRightSide()}
	<NavFunktionenRightSide />
{/snippet}

{#snippet blogRightSide()}
	<a class="group" href="{ROUTE_BLOG}/{lastPost.uid}">
		{@render highlightTitle("Blog Artikel Highlights")}
		<div class="mb-2.5 flex items-center justify-center rounded-base">
			{#if lastPost.image}
				<img
					loading="lazy"
					decoding="async"
					class="min-h-[150px] rounded-2xl object-cover"
					style="width: 100%; height: auto"
					src={lastPost.image.url}
					alt={lastPost.image.alt || "blog_image"}
				/>
			{/if}
		</div>
		<p class="mb-3 text-[15px] font-bold text-dark_text">{lastPost.title}</p>
		<p class="text-xs text-dark_text">{lastPost.subtitle}</p>
	</a>
{/snippet}

<nav
	class="flex items-center justify-center gap-8 max-large:w-full max-large:flex-col max-large:items-center max-large:justify-center max-large:gap-0 max-medium:gap-4"
>
	{#each navGroups as group (group.title)}
		<NavGroup {group} />
	{/each}
	<div class="max-large:w-full max-large:py-3 max-large:text-center">
		<a
			onclick={() => menu.close()}
			href="/#kunden"
			class="flex items-center justify-center gap-2 text-base text-dark_text max-xl:text-sm max-large:text-base"
		>
			Kunden
		</a>
	</div>

	<div class="max-large:w-full max-large:py-3 max-large:text-center">
		<a
			onclick={() => menu.close()}
			href={ROUTE_PREISE}
			class="flex items-center justify-center gap-2 text-base text-dark_text max-xl:text-sm max-large:text-base"
		>
			Preise
		</a>
	</div>
</nav>
