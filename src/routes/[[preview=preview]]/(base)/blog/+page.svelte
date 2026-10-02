<script lang="ts">
	import Subscription from "$lib/components/Basic/Subscription/Subscription.svelte";
	import BlogFilters from "$lib/components/Blog/BlogFilters.svelte";
	import NewestBlogs from "$lib/components/Blog/NewestBlogs.svelte";
	import BlogHero from "$lib/components/Hero/BlogHero.svelte";

	let { data } = $props();
</script>

<main id="content">
	<BlogHero />
	<NewestBlogs posts={data.newest} />
	<BlogFilters posts={data.posts} tags={data.tags} activeTag={data.activeTag} />
	<div
		class="flex items-center justify-center gap-32 bg-[#FAFAF9] px-4 py-8 pl-5"
	>
		<div class="flex flex-col items-center justify-center gap-4">
			<p
				class="mx-auto max-w-6xl text-center text-7xl leading-[1.1] font-semibold max-megalarge:text-6xl max-large:text-5xl max-medium:text-4xl max-small:text-3xl"
			>
				Melde dich für unseren Newsletter für Werbetreibende an.
			</p>
			<p class="text-center text-lg font-semibold max-large:text-base">
				Du wirst als Erstes über Unternehmensneuigkeiten, Events und Insights
				informiert.
			</p>
		</div>
	</div>
	<Subscription />
</main>
