<script lang="ts">
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";

	const items = [
		{
			animationName: "Animation_7",
			id: "animation7",
			title: "Betriebskostenabrechnung",
			text: "Automatisierte und präzise Erfassung aller relevanten Verbrauchsdaten für effiziente Betriebskostenabrechnung.",
		},
		{
			animationName: "Animation_8",
			id: "animation8",
			title: "Kostenfreie Wartung",
			text: "Regelmäßige Wartung Ihrer Funkzähler sorgt für eine zuverlässige und fehlerfreie Datenerfassung.",
		},
		{
			animationName: "Animation_9",
			id: "animation9",
			title: "Serviceangebot",
			text: "Von der Installation über die Wartung bis zur digitalen Verbrauchsanalyse: Unser Service deckt alle Bereiche ab.",
		},
	];
</script>

<div
	id="animations"
	class="my-16 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
>
	<div class="grid grid-cols-3 gap-6 max-medium:grid-cols-1">
		{#each items as item (item.id)}
			<div class="space-y-6">
				<LazyLottie
					animationName={item.animationName}
					id={item.id}
					wrapperClassName="relative h-full max-h-[317px] overflow-hidden rounded-base max-large:max-h-fit"
				/>
				<div>
					<p class="text-[15px] font-bold text-dark_text">{item.title}</p>
					<p class="line-clamp-3 text-[15px] text-dark_text">{item.text}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
