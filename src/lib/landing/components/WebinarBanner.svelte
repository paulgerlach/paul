<!--
  The webinar banner above every page (data in `$lib/landing/webinar.ts`).
  It lives in the `(base)` layout, which stays mounted across client-side
  navigations, so a closed banner stays closed until the next full load.
  Nothing is stored. It sits outside `.lp` on the (site) pages too, so it
  sets its own font on every element (app.css gives `*` Exo 2).
-->
<script lang="ts">
	import speakers from "$lib/assets/landing/webinar/speakers.webp";
	import vdiv from "$lib/assets/landing/webinar/vdiv-white.png";
	import { WEBINAR } from "$lib/landing/webinar";

	let closed = $state(false);
</script>

{#if !closed}
	<aside class="wb" aria-label={WEBINAR.label}>
		<div class="wb-in">
			<div class="wb-text">
				<p class="wb-meta">
					<span class="wb-pill">{WEBINAR.label}</span>
					<span class="wb-when">{WEBINAR.when}</span>
				</p>
				<p class="wb-title">
					{WEBINAR.title}
					<span class="wb-hl">{WEBINAR.highlight}</span>
				</p>
			</div>
			<div class="wb-card">
				<img
					class="wb-faces"
					src={speakers}
					alt=""
					width="68"
					height="46"
					loading="lazy"
				/>
				<p class="wb-who">
					<span>u. a. mit <b>{WEBINAR.speaker}</b></span>
					<span class="wb-role">{WEBINAR.speakerRole}</span>
				</p>
				<img
					class="wb-logo"
					src={vdiv}
					alt="VDIV"
					width="50"
					height="28"
					loading="lazy"
				/>
			</div>
			<a
				class="wb-cta"
				href={WEBINAR.href}
				target="_blank"
				rel="noopener noreferrer">{WEBINAR.cta}</a
			>
			<button
				class="wb-x"
				type="button"
				aria-label="Hinweis schließen"
				onclick={() => (closed = true)}
			>
				<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<path
						d="M3 3l10 10M13 3L3 13"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	</aside>
{/if}

<style>
	.wb {
		--wb-accent: #8ad68f;
		--wb-card: #32443f;
		position: relative;
		/* Ends at the bottom in the header bar's --ink (#1e322d) below it. */
		background: linear-gradient(to top, #1e322d, #355440);
		color: #fff;
		-webkit-font-smoothing: antialiased;
	}
	.wb,
	.wb :global(*) {
		font-family:
			"Geist",
			ui-sans-serif,
			system-ui,
			-apple-system,
			"Segoe UI",
			Helvetica,
			Arial,
			sans-serif;
	}
	.wb p {
		margin: 0;
	}

	.wb-in {
		max-width: 1200px;
		margin: 0 auto;
		padding: 10px 56px 10px 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		min-height: 74px;
	}

	.wb-text {
		flex: 1;
		min-width: 0;
		display: grid;
		gap: 4px;
	}
	.wb-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px 10px;
		font-size: 13px;
		line-height: 1.3;
		color: #dde7e3;
	}
	.wb-pill {
		background: var(--wb-accent);
		color: #1e322d;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 5px;
	}
	.wb-title {
		font-size: 15.5px;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.005em;
	}
	.wb-hl {
		color: var(--wb-accent);
		font-weight: 500;
	}

	.wb-card {
		flex: none;
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 6px 16px 6px 6px;
		background: var(--wb-card);
		border: 1px solid #598662;
		border-radius: 8px;
	}
	.wb-faces {
		display: block;
		width: 68px;
		height: 46px;
	}
	.wb-who {
		display: grid;
		font-size: 13px;
		line-height: 1.35;
		color: #dde7e3;
	}
	.wb-who b {
		color: #fff;
		font-weight: 600;
		font-size: 14px;
	}
	.wb-logo {
		display: block;
		width: 50px;
		height: 28px;
	}

	.wb-cta {
		flex: none;
		background: var(--wb-accent);
		color: #1e322d;
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
		padding: 11px 22px;
		border-radius: 6px;
		transition: background 0.15s;
	}
	.wb-cta:hover {
		background: #a3e2a7;
	}
	.wb-cta:focus-visible,
	.wb-x:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}

	.wb-x {
		position: absolute;
		right: 12px;
		top: 50%;
		translate: 0 -50%;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 0;
		border-radius: 6px;
		background: none;
		color: #dde7e3;
		cursor: pointer;
	}
	.wb-x:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.08);
	}

	@media (max-width: 1100px) {
		.wb-card {
			display: none;
		}
	}
	@media (max-width: 700px) {
		.wb-in {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			padding: 12px 52px 14px 16px;
		}
		.wb-x {
			top: 8px;
			translate: none;
		}
		.wb-title {
			font-size: 14.5px;
		}
		.wb-cta {
			padding: 9px 18px;
			font-size: 14px;
		}
	}
</style>
