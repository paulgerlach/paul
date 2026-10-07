<!-- The five steps from the portfolio check to "Fernablesbar". -->
<script lang="ts">
	import { timeWindow } from "../content";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();
</script>

<ol class="steps">
	{#each timeWindow.steps as step, i (step.title)}
		{@const expired = clock.expired && step.timingExpired}
		<li class="rv">
			<span class="sn">{i + 1}</span>
			<h3>{step.title}</h3>
			<p>{step.text}</p>
			<em data-placeholder={expired ? "" : undefined}
				>{expired ? step.timingExpired : step.timing}</em
			>
		</li>
	{/each}
	<li class="rv fin">
		<span class="sn"
			><svg viewBox="0 0 12 10" width="10" aria-hidden="true"
				><path
					d="M1 5l3.5 3.5L11 1"
					stroke="#1E322D"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			></span
		>
		<h3>{timeWindow.final.title}</h3>
		<p>{timeWindow.final.text}</p>
		<em>{timeWindow.final.timing}</em>
	</li>
</ol>

<style>
	.steps {
		list-style: none;
		padding: 0;
		margin: 64px 0 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 14px;
	}
	li {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 22px 20px;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	li:not(:last-child)::after {
		content: "";
		position: absolute;
		right: -12px;
		top: 38px;
		width: 10px;
		height: 2px;
		background: #c9d3ce;
	}
	.sn {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: var(--bg);
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 14.5px;
	}
	li.fin {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	li.fin .sn {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--ink);
	}
	li.fin .sn svg {
		width: 12px;
	}
	h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 18px;
		letter-spacing: -0.01em;
	}
	p {
		font-size: 14px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
		flex: 1;
	}
	li.fin p {
		color: rgba(255, 255, 255, 0.7);
	}
	em {
		font-style: normal;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ok);
		margin-top: 16px;
	}
	li.fin em {
		color: var(--accent);
	}
	@media (max-width: 1040px) {
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		li::after {
			display: none;
		}
		li.fin {
			grid-column: span 2;
		}
	}
	@media (max-width: 640px) {
		.steps {
			grid-template-columns: minmax(0, 1fr);
		}
		li.fin {
			grid-column: auto;
		}
	}
</style>
