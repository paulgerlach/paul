<!--
  Footer of the landing pages: the site footer's link groups, socials, partner
  badge, address and disclaimer (Footer/footerLinks.ts), in the landing
  design's dark layout. The site's tagline and newsletter form are left out,
  so the page's own signup stays the only email form.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { vdiv_footer_new } from "$lib/assets/icons";
	import {
		ADDRESS,
		DienstleistungenLinksGroup,
		VDIV_PARTNER_URL,
		datenschutzLinksGroup,
		gerateLinksGroup,
		kundenLinksGroup,
		newsInfoLinksGroup,
		rechtlichesLinksGroup,
		socials,
		standorteLinksGroup,
	} from "$lib/components/Footer/footerLinks";
	import { CITIES } from "$lib/landing/pages/messdienstanbieter-city/cities";
	import { cityRoute, ROUTE_HOME, ROUTE_MESSDIENSTANBIETER } from "$lib/routes";
	import HeidiLogo from "./icons/HeidiLogo.svelte";

	const groups = [
		gerateLinksGroup,
		DienstleistungenLinksGroup,
		standorteLinksGroup,
		rechtlichesLinksGroup,
		kundenLinksGroup,
		newsInfoLinksGroup,
	];
	const year = new Date().getFullYear();
</script>

<footer>
	<div class="wrap fgrid">
		<div class="first">
			<a class="flogo" href={ROUTE_HOME}><HeidiLogo class="heidi-logo" /></a>
			<address>
				{ADDRESS.company}<br />
				{ADDRESS.street}<br />
				{ADDRESS.city}
			</address>
			<a class="vdiv" target="_blank" rel="noopener" href={VDIV_PARTNER_URL}>
				<span>Kooperationspartner:</span>
				<Image
					width={0}
					height={0}
					sizes="150px"
					class="vdiv-img"
					src={vdiv_footer_new}
					alt="VDIV Partner"
				/>
			</a>
		</div>
		{#each groups as group (group.title)}
			<div>
				<h4><a href={group.mainUrl}>{group.title}</a></h4>
				<ul>
					{#each group.groupLinks as link (link.text)}
						<li>
							<a href={link.url}>{link.text}</a>
							{#if link.isNeu}<span class="badge">neu</span>{/if}
							{#if link.isBeliebt}<span class="badge">beliebt</span>{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}

		<!-- Every city page, also those not live yet (they render with noindex). -->
		{#if CITIES.length}
			<nav class="cities" aria-labelledby="f-cities-h">
				<h4 id="f-cities-h">Städte</h4>
				<ul>
					{#each CITIES as city (city.slug)}
						<li><a class="city" href={cityRoute(city.slug)}>{city.name}</a></li>
					{/each}
					<li class="all">
						<a class="city" href={ROUTE_MESSDIENSTANBIETER}>Ganz Deutschland</a>
					</li>
				</ul>
			</nav>
		{/if}

		<div class="legal">
			<span>© {year} {ADDRESS.company}, Berlin</span>
			<span class="legal-links">
				{#each datenschutzLinksGroup.groupLinks as link (link.text)}
					<a href={link.url}>{link.text}</a>
				{/each}
			</span>
			<span class="socials">
				{#each socials as social (social.alt)}
					<a href={social.href} aria-label={social.alt}>
						<Image width={20} height={20} src={social.icon} alt="" />
					</a>
				{/each}
			</span>
		</div>
		<p class="disclaimer">
			Die Heidi Systems GmbH erbringt Messdienstleistungen sowie digitale
			Verbrauchserfassungs- und Abrechnungslösungen nach Maßgabe der jeweils
			geltenden gesetzlichen Bestimmungen. Alle auf dieser Website
			bereitgestellten Inhalte dienen ausschließlich der allgemeinen Information
			und begründen weder einen Rechtsanspruch noch eine Verpflichtung. Trotz
			sorgfältiger Prüfung wird keine Haftung für die Richtigkeit,
			Vollständigkeit oder Aktualität der dargestellten Informationen
			übernommen. Haftungsansprüche gegen die Heidi Systems GmbH aufgrund von
			materiellen oder immateriellen Schäden sind – soweit gesetzlich zulässig –
			ausgeschlossen. Sämtliche auf dieser Website verwendeten Texte, Marken,
			Darstellungen und technischen Inhalte unterliegen dem Urheberrecht und
			dürfen nur mit schriftlicher Zustimmung verwendet werden. Verbindliche
			Aussagen zu Leistungen, Preisen oder technischen Spezifikationen erfolgen
			ausschließlich im Rahmen eines individuellen Vertragsverhältnisses.
		</p>
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
		grid-template-columns: 1.3fr repeat(6, 1fr);
		gap: 28px;
		font-size: 15px;
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
	address {
		font-style: normal;
		color: #a9b8b3;
		line-height: 1.5;
	}
	.vdiv {
		display: inline-flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 24px;
		font-size: 12px;
		color: #a9b8b3;
	}
	.vdiv :global(.vdiv-img) {
		max-width: 150px;
		height: auto;
		background: #fff;
		border-radius: 8px;
		padding: 6px 10px;
	}
	h4 {
		font-size: 16px;
		margin: 0 0 14px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
		color: #a9b8b3;
	}
	li {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
	}
	ul a:hover,
	h4 a:hover,
	.legal a:hover {
		color: #fff;
	}
	.badge {
		background: var(--accent);
		color: var(--ink);
		border-radius: 999px;
		padding: 1px 8px;
		font-size: 11px;
		font-weight: 600;
	}
	.cities {
		grid-column: 1 / -1;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		padding-top: 32px;
	}
	.cities ul {
		grid-template-columns: repeat(6, minmax(0, 1fr));
		column-gap: 28px;
	}
	.cities .all {
		font-weight: 600;
		white-space: nowrap;
		grid-column: -2 / -1;
	}
	a.city {
		color: #fff;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(255, 255, 255, 0.35);
	}
	a.city:hover {
		text-decoration-color: var(--accent);
	}
	.legal {
		grid-column: 1 / -1;
		border-top: 1px solid #36504a;
		padding-top: 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		color: #8fa29c;
		font-size: 14px;
	}
	.legal-links {
		display: flex;
		flex-wrap: wrap;
	}
	.legal-links a + a::before {
		content: "·";
		margin-inline: 8px;
	}
	.socials {
		display: flex;
		gap: 14px;
	}
	.socials a {
		display: block;
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	.socials a:hover {
		opacity: 1;
	}
	/* The icons are dark PNGs; turn them white on the dark footer. */
	.socials :global(img) {
		filter: brightness(0) invert(1);
	}
	.disclaimer {
		grid-column: 1 / -1;
		color: #6f847e;
		font-size: 12px;
		line-height: 1.5;
		max-width: 110ch;
	}

	@media (max-width: 1100px) {
		.fgrid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.first {
			grid-column: 1 / -1;
		}
		.cities ul {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 980px) {
		/* Long German words would otherwise widen the two columns. */
		ul,
		h4 {
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.fgrid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			padding-block: 96px 56px;
		}
		.cities ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
