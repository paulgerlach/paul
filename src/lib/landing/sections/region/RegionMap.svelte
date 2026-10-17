<!--
  The interactive district map (city pages) or Bundesländer map (Germany
  page). Hovering, focusing or clicking an area selects it and fills the info
  panel. Areas with an `href` (the Germany page's city dots) are real links
  to their pages. Handles all three map variants of the designs: district
  polygons, an outline with polygons, and an outline with dots.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import {
		cityBySlug,
		isLiveCity,
	} from "$lib/landing/pages/messdienstanbieter-city/cities";
	import { cityRoute, ROUTE_MESSDIENSTANBIETER } from "$lib/routes";
	import { districtId, type MapDistrict, type RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const map = $derived(content.map);

	// svelte-ignore state_referenced_locally (the default only seeds the state)
	let selected = $state(content.map.defaultDistrict);
	const current = $derived(
		map.districts.find((d) => districtId(d) === selected) ?? map.districts[0],
	);

	const nearby = $derived(
		content.links.nearby.filter(isLiveCity).map((slug) => cityBySlug(slug)!),
	);
	/** City pages link to the Germany hub; the hub itself doesn't. */
	const isCity = $derived(content.slug !== undefined);

	const select = (d: MapDistrict) => (selected = districtId(d));
	function onkeydown(event: KeyboardEvent, d: MapDistrict) {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		select(d);
	}
</script>

{#snippet shape(d: MapDistrict, focusable: boolean)}
	{@const on = districtId(d) === selected}
	<!-- A linked dot is focused through its <a>; every other area is a button. -->
	{@const attrs = focusable
		? {
				tabindex: 0,
				role: "button",
				"aria-label": d.name,
				"aria-pressed": on,
				onmouseenter: () => select(d),
				onfocus: () => select(d),
				onclick: () => select(d),
				onkeydown: (e: KeyboardEvent) => onkeydown(e, d),
			}
		: {}}
	{#if d.shape.kind === "path"}
		<path class={["bz", on && "on"]} d={d.shape.d} {...attrs} />
	{:else}
		<circle
			class={["bz dot", on && "on"]}
			cx={d.shape.cx}
			cy={d.shape.cy}
			r={d.shape.r}
			{...attrs}
		/>
	{/if}
{/snippet}

<section class="bmap wrap" aria-labelledby="map-h">
	<div class="bm-grid">
		<div class="bm-copy">
			<div class="eyebrow">{map.eyebrow}</div>
			<h2 id="map-h">{map.title}</h2>
			<p class="bm-sub">{map.sub}</p>
			<div class="bm-info" aria-live="polite">
				<div class="bm-k">{map.areaLabel}</div>
				<div class="bm-n">{current.name}</div>
				<div class="bm-k bm-k2">Typischer Bestand</div>
				<div class="bm-t">{current.stock}</div>
				<div class="bm-h">
					<span class="okb"><Check /></span><span>{current.hint}</span>
				</div>
				<a class="bm-cta" href={START_HREF} onclick={focusSignup}>
					Bestand in {current.name} prüfen <span class="ar">→</span>
				</a>
			</div>
			{#if nearby.length || isCity}
				<div class="bm-links">
					{#if nearby.length}
						<p>
							Auch in der Nähe:
							{#each nearby as city, i (city.slug)}{#if i},
								{/if}<a href={cityRoute(city.slug)}>{city.name}</a>{/each}
						</p>
					{/if}
					{#if isCity}
						<a class="hub" href={ROUTE_MESSDIENSTANBIETER}>
							Messdienst in ganz Deutschland <span class="ar">→</span>
						</a>
					{/if}
				</div>
			{/if}
		</div>
		<div
			class={[
				"bm-map",
				map.style?.legacyFrame && `legacy-${map.style.legacyFrame}`,
			]}
			style:--bz-stroke={map.style?.strokeWidth}
			style:--bz-label={map.style?.labelSize && `${map.style.labelSize}px`}
		>
			<svg viewBox={map.viewBox} role="group" aria-label={map.ariaLabel}>
				<g class="bz-g">
					{#if map.outline}<path class="bz-out" d={map.outline} />{/if}
					{#each map.districts as d (districtId(d))}
						{#if d.href}
							<a
								href={d.href}
								aria-label={d.name}
								onmouseenter={() => select(d)}
								onfocus={() => select(d)}
							>
								{@render shape(d, false)}
								<!-- Keeps the small dots tappable on phones. -->
								{#if d.shape.kind === "dot"}
									<circle
										class="hit"
										cx={d.shape.cx}
										cy={d.shape.cy}
										r={Math.max(d.shape.r * 2, 12)}
									/>
								{/if}
							</a>
						{:else}
							{@render shape(d, true)}
						{/if}
					{/each}
				</g>
				<g class="bz-l" aria-hidden="true">
					{#each map.districts as d (districtId(d))}
						{#if d.label}
							<text
								class={[d.label.small && "sm", d.shape.kind === "dot" && "dl"]}
								x={d.label.x}
								y={d.label.y}
								style:font-size={d.label.fontSize && `${d.label.fontSize}px`}
							>
								{#each d.label.lines as line, i (i)}
									<tspan x={d.label.x} dy={i ? d.label.lineHeight : 0}
										>{line}</tspan
									>
								{/each}
							</text>
						{/if}
					{/each}
				</g>
				{#if map.marker}
					<g class="bz-m" aria-hidden="true">
						<circle cx={map.marker.x} cy={map.marker.y} r="11" class="pulse" />
						<circle cx={map.marker.x} cy={map.marker.y} r="5.5" />
					</g>
				{/if}
			</svg>
			<div class="bm-legend"><i></i>{map.legend}</div>
		</div>
	</div>
</section>

<style>
	.bmap {
		padding-block: 40px 110px;
	}
	.bm-grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 48px;
		align-items: center;
	}
	.bm-copy {
		min-width: 0;
	}
	h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
	}
	.bm-sub {
		color: var(--muted);
		font-size: 18px;
		margin-top: 14px;
		max-width: 40ch;
	}
	.bm-info {
		margin-top: 28px;
		background: var(--stone);
		border-radius: 18px;
		padding: 22px 24px;
		min-height: 250px;
	}
	.bm-k {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.bm-k2 {
		margin-top: 12px;
	}
	.bm-n {
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.02em;
		margin-top: 2px;
		overflow-wrap: anywhere;
	}
	.bm-t {
		font-size: 16px;
		margin-top: 2px;
	}
	.bm-h {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid #e1e5e3;
		font-size: 15px;
		color: var(--ink);
	}
	.bm-h .okb {
		margin-top: 2px;
	}
	.bm-cta,
	.hub {
		display: inline-block;
		margin-top: 16px;
		font-weight: 600;
		color: #2f7a3c;
	}
	.ar {
		display: inline-block;
		transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bm-cta:hover .ar,
	.hub:hover .ar {
		transform: translateX(6px);
	}
	/* Internal links, an addition to the design (plan: README core requirement) */
	.bm-links {
		margin-top: 18px;
		font-size: 15px;
		color: var(--muted);
	}
	.bm-links p a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.hub {
		margin-top: 8px;
	}
	.bm-links p + .hub {
		margin-top: 6px;
	}
	.bm-map {
		position: relative;
		background: var(--stone);
		border-radius: 22px;
		padding: 24px 24px 44px;
	}
	svg {
		width: 100%;
		height: auto;
		max-height: 600px;
		display: block;
		overflow: visible;
	}
	.hit {
		fill: transparent;
	}
	.bz-out {
		fill: #e9edea;
		stroke: #fff;
		stroke-width: 2;
		pointer-events: none;
	}
	.bz {
		fill: #e3e8e5;
		stroke: #fff;
		stroke-width: var(--bz-stroke, 2);
		stroke-linejoin: round;
		cursor: pointer;
		transition: fill 0.2s;
	}
	.bz:hover,
	.bz:focus-visible {
		fill: #cfe9d1;
		outline: none;
	}
	.bz.on {
		fill: var(--accent);
	}
	.bz.dot {
		stroke-width: 3;
		fill: #cfd8d3;
	}
	.bz.dot:hover,
	.bz.dot:focus-visible,
	a:focus-visible .bz.dot {
		fill: #a9ddad;
	}
	.bz.dot.on {
		fill: var(--accent);
	}
	a:focus-visible {
		outline: none;
	}
	a:focus-visible .bz {
		stroke: var(--accent-deep);
	}
	.bz-l {
		pointer-events: none;
		font-size: var(--bz-label, 11px);
		font-weight: 600;
		fill: #4a5a55;
		text-anchor: middle;
	}
	.bz-l .sm {
		font-size: 8.5px;
	}
	.bz-m {
		pointer-events: none;
	}
	.bz-m circle {
		fill: var(--ink);
	}
	.bz-m .pulse {
		opacity: 0.25;
		transform-box: fill-box;
		transform-origin: center;
		animation: bz-pulse 2s ease-out infinite;
	}
	@keyframes bz-pulse {
		0% {
			transform: scale(0.6);
			opacity: 0.4;
		}
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	.bm-legend {
		position: absolute;
		left: 24px;
		bottom: 18px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--muted);
	}
	.bm-legend i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--ink);
	}

	.bm-map.legacy-none,
	.bm-map.legacy-narrow {
		padding-bottom: 24px;
	}
	.legacy-none svg,
	.legacy-narrow svg {
		max-height: none;
	}

	@media (max-width: 980px) {
		.bm-grid {
			grid-template-columns: 1fr;
		}
		.bm-map {
			order: -1;
		}
	}
	@media (max-width: 560px) {
		.bz-l .sm {
			display: none;
		}
		.bm-map.legacy-narrow {
			padding-bottom: 46px;
		}
	}
</style>
