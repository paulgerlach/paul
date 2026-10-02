<script lang="ts">
	import type { PostSummary } from "$lib/server/blog";
	import NavGroup from "./NavGroup.svelte";
	import { buildNavGroups, navLinks } from "./navGroups";
	import { menu } from "./menu.svelte";

	let { posts }: { posts: PostSummary[] } = $props();

	const navGroups = $derived(buildNavGroups(posts));
</script>

<nav
	class="flex items-center justify-center gap-8 max-large:w-full max-large:flex-col max-large:items-center max-large:justify-center max-large:gap-0 max-medium:gap-4"
>
	{#each navGroups as group (group.title)}
		<NavGroup {group} {posts} />
	{/each}
	{#each navLinks as link (link.href)}
		<div class="max-large:w-full max-large:py-3 max-large:text-center">
			<a
				onclick={() => menu.close()}
				href={link.href}
				class="flex items-center justify-center gap-2 text-base text-dark_text max-xl:text-sm max-large:text-base"
			>
				{link.title}
			</a>
		</div>
	{/each}
</nav>
