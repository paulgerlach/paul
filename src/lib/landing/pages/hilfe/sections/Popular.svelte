<!-- "Häufig gesucht:": links to four questions. With JS the card opens, centred, with a short flash. -->
<script lang="ts">
	import { popular } from "../content";
	import { getHelpSearch } from "../search.svelte";

	const search = getHelpSearch();

	const items = popular.ids.map((id) => ({
		id,
		text: search.topics
			.flatMap((topic) => topic.questions)
			.find((question) => question.id === id)!.question,
	}));

	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => () => clearTimeout(flashTimer));

	async function show(event: MouseEvent, id: string) {
		event.preventDefault();
		search.setQuery("");
		const card = await search.reveal(id, { block: "center", hash: true });
		if (!card) return;
		card.classList.remove("flash");
		// Restart the animation when the same link is clicked again.
		void card.offsetWidth;
		card.classList.add("flash");
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => card.classList.remove("flash"), 1200);
	}
</script>

<p class="pops rv">
	<span>{popular.label}</span>
	{#each items as item (item.id)}
		<a class="pop" href="#q-{item.id}" onclick={(event) => show(event, item.id)}
			>{item.text}</a
		>
	{/each}
</p>

<style>
	.pops {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		align-items: center;
		margin-top: 18px;
		font-size: 13.5px;
		color: var(--muted);
	}
	.pop {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 13.5px;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.pop:hover {
		border-color: var(--ok);
		background: #f2faf3;
	}
</style>
