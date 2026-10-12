<!--
  The search field. Without JS it's a GET form (`/hilfe?q=…`, filtered on the
  server); with JS the list follows every keystroke and the URL follows once
  typing settles. "/" focuses it from anywhere but another field.
-->
<script lang="ts">
	import { ROUTE_HILFE } from "$lib/routes";
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
	import { MAX_QUERY } from "../search";
	import { getHelpSearch } from "../search.svelte";

	const search = getHelpSearch();
	let input: HTMLInputElement;

	function onsubmit(event: SubmitEvent) {
		// The list is already filtered; only the URL is behind.
		event.preventDefault();
		search.settle();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "Escape" || !search.query) return;
		event.preventDefault();
		search.setQuery("");
	}

	function isField(target: EventTarget | null) {
		return (
			target instanceof HTMLElement &&
			(target.isContentEditable ||
				["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
		);
	}

	function focusOnSlash(event: KeyboardEvent) {
		if (event.key !== "/" || event.defaultPrevented) return;
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (isField(event.target)) return;
		event.preventDefault();
		input.focus();
	}
</script>

<svelte:document onkeydown={focusOnSlash} />

<form
	class="search rv"
	role="search"
	method="get"
	action={ROUTE_HILFE}
	{onsubmit}
>
	<Icon name="search" />
	<input
		bind:this={input}
		id="hc-q"
		type="search"
		name="q"
		value={search.query}
		oninput={(event) => search.setQuery(event.currentTarget.value)}
		{onkeydown}
		placeholder={hero.search.placeholder}
		aria-label={hero.search.label}
		aria-keyshortcuts="/"
		autocomplete="off"
		enterkeyhint="search"
		maxlength={MAX_QUERY}
	/>
	<kbd aria-hidden="true">/</kbd>
	<button class="sr-only" type="submit">{hero.search.submit}</button>
</form>

<style>
	.search {
		display: flex;
		align-items: center;
		gap: 12px;
		max-width: 640px;
		margin: 32px auto 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 14px 18px;
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.4);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.search:focus-within {
		border-color: var(--ok);
		box-shadow: 0 0 0 4px rgba(138, 214, 143, 0.25);
	}
	.search :global(svg) {
		width: 20px;
		height: 20px;
		color: var(--faint);
		flex: none;
	}
	input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		font-size: 17px;
		background: transparent;
		color: var(--ink);
	}
	/* The field's ring is the form's :focus-within. */
	input:focus-visible {
		outline: 0;
	}
	input::placeholder {
		color: var(--faint);
		opacity: 1;
	}
	kbd {
		font: inherit;
		font-size: 12px;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 6px;
		padding: 2px 7px;
	}
	@media (max-width: 560px), (hover: none) {
		kbd {
			display: none;
		}
	}
</style>
