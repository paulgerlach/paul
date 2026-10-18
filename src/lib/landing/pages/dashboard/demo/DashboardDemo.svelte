<!--
  The dashboard preview in the hero (plan 02, 1a; plan 03, part A): the top
  bar with its menus, the view switch (side nav, tabs on small screens) and the
  current view. Only the Dashboard view is server-rendered; the others load on
  first use. Nothing the visitor does here leaves the browser.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import HeidiLogo from "$lib/landing/components/icons/HeidiLogo.svelte";
	import Icon from "../components/Icon.svelte";
	import type { IconName } from "../icons";
	import { PERIODS } from "./data";
	import { DashboardDemo, setDemo, type View } from "./demo.svelte";
	import Picker from "./Picker.svelte";
	import Overview from "./views/Overview.svelte";

	let { label }: { label: string } = $props();

	const demo = setDemo(new DashboardDemo());
	onDestroy(() => demo.destroy());
	const uid = $props.id();

	const VIEWS: { key: View; text: string; icon: IconName; more?: boolean }[] = [
		{ key: "dash", text: "Dashboard", icon: "home" },
		{ key: "obj", text: "Objekte", icon: "building", more: true },
		{ key: "mtr", text: "Zähler", icon: "meter" },
		{ key: "doc", text: "Dokumente", icon: "file" },
		{ key: "abr", text: "Abrechnung", icon: "calculator", more: true },
	];

	/** Arrow keys move between the tabs of one tablist (roving tabindex). */
	function onTabKey(event: KeyboardEvent, list: HTMLElement) {
		const keys = [
			"ArrowRight",
			"ArrowDown",
			"ArrowLeft",
			"ArrowUp",
			"Home",
			"End",
		];
		if (!keys.includes(event.key)) return;
		event.preventDefault();
		const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
		const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
		const n = tabs.length;
		const next =
			event.key === "Home"
				? 0
				: event.key === "End"
					? n - 1
					: event.key === "ArrowRight" || event.key === "ArrowDown"
						? (i + 1) % n
						: (i - 1 + n) % n;
		tabs[next].focus();
	}
</script>

<section class="app" aria-label={label}>
	<div class="top">
		<div class="logo"><HeidiLogo class="hl" /></div>

		<Picker menu="port" label="Portfolio wählen" class="port">
			{#snippet button()}
				<Icon name="building" />
				<span class="sel-t">
					<b>Mein Portfolio</b>
					<small
						>{demo.scoped
							? `${demo.scoped.name} · ${demo.scoped.units} Wohnungen`
							: `${demo.totalUnits} Wohnungen ausgewählt`}</small
					>
				</span>
				<Icon name="chevron" />
			{/snippet}
			<p class="ph">Portfolio wählen</p>
			<button
				type="button"
				class="pi"
				aria-current={!demo.scope}
				onclick={() => demo.setScope(null)}
			>
				<span
					><b>Alle Objekte</b><small
						>{demo.objects.length} Objekte · {demo.totalUnits} Wohnungen</small
					></span
				>
				{#if !demo.scope}<Icon name="check" />{/if}
			</button>
			{#each demo.objects as o (o.id)}
				<button
					type="button"
					class="pi"
					aria-current={demo.scope === o.id}
					onclick={() => demo.setScope(o.id)}
				>
					<span><b>{o.name}</b><small>{o.units} Wohnungen</small></span>
					{#if demo.scope === o.id}<Icon name="check" />{/if}
				</button>
			{/each}
		</Picker>

		<Picker menu="zeit" label="Zeitraum" class="hide-m">
			{#snippet button()}
				<Icon name="clock" />
				<span class="sel-t"
					><b>Zeitraum</b><small>{demo.period.label}</small></span
				>
				<Icon name="chevron" />
			{/snippet}
			<p class="ph">Zeitraum</p>
			{#each PERIODS as p (p.key)}
				<button
					type="button"
					class="pi"
					aria-current={demo.periodKey === p.key}
					onclick={() => demo.setPeriod(p.key)}
				>
					<span><b>{p.name}</b><small>{p.label}</small></span>
					{#if demo.periodKey === p.key}<Icon name="check" />{/if}
				</button>
			{/each}
		</Picker>

		<label class="tg hide-s">
			<input type="checkbox" role="switch" bind:checked={demo.dataView} />
			<i aria-hidden="true"></i>Datenansicht
		</label>

		<button type="button" class="share">Dashboard teilen</button>
	</div>

	<div class="body">
		<aside class="side">
			<div
				class="nav"
				role="tablist"
				aria-label="Bereiche"
				aria-orientation="vertical"
				tabindex="-1"
				onkeydown={(e) => onTabKey(e, e.currentTarget)}
			>
				{#each VIEWS as v (v.key)}
					<button
						type="button"
						role="tab"
						id="{uid}-s-{v.key}"
						aria-selected={demo.view === v.key}
						aria-controls="{uid}-panel"
						tabindex={demo.view === v.key ? 0 : -1}
						class={["nv", demo.view === v.key && "on"]}
						onclick={() => demo.go(v.key)}
					>
						<Icon name={v.icon} />{v.text}
						{#if v.key === "doc" && demo.docsUnseen}
							<span class="cnt">neu</span>
						{:else if v.more}
							<span class="ch"><Icon name="chevronRight" /></span>
						{/if}
					</button>
				{/each}
			</div>
			<div class="sp"></div>
			<span class="acc"
				><Icon name="user" />Mein Konto<Icon name="chevron" /></span
			>
			<span class="lang"
				><Icon name="language" />Deutsch<Icon name="chevron" /></span
			>
			<span class="legal"><span>Impressum</span><span>Datenschutz</span></span>
		</aside>

		<div class="main">
			<div
				class="mtabs"
				role="tablist"
				aria-label="Bereiche"
				tabindex="-1"
				onkeydown={(e) => onTabKey(e, e.currentTarget)}
			>
				{#each VIEWS as v (v.key)}
					<button
						type="button"
						role="tab"
						id="{uid}-m-{v.key}"
						aria-selected={demo.view === v.key}
						aria-controls="{uid}-panel"
						tabindex={demo.view === v.key ? 0 : -1}
						class={[demo.view === v.key && "on"]}
						onclick={() => demo.go(v.key)}
					>
						{v.text}
					</button>
				{/each}
			</div>

			<div
				class="view"
				id="{uid}-panel"
				role="tabpanel"
				aria-labelledby="{uid}-s-{demo.view}"
			>
				{#if demo.view === "dash"}
					<Overview />
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.app {
		position: relative;
		text-align: left;
		background: #f3f4f2;
		border: 1px solid var(--hair);
		border-radius: 16px;
		box-shadow: 0 40px 80px -40px rgba(30, 50, 45, 0.35);
		font-size: 13px;
		color: var(--ink);
		min-height: 900px;
	}
	.top {
		display: flex;
		align-items: center;
		gap: 22px;
		background: #fff;
		border-bottom: 1px solid var(--hair);
		border-radius: 16px 16px 0 0;
		height: 58px;
		padding: 0 20px;
		position: relative;
		z-index: 20;
		min-width: 0;
	}
	.top > :global(*) {
		flex-shrink: 0;
	}
	.top > :global(.port) {
		flex-shrink: 1;
		min-width: 0;
	}
	.logo {
		display: flex;
		align-items: center;
		width: 178px;
		flex: none;
	}
	.logo :global(.hl) {
		height: 21px;
		width: auto;
		color: var(--ink);
		display: block;
	}
	.top :global(.sel) {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 0;
		background: none;
		color: var(--ink);
		cursor: pointer;
		padding: 6px 8px;
		border-radius: 8px;
		text-align: left;
		min-width: 0;
		max-width: 100%;
	}
	.top :global(.sel:hover) {
		background: #f3f5f3;
	}
	.top :global(.sel > svg:first-child) {
		width: 18px;
		height: 18px;
		flex: none;
	}
	.top :global(.sel > svg:last-child) {
		width: 12px;
		height: 12px;
		margin-left: 18px;
		color: var(--muted);
		flex: none;
		transition: transform 0.2s;
	}
	.sel-t {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
		min-width: 0;
	}
	.sel-t b {
		font-size: 12.5px;
		font-weight: 600;
	}
	.sel-t small {
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.top :global(.ph) {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		padding: 8px 10px 6px;
		margin: 0;
	}
	.top :global(.pi),
	.side :global(.pi) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		width: 100%;
		border: 0;
		background: none;
		text-align: left;
		padding: 8px 10px;
		border-radius: 8px;
		cursor: pointer;
		color: var(--ink);
	}
	.top :global(.pi:hover),
	.side :global(.pi:hover) {
		background: #f2f5f3;
	}
	.top :global(.pi[aria-current="true"]) {
		background: #eef3f0;
	}
	.top :global(.pi b),
	.side :global(.pi b) {
		display: block;
		font-size: 13px;
		font-weight: 600;
	}
	.top :global(.pi small),
	.side :global(.pi small) {
		font-size: 11.5px;
		color: var(--muted);
	}
	.top :global(.pi > svg) {
		width: 15px;
		height: 15px;
		color: var(--accent-deep);
		flex: none;
	}
	.tg {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		cursor: pointer;
		margin-left: auto;
		white-space: nowrap;
		position: relative;
	}
	.tg input {
		position: absolute;
		opacity: 0;
		width: 36px;
		height: 20px;
		margin: 0;
	}
	.tg i {
		width: 36px;
		height: 20px;
		border-radius: 999px;
		background: #e3e6e3;
		position: relative;
		transition: background 0.25s;
		box-shadow: inset 0 0 0 1px #d5dad7;
	}
	.tg i::after {
		content: "";
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.25s;
	}
	.tg input:checked + i {
		background: var(--accent);
	}
	.tg input:checked + i::after {
		transform: translateX(16px);
	}
	.tg input:focus-visible + i {
		outline: 2px solid var(--accent-deep);
		outline-offset: 2px;
	}
	.top :global(.share) {
		border: 0;
		background: var(--accent);
		color: var(--ink);
		font-size: 13px;
		font-weight: 500;
		border-radius: 6px;
		padding: 9px 14px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.2s;
	}
	.top :global(.share:hover) {
		background: var(--accent-deep);
	}
	.body {
		display: grid;
		grid-template-columns: 198px minmax(0, 1fr);
		min-height: 842px;
		border-radius: 0 0 16px 16px;
	}
	.side {
		background: #fff;
		border-right: 1px solid var(--hair);
		border-bottom-left-radius: 16px;
		padding: 18px 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.nv {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 0;
		background: none;
		font-size: 13px;
		color: var(--ink);
		padding: 9px 12px;
		border-radius: 9px;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
	}
	.nv :global(svg) {
		width: 17px;
		height: 17px;
	}
	.nv:hover {
		background: #f3f5f3;
	}
	.nv.on {
		background: #eceeeb;
		font-weight: 600;
	}
	.ch {
		margin-left: auto;
		display: flex;
	}
	.ch :global(svg) {
		width: 12px;
	}
	.cnt {
		margin-left: auto;
		font-size: 10px;
		font-weight: 700;
		background: var(--accent);
		border-radius: 999px;
		padding: 1px 7px;
	}
	.sp {
		flex: 1;
	}
	.acc,
	.lang {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		padding: 8px 12px;
		white-space: nowrap;
	}
	.lang {
		font-weight: 600;
	}
	.acc :global(svg),
	.lang :global(svg) {
		width: 16px;
		height: 16px;
	}
	.acc :global(svg:last-child),
	.lang :global(svg:last-child) {
		width: 11px;
		margin-left: auto;
		color: var(--muted);
	}
	.legal {
		display: flex;
		justify-content: space-around;
		font-size: 11px;
		color: var(--muted);
		padding-bottom: 8px;
	}
	.main {
		padding: 16px 26px 22px;
		min-width: 0;
	}
	.mtabs {
		display: none;
	}
	@media (max-width: 1180px) {
		.top {
			gap: 12px;
		}
		.logo {
			width: auto;
		}
		.top :global(.sel > svg:last-child) {
			margin-left: 8px;
		}
	}
	@media (max-width: 1120px) {
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
		.side {
			display: none;
		}
		.mtabs {
			display: flex;
			gap: 4px;
			overflow-x: auto;
			scrollbar-width: none;
			margin: 0 0 14px;
			border-bottom: 1px solid var(--hair);
		}
		.mtabs button {
			border: 0;
			background: none;
			font-size: 13px;
			padding: 8px 10px;
			border-bottom: 2px solid transparent;
			cursor: pointer;
			white-space: nowrap;
			color: var(--muted);
		}
		.mtabs button.on {
			color: var(--ink);
			border-bottom-color: var(--ink);
			font-weight: 600;
		}
	}
	@media (max-width: 1040px) {
		.top :global(.hide-m) {
			display: none;
		}
	}
	@media (max-width: 900px) {
		.app,
		.body {
			min-height: 0;
		}
	}
	@media (max-width: 820px) {
		.hide-s {
			display: none;
		}
		.top :global(.share) {
			margin-left: auto;
		}
	}
	@media (max-width: 640px) {
		.top {
			gap: 8px;
			padding: 8px 10px;
			height: auto;
			min-height: 56px;
			flex-wrap: wrap;
		}
		.logo :global(.hl) {
			height: 17px;
		}
		.top :global(.share) {
			padding: 8px 10px;
			font-size: 12px;
		}
		.top :global(.sel > svg:last-child) {
			margin-left: 6px;
		}
		.main {
			padding: 12px 10px 14px;
		}
	}
</style>
