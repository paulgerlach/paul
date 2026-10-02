<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { right_arrow } from "$lib/assets/icons";
	import type { PostSummary } from "$lib/server/blog";
	import type { NavGroupType } from "$lib/types";
	import NavHighlight from "./highlights/NavHighlight.svelte";
	import { menu } from "./menu.svelte";

	let { group, posts }: { group: NavGroupType; posts: PostSummary[] } =
		$props();
	const { title, route, groupTitle, groupLinks, highlight } = $derived(group);

	let isMobileDropdownOpen = $state(false);

	const closeAll = () => {
		isMobileDropdownOpen = false;
		menu.close();
	};
</script>

<div
	class="group relative py-5 duration-300 max-large:w-full max-large:py-3 [.scrolled_&]:py-4"
>
	<!-- Desktop link - visible on large screens -->
	<a
		href={route}
		onclick={() => menu.close()}
		class="flex items-center justify-start gap-2 text-base text-dark_text max-xl:text-sm max-large:hidden"
	>
		{title}
		<Image class="colored-to-black" src={right_arrow} alt="arrow" />
	</a>

	<!-- Mobile dropdown toggle - visible on mobile -->
	<button
		onclick={() => (isMobileDropdownOpen = !isMobileDropdownOpen)}
		class="hidden w-full items-center justify-center gap-2 text-base text-dark_text max-large:flex"
	>
		{title}
		<Image
			class={[
				"colored-to-black transition-transform duration-300",
				isMobileDropdownOpen && "rotate-90",
			]}
			src={right_arrow}
			alt="arrow"
		/>
	</button>

	<!-- Mobile dropdown content -->
	{#if isMobileDropdownOpen}
		<div class="mt-2 hidden rounded-base bg-white px-3 py-2 max-large:block">
			<ul class="space-y-1">
				{#each groupLinks as link (link.title)}
					<li>
						<a
							class="flex cursor-pointer items-center justify-start gap-3 rounded-base px-2 py-1.5 text-sm text-dark_text/70 duration-300 hover:bg-link/20"
							href={link.link ? link.link : route}
							onclick={closeAll}
						>
							<Image
								width={20}
								height={20}
								sizes="100vw"
								class="size-5 max-h-5 max-w-5"
								src={link.icon}
								alt="modal_icon"
							/>
							<span class="line-clamp-2">{link.title}</span>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href={route}
				onclick={closeAll}
				class="mt-2 block py-1 text-center text-sm text-green"
			>
				Alle anzeigen →
			</a>
		</div>
	{/if}

	<!-- Desktop dropdown -->
	<div
		class="absolute top-[100%] left-1/2 mx-5 grid w-[620px] -translate-x-1/2 -translate-y-[200%] grid-cols-2 gap-20 rounded-base bg-white py-9 pr-8 pl-16 shadow-2xl group-hover:translate-y-0 max-large:hidden max-large:grid-cols-1"
	>
		<div>
			<p class="mb-5 text-xl text-dark_text">{groupTitle}</p>
			<ul>
				{#each groupLinks as link (link.title)}
					<li class="nav-link-wrapper">
						<a
							class="flex cursor-pointer items-center justify-start gap-4 rounded-base px-3.5 py-2.5 text-[15px] text-dark_text/50 duration-300 hover:bg-link/20"
							href={link.link ? link.link : route}
						>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								style="width: 100%; height: auto"
								class="size-7 max-h-7 max-w-7"
								src={link.icon}
								alt="modal_icon"
							/>
							<span class="line-clamp-2">{link.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<NavHighlight key={highlight} {posts} />
	</div>
</div>
