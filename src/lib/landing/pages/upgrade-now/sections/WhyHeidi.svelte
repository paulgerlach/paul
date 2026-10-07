<!-- "Umrüsten mit Heidi": bento with one big card (CSS-only radio waves) and four small ones. -->
<script lang="ts">
	import SectionHead from "../components/SectionHead.svelte";
	import { whyHeidi, type BentoIcon } from "../content";

	const icons: Record<BentoIcon, string[]> = {
		tools: [
			"M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z",
		],
		switch: ["M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3"],
		bell: ["M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0"],
		calculator: [
			"M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01",
		],
	};
</script>

{#snippet icon(paths: string[], rect?: boolean)}
	<span class="bi">
		<svg
			width="16"
			height="16"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			{#if rect}<rect x="4.5" y="2.5" width="11" height="15" rx="2" />{/if}
			{#each paths as d (d)}<path {d} />{/each}
		</svg>
	</span>
{/snippet}

<section class="why" aria-labelledby="why-h">
	<div class="wrap">
		<SectionHead id="why-h" heading={whyHeidi.h2} center />
		<div class="bento">
			<div class="b big rv">
				<span class="bi">
					<svg
						width="16"
						height="16"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						><path
							d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
						/><circle cx="10" cy="16" r=".8" fill="currentColor" /></svg
					>
				</span>
				<h3>{whyHeidi.big.title}</h3>
				<p>{whyHeidi.big.text}</p>
				<div class="wave" aria-hidden="true">
					<i></i><i></i><i></i>
					<span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect x="5" y="2.5" width="10" height="15" rx="2" /><path
								d="M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4"
							/></svg
						>
					</span>
				</div>
			</div>
			{#each whyHeidi.cards as card (card.title)}
				<div class="b rv">
					{@render icon(icons[card.icon], card.icon === "calculator")}
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.why {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.bento {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 52px;
	}
	.b {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px 24px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.b:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.b.big {
		grid-column: span 2;
		grid-row: span 2;
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}
	.bi {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bi svg {
		width: 20px;
		height: 20px;
		color: var(--ink);
	}
	.big .bi {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.14);
	}
	.big .bi svg {
		color: var(--accent);
	}
	h3 {
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.015em;
		margin-top: 18px;
	}
	.big h3 {
		font-size: clamp(22px, 2.4vw, 30px);
		letter-spacing: -0.03em;
		font-weight: 500;
		max-width: 18ch;
		line-height: 1.15;
	}
	p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
	}
	.big p {
		color: rgba(255, 255, 255, 0.7);
		font-size: 16px;
		max-width: 42ch;
	}
	.wave {
		flex: 1;
		min-height: 150px;
		position: relative;
		margin-top: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wave span {
		position: relative;
		z-index: 1;
		width: 64px;
		height: 64px;
		border-radius: 18px;
		background: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12px 30px -10px rgba(138, 214, 143, 0.6);
	}
	.wave span svg {
		width: 30px;
		height: 30px;
		color: var(--ink);
	}
	.wave i {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		border: 1.5px solid rgba(138, 214, 143, 0.55);
		transform: translate(-50%, -50%);
		animation: ring 3.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
	}
	.wave i:nth-child(2) {
		animation-delay: 1.2s;
	}
	.wave i:nth-child(3) {
		animation-delay: 2.4s;
	}
	@keyframes ring {
		0% {
			width: 64px;
			height: 64px;
			opacity: 0.9;
		}
		100% {
			width: 300px;
			height: 300px;
			opacity: 0;
		}
	}
	@media (max-width: 1040px) {
		.bento {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.bento {
			grid-template-columns: minmax(0, 1fr);
		}
		.b.big {
			grid-column: auto;
			grid-row: auto;
		}
	}
</style>
