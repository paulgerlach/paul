<!--
  "Preise anfragen" (#anfrage): the three steps beside the three ways to an
  offer (Self-Service, /kontakt, /demo) and the sales mailbox, which the
  design shows as text to select, not as a link.
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { REQUEST_ID, request, SALES_MAIL } from "../content";
</script>

<section class="pg-sec" id={REQUEST_ID} aria-labelledby="pr-rh">
	<div class="wrap">
		<div class="ask rv">
			<div>
				<span class="pill rv"><Icon name="mail" />{request.pill}</span>
				<h2 class="h2" id="pr-rh">
					{request.h2}<br /><span>{request.h2Accent}</span>
				</h2>
				<p class="p">{request.text}</p>
				<ol class="steps">
					{#each request.steps as step, i (step.title)}
						<li>
							<span class="n" aria-hidden="true">{i + 1}</span><span
								><b>{step.title}</b>{step.text}</span
							>
						</li>
					{/each}
				</ol>
			</div>
			<div class="acts">
				{#each request.actions as action (action.title)}
					<a class="act" href={action.href}
						><span class="mi"><Icon name={action.icon} /></span><span
							><b>{action.title}</b><small>{action.text}</small></span
						><span class="ar" aria-hidden="true">→</span></a
					>
				{/each}
				<p class="mail">{request.mail}<b>{SALES_MAIL}</b></p>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 80px;
	}
	.ask {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
		gap: 56px;
		align-items: start;
	}
	.p {
		font-size: 16px;
		color: var(--muted);
		line-height: 1.6;
		margin: 16px 0 0;
		max-width: 56ch;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 26px 0 0;
		display: grid;
		gap: 18px;
		max-width: 520px;
	}
	.steps li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		font-size: 15px;
		color: var(--muted);
		line-height: 1.45;
	}
	.n {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 600;
		flex: none;
	}
	.steps b {
		display: block;
		color: var(--ink);
		font-size: 16px;
		font-weight: 600;
	}
	.acts {
		display: grid;
		gap: 12px;
	}
	.act {
		display: flex;
		align-items: center;
		gap: 14px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 18px;
		color: var(--ink);
		text-decoration: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.act:hover {
		border-color: #c6e6c8;
		box-shadow: 0 18px 36px -28px rgba(30, 50, 45, 0.45);
	}
	.act > span:nth-child(2) {
		flex: 1;
		min-width: 0;
	}
	.act b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.act small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
	}
	.act .ar {
		color: #2f7a3c;
		font-weight: 600;
	}
	.mi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--bg);
		display: grid;
		place-items: center;
		flex: none;
	}
	.mi :global(svg) {
		width: 20px;
		height: 20px;
	}
	/* The first way is the dark one. */
	.act:first-child {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.act:first-child small {
		color: rgba(255, 255, 255, 0.7);
	}
	.act:first-child .ar {
		color: #8ad68f;
	}
	.act:first-child .mi {
		background: rgba(255, 255, 255, 0.1);
	}
	.act:first-child .mi :global(svg) {
		color: #8ad68f;
	}
	.mail {
		margin: 6px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.mail b {
		color: var(--ink);
		user-select: all;
	}
	@media (max-width: 1040px) {
		.ask {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
</style>
