<!--
  Announcement banner and top nav of the landing pages, the designs' own:
  four dropdowns from `navLinks.ts`, "Anmelden", "Demo buchen" and
  "Angebot einholen" (the questionnaire). Desktop dropdowns open on hover,
  focus and click; below 980 px the burger shows the same groups as
  <details> accordions.
-->
<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { LOGIN_URL } from "$lib/components/Header/navGroups";
	import { ROUTE_FRAGEBOGEN, ROUTE_MESSDIENSTANBIETER } from "$lib/routes";
	import { DEMO_HREF, focusSignup, START_HREF } from "../cta";
	import { landingNav, shownItems, type LandingNavGroup } from "../navLinks";
	import Chevron from "./icons/Chevron.svelte";
	import HeidiLogo from "./icons/HeidiLogo.svelte";

	let {
		bannerText,
		bannerHref = "#faq",
		demoHref = DEMO_HREF,
	}: {
		bannerText: string;
		bannerHref?: string;
		demoHref?: string;
	} = $props();

	/** Title of the dropdown opened by a click (hover and focus need none). */
	let openGroup = $state<string | null>(null);
	let mobileOpen = $state(false);

	const isCurrent = (href?: string) => href === page.url.pathname;
	const hasCurrent = (group: LandingNavGroup) =>
		group.columns.some((column) => column.items.some((i) => isCurrent(i.href)));

	afterNavigate(() => {
		openGroup = null;
		mobileOpen = false;
	});

	function toggleGroup(event: MouseEvent, title: string) {
		// The document listener below would close it again.
		event.stopPropagation();
		openGroup = openGroup === title ? null : title;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "Escape") return;
		openGroup = null;
		mobileOpen = false;
		// Desktop dropdowns open on :focus-within, so dropping focus closes them.
		const el = document.activeElement;
		if (el instanceof HTMLElement && el.closest(".nv-dd")) el.blur();
	}

	function onDemo() {
		mobileOpen = false;
		if (demoHref === START_HREF) focusSignup();
	}

	/** The buttons' glow follows the pointer. */
	function glow(event: PointerEvent) {
		const el = event.currentTarget as HTMLElement;
		const r = el.getBoundingClientRect();
		el.style.setProperty("--mx", `${event.clientX - r.left}px`);
		el.style.setProperty("--my", `${event.clientY - r.top}px`);
	}
</script>

<svelte:window {onkeydown} />
<svelte:document onclick={() => (openGroup = null)} />

{#snippet items(group: LandingNavGroup)}
	{#each group.columns as column, i (i)}
		<div class="nv-col">
			{#if column.title}<div class="nv-g">{column.title}</div>{/if}
			{#each shownItems(column) as item (item.title)}
				{#if item.href}
					<a
						class={["nv-it", isCurrent(item.href) && "cur"]}
						href={item.href}
						aria-current={isCurrent(item.href) ? "page" : undefined}
						onclick={() => (mobileOpen = false)}
					>
						<span class="nv-t">{item.title}</span>
						<span class="nv-d">{item.text}</span>
					</a>
				{:else}
					<span class="nv-it soon">
						<span class="nv-t">{item.title}<small>bald</small></span>
						<span class="nv-d">{item.text}</span>
					</span>
				{/if}
			{/each}
		</div>
	{/each}
{/snippet}

<div class="banner">
	{bannerText}<a href={bannerHref}>Mehr erfahren</a>
</div>

<nav class="top" aria-label="Hauptnavigation">
	<div class="wrap bar">
		<a class="logo" href={ROUTE_MESSDIENSTANBIETER}>
			<HeidiLogo class="heidi-logo" />
		</a>
		<div class="nv-links">
			{#each landingNav as group (group.title)}
				<div class={["nv-dd", openGroup === group.title && "open"]}>
					<button
						class="nv-btn"
						type="button"
						aria-expanded={openGroup === group.title}
						onclick={(event) => toggleGroup(event, group.title)}
					>
						{group.title}
						<Chevron class="nv-chev" />
					</button>
					<div class="nv-panel">
						<div
							class={[
								"nv-box",
								group.layout === "list" ? "nv-list" : "nv-mega",
								group.layout === "res" && "nv-res",
							]}
						>
							{@render items(group)}
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="navright">
			<a
				class="nv-a"
				href={LOGIN_URL}
				target="_blank"
				rel="noopener noreferrer"
			>
				Anmelden
			</a>
			<a
				class="btn btn-ghost nv-ghost"
				href={demoHref}
				onclick={onDemo}
				onpointermove={glow}>Demo buchen</a
			>
			<a class="btn btn-ink" href={ROUTE_FRAGEBOGEN} onpointermove={glow}>
				Angebot einholen
			</a>
		</div>
		<button
			type="button"
			class="burger"
			aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
			aria-expanded={mobileOpen}
			aria-controls="lp-menu"
			onclick={() => (mobileOpen = !mobileOpen)}
		>
			<svg width="22" viewBox="0 0 22 14" aria-hidden="true">
				<path d="M0 1h22M0 7h22M0 13h22" stroke="#1E322D" stroke-width="2" />
			</svg>
		</button>
	</div>

	<div class="nv-mobile" id="lp-menu" hidden={!mobileOpen}>
		<div class="wrap">
			{#each landingNav as group (group.title)}
				<details open={hasCurrent(group)}>
					<summary>{group.title}</summary>
					<div class={group.layout === "list" ? "nv-list" : "nv-mega"}>
						{@render items(group)}
					</div>
				</details>
			{/each}
			<a
				class="nv-mlogin"
				href={LOGIN_URL}
				target="_blank"
				rel="noopener noreferrer">Anmelden</a
			>
			<div class="nv-mcta">
				<a class="btn btn-ghost" href={demoHref} onclick={onDemo}>
					Demo buchen
				</a>
				<a class="btn btn-ink" href={ROUTE_FRAGEBOGEN}>Angebot einholen</a>
			</div>
		</div>
	</div>
</nav>

<style>
	.banner {
		background: var(--ink);
		color: #dde7e3;
		font-size: 13px;
		text-align: center;
		padding: 8px 16px;
	}
	.banner a {
		color: #fff;
		text-decoration: underline;
		margin-left: 6px;
	}

	nav.top {
		position: sticky;
		top: env(safe-area-inset-top, 0px);
		z-index: 50;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--line);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 36px;
		height: 64px;
	}
	.logo {
		display: flex;
		align-items: center;
		color: var(--ink);
	}
	.logo :global(.heidi-logo) {
		height: 26px;
		width: auto;
		display: block;
	}

	.nv-links {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 15px;
	}
	.nv-dd {
		position: relative;
	}
	.nv-btn,
	.nv-a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: 0;
		padding: 8px 12px;
		border-radius: 8px;
		font: inherit;
		font-size: 15px;
		color: var(--ink);
		cursor: pointer;
	}
	.nv-btn:hover,
	.nv-a:hover,
	.nv-dd:focus-within .nv-btn,
	.nv-dd.open .nv-btn {
		background: #f1f4f2;
	}
	.nv-btn :global(.nv-chev) {
		width: 10px;
		transition: transform 0.2s;
	}
	.nv-dd:hover :global(.nv-chev),
	.nv-dd.open :global(.nv-chev) {
		transform: rotate(180deg);
	}
	.nv-panel {
		position: absolute;
		top: 100%;
		left: -8px;
		padding-top: 10px;
		display: none;
		z-index: 50;
	}
	.nv-dd:hover .nv-panel,
	.nv-dd:focus-within .nv-panel,
	.nv-dd.open .nv-panel {
		display: block;
	}
	.nv-box {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		box-shadow: 0 28px 60px -24px rgba(30, 50, 45, 0.35);
		padding: 10px;
	}
	.nv-list {
		display: grid;
		gap: 2px;
		width: 340px;
	}
	/* Single-column groups: the column wrapper doesn't take part in the grid. */
	.nv-list .nv-col {
		display: contents;
	}
	.nv-mega {
		display: grid;
		grid-template-columns: repeat(3, 230px);
		gap: 6px 10px;
		padding: 14px;
	}
	.nv-mega.nv-res {
		grid-template-columns: repeat(2, 290px);
	}
	.nv-g {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--faint);
		padding: 4px 10px 8px;
	}
	.nv-it {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 9px 10px;
		border-radius: 10px;
		color: var(--ink);
	}
	a.nv-it:hover {
		background: #f1f5f2;
	}
	.nv-it.cur {
		background: #eef3f0;
	}
	.nv-it.cur .nv-t::after {
		content: "Aktuell";
		font-size: 10.5px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 1px 7px;
		margin-left: 8px;
	}
	.nv-t {
		font-size: 14.5px;
		font-weight: 500;
		display: flex;
		align-items: center;
	}
	.nv-d {
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.35;
	}
	.nv-it.soon {
		cursor: default;
	}
	.nv-it.soon .nv-t {
		color: var(--faint);
	}
	.nv-it.soon .nv-d {
		color: #b7c0bc;
	}
	.nv-t small {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--faint);
		background: #f1f3f2;
		border-radius: 999px;
		padding: 1px 7px;
		margin-left: 8px;
	}

	.navright {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15px;
	}
	.nv-ghost {
		border: 1px solid var(--line);
		color: var(--ink);
	}
	.burger {
		display: none;
		margin-left: auto;
		background: none;
		border: 0;
		padding: 8px;
		cursor: pointer;
	}
	.burger svg {
		display: block;
	}

	/* The buttons' hover: a sliding gradient and a glow at the pointer. */
	.navright .btn {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s,
			border-color 0.35s,
			color 0.35s;
	}
	.navright .btn::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: -1;
		opacity: 0;
		transition: opacity 0.45s ease;
		border-radius: inherit;
	}
	.navright .btn::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: -1;
		opacity: 0;
		transition: opacity 0.35s ease;
		border-radius: inherit;
		background: radial-gradient(
			110px circle at var(--mx, 50%) var(--my, 50%),
			var(--glow),
			transparent 65%
		);
	}
	.navright .btn:hover::before,
	.navright .btn:hover::after,
	.navright .btn:focus-visible::before {
		opacity: 1;
	}
	.navright .btn:hover {
		transform: translateY(-1px);
	}
	.navright .btn-ink {
		--glow: rgba(138, 214, 143, 0.22);
	}
	.navright .btn-ink::before {
		background: linear-gradient(120deg, #1e322d 0%, #24403a 50%, #2c4c43 100%);
		background-size: 220% 100%;
		background-position: 0% 50%;
		transition:
			opacity 0.45s ease,
			background-position 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.navright .btn-ink:hover::before {
		background-position: 100% 50%;
	}
	.navright .btn-ink:hover {
		box-shadow:
			0 6px 16px -12px rgba(30, 50, 45, 0.45),
			inset 0 0 0 1px rgba(138, 214, 143, 0.15);
	}
	.navright .nv-ghost {
		--glow: rgba(138, 214, 143, 0.18);
	}
	.navright .nv-ghost::before {
		background: linear-gradient(120deg, #ffffff 0%, #f8fcf8 50%, #f0f8f0 100%);
		background-size: 220% 100%;
		background-position: 0% 50%;
		transition:
			opacity 0.45s ease,
			background-position 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.navright .nv-ghost:hover::before {
		background-position: 100% 50%;
	}
	.navright .nv-ghost:hover {
		border-color: #c6e6c8;
		box-shadow: 0 6px 14px -12px rgba(30, 50, 45, 0.3);
	}
	@media (prefers-reduced-motion: reduce) {
		.navright .btn,
		.navright .btn::before {
			transition: none;
		}
		.navright .btn:hover {
			transform: none;
		}
	}

	/* Mobile menu */
	.nv-mobile {
		border-top: 1px solid var(--line);
		background: #fff;
		max-height: calc(100vh - 64px);
		overflow: auto;
	}
	.nv-mobile .wrap {
		display: block;
		padding-block: 8px 20px;
	}
	.nv-mobile details {
		border-bottom: 1px solid var(--line);
	}
	.nv-mobile summary {
		list-style: none;
		padding: 14px 0;
		font-weight: 600;
		font-size: 16px;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
	}
	.nv-mobile summary::-webkit-details-marker {
		display: none;
	}
	.nv-mobile summary::after {
		content: "+";
		color: var(--muted);
	}
	.nv-mobile details[open] summary::after {
		content: "–";
	}
	.nv-mobile .nv-list,
	.nv-mobile .nv-mega {
		width: auto;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
		padding: 0 0 10px;
	}
	.nv-mobile .nv-col {
		display: contents;
	}
	.nv-mobile .nv-g {
		padding-top: 10px;
	}
	.nv-mcta {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 16px;
	}
	.nv-mlogin {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 14px;
		/* The design also sets a border-top in `--hair`, which isn't defined
		   there, so it draws none. */
		padding: 14px 4px 0;
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
	}
	.nv-mlogin::after {
		content: "→";
		color: var(--muted);
	}

	@media (max-width: 1080px) {
		.nv-ghost {
			display: none;
		}
	}
	@media (max-width: 980px) {
		.nv-links,
		.navright {
			display: none;
		}
		.burger {
			display: block;
		}
	}
	@media (min-width: 981px) {
		.nv-mobile {
			display: none;
		}
	}
</style>
