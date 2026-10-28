<!--
  "Sie entscheiden, wie viel Heidi übernimmt.": the Selbstabrechnung /
  Vollservice toggle and the two task columns. A task that changes column
  slides in; the others stay put. The lists fade up once on first view (not
  without JS or with reduced motion).
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import {
		type Mode,
		taskSplit,
		tasks,
		tasksText,
		type TaskKey,
	} from "../content";

	let mode = $state<Mode>("self");
	/** The mode before the last change, to tell which tasks moved. */
	let from = $state<Mode>("self");
	let armed = $state(false);
	let shown = $state(false);

	const options = (Object.keys(taskSplit.modes) as Mode[]).map((value) => ({
		value,
		label: taskSplit.modes[value].label,
	}));

	const columns = $derived(
		(["heidi", "you"] as const).map((side) => {
			const before = taskSplit.modes[from][side];
			return {
				side,
				keys: taskSplit.modes[mode][side],
				moved: (key: TaskKey) => mode !== from && !before.includes(key),
			};
		}),
	);

	const sub = (key: TaskKey) =>
		mode === "full" ? (tasks[key].subFull ?? tasks[key].sub) : tasks[key].sub;
</script>

<section class="sec" aria-labelledby="who-h">
	<div class="wrap">
		<div class="top">
			<div class="head">
				<SectionHead id="who-h" eyebrow={taskSplit.pill} heading={taskSplit.h2}>
					{#snippet icon()}
						<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
					{/snippet}
				</SectionHead>
			</div>
			<div class="rv">
				<Segmented
					{options}
					bind:value={
						() => mode,
						(v) => {
							from = mode;
							mode = v;
						}
					}
					label={taskSplit.modeLabel}
				/>
			</div>
		</div>
		<div
			class={["who rv", armed && "armed", shown && "in"]}
			{@attach (el) => {
				armed = !prefersReducedMotion();
				return inView({
					threshold: 0.15,
					once: true,
					onEnter: () => (shown = true),
				})(el);
			}}
		>
			{#each columns as col (col.side)}
				<div class={["col", col.side]}>
					<div class="ch">
						<span class="av">
							{#if col.side === "heidi"}<HeidiMark />{:else}<Icon
									name="user"
								/>{/if}
						</span>
						<b>{taskSplit[col.side]}</b>
						<small>{tasksText(col.keys.length)}</small>
					</div>
					<ul>
						{#each col.keys as key, i (key)}
							<li class={[col.moved(key) && "moved"]} style:--i={i}>
								<span class="ic"><Icon name={tasks[key].icon} /></span>
								<span><b>{tasks[key].title}</b><small>{sub(key)}</small></span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		<p class="note rv" aria-live="polite">{taskSplit.modes[mode].note}</p>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		flex-wrap: wrap;
	}
	.head {
		max-width: 760px;
	}
	.who {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 44px;
	}
	.col {
		border-radius: 20px;
		padding: 24px;
		border: 1px solid var(--hair);
		min-height: 100%;
	}
	.col.heidi {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.col.you {
		background: var(--bg);
	}
	.ch {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--hair);
	}
	.heidi .ch {
		border-color: rgba(255, 255, 255, 0.12);
	}
	.ch b {
		font-size: 18px;
		font-weight: 600;
	}
	.ch small {
		margin-left: auto;
		font-size: 13px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.heidi .ch small {
		color: rgba(255, 255, 255, 0.6);
	}
	.av {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	.av :global(svg) {
		width: 16px;
		height: 14px;
	}
	.you .av {
		background: #fff;
		border: 1px solid var(--hair);
		color: var(--ink);
	}
	.you .av :global(svg) {
		width: 17px;
		height: 17px;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 8px 0 0;
	}
	li {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 13px 4px;
		border-bottom: 1px solid var(--hair);
	}
	.heidi li {
		border-color: rgba(255, 255, 255, 0.1);
	}
	li:last-child {
		border-bottom: 0;
	}
	.ic {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		background: #fff;
		border: 1px solid var(--hair);
	}
	.heidi .ic {
		background: rgba(138, 214, 143, 0.14);
		border-color: transparent;
		color: var(--accent);
	}
	.ic :global(svg) {
		width: 16px;
		height: 16px;
	}
	li b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	li small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
		line-height: 1.45;
	}
	.heidi li small {
		color: rgba(255, 255, 255, 0.65);
	}
	.armed:not(.in) li {
		opacity: 0;
	}
	.armed.in li {
		animation: task-in 0.45s calc(var(--i) * 50ms)
			cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.armed.in li.moved {
		animation: task-move 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes task-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	@keyframes task-move {
		0% {
			opacity: 0;
			transform: translateX(-24px) scale(0.98);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.note {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}

	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.who {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
