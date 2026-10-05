<!--
  Announcement banner and top nav of the landing pages. The links and
  dropdowns are the site header's (Header/navGroups.ts); the look is the
  landing design's.
-->
<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { menu } from "$lib/components/Header/menu.svelte";
	import {
		buildNavGroups,
		LOGIN_URL,
		navLinks,
		PHONE,
		PHONE_HREF,
	} from "$lib/components/Header/navGroups";
	import { ROUTE_HOME } from "$lib/routes";
	import type { PostSummary } from "$lib/server/blog";
	import { focusSignup, START_HREF } from "../cta";
	import HeidiLogo from "./icons/HeidiLogo.svelte";
	import LandingNavGroup from "./LandingNavGroup.svelte";

	let {
		posts,
		bannerText,
		ctaLabel = "Wechsel starten",
	}: {
		posts: PostSummary[];
		bannerText: string;
		ctaLabel?: string;
	} = $props();

	const navGroups = $derived(buildNavGroups(posts));

	$effect(() => {
		document.documentElement.classList.toggle("_lock", menu.open);
	});

	afterNavigate(() => menu.close());

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "Escape") return;
		menu.close();
		// Desktop dropdowns open on :focus-within, so dropping focus closes them.
		const el = document.activeElement;
		if (el instanceof HTMLElement && el.closest("[data-nav-group]")) el.blur();
	}

	function onStart() {
		menu.close();
		focusSignup();
	}
</script>

<svelte:window {onkeydown} />

<div class="banner">
	{bannerText}<a href="#faq">Mehr erfahren</a>
</div>

<nav class="top" aria-label="Hauptnavigation">
	<div class="wrap bar">
		<a class="logo" href={ROUTE_HOME}><HeidiLogo class="heidi-logo" /></a>
		<ul class="navlinks">
			{#each navGroups as group (group.title)}
				<LandingNavGroup {group} {posts} variant="desktop" />
			{/each}
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={page.url.pathname === link.href ? "page" : undefined}
						>{link.title}</a
					>
				</li>
			{/each}
		</ul>
		<div class="navright">
			<a href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
				Einloggen
			</a>
			<a class="phone" href={PHONE_HREF}>{PHONE}</a>
			<a class="btn btn-ink" href={START_HREF} onclick={onStart}>
				{ctaLabel}
			</a>
		</div>
		<button
			type="button"
			class="burger"
			aria-label={menu.open ? "Menü schließen" : "Menü öffnen"}
			aria-expanded={menu.open}
			aria-controls="lp-menu"
			onclick={() => menu.toggle()}
		>
			{#if menu.open}
				<svg width="20" viewBox="0 0 20 20" aria-hidden="true">
					<path d="M2 2l16 16M18 2L2 18" stroke="#1E322D" stroke-width="2" />
				</svg>
			{:else}
				<svg width="22" viewBox="0 0 22 14" aria-hidden="true">
					<path d="M0 1h22M0 7h22M0 13h22" stroke="#1E322D" stroke-width="2" />
				</svg>
			{/if}
		</button>
	</div>

	{#if menu.open}
		<div class="mmenu" id="lp-menu">
			<ul class="wrap mlist">
				{#each navGroups as group (group.title)}
					<LandingNavGroup {group} {posts} variant="mobile" />
				{/each}
				{#each navLinks as link (link.href)}
					<li class="mlink">
						<a
							href={link.href}
							aria-current={page.url.pathname === link.href
								? "page"
								: undefined}
							onclick={() => menu.close()}>{link.title}</a
						>
					</li>
				{/each}
				<li class="mcta">
					<a class="btn btn-ink" href={START_HREF} onclick={onStart}>
						{ctaLabel}
					</a>
					<a
						class="btn btn-ghost"
						href={LOGIN_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						Einloggen
					</a>
					<a class="mphone" href={PHONE_HREF}>{PHONE}</a>
				</li>
			</ul>
		</div>
	{/if}
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
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--line);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 28px;
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
	.navlinks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 26px;
		font-size: 15px;
	}
	.navright {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 15px;
	}
	.phone {
		white-space: nowrap;
	}
	.navlinks a[aria-current="page"],
	.mlink a[aria-current="page"] {
		font-weight: 500;
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

	.mmenu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		max-height: calc(100dvh - 64px);
		overflow-y: auto;
		background: #fff;
		border-bottom: 1px solid var(--line);
		box-shadow: 0 20px 40px -20px rgba(30, 50, 45, 0.25);
	}
	.mlist {
		list-style: none;
		margin: 0 auto;
		padding-block: 8px 24px;
	}
	.mlink a {
		display: block;
		padding: 14px 0;
		font-size: 17px;
		border-bottom: 1px solid var(--line);
	}
	.mcta {
		display: grid;
		gap: 10px;
		margin-top: 20px;
	}
	.mcta .btn {
		padding: 14px 16px;
		font-size: 16px;
	}
	.mphone {
		text-align: center;
		padding: 8px;
		color: var(--muted);
	}

	@media (max-width: 1180px) {
		.phone {
			display: none;
		}
	}
	@media (max-width: 980px) {
		.navlinks,
		.navright {
			display: none;
		}
		.burger {
			display: block;
		}
	}
	@media (min-width: 981px) {
		.mmenu {
			display: none;
		}
	}
</style>
