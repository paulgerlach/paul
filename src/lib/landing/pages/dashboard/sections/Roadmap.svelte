<!-- "Sie bestimmen mit, was als Nächstes kommt." (`.db-road`) -->
<script lang="ts">
	import { focusSignup } from "$lib/landing/cta";
	import Icon from "../components/Icon.svelte";
	import Pill from "../components/Pill.svelte";
	import { roadmap } from "../content";
</script>

<section class="sec road-sec" aria-labelledby="road-h">
	<div class="wrap">
		<div class="road rv">
			<div>
				<Pill text={roadmap.pill} icon="sparkle" />
				<h2 id="road-h">{roadmap.h2}</h2>
				<p>{roadmap.text}</p>
				<a class="db-btn k" href={roadmap.button.href} onclick={focusSignup}
					>{roadmap.button.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
			<ul class="v">
				{#each roadmap.items as item (item.title)}
					<li class="i">
						<span class="ni"><Icon name={item.icon} /></span>
						<span><b>{item.title}</b><small>{item.sub}</small></span>
						<em class="s1">{item.status}</em>
					</li>
				{/each}
				<li class="i you">
					<span class="ni"><Icon name={roadmap.wish.icon} /></span>
					<span
						><b>{roadmap.wish.title}</b><small>{roadmap.wish.sub}</small></span
					>
					<em class="s2">{roadmap.wish.status}</em>
				</li>
			</ul>
		</div>
	</div>
</section>

<style>
	.road-sec {
		padding: 24px 0 12px;
	}
	.road {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 48px;
		align-items: center;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 56px clamp(24px, 5vw, 64px);
	}
	.road h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		line-height: 1.1;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
	}
	.road p {
		color: var(--muted);
		font-size: 17px;
		margin: 14px 0 0;
		max-width: 42ch;
	}
	.road :global(.db-btn) {
		margin-top: 26px;
	}
	.v {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.i {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fafbfa;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 14px;
		font-size: 14px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.i:hover {
		transform: translateX(4px);
		box-shadow: 0 10px 24px -16px rgba(30, 50, 45, 0.3);
	}
	.ni {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: #eef3f0;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ni :global(svg) {
		width: 16px;
		height: 16px;
	}
	small {
		display: block;
		color: var(--faint);
		font-size: 12.5px;
	}
	em {
		margin-left: auto;
		font-style: normal;
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.s1 {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.s2 {
		background: var(--ink);
		color: #fff;
	}
	.i.you {
		border-style: dashed;
		background: #fff;
	}
	@media (max-width: 900px) {
		.road {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
	@media (max-width: 640px) {
		.road {
			padding: 36px 20px;
		}
	}
</style>
