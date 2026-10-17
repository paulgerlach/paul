<!--
  "Ein Tag bei Heidi": a decorative example feed. The server renders the
  first 4 events; in the browser a new one slides in every 2.6 s and the
  oldest leaves after 5, but only while the feed is in view, the tab is
  visible, and it isn't paused, hovered or focused. Nothing moves with
  reduced motion. Not `aria-live`: it would announce every tick.
-->
<script lang="ts">
	import type { TransitionConfig } from "svelte/transition";
	import { onMount } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { feed, type FeedEvent } from "../content";

	const START = 4;
	const MAX = 5;
	const EVERY_MS = 2600;

	const events = feed.events;
	// Newest first: the design starts with events 4…1 already added.
	let items = $state<{ key: number; event: FeedEvent; added?: boolean }[]>(
		events
			.slice(0, START)
			.map((event, key) => ({ key, event }))
			.reverse(),
	);
	let next = START;

	let motion = $state(false);
	let shown = $state(false);
	let visible = $state(true);
	let paused = $state(false);
	let hovered = $state(false);
	let focused = $state(false);

	const running = $derived(
		motion && shown && visible && !paused && !hovered && !focused,
	);

	onMount(() => {
		motion = !prefersReducedMotion();
		visible = document.visibilityState === "visible";
	});

	function tick() {
		const key = next++;
		items.unshift({ key, event: events[key % events.length], added: true });
		if (items.length > MAX) items.pop();
	}

	$effect(() => {
		if (!running) return;
		const timer = setInterval(tick, EVERY_MS);
		return () => clearInterval(timer);
	});

	/** The design's `kr-out`: fade and drop 8 px. */
	const leave: (node: Element) => TransitionConfig = () => ({
		duration: 400,
		css: (t: number) =>
			`opacity: ${t}; transform: translateY(${(1 - t) * 8}px)`,
	});
</script>

<svelte:document
	onvisibilitychange={() => (visible = document.visibilityState === "visible")}
/>

<div
	class="feed rv"
	role="group"
	aria-label={feed.label}
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
	{@attach inView({
		onEnter: () => (shown = true),
		onLeave: () => (shown = false),
	})}
>
	<div class="fh">
		<span class={["fd", motion && !paused && "live"]}>
			<i aria-hidden="true"></i>{feed.title}
		</span>
		<span class="fr">
			<span class="demo">{feed.badge}</span>
			{#if motion}
				<button
					type="button"
					class="pause"
					aria-pressed={paused}
					aria-label={feed.pause}
					title={paused ? feed.resume : feed.pause}
					onclick={() => (paused = !paused)}
				>
					<svg viewBox="0 0 12 12" aria-hidden="true">
						{#if paused}
							<path d="M3.5 2l6 4-6 4z" fill="currentColor" />
						{:else}
							<path
								d="M4 2.5v7M8 2.5v7"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
						{/if}
					</svg>
				</button>
			{/if}
		</span>
	</div>
	<ul>
		{#each items as item (item.key)}
			<li class={[item.added && "new"]} out:leave>
				<span class="ei"><Icon name={item.event.icon} /></span>
				<span class="et">
					<b>{item.event.title}</b>
					<small>{item.event.sub}</small>
				</span>
				<em class={item.event.area}>{item.event.label}</em>
			</li>
		{/each}
	</ul>
</div>

<style>
	.feed {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 22px;
		padding: 18px;
		min-height: 380px;
		position: relative;
		overflow: hidden;
	}
	.fh {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 2px 4px 14px;
	}
	.fd {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.8);
	}
	.fd i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
	}
	.fd.live i {
		animation: blink 1.6s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}
	.fr {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.demo {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.pause {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.24);
		background: transparent;
		color: rgba(255, 255, 255, 0.8);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: border-color 0.2s;
	}
	.pause:hover {
		border-color: rgba(255, 255, 255, 0.5);
	}
	.pause svg {
		width: 10px;
		height: 10px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	li {
		display: grid;
		grid-template-columns: 36px minmax(0, 1fr) auto;
		gap: 12px;
		align-items: center;
		background: #fff;
		color: var(--ink);
		border-radius: 14px;
		padding: 11px 13px;
	}
	li.new {
		animation: enter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes enter {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.ei {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--bg);
		display: grid;
		place-items: center;
	}
	.ei :global(svg) {
		width: 17px;
		height: 17px;
	}
	.et b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.et small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	em {
		font-style: normal;
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 9px;
		white-space: nowrap;
	}
	em.eng {
		background: #eef1f6;
		color: #3f5fae;
	}
	em.ops {
		background: #fff4e5;
		color: #9a5b00;
	}
	em.cs {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	em.sales {
		background: #f1f3f2;
		color: var(--ink);
	}
	@media (max-width: 640px) {
		.feed {
			min-height: 340px;
		}
		/* German text wraps instead of being cut */
		.et small {
			white-space: normal;
		}
	}
</style>
