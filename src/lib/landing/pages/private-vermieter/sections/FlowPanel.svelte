<!-- One of the flow's mock-ups (.pv-pan > .pv-ui): a white card with rows, a bar, monthly bars, a pressed button, a confirmation or a question and its answer. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import type { Panel } from "../content";

	let { panel, on }: { panel: Panel; on: boolean } = $props();
</script>

<div class={["pan", on && "on"]} aria-hidden={!on}>
	<div class="ui">
		{#if panel.badge}<span class="bd">{panel.badge}</span>{/if}
		<div class="uh"><b>{panel.title}</b><small>{panel.sub}</small></div>
		{#if panel.bars}
			<div class="bars" aria-hidden="true">
				{#each panel.bars as h, i (i)}
					<i class={[i === panel.bars.length - 1 && "cur"]} style:--h="{h}%"
					></i>
				{/each}
			</div>
		{/if}
		{#each panel.rows as row (row.text)}
			<div class="ur">
				{#if row.icon}
					<span class="ic"><Icon name={row.icon} /></span>
				{:else}
					<span class={["d", row.dot]}></span>
				{/if}
				{row.text}<em class={[row.value && "v"]}>{row.note}</em>
			</div>
		{/each}
		{#if panel.meter !== undefined}
			<div class="meter"><i style:--w="{panel.meter}%"></i></div>
		{/if}
		{#if panel.button}<div class="btn2">{panel.button}</div>{/if}
		{#if panel.ok}<div class="conf">{panel.ok}</div>{/if}
		{#if panel.messages}
			<div class="msg q">{panel.messages[0]}</div>
			<div class="msg a">{panel.messages[1]}</div>
		{/if}
	</div>
</div>

<style>
	.pan {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(18px, 4vw, 48px);
		opacity: 0;
		transform: translateY(18px) scale(0.98);
		transition:
			opacity 0.55s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pan.on {
		opacity: 1;
		transform: none;
	}
	.pan:nth-child(2),
	.pan:nth-child(4) {
		background: #efeeea;
	}
	.pan:nth-child(3),
	.pan:nth-child(5) {
		background: #e4efe6;
	}
	.ui {
		position: relative;
		width: min(420px, 100%);
		background: #fff;
		color: var(--ink);
		border-radius: 18px;
		padding: 20px 20px 18px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.5);
	}
	.bd {
		position: absolute;
		top: 14px;
		right: 14px;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 6px;
		padding: 2px 6px;
	}
	.uh b {
		display: block;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.uh small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.ur {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		padding: 11px 0;
		border-top: 1px solid var(--hair);
		margin-top: 12px;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.ur + .ur {
		margin-top: 0;
	}
	em {
		margin-left: auto;
		font-style: normal;
		font-size: 12.5px;
		color: var(--muted);
		white-space: nowrap;
	}
	em.v {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		font-weight: 600;
		font-size: 13.5px;
	}
	.d {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex: none;
		background: #d7dfda;
	}
	.d.ok {
		background: #3e9a57;
	}
	.d.run {
		border: 2px solid #d7dfda;
		border-top-color: #3e9a57;
		background: none;
		width: 12px;
		height: 12px;
		animation: pv-rot 0.8s linear infinite;
	}
	@keyframes pv-rot {
		to {
			transform: rotate(360deg);
		}
	}
	.ic {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: #eef1ef;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 15px;
		height: 15px;
	}
	.on .ur {
		opacity: 1;
		transform: none;
	}
	.on .ur:nth-of-type(2) {
		transition-delay: 0.12s;
	}
	.on .ur:nth-of-type(3) {
		transition-delay: 0.24s;
	}
	.on .ur:nth-of-type(4) {
		transition-delay: 0.36s;
	}
	.meter {
		height: 8px;
		border-radius: 4px;
		background: #eef1ef;
		margin-top: 10px;
		overflow: hidden;
	}
	.meter i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--ok);
		border-radius: 4px;
		transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s;
	}
	.on .meter i {
		width: var(--w);
	}
	.conf {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
		font-size: 13px;
		font-weight: 600;
		color: #2f7a3c;
		background: #eef6ef;
		border-radius: 10px;
		padding: 9px 12px;
		opacity: 0;
		transition: opacity 0.4s 0.7s;
	}
	.conf::before {
		content: "✓";
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #3e9a57;
		color: #fff;
		display: grid;
		place-items: center;
		font-size: 11px;
	}
	.on .conf {
		opacity: 1;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		height: 120px;
		margin-top: 16px;
		border-bottom: 1px solid var(--hair);
	}
	.bars i {
		flex: 1;
		height: 4%;
		background: #d7e3da;
		border-radius: 5px 5px 0 0;
		transition: height 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bars i.cur {
		background: var(--ok);
	}
	.on .bars i {
		height: var(--h);
	}
	.on .bars i:nth-child(2) {
		transition-delay: 0.06s;
	}
	.on .bars i:nth-child(3) {
		transition-delay: 0.12s;
	}
	.on .bars i:nth-child(4) {
		transition-delay: 0.18s;
	}
	.on .bars i:nth-child(5) {
		transition-delay: 0.24s;
	}
	.on .bars i:nth-child(6) {
		transition-delay: 0.3s;
	}
	.btn2 {
		margin-top: 14px;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: 14.5px;
		text-align: center;
		border-radius: 10px;
		padding: 11px;
		transform: scale(1);
		transition: transform 0.2s;
	}
	.on .btn2 {
		animation: pv-press 0.5s ease 0.6s;
	}
	@keyframes pv-press {
		50% {
			transform: scale(0.95);
		}
	}
	.msg {
		font-size: 13.5px;
		line-height: 1.4;
		border-radius: 12px;
		padding: 9px 12px;
		max-width: 86%;
		margin-top: 12px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.msg.q {
		background: #f2f3f2;
	}
	.msg.a {
		background: #e6f5e7;
		color: #245f33;
		margin-left: auto;
		transition-delay: 0.7s;
	}
	.on .msg {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.pan,
		.ur,
		.meter i,
		.conf,
		.bars i,
		.msg {
			transition: none;
		}
		.d.run,
		.on .btn2 {
			animation: none;
		}
	}
</style>
