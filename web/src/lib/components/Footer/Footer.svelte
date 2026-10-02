<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		footer_logo,
		insta,
		linkedin,
		vdiv_footer_new,
		xIcon,
		youtube,
	} from "$lib/assets/icons";
	import type { FooterLinkGroupType } from "$lib/types";
	import FooterEmailForm from "./FooterEmailForm.svelte";
	import FooterLink from "./FooterLink.svelte";
	import {
		DienstleistungenLinksGroup,
		datenschutzLinksGroup,
		gerateLinksGroup,
		kundenLinksGroup,
		newsInfoLinksGroup,
		rechtlichesLinksGroup,
		standorteLinksGroup,
	} from "./footerLinks";

	const socials = [
		{
			href: "https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q",
			icon: youtube,
			alt: "youtube",
		},
		{ href: "https://x.com/Heidisystems", icon: xIcon, alt: "x" },
		{
			href: "https://www.linkedin.com/company/heidisystems/",
			icon: linkedin,
			alt: "linkedin",
		},
		{
			href: "https://www.instagram.com/heidisystems/",
			icon: insta,
			alt: "insta",
		},
	];
</script>

{#snippet linkGroup(group: FooterLinkGroupType)}
	<div class="space-y-2.5">
		<a
			class="mb-3.5 inline-block text-lg leading-[21px] font-bold text-dark_text"
			href={group.mainUrl}
		>
			{group.title}
		</a>
		{#each group.groupLinks as link (link.text)}
			<FooterLink {link} />
		{/each}
	</div>
{/snippet}

<footer
	class="bg-card_dark_bg px-[72px] pt-16 pb-12 max-megalarge:px-6 max-medium:px-5"
>
	<div class="border-b border-dark_green/10 pb-16">
		<div
			class="mt-6 grid grid-cols-5 gap-10 max-megalarge:gap-4 max-large:flex max-large:flex-wrap max-large:items-start max-large:justify-between"
		>
			<div class="space-y-9">
				{@render linkGroup(gerateLinksGroup)}
				{@render linkGroup(DienstleistungenLinksGroup)}
			</div>
			{@render linkGroup(standorteLinksGroup)}
			{@render linkGroup(rechtlichesLinksGroup)}
			<div class="flex flex-col justify-between space-y-9">
				{@render linkGroup(kundenLinksGroup)}
				{@render linkGroup(datenschutzLinksGroup)}
			</div>
			<div class="flex flex-col justify-between">
				{@render linkGroup(newsInfoLinksGroup)}
				<div class="flex flex-col items-start justify-center">
					<a
						target="_blank"
						href="https://vdiv.de/partneruebersicht/heidi-systems"
					>
						<p class="text-xs text-dark_text">Kooperationspartner:</p>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class="mb-2 block max-h-[92px] max-w-[150px]"
							src={vdiv_footer_new}
							alt="footer logo"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
	<div
		class="flex items-center justify-between border-b border-dark_green/10 py-8 max-megalarge:flex-wrap max-megalarge:justify-start max-megalarge:gap-4"
	>
		<div class="max-medium:hidden">
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="mb-2 block"
				src={footer_logo}
				alt="footer logo"
			/>
			<p class="max-w-[180px] text-lg leading-[21px] text-dark_text/50">
				Heidi Systems GmbH Monbijoupl. 4 <br /> 10178 Berlin
			</p>
		</div>
		<div
			class="max-w-lg text-[30px] leading-9 text-dark_text max-large:max-w-full max-medium:text-[19px] max-medium:leading-[22px] max-small:px-2 max-small:text-base max-small:leading-5"
		>
			Werde Teil der Revolution: Schon mehr als 15.000+ Geräte erfolgreich
			installiert.
		</div>
		<FooterEmailForm />
	</div>
	<div
		class="flex items-start justify-between pt-8 max-large:flex-wrap max-large:justify-start max-large:gap-3 max-medium:flex-col-reverse max-medium:items-center max-medium:gap-8"
	>
		<p class="max-w-4xl text-xs leading-[14px] text-dark_text">
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
		<div class="flex items-center justify-end gap-3">
			{#each socials as social (social.alt)}
				<a href={social.href}>
					<Image
						width={20}
						height={20}
						sizes="100vw"
						src={social.icon}
						alt={social.alt}
					/>
				</a>
			{/each}
		</div>
	</div>
</footer>
