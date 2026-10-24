<!-- The sticky "Themen" list; the topic in view is marked (scroll-spy, wide screens only, where the list is shown). -->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { toc } from "../content";
	import { getHelpSearch } from "../search.svelte";

	const search = getHelpSearch();
	let active = $state("");

	/** Marks the topic crossing the upper third of the viewport (the design's margins). */
	const spy: Attachment<HTMLElement> = () => {
		const wide = matchMedia("(min-width: 901px)");
		let observer: IntersectionObserver | undefined;

		function start() {
			observer?.disconnect();
			observer = undefined;
			if (!wide.matches) return;
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries)
						if (entry.isIntersecting) active = entry.target.id.slice(2);
				},
				{ rootMargin: "-30% 0px -60% 0px" },
			);
			// Hidden topics (search) never intersect, so they're skipped.
			for (const topic of search.topics) {
				const section = document.getElementById(`c-${topic.id}`);
				if (section) observer.observe(section);
			}
		}

		start();
		wide.addEventListener("change", start);
		return () => {
			wide.removeEventListener("change", start);
			observer?.disconnect();
		};
	};
</script>

<nav class="toc" aria-label={toc.label} {@attach spy}>
	<b aria-hidden="true">{toc.label}</b>
	{#each search.topics as topic (topic.id)}
		<a
			href="#c-{topic.id}"
			class={[active === topic.id && "on"]}
			aria-current={active === topic.id ? "location" : undefined}
			>{topic.title}</a
		>
	{/each}
</nav>

<style>
	.toc {
		position: sticky;
		top: 96px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 14.5px;
	}
	b {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
		margin-bottom: 8px;
	}
	a {
		padding: 7px 10px;
		border-radius: 8px;
		color: var(--muted);
		border-left: 2px solid transparent;
		transition:
			background 0.2s,
			color 0.2s;
	}
	a:hover {
		background: #fff;
		color: var(--ink);
	}
	a.on {
		background: #fff;
		color: var(--ink);
		border-left-color: var(--ok);
		font-weight: 600;
	}
	@media (max-width: 900px) {
		.toc {
			display: none;
		}
	}
</style>
