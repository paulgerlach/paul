<script lang="ts">
	import type { FooterLinkType } from "$lib/types";

	let { link }: { link: FooterLinkType } = $props();
</script>

<a
	href={link.url}
	class="flex items-center justify-start gap-1.5 text-lg leading-[21px] text-dark_text"
>
	{link.text}
	{#if link.isNeu}
		<span
			class="rounded-halfbase bg-green px-2 py-0.5 text-lg leading-[18px] text-dark_text"
		>
			neu
		</span>
	{/if}
	{#if link.isBeliebt}
		<span
			class="rounded-halfbase bg-green px-2 py-0.5 text-lg leading-[18px] text-dark_text"
		>
			beliebt
		</span>
	{/if}
</a>
