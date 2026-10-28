<!-- "Vorher und nachher" (.si-vn): five manual steps with two platforms against three automatic ones with Heidi, plus the link to the Dashboard. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import { beforeAfter as t } from "../content";
</script>

<section class="pg-sec" aria-labelledby="vn-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="vn-h" eyebrow={t.pill} heading={t.h2} center>
				{#snippet icon()}
					<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
				{/snippet}
			</SectionHead>
		</div>
		<div class="vn">
			<div class="col col-two rv">
				<div class="ch">
					<b>{t.two.title}</b><small>{t.two.sub}</small>
				</div>
				<ol>
					{#each t.two.steps as step, i (step.title)}
						<li>
							<i>{i + 1}</i><span
								><b>{step.title}</b><small>{step.sub}</small></span
							>
						</li>
					{/each}
				</ol>
			</div>
			<div class="col col-one rv">
				<div class="ch">
					<span class="av"><HeidiMark /></span><b>{t.one.title}</b><small
						>{t.one.sub}</small
					>
				</div>
				<ol>
					{#each t.one.steps as step (step.title)}
						<li>
							<i><Check /></i><span
								><b>{step.title}</b><small>{step.sub}</small></span
							>
						</li>
					{/each}
				</ol>
				<p class="note">
					{t.one.note}
					<a href={t.one.link.href}
						>{t.one.link.text} <span aria-hidden="true">→</span></a
					>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.vn {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 52px;
	}
	.col {
		border-radius: 20px;
		padding: 26px;
		border: 1px solid var(--hair);
	}
	.col-two {
		background: var(--bg);
	}
	.col-one {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.ch {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--hair);
	}
	.col-one .ch {
		border-color: rgba(255, 255, 255, 0.12);
	}
	.ch b {
		font-size: 19px;
		font-weight: 600;
	}
	.ch small {
		flex-basis: 100%;
		font-size: 13.5px;
		color: var(--muted);
	}
	.col-one .ch small {
		color: rgba(255, 255, 255, 0.6);
	}
	.av {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	.av :global(svg) {
		width: 16px;
		height: 14px;
	}
	ol {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
	}
	li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 14px 0;
		border-bottom: 1px solid var(--hair);
	}
	.col-one li {
		border-color: rgba(255, 255, 255, 0.1);
	}
	li:last-child {
		border-bottom: 0;
	}
	li > i {
		font-style: normal;
		flex: none;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12.5px;
		font-weight: 600;
		background: #fff;
		border: 1px solid var(--hair);
		color: var(--muted);
	}
	li > i :global(svg) {
		width: 10px;
	}
	.col-one li > i {
		background: var(--accent);
		border-color: var(--accent);
	}
	li b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	li small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.col-one li small {
		color: rgba(255, 255, 255, 0.62);
	}
	.note {
		margin-top: 18px;
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.62);
		line-height: 1.5;
	}
	.note a {
		color: var(--accent);
		font-weight: 600;
		white-space: nowrap;
	}
	@media (max-width: 860px) {
		.vn {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
