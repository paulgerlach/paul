<!-- "So läuft der Wechsel" (.sg-steps): four numbered steps on a line. The server renders every step lit and the line full. -->
<script lang="ts">
	import Head from "./Head.svelte";
	import type { Steps } from "./types";

	let { steps }: { steps: Steps } = $props();
</script>

<section class="pg-sec alt" aria-labelledby="sg-s-h">
	<div class="wrap">
		<Head id="sg-s-h" pill={steps.pill} heading={steps.h2} center />
		<div class="steps-w rv">
			<ol class="steps">
				{#each steps.items as step, i (step.title)}
					<li class="on done">
						<span>{i + 1}</span><b>{step.title}</b><small>{step.text}</small>
					</li>
				{/each}
			</ol>
			<i class="sbar" aria-hidden="true"><i style:width="100%"></i></i>
		</div>
	</div>
</section>

<style>
	.steps-w {
		position: relative;
		margin: 56px 0 0;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	li {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0 6px;
	}
	li > span {
		position: relative;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--hair);
		color: var(--ink);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 17px;
		transition:
			background 0.45s,
			border-color 0.45s,
			color 0.45s,
			transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1),
			box-shadow 0.45s;
	}
	li.on > span {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--accent);
		transform: scale(1.08);
	}
	li.done > span {
		transform: none;
	}
	li > span::after {
		content: "";
		position: absolute;
		inset: -2px;
		border-radius: 50%;
		border: 2px solid var(--accent);
		opacity: 0;
	}
	li:global(.ping) > span::after {
		animation: sg-ping 1s ease-out;
	}
	@keyframes sg-ping {
		0% {
			opacity: 0.9;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.7);
		}
	}
	b {
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
	}
	small {
		font-size: 14px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.5;
		max-width: 26ch;
	}
	b,
	small {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.55s,
			transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	small {
		transition-delay: 0.12s;
	}
	li.on b,
	li.on small {
		opacity: 1;
		transform: none;
	}
	/* The line between the first and the last circle. */
	.sbar {
		position: absolute;
		left: 12.5%;
		right: 12.5%;
		top: 23px;
		height: 2px;
		background: #dde3e0;
	}
	.sbar > i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--accent-deep, #5db864);
		transition: width 0.8s cubic-bezier(0.45, 0, 0.2, 1);
	}
	@media (max-width: 640px) {
		.steps {
			grid-template-columns: minmax(0, 1fr);
			gap: 22px;
		}
		li {
			display: grid;
			grid-template-columns: 48px 1fr;
			text-align: left;
			align-items: center;
			gap: 2px 14px;
		}
		li > span {
			grid-row: span 2;
		}
		b {
			margin-top: 0;
		}
		.sbar {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		li > span,
		b,
		small,
		.sbar > i {
			transition: none;
		}
	}
</style>
