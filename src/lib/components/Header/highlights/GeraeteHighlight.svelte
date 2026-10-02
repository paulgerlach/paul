<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { modal_counter } from "$lib/assets/icons";
	import { ROUTE_GERAETE } from "$lib/routes";
	import HighlightTitle from "./HighlightTitle.svelte";
</script>

<a class="group" href={ROUTE_GERAETE}>
	<HighlightTitle text="Produkthighlight" />
	<div
		class="mb-2.5 flex items-center justify-center rounded-base bg-[#D9D9D9]/50 px-12 py-5"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			style="width: 100%; height: auto"
			src={modal_counter}
			alt="counter mobile"
		/>
	</div>
	<p class="mb-3 text-[15px] font-bold text-dark_text">Neue Warmwasserzähler</p>
	<p class="text-xs text-dark_text">
		Neuste Funktechnik erlaubt das Ablesen des Warmwasserverbrauchs in Echtzeit
	</p>
</a>
