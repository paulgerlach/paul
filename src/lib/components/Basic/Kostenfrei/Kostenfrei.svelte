<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		checkmark_shield,
		chess_shield,
		eu_elipse,
		lock,
		small_counter,
	} from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";

	const badges = [
		{
			icon: chess_shield,
			alt: "chess_shield",
			title: "Gesetzeskonform",
			text: "§ 229 Artikel 3",
		},
		{
			icon: checkmark_shield,
			alt: "checkmark_shield",
			title: "Datenschutzkonform",
			text: "Nach DSGVO",
		},
		{
			icon: lock,
			alt: "lock",
			title: "SSL Verschlüsselung",
			text: "Zertifiziert und Sicher",
		},
		{
			icon: eu_elipse,
			alt: "eu_elipse",
			title: "Server in Europa",
			text: "EU Datenschutz",
		},
	];
</script>

<div
	class="my-16 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
>
	<h5
		class="mb-9 text-center text-[45px] leading-[54px] text-dark_text max-medium:text-2xl"
	>
		Kostenfrei nachrüsten
	</h5>
	<a
		class="mx-auto flex w-fit cursor-pointer items-center justify-center rounded-halfbase bg-green px-[104px] py-5 text-center text-lg text-white transition hover:opacity-80 max-medium:w-full max-medium:px-10 max-medium:py-3 max-small:text-base"
		href={ROUTE_FRAGEBOGEN}
	>
		Jetzt installieren lassen
	</a>
	<p class="text-center text-[15px] text-dark_text">
		Kostenfreie Installation der Funkgeräte
	</p>
	<div
		class="mt-16 mb-28 flex items-center justify-center gap-24 max-large:grid max-large:grid-cols-2 max-large:gap-16 max-medium:my-10 max-medium:grid-cols-1 max-medium:gap-10 max-small:gap-5"
	>
		{#each badges as badge (badge.alt)}
			<div
				class="flex items-center justify-start gap-5 max-medium:justify-center max-small:justify-start"
			>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					src={badge.icon}
					alt={badge.alt}
				/>
				<div>
					<p class="text-[15px] text-dark_text">{badge.title}</p>
					<p class="text-[15px] text-dark_text/50">{badge.text}</p>
				</div>
			</div>
		{/each}
	</div>
	<div
		class="flex items-center justify-between rounded-base border border-dark_green/10 px-9 py-7 max-megalarge:flex-col max-megalarge:space-y-6 max-small:px-5"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={small_counter}
			alt="small_counter"
		/>
		<p
			class="text-[30px] text-dark_text max-medium:text-center max-small:text-xl"
		>
			Jetzt auf digitale Funkzähler umstellen lassen.
		</p>
		<a
			class="flex w-fit cursor-pointer items-center justify-center rounded-base bg-green px-5 py-4 text-center text-lg text-white transition hover:opacity-80 max-small:rounded-lg max-small:px-6 max-small:py-3 max-small:text-base"
			href={ROUTE_FRAGEBOGEN}
		>
			Angebot anfordern
		</a>
	</div>
</div>
