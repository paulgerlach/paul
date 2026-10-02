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
	};

	let { animationName, id, wrapperClassName, eager = false }: Props = $props();

	const load = $derived(
		animations[`/src/lib/animations/${animationName}.json`],
	);
</script>

<div class={wrapperClassName}>
	{#if load}
		{#key animationName}
			<div {id} {@attach lottie(load, eager)}></div>
		{/key}
	{/if}
</div>
