<!-- "Partner und Verbände": the DEUMESS, VDIV and bved logos. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import bved from "$lib/assets/landing/partners/bved.webp?enhanced";
	import deumess from "$lib/assets/landing/partners/deumess.webp?enhanced";
	import vdiv from "$lib/assets/landing/partners/vdiv.webp?enhanced";
</script>

<section class="trust" aria-label="Partner und Verbände">
	<div class="wrap">
		<p class="t-k">Partner und Verbände</p>
		<div class="t-row">
			<Image
				class="t-deumess"
				src={deumess}
				alt="DEUMESS – energie.daten.netzwerk."
			/>
			<Image class="t-vdiv" src={vdiv} alt="VDIV Kooperationspartner Bund" />
			<Image
				class="t-bved"
				src={bved}
				alt="bved – Bundesverband für Energie- und Wasserdatenmanagement e.V."
			/>
		</div>
	</div>
</section>

<style>
	.trust {
		border-top: 1px solid var(--line);
		padding: 64px 0 104px;
		text-align: center;
	}
	.t-k {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 28px;
	}
	.t-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 32px 72px;
	}
	.t-row :global(img) {
		display: block;
		width: auto;
		opacity: 0.92;
		transition:
			opacity 0.25s,
			transform 0.25s;
	}
	.t-row :global(img:hover) {
		opacity: 1;
		transform: translateY(-2px);
	}
	.t-row :global(.t-deumess) {
		height: 44px;
	}
	.t-row :global(.t-vdiv) {
		height: 74px;
	}
	.t-row :global(.t-bved) {
		height: 60px;
	}

	@media (max-width: 640px) {
		.trust {
			padding: 48px 0 84px;
		}
		.t-row {
			gap: 28px 36px;
		}
		.t-row :global(.t-deumess) {
			height: 34px;
		}
		.t-row :global(.t-vdiv) {
			height: 58px;
		}
		.t-row :global(.t-bved) {
			height: 48px;
		}
	}
</style>
