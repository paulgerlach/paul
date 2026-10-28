<!--
  Hero (.pg-hero with #kt-css): pill, H1, lead, the two CTAs, three ticks,
  and the team photo with the card of the three mailboxes over it. No
  `#start`: the page's form is `#schreiben`.
-->
<script lang="ts">
	import team from "$lib/assets/landing/kontakt/team.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { focusContactForm } from "../focus";
	import Icon from "../components/Icon.svelte";
	import { hero, MAILBOXES } from "../content";
</script>

<section class="hero" aria-labelledby="kt-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="mail" />{hero.pill}</span>
			<h1 data-hs class="rv" id="kt-h1">
				{hero.h1}<br /><em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="bk" href={hero.write.href} onclick={focusContactForm}
					>{hero.write.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="ghost" href={hero.book.href}>{hero.book.text}</a>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>

		<div class="hv rv">
			<figure class="photo">
				<Image
					src={team}
					alt={hero.photoAlt}
					width={1200}
					height={900}
					sizes="(max-width: 1040px) 100vw, 560px"
					priority
				/>
			</figure>
			<div class="card">
				{#each hero.mailboxes as box (box.key)}
					<a href="mailto:{MAILBOXES[box.key]}" class="row"
						><span class="ic"><Icon name="mail" /></span><span
							><small>{box.label}</small><b>{MAILBOXES[box.key]}</b></span
						></a
					>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
	}
	/* `.cols h1`: beats the landing reset of heading margins. */
	.cols h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--ok);
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	/* .bk-next (dark) */
	.bk {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 20px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.bk .ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		/* The design keeps the list's default bottom margin. */
		margin: 28px 0 1em;
		font-size: 14.5px;
		color: var(--muted);
		list-style: none;
		padding: 0;
	}
	.ticks li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.tk {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e3f3e4;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.tk :global(svg) {
		width: 10px;
	}

	/* The photo and the mailbox card (#kt-css) */
	.hv {
		position: relative;
		padding-bottom: 56px;
	}
	.photo {
		margin: 0;
		border-radius: 22px;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		box-shadow: 0 40px 80px -46px rgba(30, 50, 45, 0.55);
	}
	.photo :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 30%;
		display: block;
		transition: transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.hv:hover .photo :global(img) {
		transform: scale(1.025);
	}
	.card {
		position: absolute;
		left: -28px;
		right: 56px;
		bottom: 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 6px 18px;
		box-shadow: 0 26px 54px -30px rgba(30, 50, 45, 0.45);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 0;
		color: var(--ink);
		border-top: 1px solid #eef1ef;
	}
	.row:first-child {
		border-top: 0;
	}
	.row small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.row b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		word-break: break-word;
		transition: color 0.2s;
	}
	.row:hover b {
		color: #2f7a3c;
	}
	.ic {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: #e3f3e4;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 18px;
		height: 18px;
		color: #2f7a3c;
	}

	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
		.card {
			left: 16px;
			right: 16px;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.bk,
		.ghost {
			justify-content: center;
		}
		.card {
			position: relative;
			left: 0;
			right: 0;
			margin: -40px 12px 0;
		}
		.hv {
			padding-bottom: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.photo :global(img) {
			transition: none;
		}
	}
</style>
