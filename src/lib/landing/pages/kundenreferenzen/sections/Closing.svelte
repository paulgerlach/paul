<!--
  The design's dark closing card (.dm-end / .dm-cta with `.rf-ctp`): the
  heading with its line, and "Demo buchen" → /demo.
-->
<script lang="ts">
	import { closing } from "../content";
</script>

<section class="end" aria-labelledby="rf-closing-h">
	<div class="wrap">
		<div class="cta rv">
			<div>
				<h2 id="rf-closing-h">{closing.h2}</h2>
				<p>{closing.text}</p>
			</div>
			<a class="go" href={closing.cta.href}
				>{closing.cta.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>
	</div>
</section>

<style>
	.end {
		padding: 0 0 110px;
	}
	.cta {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 56px clamp(24px, 5vw, 64px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		position: relative;
		overflow: hidden;
	}
	/* `.cta h2`: beats the landing reset of heading margins. */
	.cta h2 {
		font-size: clamp(26px, 3vw, 40px);
		letter-spacing: -0.03em;
		font-weight: 500;
		max-width: 20ch;
	}
	p {
		color: rgba(255, 255, 255, 0.7);
		margin-top: 10px;
		font-size: 16px;
	}
	/* .bk-next.inv */
	.go {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--accent);
		color: var(--ink);
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.go:hover {
		background: #fff;
	}
	.go:active {
		transform: scale(0.98);
	}
	.go .ar {
		transition: transform 0.25s;
	}
	.go:hover .ar {
		transform: translateX(4px);
	}
	@media (max-width: 640px) {
		.cta {
			padding: 40px 22px;
		}
	}
</style>
