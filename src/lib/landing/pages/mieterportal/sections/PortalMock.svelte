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
	import Icon from "../components/Icon.svelte";
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

<figure
	class="pk mid"
	aria-label={portal.label}
	{@attach loopInView({ run, every: EVERY, delay: EVERY })}
>
	<div class="app" aria-hidden="true">
		<div class="side">
			<b class="logo">
				<svg viewBox="0 0 14 14"
					><rect x="1" y="2" width="3" height="10" rx="1.5" /><rect
						x="5.5"
						y="2"
						width="3"
						height="10"
						rx="1.5"
					/><rect x="10" y="2" width="3" height="10" rx="1.5" /></svg
				>
				{portal.brand}
			</b>
			{#each portal.nav as item, i (item.text)}
				<span class={[i === 0 && "on"]}
					><Icon name={item.icon} />{item.text}</span
				>
			{/each}
			<small>{portal.navFoot}</small>
		</div>
		<div class="main">
			<div class="mh">
				<b>{portal.head}</b><span class="demo">{portal.tag}</span>
			</div>
			<p class="greet">{portal.greeting}</p>
			<p class="ms">{portal.sub}</p>
			<div class="ls">
				{#each portal.entries as entry, i (entry.title)}
					<div class={["li", ok[i] && "ok"]}>
						<span class="th"><Icon name={entry.icon} /></span>
						<span class="nm"
							><b>{entry.title}</b><small>{entry.sub}</small></span
						>
						<em class="st">{ok[i] ? entry.after : entry.before}</em>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<ul class="sr-only">
		{#each portal.entries as entry (entry.title)}
			<li>{entry.title}, {entry.sub}: {entry.after}</li>
		{/each}
	</ul>
</figure>

<style>
	.pk {
		margin: 0;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 42vw, 600px);
		position: relative;
	}
	.mid {
		background: #e4efe6;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: clamp(24px, 5vw, 72px) clamp(18px, 4vw, 64px) 0;
	}
	.app {
		width: 100%;
		max-width: 820px;
		background: #fff;
		color: var(--ink);
		border-radius: 14px 14px 0 0;
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr);
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.55);
		min-height: 86%;
	}
	.side {
		border-right: 1px solid var(--hair);
		padding: 14px 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12.5px;
		color: var(--muted);
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 15px;
		color: var(--ink);
		font-weight: 600;
		margin: 0 4px 10px;
	}
	.logo svg {
		width: 18px;
		height: 18px;
		fill: var(--ink);
	}
	.side span {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 7px 8px;
		border-radius: 7px;
	}
	.side span :global(svg) {
		width: 14px;
		height: 14px;
	}
	.side span.on {
		background: var(--bg);
		color: var(--ink);
		font-weight: 600;
	}
	.side small {
		margin-top: auto;
		padding: 8px;
		font-size: 11px;
		color: var(--faint);
	}
	.main {
		padding: 16px clamp(14px, 3vw, 34px) 18px;
		display: flex;
		flex-direction: column;
	}
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
		.pk {
			height: auto;
			min-height: 440px;
			border-radius: 20px;
		}
		.mid {
			padding: 20px 12px 0;
		}
		.app {
			grid-template-columns: 1fr;
		}
		.side {
			display: none;
		}
		.li {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.th {
			display: none;
		}
	}
</style>
