<!--
  "War das hilfreich?" Ja / Nein: a real form (works without JS, then the
  page comes back at this card). With JS it posts in the background. The
  answer is always a thanks, so there's no error state.
-->
<script lang="ts">
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import { feedback } from "../content";
	import { getHelpSearch } from "../search.svelte";

	let { id }: { id: string } = $props();
	const search = getHelpSearch();

	let sending = $state(false);
	const voted = $derived(search.voted.has(id));

	const submit: SubmitFunction = () => {
		sending = true;
		return async () => {
			sending = false;
			search.voted.add(id);
		};
	};
</script>

<form class="fb" method="POST" action="?/feedback#q-{id}" use:enhance={submit}>
	<input type="hidden" name="question" value={id} />
	{#if !voted}
		<span>{feedback.label}</span>
		<button name="vote" value="yes" disabled={sending}>{feedback.yes}</button>
		<button name="vote" value="no" disabled={sending}>{feedback.no}</button>
	{/if}
	<em role="status">{voted ? feedback.thanks : ""}</em>
</form>

<style>
	.fb {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px 20px 16px;
		font-size: 13px;
		color: var(--faint);
	}
	button {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 4px 12px;
		font-size: 13px;
		cursor: pointer;
		color: var(--ink);
	}
	button:hover {
		border-color: var(--ok);
	}
	button:disabled {
		cursor: default;
		opacity: 0.6;
	}
	em {
		font-style: normal;
		color: var(--ok);
		font-weight: 600;
	}
	em:empty {
		display: none;
	}
</style>
