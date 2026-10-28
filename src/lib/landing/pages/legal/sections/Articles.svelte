<!--
  The articles (.pg-sec#inhalt, .lf-g): the table of contents, sticky above
  900 px, marking the article being read and filling its progress bar (the
  design's `spy()` in #lg-js, pure in /heizkostenverordnung's toc.ts), next to the
  article cards. The server renders the first link marked and the bar empty.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import {
		activeIndex,
		READING_LINE,
		readProgress,
	} from "$lib/landing/pages/hkvo-leitfaden/toc";
	import type { LegalPage } from "../types";

	let { page }: { page: LegalPage } = $props();

	let active = $state(0);
	let progress = $state(0);

	/** One passive scroll listener, read once per animation frame. */
	const spy: Attachment<HTMLElement> = (section) => {
		const body = section.querySelector<HTMLElement>(".body");
		const articles = [...section.querySelectorAll<HTMLElement>("article")];
		if (!body) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			const line = window.innerHeight * READING_LINE;
			active = activeIndex(
				articles.map((a) => a.getBoundingClientRect().top),
				line,
			);
			const box = body.getBoundingClientRect();
			progress = readProgress(box.top, box.height, line);
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		update();
		return () => {
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			if (frame) cancelAnimationFrame(frame);
		};
	};
</script>

<section class="pg-sec" id="inhalt" aria-label={page.label} {@attach spy}>
	<div class="wrap cols">
		<nav class="toc" aria-label="Inhalt">
			<small>Inhalt</small>
			<ol>
				{#each page.articles as article, i (article.id)}
					<li>
						<a
							href={`#${article.id}`}
							class={[i === active && "on"]}
							aria-current={i === active ? "location" : undefined}
							><i>{article.num}</i>{article.title}</a
						>
					</li>
				{/each}
			</ol>
			<div class="prog" aria-hidden="true">
				<i style:width={`${progress * 100}%`}></i>
			</div>
		</nav>
		<div class="body">
			{#each page.articles as article (article.id)}
				<article class="rv" id={article.id}>
					<div class="sh">
						<i>{article.num}</i>
						{#if article.law}<span class="par">{article.law}</span>{/if}
					</div>
					<h2>{article.title}</h2>
					<!-- eslint-disable svelte/no-at-html-tags -- trusted content data -->
					{#each article.body as block, i (i)}
						{#if "p" in block}
							<!-- The space after the number sits outside the {#if}: the
							     compiler drops a space at the end of a block. -->
							<p>
								{#if block.nr}<b class="nr">{block.nr}</b>{/if}{block.nr
									? " "
									: ""}{@html block.p}
							</p>
						{:else if "h3" in block}
							<h3>{block.h3}</h3>
						{:else if "doc" in block}
							<p class="doc">{block.doc}</p>
						{:else if "stand" in block}
							<p class="stand">{block.stand}</p>
						{:else}
							<ul>
								{#each block.list as item (item)}
									<li>{@html item}</li>
								{/each}
							</ul>
						{/if}
					{/each}
					<!-- eslint-enable svelte/no-at-html-tags -->
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 72px;
	}
	.cols {
		display: grid;
		grid-template-columns: 260px minmax(0, 1fr);
		gap: 64px;
		align-items: start;
	}
	.toc {
		position: sticky;
		top: 96px;
	}
	.toc small {
		display: block;
		font-size: 11.5px;
		color: var(--faint);
		margin-bottom: 12px;
	}
	ol {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 2px;
	}
	.toc a {
		display: flex;
		gap: 10px;
		align-items: baseline;
		padding: 7px 10px;
		border-radius: 8px;
		font-size: 14px;
		color: var(--muted);
		transition:
			background 0.2s,
			color 0.2s;
		line-height: 1.35;
	}
	.toc a i {
		font-style: normal;
		font-size: 11px;
		color: var(--faint);
		font-variant-numeric: tabular-nums;
	}
	.toc a:hover {
		color: var(--ink);
		background: #f4f6f5;
	}
	.toc a.on {
		color: var(--ink);
		background: #eef4ef;
		font-weight: 500;
	}
	.toc a.on i {
		color: var(--ok);
	}
	.prog {
		height: 3px;
		border-radius: 2px;
		background: #eef1ef;
		margin-top: 14px;
		overflow: hidden;
	}
	.prog i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--ok);
		transition: width 0.2s;
	}
	.body {
		display: grid;
		gap: 18px;
		max-width: 760px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 28px 30px;
		/* The design's TOC jumps 90 px above an article. */
		scroll-margin-top: 90px;
	}
	.sh {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.sh i {
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
		color: var(--faint);
	}
	.par {
		font-size: 12px;
		font-weight: 600;
		background: #eef4ef;
		color: #2f7a3c;
		border-radius: 6px;
		padding: 3px 8px;
	}
	/* `article h2` / `article h3`: beat the landing reset of heading margins. */
	article h2 {
		font-size: clamp(22px, 2vw, 26px);
		font-weight: 500;
		letter-spacing: -0.02em;
		margin-top: 12px;
		line-height: 1.2;
	}
	article h3 {
		font-size: 17px;
		font-weight: 600;
		margin: 26px 0 0;
	}
	article p {
		color: #3e4d49;
		font-size: 16px;
		line-height: 1.65;
		margin-top: 12px;
	}
	/* .lf-s p a, .lg .lf-s p a */
	article p :global(a) {
		font-weight: 600;
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.nr {
		font-weight: 600;
		color: var(--ink);
		margin-right: 2px;
	}
	article p.doc {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--faint);
		margin: 4px 0 0;
	}
	article p.stand {
		margin-top: 22px;
		font-size: 14px;
		color: var(--faint);
	}
	ul {
		margin: 10px 0 0;
		padding-left: 20px;
		display: grid;
		gap: 6px;
		color: var(--muted);
		list-style: disc;
	}
	ul :global(b) {
		color: var(--ink);
	}
	@media (max-width: 900px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
		.toc {
			position: static;
			background: #fff;
			border: 1px solid var(--hair);
			border-radius: 16px;
			padding: 14px;
		}
		ol {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.prog {
			display: none;
		}
	}
	@media (max-width: 560px) {
		ol {
			grid-template-columns: minmax(0, 1fr);
		}
		article {
			padding: 22px 18px;
		}
	}
</style>
