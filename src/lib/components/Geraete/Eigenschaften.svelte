<script lang="ts" module>
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import {
		caract_battery,
		caract_mark,
		caract_mind,
		caract_radio,
		caract_sniper,
		caract_vector,
		realtime,
		server,
	} from "$lib/assets/icons";

	type EigenschaftItem = {
		icon: ImageAsset;
		text: string;
		filterGreen?: boolean;
	};

	const desktopItems1: EigenschaftItem[] = [
		{ icon: caract_vector, text: "Akustische Leckageerkennung" },
		{ icon: caract_radio, text: "Fernablesung" },
		{ icon: realtime, text: "Echtzeit-Messwerte", filterGreen: true },
		{ icon: server, text: "Server in Europa", filterGreen: true },
	];

	const desktopItems2: EigenschaftItem[] = [
		{ icon: caract_sniper, text: "Hohe Messgenauigkeit" },
		{ icon: caract_mind, text: "Intelligente Warnsysteme" },
		{ icon: caract_battery, text: "Langlebige Batterie" },
		{ icon: caract_mark, text: "Offizielle Zertifizierungen" },
	];

	const mobileItems = [...desktopItems1, ...desktopItems2];
</script>

<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
</script>

{#snippet desktopList(items: EigenschaftItem[])}
	<ul class="space-y-10">
		{#each items as item (item.text)}
			<li class="flex items-center justify-start gap-5">
				<span
					class="flex size-[60px] items-center justify-center rounded-full shadow-lg"
				>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						class={["size-[30px]", item.filterGreen && "filter-to-green"]}
						src={item.icon}
						alt={item.text}
					/>
				</span>
				<span class="text-dark_text">{item.text}</span>
			</li>
		{/each}
	</ul>
{/snippet}

<div
	class="mt-24 mb-16 px-24 max-large:px-16 max-medium:my-8 max-medium:px-10 max-small:px-5"
>
	<!-- Desktop: 3-column grid layout with 8 items -->
	<div
		class="grid grid-cols-3 gap-16 max-large:grid-cols-2 max-large:gap-8 max-small:hidden"
	>
		<h3
			class="text-[45px] leading-[54px] text-dark_text max-large:col-span-2 max-large:mb-12 max-large:text-center"
		>
			Eigenschaften
		</h3>
		{@render desktopList(desktopItems1)}
		{@render desktopList(desktopItems2)}
	</div>

	<!-- Mobile: single column layout -->
	<div class="hidden max-small:block">
		<h3 class="mb-10 text-[30px] leading-[36px] text-dark_text">
			Eigenschaften
		</h3>
		<ul class="space-y-8">
			{#each mobileItems as item (item.text)}
				<li class="flex items-center justify-start gap-5">
					<span
						class="flex size-[60px] items-center justify-center rounded-full bg-gray-100"
					>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class={["size-[28px]", item.filterGreen && "filter-to-green"]}
							src={item.icon}
							alt={item.text}
						/>
					</span>
					<span class="text-lg text-dark_text">{item.text}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
