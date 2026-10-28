<!--
  The dashboard preview in the hero (plan 02, 1a; plan 03, part A): the top
  bar with its menus, the view switch (side nav, tabs on small screens) and the
  current view. Only the Dashboard view is server-rendered; the others load on
  first use. Nothing the visitor does here leaves the browser.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { page } from "$app/state";
	import HeidiLogo from "$lib/landing/components/icons/HeidiLogo.svelte";
	import Icon from "../components/Icon.svelte";
	import type { IconName } from "../icons";
	import { PERIODS } from "./data";
	import { DashboardDemo, setDemo, type View } from "./demo.svelte";
	import Picker from "./Picker.svelte";
	import Note from "./Note.svelte";
	import Overview from "./views/Overview.svelte";

	// Loaded on first use (plan README, The preview).
	const VIEW_MODULES = {
		obj: () => import("./views/Objects.svelte"),
		mtr: () => import("./views/Meters.svelte"),
		doc: () => import("./views/Documents.svelte"),
		abr: () => import("./views/Billing.svelte"),
	};
	const loadDrawer = () => import("./Drawer.svelte");
	const loadDialog = () => import("./TileDialog.svelte");

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

	// Share menu: local only, nothing is sent (plan 03, 3A.6).
	let inviteEmail = $state("");
	let inviteError = $state(false);
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(copiedTimer));

	function invite(event: SubmitEvent) {
		event.preventDefault();
		const email = inviteEmail.trim();
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			inviteError = true;
			return;
		}
		inviteError = false;
		inviteEmail = "";
		demo.invite(email);
	}

	async function copyLink() {
		try {
			await navigator.clipboard?.writeText(
				`${page.url.origin}${page.url.pathname}`,
			);
		} catch {
			// Ignored: the preview shows the feedback either way.
		}
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 1600);
	}

	/** Escape closes the dialog or the drawer (menus close themselves first). */
	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "Escape") return;
		if (demo.dialogTile || demo.drawer) demo.closeLayer();
	}

	/**
	 * The Overview's draw-in when the preview first scrolls into view, unless
	 * it was already on screen on load (plan 03, 3A.7).
	 */
	function drawInOnEnter(el: HTMLElement) {
		if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				demo.drawId++;
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}

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

<svelte:document {onkeydown} />

<section class="app" aria-label={label} {@attach drawInOnEnter}>
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

		<Picker
			menu="share"
			label="Dashboard teilen"
			buttonClass="share"
			align="right"
		>
			{#snippet button()}Dashboard teilen{/snippet}
			<p class="ph">Dashboard teilen</p>
			<form class="sh-f" onsubmit={invite} novalidate>
				<input
					type="email"
					placeholder="E-Mail-Adresse"
					aria-label="E-Mail-Adresse"
					aria-invalid={inviteError}
					class={[inviteError && "err"]}
					bind:value={inviteEmail}
				/>
				<button type="submit">Einladen</button>
			</form>
			<div class="sh-l">
				{#each demo.invited as email, i (i)}
					<div>
						<span class="av" aria-hidden="true">{email[0].toUpperCase()}</span
						>{email}<small>eingeladen</small>
					</div>
				{:else}
					<p class="mut">Noch niemand eingeladen.</p>
				{/each}
			</div>
			<button type="button" class="sh-copy" onclick={copyLink}>
				<Icon name={copied ? "check" : "link"} />{copied
					? "Link kopiert"
					: "Link kopieren"}
			</button>
		</Picker>
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
			<Picker
				menu="acc"
				label="Ihre Hausverwaltung"
				buttonClass="acc"
				align="up"
				class="acc-dd"
			>
				{#snippet button()}<Icon name="user" />Mein Konto<Icon
						name="chevron"
					/>{/snippet}
				<p class="ph">Ihre Hausverwaltung</p>
				{#each [["Profil", "Kontaktdaten und Passwort"], ["Benachrichtigungen", "E-Mail bei neuen Meldungen"], ["Abmelden", ""]] as [title, sub] (title)}
					<button
						type="button"
						class="pi"
						onclick={() => {
							demo.openMenu = null;
							demo.notify("In der Vorschau nicht verfügbar");
						}}
					>
						<span
							><b>{title}</b>{#if sub}<small>{sub}</small>{/if}</span
						>
					</button>
				{/each}
			</Picker>
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
				{:else}
					{#await VIEW_MODULES[demo.view]()}
						<p class="mut">Wird geladen …</p>
					{:then module}
						<module.default />
					{/await}
				{/if}
			</div>
		</div>
	</div>
	{#if demo.drawer}
		{#await loadDrawer() then module}<module.default />{/await}
	{/if}
	{#if demo.dialogTile}
		{#await loadDialog() then module}<module.default />{/await}
	{/if}
	<Note />
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
	.side :global(.acc),
	.lang {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		padding: 8px 12px;
		white-space: nowrap;
	}
	.side :global(.acc) {
		width: 100%;
		border: 0;
		background: none;
		color: var(--ink);
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
	}
	.side :global(.acc:hover) {
		background: #f3f5f3;
	}
	.lang {
		font-weight: 600;
	}
	.side :global(.acc svg),
	.lang :global(svg) {
		width: 16px;
		height: 16px;
	}
	.side :global(.acc svg:last-child),
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

	/* Share menu (`.sh-f`, `.sh-l`, `.sh-copy`) */
	.top :global(.sh-f) {
		display: flex;
		gap: 6px;
		padding: 6px;
	}
	.top :global(.sh-f input) {
		flex: 1;
		min-width: 0;
		border: 1px solid var(--hair);
		border-radius: 8px;
		padding: 8px 10px;
		font-size: 13px;
		outline: 0;
	}
	.top :global(.sh-f input:focus) {
		border-color: var(--accent-deep);
	}
	.top :global(.sh-f input.err) {
		border-color: var(--orange);
	}
	.top :global(.sh-f button) {
		border: 0;
		background: var(--accent);
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
	}
	.top :global(.sh-l) {
		padding: 4px 10px 6px;
		display: grid;
		gap: 6px;
		font-size: 12.5px;
		max-height: 140px;
		overflow: auto;
	}
	.top :global(.sh-l div) {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.top :global(.sh-l .av) {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #e3e8f5;
		color: #3c5ba8;
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 600;
		flex: none;
	}
	.top :global(.sh-l small) {
		margin-left: auto;
		color: var(--faint);
	}
	.top :global(.sh-copy) {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		border: 0;
		border-top: 1px solid var(--hair);
		background: none;
		font-size: 13px;
		padding: 10px;
		cursor: pointer;
		color: var(--ink);
		margin-top: 4px;
	}
	.top :global(.sh-copy svg) {
		width: 14px;
		height: 14px;
	}

	/* Shared by the views (the design's `.vh`, `.tw`, `.hd-tb`, `.chip2` …) */
	.app :global(.mut) {
		color: var(--muted);
		font-size: 12.5px;
		margin: 0;
	}
	.app :global(.mut.sm) {
		font-size: 12px;
		margin-top: 10px;
	}
	.view :global(.vh) {
		display: flex;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		margin: 4px 0 16px;
	}
	.view :global(.vh h3) {
		font-size: 22px;
		font-weight: 400;
		letter-spacing: -0.01em;
	}
	.view :global(.vt) {
		margin-left: auto;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.view :global(.sr) {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 8px;
		padding: 7px 10px;
		width: 230px;
	}
	.view :global(.sr svg) {
		width: 14px;
		height: 14px;
		color: var(--faint);
		flex: none;
	}
	.view :global(.sr input) {
		border: 0;
		outline: 0;
		font-size: 13px;
		width: 100%;
		background: none;
	}
	.view :global(.sr:focus-within) {
		border-color: var(--accent-deep);
	}
	.app :global(.btn2) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 0;
		background: var(--accent);
		color: var(--ink);
		font-size: 13px;
		font-weight: 600;
		border-radius: 8px;
		padding: 9px 14px;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.app :global(.btn2:hover) {
		background: var(--accent-deep);
	}
	.app :global(.btn2:active) {
		transform: scale(0.97);
	}
	.app :global(.btn2:disabled) {
		opacity: 0.6;
		cursor: default;
	}
	.app :global(.btn2 svg) {
		width: 15px;
		height: 15px;
	}
	.app :global(.btn2.big) {
		padding: 11px 18px;
		font-size: 14px;
		margin-top: 14px;
	}
	.app :global(.lnk) {
		border: 0;
		background: none;
		font-size: 13px;
		color: #3c5ba8;
		text-decoration: underline;
		cursor: pointer;
	}
	.view :global(.tw) {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		overflow: auto;
	}
	.view :global(.tb) {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
	}
	.view :global(.tb thead th) {
		font-weight: 500;
		color: var(--muted);
		font-size: 11.5px;
		text-align: left;
		padding: 10px 12px;
		border-bottom: 1px solid var(--hair);
		background: #fafbfa;
		white-space: nowrap;
	}
	.view :global(.tb td),
	.view :global(.tb tbody th) {
		padding: 10px 12px;
		border-bottom: 1px solid #f0f2f1;
		white-space: nowrap;
		text-align: left;
		font-weight: 400;
	}
	.view :global(.tb tbody tr:hover) {
		background: #f5f8f6;
	}
	.view :global(.tb b) {
		font-weight: 600;
	}
	.view :global(.dn) {
		color: var(--ok);
	}
	.view :global(.up) {
		color: var(--orange);
	}
	.view :global(.ti2) {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: #eef0ee;
		margin-right: 8px;
		vertical-align: middle;
	}
	.view :global(.ti2 svg) {
		width: 13px;
		height: 13px;
	}
	.view :global(.ok2) {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: #2f7a3c;
		font-size: 12px;
		font-weight: 600;
	}
	.view :global(.ok2 svg) {
		width: 13px;
		height: 13px;
	}
	.view :global(.chips) {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}
	.view :global(.chip2) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 12.5px;
		cursor: pointer;
		color: var(--ink);
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.view :global(.chip2:hover) {
		border-color: #c9d3ce;
	}
	.view :global(.chip2.on) {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.view {
		animation: view-in 0.25s ease;
	}
	@keyframes view-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	@media (max-width: 640px) {
		.view :global(.vt) {
			margin-left: 0;
			width: 100%;
		}
		.view :global(.sr) {
			flex: 1;
			width: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.view {
			animation: none;
		}
	}
</style>
