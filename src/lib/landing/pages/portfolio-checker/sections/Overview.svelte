<!--
  The example evaluation's properties (.pl.pc-ov): the `.pl` look of the
  shared list with its own columns, static rows and a longer popover per
  recommendation (the eight fields and the hints). A click on a chip toggles
  its popover; hover and focus show it too.
-->
<script lang="ts">
	import p1 from "$lib/assets/landing/dashboard/property-1.jpg";
	import p2 from "$lib/assets/landing/dashboard/property-2.jpg";
	import p3 from "$lib/assets/landing/dashboard/property-3.jpg";
	import { fieldValue, OVERVIEW_FIELDS, type Property } from "../checker";
	import { result } from "../content";

	let { properties }: { properties: Property[] } = $props();

	/** The design's `PLIMG[i]`: the list's first thumbnails. */
	const PHOTOS = [p1, p2, p3];
	const ICONS = {
		take: { w: 1.8, d: ["M4 7h11l-3-3M16 13H5l3 3"] },
		cancel: {
			w: 1.7,
			d: ["M5 2.5h7l3.5 3.5v11.5H5z", "M8 11.5l4 4M12 11.5l-4 4"],
		},
	};
	const ov = result.overview;
	let openTip = $state<number | null>(null);
</script>

<div class="pl">
	<div class="h" aria-hidden="true">
		{#each ov.columns as column (column)}<span>{column}</span>{/each}
	</div>
	<ul class="l">
		{#each properties as p, i (p.key)}
			{@const rec = p.recommendation}
			{@const icon = ICONS[rec.kind]}
			<li class="r" style:animation-delay="{i * 0.12}s">
				<div class="n">
					<span class="ph"
						><img
							src={PHOTOS[i % PHOTOS.length]}
							alt=""
							width="44"
							height="44"
							loading="lazy"
						/></span
					>
					<span><b>{p.name}</b><small>{p.sub}</small></span>
				</div>
				<div class="st">
					<b>{ov.term}{fieldValue(p, "Laufzeit bis")}</b>{ov.notice}<b
						class="hl">{fieldValue(p, "Kündigung bis")}</b
					>
				</div>
				<div class="a">
					<button
						type="button"
						class={["chip", rec.kind]}
						aria-expanded={openTip === i}
						aria-controls="pc-pop-{i}"
						onclick={() => (openTip = openTip === i ? null : i)}
					>
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width={icon.w}
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							>{#each icon.d as d (d)}<path {d} />{/each}</svg
						>{rec.title}<i class="pi" aria-hidden="true">i</i>
					</button>
					<div
						class={["pop", rec.kind, openTip === i && "open"]}
						id="pc-pop-{i}"
						role="tooltip"
					>
						<b>{rec.title} · {p.name}</b>
						<p>{rec.text}</p>
						<div class="kv">
							{#each OVERVIEW_FIELDS as label (label)}
								{@const field = p.fields.find((f) => f.label === label)}
								{#if field}
									<div class={[field.tone === "hl" && "hl"]}>
										<small>{label}</small><span>{field.value}</span>
									</div>
								{/if}
							{/each}
						</div>
						<div class="hn">
							{#each p.hints as hint (hint.text)}
								<div>
									<i aria-hidden="true">{hint.tone === "g" ? "✓" : "⚠"}</i><span
										>{hint.text}</span
									>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<div class="ft">
		<span class="demo">{ov.badge}</span><span>{ov.hover}</span>
	</div>
</div>

<style>
	.pl {
		margin-top: 14px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px 24px 18px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.h,
	.r {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.1fr) 290px;
		gap: 16px;
	}
	.h {
		padding: 18px 14px 8px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.l {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.r {
		align-items: center;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 14px;
		animation: pcIn 0.45s both;
	}
	@keyframes pcIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.r:hover {
		z-index: 5;
		position: relative;
	}
	.n {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.ph {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		overflow: hidden;
		background: #eef1ef;
		box-shadow: inset 0 0 0 1px rgba(30, 50, 45, 0.06);
		flex: none;
	}
	.ph img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s;
	}
	.r:hover .ph img {
		transform: scale(1.08);
	}
	.n b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.n small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.st {
		font-size: 13.5px;
		color: var(--muted);
		line-height: 1.35;
	}
	.st b {
		display: block;
		color: var(--ink);
		font-weight: 500;
	}
	.st b.hl {
		display: inline;
		color: #b4541a;
	}
	.a {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		z-index: 1;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 999px;
		padding: 8px 14px 8px 10px;
		font-size: 13.5px;
		font-weight: 600;
		white-space: nowrap;
		cursor: help;
		transition:
			opacity 0.3s,
			transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1),
			box-shadow 0.25s;
	}
	.chip svg {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.chip.take {
		background: var(--ink);
		color: #fff;
	}
	.chip.cancel {
		background: #fbefdf;
		color: #8a5410;
	}
	.a:hover .chip,
	.chip:focus-visible {
		transform: translateY(-1px);
		box-shadow: 0 8px 18px -10px rgba(30, 50, 45, 0.45);
	}
	.chip:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.pi {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 10.5px;
		font-weight: 700;
		font-style: normal;
		margin-left: 2px;
		background: rgba(255, 255, 255, 0.18);
	}
	.cancel .pi {
		background: rgba(138, 84, 16, 0.14);
	}
	.pop {
		position: absolute;
		left: auto;
		right: 0;
		top: calc(100% + 10px);
		width: 400px;
		max-width: 80vw;
		background: var(--ink);
		color: #fff;
		border-radius: 14px;
		padding: 16px 16px 14px;
		box-shadow: 0 24px 50px -24px rgba(30, 50, 45, 0.6);
		z-index: 30;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-6px);
		transition:
			opacity 0.2s,
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			visibility 0s 0.25s;
		text-align: left;
	}
	.pop::before {
		content: "";
		position: absolute;
		top: -6px;
		right: 40px;
		width: 12px;
		height: 12px;
		background: inherit;
		transform: rotate(45deg);
		border-radius: 2px;
	}
	.pop b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}
	.pop p {
		font-size: 13px;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.75);
		margin: 6px 0 0;
	}
	.a:hover .pop,
	.a:focus-within .pop,
	.pop.open {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity 0.2s,
			transform 0.25s,
			visibility 0s;
	}
	.pop.cancel {
		background: #fbefdf;
		color: #4a2e0a;
		box-shadow: 0 24px 50px -24px rgba(138, 84, 16, 0.35);
		border: 1px solid #f0d9b8;
	}
	.pop.cancel::before {
		box-shadow: -1px -1px 0 #f0d9b8;
	}
	.pop.cancel p {
		color: #6b4a1f;
	}
	.kv {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px 14px;
		margin-top: 12px;
	}
	.kv small {
		display: block;
		font-size: 11px;
		opacity: 0.7;
	}
	.kv span {
		display: block;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.3;
	}
	.kv .hl span {
		color: #b4541a;
	}
	.take .kv .hl span {
		color: #f4b37a;
	}
	.hn {
		margin-top: 12px;
		padding-top: 10px;
		border-top: 1px solid rgba(30, 50, 45, 0.12);
		display: grid;
		gap: 6px;
		font-size: 12.5px;
		line-height: 1.4;
	}
	.take .hn {
		border-top-color: rgba(255, 255, 255, 0.14);
	}
	.hn div {
		display: flex;
		gap: 7px;
	}
	.hn i {
		font-style: normal;
		flex: none;
	}
	.ft {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 14px;
		font-size: 13px;
		color: var(--muted);
	}
	.demo {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 860px) {
		.pl {
			padding: 16px;
		}
		.h {
			display: none;
		}
		.r {
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
		}
		.st,
		.a {
			padding-left: 48px;
		}
		.chip {
			font-size: 13px;
			padding: 7px 12px 7px 9px;
		}
		.pi {
			display: none;
		}
		.pop {
			left: 0;
			right: 0;
			width: auto;
			max-width: none;
		}
		.pop::before {
			right: auto;
			left: 70px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.r {
			animation: none;
		}
	}
</style>
