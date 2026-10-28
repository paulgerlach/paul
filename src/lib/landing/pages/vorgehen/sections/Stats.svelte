<!-- The three key figures, each with a small photo. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import dashboard from "$lib/assets/landing/vorgehen/dashboard.webp?enhanced";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import office from "$lib/assets/landing/vorgehen/office.webp?enhanced";
	import { stats } from "../content";

	const photos = [installer, office, dashboard];
</script>

<section class="stats">
	<div class="wrap">
		<ul>
			{#each stats as stat, i (stat.figure)}
				<li class="rv">
					<div class="top">
						<b>{stat.figure}</b>
						<Image src={photos[i]} alt="" width={96} height={64} sizes="96px" />
					</div>
					<p>{stat.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.stats {
		padding-top: 16px;
	}
	.wrap {
		max-width: 1280px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	li {
		background: var(--soft);
		border-radius: 18px;
		padding: 22px 22px 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 170px;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 14px;
	}
	b {
		font-family: var(--mono);
		font-size: clamp(28px, 3vw, 40px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.5;
	}
	.top :global(img) {
		width: 96px;
		height: 64px;
		object-fit: cover;
		border-radius: 10px;
		flex: none;
	}
	p {
		font-size: 15px;
		color: var(--muted);
		margin-top: 28px;
	}
	@media (max-width: 980px) {
		ul {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
