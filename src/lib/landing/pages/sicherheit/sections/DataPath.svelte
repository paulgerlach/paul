<!--
  "Der Weg Ihrer Daten" (.sc-flow): Funkzähler → Gateway → Heidi-Server →
  three outputs, inside the dashed "Server in Deutschland" frame. Rendered
  lit; scrolled into view, it lights up step by step (plan 03 §3.4).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Icon from "../components/Icon.svelte";
	import { path } from "../content";

	/** node 0, line 0, node 1, line 1, node 2, line 2, the outputs */
	const STEPS = 7;
	const STEP_MS = 550;

	/** Steps lit so far (all on the server). */
	let lit = $state(STEPS);
	/** The step whose nodes pulse. */
	let pulse = $state(-1);

	function play() {
		const timers: ReturnType<typeof setTimeout>[] = [];
		for (let k = 0; k < STEPS; k++)
			timers.push(
				setTimeout(() => {
					lit = k + 1;
					if (k % 2 === 0) {
						pulse = k;
						timers.push(setTimeout(() => (pulse = -1), 400));
					}
				}, k * STEP_MS),
			);
		return () => timers.forEach(clearTimeout);
	}

	const node = (k: number) => [lit > k && "on", pulse === k && "pulse"];
</script>

<section class="pg-sec alt" aria-labelledby="sc-wh">
	<div class="wrap">
		<h2 class="head rv" id="sc-wh">{path.h2}</h2>
		<p class="sub rv">{path.lead}</p>
		<div
			class="flow rv"
			{@attach enterView({ prepare: () => (lit = 0), play, threshold: 0.15 })}
		>
			<div class="frame">
				<span class="label"><Icon name="lock" />{path.frame}</span>
			</div>
			<ol class="steps">
				{#each path.chain as item, i (item.title)}
					<li class={["nd", i === 2 && "core", ...node(i * 2)]}>
						<span class="ic"><Icon name={item.icon} /></span>
						<b>{item.title}</b>
						<small>{item.sub}</small>
					</li>
					<li class={["ln", lit > i * 2 + 1 && "on"]} aria-hidden="true">
						<i></i>
					</li>
				{/each}
				<li>
					<ul class="out">
						{#each path.outputs as item (item.title)}
							<li class={["nd", "sm", ...node(6)]}>
								<span class="ic"><Icon name={item.icon} /></span>
								<b>{item.title}</b>
							</li>
						{/each}
					</ul>
				</li>
			</ol>
		</div>
	</div>
</section>

<style>
	.flow {
		position: relative;
		margin: 56px auto 0;
		max-width: 1060px;
		padding: 56px 28px 32px;
	}
	.frame {
		position: absolute;
		inset: 0;
		border: 1.5px dashed #b9d9bc;
		border-radius: 22px;
		background: #fff;
	}
	.label {
		position: absolute;
		top: -14px;
		left: 28px;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--ink);
		color: #fff;
		font-size: 12.5px;
		font-weight: 500;
		border-radius: 8px;
		padding: 5px 10px;
	}
	.label :global(svg) {
		width: 13px;
		height: 13px;
		color: var(--accent);
	}
	ol,
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.steps {
		position: relative;
		display: grid;
		grid-template-columns:
			auto minmax(24px, 1fr) auto minmax(24px, 1fr) auto minmax(24px, 1fr)
			auto;
		align-items: center;
	}
	.nd {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 4px;
		opacity: 0.35;
		transition: opacity 0.5s;
	}
	.ic {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		background: #f2f4f3;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		margin-bottom: 6px;
		transition:
			background 0.4s,
			border-color 0.4s,
			transform 0.4s;
	}
	.ic :global(svg) {
		width: 22px;
		height: 22px;
	}
	.nd b {
		font-size: 14.5px;
		font-weight: 600;
	}
	.nd small {
		font-size: 12.5px;
		color: var(--muted);
	}
	.nd.on {
		opacity: 1;
	}
	.nd.on .ic {
		background: #e4efe6;
		border-color: #cfe3d3;
	}
	.core .ic {
		width: 68px;
		height: 68px;
		border-radius: 16px;
	}
	.core.on .ic {
		background: var(--ink);
		color: var(--accent);
		border-color: var(--ink);
	}
	.pulse .ic {
		transform: scale(1.08);
	}
	.ln {
		position: relative;
		height: 2px;
		background: #e6e9e7;
		margin: 0 10px 34px;
		border-radius: 2px;
		overflow: hidden;
	}
	.ln i {
		position: absolute;
		inset: 0;
		width: 0;
		background: var(--ok);
		transition: width 0.7s ease;
	}
	.ln.on i {
		width: 100%;
	}
	.out {
		display: grid;
		gap: 10px;
	}
	.out .nd {
		flex-direction: row;
		gap: 10px;
		text-align: left;
	}
	.out .ic {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		margin: 0;
	}
	.out .ic :global(svg) {
		width: 18px;
		height: 18px;
	}
	@media (max-width: 900px) {
		.flow {
			padding: 48px 20px 28px;
		}
		.steps {
			grid-template-columns: 1fr;
			justify-items: center;
		}
		.ln {
			width: 2px;
			height: 28px;
			margin: 8px 0;
		}
		.ln i {
			width: 100%;
			height: 0;
			transition: height 0.7s ease;
		}
		.ln.on i {
			height: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nd,
		.ic,
		.ln i {
			transition: none;
		}
	}
</style>
