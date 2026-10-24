<!-- "Worauf Sie sich verlassen": four KPI tiles; 92 and 14 count up on view. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { countUp } from "$lib/landing/attachments/countUp";
	import { numbers } from "../content";
</script>

<section class="nm" aria-labelledby="nm-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="nm-h"
				eyebrow={numbers.eyebrow}
				heading={numbers.h2}
				center
			>
				{#snippet icon()}
					<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
				{/snippet}
			</SectionHead>
		</div>
		<div class="nums">
			{#each numbers.items as tile (tile.label)}
				<div class={["rv", tile.dark && "dark"]}>
					<b
						>{#if tile.countTo !== undefined}<span
								{@attach countUp({ to: tile.countTo, duration: 1200 })}
								>{tile.value}</span
							>{:else}{tile.value}{/if}<i>{tile.unit}</i></b
					>
					<span class="lb">{tile.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.nm {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.nums {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	.nums > div {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
	}
	.nums > .dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	b {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-size: clamp(44px, 4.4vw, 60px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.dark b {
		color: var(--accent);
	}
	b i {
		font-style: normal;
		font-size: 20px;
		letter-spacing: 0;
		color: var(--muted);
	}
	.dark b i {
		color: rgba(255, 255, 255, 0.7);
	}
	.lb {
		display: block;
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 14px;
		line-height: 1.45;
	}
	.dark .lb {
		color: rgba(255, 255, 255, 0.7);
	}
	@media (max-width: 1040px) {
		.nums {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.nm {
			padding: 72px 0;
		}
		.nums {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
