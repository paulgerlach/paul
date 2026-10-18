<!--
  The hero's middle panel: a mock of the tenant portal with four entries whose
  status pills turn from amber to green one after another, every 9 s while in
  view (the design's loop). The server renders the finished list; the first
  pass waits a full interval, so the in-view hero doesn't flash on load (plan
  03 §3.1). The mock is hidden from screen readers; a plain list states the
  entries with their final status.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import AppFrame from "$lib/landing/sections/uv/AppFrame.svelte";
	import Icon from "$lib/landing/sections/uv/Icon.svelte";
	import { portal } from "../content";

	const EVERY = 9000;

	let ok = $state(portal.entries.map(() => true));

	function run() {
		ok = portal.entries.map(() => false);
		const timers = portal.entries.map((_, i) =>
			setTimeout(() => (ok[i] = true), 1400 + i * 700),
		);
		return () => timers.forEach(clearTimeout);
	}
</script>

<AppFrame
	label={portal.label}
	brand={portal.brand}
	nav={portal.nav}
	navFoot={portal.navFoot}
	{@attach loopInView({ run, every: EVERY, delay: EVERY })}
>
	<div class="mh">
		<b>{portal.head}</b><span class="demo">{portal.tag}</span>
	</div>
	<p class="greet">{portal.greeting}</p>
	<p class="ms">{portal.sub}</p>
	<div class="ls">
		{#each portal.entries as entry, i (entry.title)}
			<div class={["li", ok[i] && "ok"]}>
				<span class="th"><Icon name={entry.icon} /></span>
				<span class="nm"><b>{entry.title}</b><small>{entry.sub}</small></span>
				<em class="st">{ok[i] ? entry.after : entry.before}</em>
			</div>
		{/each}
	</div>
	{#snippet sr()}
		<ul class="sr-only">
			{#each portal.entries as entry (entry.title)}
				<li>{entry.title}, {entry.sub}: {entry.after}</li>
			{/each}
		</ul>
	{/snippet}
</AppFrame>

<style>
	.mh {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.mh b {
		font-size: 12px;
		color: var(--muted);
		font-weight: 500;
	}
	.demo {
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 6px;
		padding: 3px 7px;
	}
	.greet {
		font-size: clamp(20px, 2.2vw, 30px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.4;
		margin: 4px 0 0;
	}
	.ms {
		color: var(--muted);
		font-size: 12.5px;
		margin: 4px 0 0;
	}
	.ls {
		margin-top: 16px;
		display: grid;
		gap: 6px;
	}
	.li {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		gap: 12px;
		align-items: center;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 8px 10px;
	}
	.th {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		background: #e4efe6;
		color: #2f7a3c;
		display: grid;
		place-items: center;
	}
	.th :global(svg) {
		width: 16px;
		height: 16px;
	}
	.nm b {
		display: block;
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.nm small {
		display: block;
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.st {
		font-style: normal;
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 4px 9px;
		background: #f3f1ea;
		color: #7a6a3a;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		transition:
			background 0.35s,
			color 0.35s;
	}
	.st::before {
		content: "";
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.8;
	}
	.li.ok .st {
		background: #e6f5e7;
		color: #245f33;
	}
	@media (max-width: 620px) {
		.li {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.th {
			display: none;
		}
	}
</style>
