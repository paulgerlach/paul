<!--
  Answer cards (`.ss-opts`, `aria-pressed` buttons): one value or several
  (`multi`). An option's icon is an SVG string or a photo.
-->
<script lang="ts" module>
	import type { ImageAsset } from "$lib/components/Basic/Image/types";

	export type Card = {
		v: string;
		label: string;
		/** SVG markup (trusted, static). */
		icon?: string;
		img?: ImageAsset;
		small?: string;
		/** A second, longer line under `small` ("Weitere Leistungen"). */
		more?: string;
		/** The "Empfohlen" badge. */
		rec?: boolean;
	};
</script>

<script lang="ts">
	import Markup from "./Markup.svelte";
	import { ICONS } from "../svg";
	import Image from "$lib/components/Basic/Image/Image.svelte";

	let {
		options,
		value,
		onpick,
		class: cls = "",
	}: {
		options: Card[];
		value: string | string[];
		onpick: (v: string) => void;
		class?: string;
	} = $props();

	const on = (v: string) =>
		Array.isArray(value) ? value.includes(v) : value === v;
</script>

<div class={["ss-opts", cls]}>
	{#each options as o (o.v)}
		<button
			type="button"
			class={["ss-opt", on(o.v) && "on"]}
			aria-pressed={on(o.v)}
			onclick={() => onpick(o.v)}
		>
			<span class="ic"
				>{#if o.img}<Image
						src={o.img}
						alt=""
						width={0}
						height={0}
						sizes="76px"
					/>{:else if o.icon}<Markup html={o.icon} />{/if}</span
			>
			<span class="tx"
				>{#if o.rec}{o.label}
					<span class="ss-rec">Empfohlen</span
					>{:else}{o.label}{/if}{#if o.small || o.more}<small
						>{#if o.more}<span class="ss-zs">{o.small}</span><span class="ss-zx"
								>{o.more}</span
							>{:else}{o.small}{/if}</small
					>{/if}</span
			>
			<span class="ck"><Markup html={ICONS.keep} /></span>
		</button>
	{/each}
</div>
