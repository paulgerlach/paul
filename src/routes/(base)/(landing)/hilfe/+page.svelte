<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { afterNavigate } from "$app/navigation";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { faqJsonLd } from "$lib/landing/faqJsonLd";
	import {
		QUESTION_IDS,
		resolveTopics,
	} from "$lib/landing/pages/hilfe/content";
	import { setHelpSearch } from "$lib/landing/pages/hilfe/search.svelte";
	import Articles from "$lib/landing/pages/hilfe/sections/Articles.svelte";
	import EndCta from "$lib/landing/pages/hilfe/sections/EndCta.svelte";
	import Hero from "$lib/landing/pages/hilfe/sections/Hero.svelte";
	import Topics from "$lib/landing/pages/hilfe/sections/Topics.svelte";
	import Trust from "$lib/landing/pages/hilfe/sections/Trust.svelte";

	let { data, form } = $props();

	// The server's time picks the deadline answer, so SSR and hydration agree.
	const search = setHelpSearch(
		resolveTopics(untrack(() => data.now)),
		untrack(() => data.q),
	);

	// A vote without JS comes back here: thank it, at its open card.
	const votedWithoutJs = untrack(() => form?.form.message?.question);
	if (votedWithoutJs) {
		search.voted.add(votedWithoutJs);
		search.open.add(votedWithoutJs);
	}

	const jsonLd = faqJsonLd(
		search.topics.flatMap((topic) =>
			topic.questions.map(({ question, answer }) => ({ question, answer })),
		),
	);

	/** A `#q-<id>` link opens its card, even when the search hides it. */
	function openFromHash() {
		const id = /^#q-(.+)$/.exec(decodeURIComponent(location.hash))?.[1];
		if (id && QUESTION_IDS.includes(id)) search.reveal(id);
	}

	// On the first load, once hydration is done. Kit marks the router as
	// started right after these callbacks, and replaceState needs that.
	afterNavigate(({ type }) => {
		if (type === "enter") queueMicrotask(openFromHash);
	});
	onMount(() => () => search.destroy());
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html jsonLd}
</svelte:head>

<svelte:window onhashchange={openFromHash} />

<main id="content" class="hc" {@attach reveal()}>
	<Hero />
	<Topics />
	<Articles />
	<EndCta />
	<Trust />
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.hc {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.hc :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.hc :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
