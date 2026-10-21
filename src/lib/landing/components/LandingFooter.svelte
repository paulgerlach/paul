<!--
  Footer of the landing pages, as in the landing design: company links, five
  link groups ($lib/landing/footerLinks.ts), every city page, address, claim
  and newsletter, disclaimer with socials, and the legal line.
-->
<script lang="ts">
	import { ADDRESS, LEGAL_LINKS, SOCIALS } from "$lib/company";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";
	import {
		companyLinks,
		footerGroups,
		type LandingFooterLink,
	} from "$lib/landing/footerLinks";
	import { CITIES } from "$lib/landing/pages/messdienstanbieter-city/cities";
	import { cityRoute, ROUTE_MESSDIENSTANBIETER } from "$lib/routes";
	import HeidiLogo from "./icons/HeidiLogo.svelte";
	import LandingNewsletter from "./LandingNewsletter.svelte";

	interface Props {
		/**
		 * Target of the "Demo buchen" link (default `DEMO_HREF`, /demo-buchen;
		 * the page's `landing.demoHref` when it sets one).
		 */
		demoHref?: string;
	}

	let { demoHref = DEMO_HREF }: Props = $props();

	const year = new Date().getFullYear();
</script>

{#snippet link(item: LandingFooterLink)}
	{@const href = item.href === DEMO_HREF ? demoHref : item.href}
	<li>
		{#if href}
			<a
				class="f-link"
				{href}
				onclick={href === START_HREF ? focusSignup : undefined}>{item.text}</a
			>
		{:else}
			{item.text}
		{/if}
	</li>
{/snippet}

<footer>
	<div class="wrap fgrid">
		<div class="first">
			<a class="flogo" href={ROUTE_MESSDIENSTANBIETER}
				><HeidiLogo class="heidi-logo" /></a
			>
			<ul>
				{#each companyLinks as item (item.text)}{@render link(item)}{/each}
			</ul>
		</div>
		{#each footerGroups as group (group.title)}
			<div>
				<h4>{group.title}</h4>
				<ul>
					{#each group.links as item (item.text)}{@render link(item)}{/each}
				</ul>
			</div>
		{/each}

		<!-- Every city page, also those not live yet (they render with noindex). -->
		<nav class="f-cities" aria-labelledby="f-cities-h">
			<h4 id="f-cities-h">Städte</h4>
			<ul>
				{#each CITIES as city (city.slug)}
					<li>
						<a class="f-link" href={cityRoute(city.slug)}>{city.name}</a>
						{#if "isNew" in city && city.isNew}<span class="f-new">neu</span
							>{/if}
					</li>
				{/each}
				<li class="f-all">
					<a class="f-link" href={ROUTE_MESSDIENSTANBIETER}>Ganz Deutschland</a>
				</li>
			</ul>
		</nav>

		<div class="f-news">
			<div class="f-adr">
				<a class="flogo" href={ROUTE_MESSDIENSTANBIETER}
					><HeidiLogo class="heidi-logo" /></a
				>
				<address>
					{ADDRESS.company}<br />
					{ADDRESS.street}<br />
					{ADDRESS.city}
				</address>
			</div>
			<p class="f-claim">
				Werde Teil der Revolution: Immer mehr Hausverwaltungen messen bereits <em
					>mit Heidi</em
				>.
			</p>
			<LandingNewsletter />
		</div>

		<div class="f-disc">
			<p>
				Die Heidi Systems GmbH erbringt Messdienstleistungen sowie digitale
				Verbrauchserfassungs- und Abrechnungslösungen nach Maßgabe der jeweils
				geltenden gesetzlichen Bestimmungen. Alle auf dieser Website
				bereitgestellten Inhalte dienen ausschließlich der allgemeinen
				Information und begründen weder einen Rechtsanspruch noch eine
				Verpflichtung. Trotz sorgfältiger Prüfung wird keine Haftung für die
				Richtigkeit, Vollständigkeit oder Aktualität der dargestellten
				Informationen übernommen. Haftungsansprüche gegen die Heidi Systems GmbH
				aufgrund von materiellen oder immateriellen Schäden sind – soweit
				gesetzlich zulässig – ausgeschlossen. Sämtliche auf dieser Website
				verwendeten Texte, Marken, Darstellungen und technischen Inhalte
				unterliegen dem Urheberrecht und dürfen nur mit schriftlicher Zustimmung
				verwendet werden. Verbindliche Aussagen zu Leistungen, Preisen oder
				technischen Spezifikationen erfolgen ausschließlich im Rahmen eines
				individuellen Vertragsverhältnisses.
			</p>
			<div class="f-soc">
				{#each SOCIALS as social (social.label)}
					<a
						href={social.href}
						target="_blank"
						rel="noopener"
						aria-label={social.label}
					>
						{#if social.label === "YouTube"}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
								aria-hidden="true"
								><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path
									d="M10 9.3v5.4l4.6-2.7z"
									fill="currentColor"
									stroke="none"
								/></svg
							>
						{:else if social.label === "X"}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
								stroke-linecap="round"
								aria-hidden="true"><path d="M4 4l16 16M20 4L4 20" /></svg
							>
						{:else if social.label === "LinkedIn"}
							<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
								><rect x="3.5" y="9" width="3.6" height="11.5" rx=".4" /><circle
									cx="5.3"
									cy="5.3"
									r="2.1"
								/><path
									d="M9.7 9h3.4v1.6c.6-1 1.9-1.9 3.7-1.9 3 0 4 1.9 4 4.9v6.9h-3.6v-6.1c0-1.5-.3-2.6-1.8-2.6s-2.1 1.1-2.1 2.6v6.1H9.7z"
								/></svg
							>
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
								aria-hidden="true"
								><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle
									cx="12"
									cy="12"
									r="4"
								/><circle
									cx="17.2"
									cy="6.8"
									r="1"
									fill="currentColor"
									stroke="none"
								/></svg
							>
						{/if}
					</a>
				{/each}
			</div>
		</div>

		<div class="legal">
			<span>© {year} {ADDRESS.company}, Berlin</span>
			<span class="legal-links">
				{#each LEGAL_LINKS as item (item.text)}
					<a href={item.href}>{item.text}</a>
				{/each}
			</span>
		</div>
	</div>
</footer>

<style>
	footer {
		background: var(--ink);
		color: #fff;
		border-radius: 28px 28px 0 0;
		margin-top: -28px;
		position: relative;
	}
	.fgrid {
		padding-block: 120px 80px;
		display: grid;
		grid-template-columns: 1.1fr repeat(5, 1fr);
		gap: 28px;
		font-size: 16px;
	}
	.flogo {
		display: inline-block;
		color: #fff;
		margin-bottom: 24px;
	}
	.flogo :global(.heidi-logo) {
		height: 30px;
		width: auto;
		display: block;
	}
	h4 {
		font-weight: 500;
		margin: 0 0 14px;
		font-size: 16px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
		color: #a9b8b3;
	}
	.first ul {
		color: #fff;
	}
	a.f-link {
		color: #fff;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(255, 255, 255, 0.35);
	}
	a.f-link:hover {
		text-decoration-color: var(--accent);
	}
	.f-new {
		display: inline-block;
		margin-left: 6px;
		padding: 1px 7px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--ink);
		font-size: 11px;
		font-weight: 600;
		line-height: 1.5;
		vertical-align: 1px;
	}

	.f-cities {
		grid-column: 1 / -1;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		padding-top: 32px;
	}
	.f-cities ul {
		grid-template-columns: repeat(6, minmax(0, 1fr));
		column-gap: 28px;
	}
	.f-all {
		font-weight: 600;
		white-space: nowrap;
		grid-column: -2 / -1;
	}

	.f-news {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.5fr) minmax(0, 1.3fr);
		gap: 40px;
		align-items: start;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		padding-top: 40px;
	}
	.f-news > * {
		min-width: 0;
	}
	.f-adr .flogo {
		margin-bottom: 10px;
	}
	address {
		font-style: normal;
		color: rgba(255, 255, 255, 0.55);
		font-size: 16px;
		line-height: 1.45;
	}
	.f-claim {
		font-size: clamp(22px, 2.2vw, 32px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.2;
		margin: 0;
	}
	.f-claim em {
		font-style: normal;
		color: var(--accent);
	}

	.f-disc {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 40px;
		align-items: start;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		padding-top: 32px;
	}
	.f-disc p {
		font-size: 12.5px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.5);
		max-width: 110ch;
		margin: 0;
	}
	.f-soc {
		display: flex;
		gap: 16px;
	}
	.f-soc a {
		width: 26px;
		height: 26px;
		color: rgba(255, 255, 255, 0.85);
		display: grid;
		place-items: center;
		transition:
			color 0.2s,
			transform 0.2s;
	}
	.f-soc a:hover {
		color: var(--accent);
		transform: translateY(-2px);
	}
	.f-soc svg {
		width: 24px;
		height: 24px;
	}

	.legal {
		grid-column: 1 / -1;
		border-top: 1px solid #36504a;
		padding-top: 24px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		color: #8fa29c;
		font-size: 14px;
	}
	.legal-links a:hover {
		color: #fff;
	}
	.legal-links a + a::before {
		content: "·";
		margin-inline: 6px;
	}

	@media (max-width: 1240px) {
		.fgrid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			row-gap: 40px;
		}
		.f-cities ul {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 980px) {
		.fgrid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px 16px;
			font-size: 15px;
		}
		.fgrid > * {
			min-width: 0;
		}
		h4,
		li {
			overflow-wrap: anywhere;
		}
		.f-cities ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.f-news {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
		.f-news > :global(.f-nl) {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 900px) {
		a,
		li {
			hyphens: auto;
		}
	}
	@media (max-width: 620px) {
		.f-news {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
		.f-disc {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
</style>
