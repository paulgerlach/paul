<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { arrow } from "$lib/assets/icons";
	import { ROUTE_FUNKTIONEN } from "$lib/routes";
</script>

<a class="group" href={ROUTE_FUNKTIONEN}>
	<p class="mb-5 flex items-center justify-between text-xl text-dark_text">
		Funktionshighlight
		<span class="duration-300 group-hover:translate-x-1">
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="size-2.5 max-h-2.5 max-w-2.5"
				style="width: 100%; height: auto"
				alt="arrow"
				src={arrow}
			/>
		</span>
	</p>
	<LazyLottie animationName="Animation_10" id="animation10" />
	<p class="mb-3 text-[15px] font-bold text-dark_text">Dashboard</p>
	<p class="text-xs text-dark_text">
		Sehen Sie alle Verbräuche in Echtzeit in einem übersichtlichen Dashboard
	</p>
</a>
