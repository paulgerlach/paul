<script lang="ts" module>
	const animations = import.meta.glob<unknown>("$lib/animations/*.json", {
		import: "default",
	});
</script>

<script lang="ts">
	import { lottie } from "$lib/attachments/lottie";

	type Props = {
		/** e.g. "Animation_1" */
		animationName: string;
		id?: string;
		wrapperClassName?: string;
		/** For above-the-fold animations */
		eager?: boolean;
		/**
		 * The animation's own size (its JSON `w`/`h`). Reserves the box its SVG
		 * will take, so the layout doesn't shift when lottie-web renders.
		 */
		size?: { w: number; h: number };
	};

	let {
		animationName,
		id,
		wrapperClassName,
		eager = false,
		size,
	}: Props = $props();

	const load = $derived(
		animations[`/src/lib/animations/${animationName}.json`],
	);
</script>

<div class={wrapperClassName}>
	{#if load}
		{#key animationName}
			<div {id} {@attach lottie(load, eager)}>
				{#if size}
					<!-- Sized like lottie-web's own <svg>; hidden once that is added. -->
					<svg
						class="placeholder"
						width={size.w}
						height={size.h}
						viewBox="0 0 {size.w} {size.h}"
						aria-hidden="true"
					></svg>
				{/if}
			</div>
		{/key}
	{/if}
</div>

<style>
	.placeholder {
		width: 100%;
		height: 100%;
	}
	.placeholder:not(:only-child) {
		display: none;
	}
</style>
