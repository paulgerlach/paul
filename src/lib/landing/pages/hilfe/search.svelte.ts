import { getContext, setContext, tick } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { prefersReducedMotion } from "$lib/landing/motion";
import { results as resultsCopy, type Topic } from "./content";
import { search } from "./search";

/** How long typing has to settle before the URL and the result line follow. */
const SETTLE_MS = 300;

/**
 * The state of /hilfe, shared by its sections: the query, its results, the
 * open cards and the votes. One per page visit (context), so nothing leaks
 * between SSR requests. The server renders from the `?q=` of the request, so
 * the first client render agrees with it.
 */
export class HelpSearch {
	/** The topics with their current answers (`resolveTopics(now)`), set once. */
	topics: Topic[] = [];
	/** What's in the search field; the list follows it on every keystroke. */
	query = $state("");
	results = $derived(search(this.topics, this.query));
	/**
	 * The query once typing has settled: the result line (a live region,
	 * announced once, not per key) and the URL follow this one.
	 */
	settled = $state("");
	resultLine = $derived.by(() => {
		const query = this.settled.trim();
		const found = search(this.topics, query);
		return found.terms.length ? resultsCopy.text(found.count, query) : "";
	});
	/** Ids of the open question cards. */
	readonly open = new SvelteSet<string>();
	/** Ids of the questions voted on in this visit. */
	readonly voted = new SvelteSet<string>();

	#timer: ReturnType<typeof setTimeout> | undefined;

	constructor(topics: Topic[], initialQuery: string) {
		this.topics = topics;
		this.query = initialQuery;
		this.settled = initialQuery;
		this.#openResults();
	}

	/** A new query from the field (or a reset to ""): the list follows now. */
	setQuery(query: string) {
		this.query = query;
		this.#openResults();
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => this.settle(), SETTLE_MS);
	}

	/**
	 * Writes the query into the result line and the URL (`?q=`, so reload and
	 * sharing keep it) right away. `hash` replaces the URL's hash; without it,
	 * a query drops the hash and no query keeps it.
	 */
	settle(hash?: string) {
		clearTimeout(this.#timer);
		this.settled = this.query;
		if (!browser) return;
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- a throwaway copy for replaceState
		const url = new URL(location.href);
		const query = this.query.trim();
		if (query) url.searchParams.set("q", query);
		else url.searchParams.delete("q");
		if (hash !== undefined) url.hash = hash;
		else if (query) url.hash = "";
		if (url.href !== location.href) replaceState(url, page.state);
	}

	/**
	 * Shows one question: clears a query that hides it, opens the card and
	 * scrolls it into view. `hash` puts `#q-<id>` into the URL, so it can be
	 * shared.
	 */
	async reveal(
		id: string,
		{
			block = "start",
			hash = false,
		}: { block?: ScrollLogicalPosition; hash?: boolean } = {},
	) {
		if (!this.results.ids.has(id)) this.query = "";
		this.open.add(id);
		this.settle(hash ? `q-${id}` : undefined);
		await tick();
		const card = document.getElementById(`q-${id}`);
		card?.scrollIntoView({
			block,
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
		return card;
	}

	/** Whether a topic has a question in the results. */
	hasResults(topic: Topic) {
		return topic.questions.some((question) =>
			this.results.ids.has(question.id),
		);
	}

	/** Stops the pending URL update (page teardown). */
	destroy() {
		clearTimeout(this.#timer);
	}

	/** Opens the results when there are only a few (the design's rule). */
	#openResults() {
		if (this.results.autoOpen)
			for (const id of this.results.ids) this.open.add(id);
	}
}

const KEY = Symbol("help-search");

export function setHelpSearch(topics: Topic[], initialQuery: string) {
	return setContext(KEY, new HelpSearch(topics, initialQuery));
}

export function getHelpSearch() {
	return getContext<HelpSearch>(KEY);
}
