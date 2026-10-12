<!-- "Wir wachsen": dark careers teaser. Hidden with `careers.show = false`. -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import { careers } from "../content";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
</script>

{#if careers.show}
	<section class="kt-sec" aria-labelledby="kt-h">
		<div class="wrap">
			<div class="kt rv">
				<div>
					<span class="pill">
						<StrokeIcon
							><path
								d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
							/></StrokeIcon
						>{careers.eyebrow}
					</span>
					<h2 id="kt-h">{careers.title}</h2>
					<p>{careers.text}</p>
				</div>
				<ArrowLink href={careers.cta.href} label={careers.cta.text} />
			</div>
		</div>
	</section>
{/if}

<style>
	.kt-sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.kt {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 32px;
		flex-wrap: wrap;
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 44px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
	}
	h2 {
		font-size: clamp(26px, 3vw, 38px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 16px;
		max-width: 22ch;
	}
	p {
		color: rgba(255, 255, 255, 0.7);
		margin-top: 10px;
		max-width: 52ch;
	}
	@media (max-width: 640px) {
		.kt-sec {
			padding: 72px 0;
		}
		.kt {
			padding: 28px;
		}
	}
</style>
