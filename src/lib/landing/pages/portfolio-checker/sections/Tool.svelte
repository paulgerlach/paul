<!--
  The hero's tool (.pc-tool, `#checker`): the drop zone around a native file
  picker, "Mit Beispielunterlagen testen", the file list with four status
  dots per file, the action row and the privacy note. Only the files' names
  and sizes are used (PortfolioCheck); nothing is read or sent. Without JS
  the example button is hidden (plan README, open question 3).
-->
<script lang="ts">
	import { CHECKER_ID, tool } from "../content";
	import { documentCount, formatSize } from "../checker";
	import { getPortfolioCheck, type CheckFile } from "../check.svelte";
	import Icon from "../components/Icon.svelte";

	const check = getPortfolioCheck();
	let over = $state(false);

	function pick(e: Event & { currentTarget: HTMLInputElement }) {
		const input = e.currentTarget;
		if (input.files?.length) check.add(input.files);
		// So the same file can be picked again.
		input.value = "";
	}

	function enter(e: DragEvent) {
		e.preventDefault();
		over = true;
	}

	function leave(e: DragEvent) {
		e.preventDefault();
		over = false;
	}

	function drop(e: DragEvent) {
		leave(e);
		if (e.dataTransfer?.files.length) check.add(e.dataTransfer.files);
	}

	/** The last finished step, for screen readers (the dots are drawn). */
	function statusText(file: CheckFile) {
		let last = 0;
		file.dots.forEach((dot, i) => {
			if (dot === "on" || dot === "wn") last = i;
		});
		return tool.status[last];
	}
</script>

<div class="tool rv" id={CHECKER_ID}>
	<label
		class={["drop", over && "ov"]}
		ondragenter={enter}
		ondragover={enter}
		ondragleave={leave}
		ondrop={drop}
	>
		<input type="file" multiple accept={tool.accept} onchange={pick} />
		<span class="dic"><Icon name="upload" /></span>
		<b>{tool.drop}</b>
		<small>{tool.or}<u>{tool.pick}</u>{tool.formats}</small>
	</label>
	<button type="button" class="ex" onclick={() => check.useExamples()}
		><Icon name="sparkle" />{tool.example}</button
	>
	<ul class="fl" aria-live="polite">
		{#each check.files as file (file.id)}
			<li class={["f", file.scanning && "scan"]}>
				<span class={["fi", file.kind === "img" && "img"]}
					>{tool.badge[file.kind]}</span
				>
				<span class="fn">
					<b>{file.name}</b>
					<small
						><span>{formatSize(file.size)}</span
						>{#each file.tags as tag (tag.text)}
							{#if tag.tone === "plain"}<span>{tag.text}</span>{:else}<em
									class={[tag.tone === "warn" && "w"]}>{tag.text}</em
								>{/if}
						{/each}</small
					>
				</span>
				<span class="fs">
					<span class="sr-only">{statusText(file)}</span>
					{#each file.dots as dot, i (i)}
						<i class={dot} title={tool.status[i]} aria-hidden="true"
							><Icon
								name={dot === "wn" ? "warning" : dot === "lk" ? "lock" : "tick"}
							/></i
						>
					{/each}
					{#if !file.example}
						<button
							type="button"
							class="x"
							aria-label="{tool.remove}: {file.name}"
							onclick={() => check.remove(file)}><Icon name="close" /></button
						>
					{/if}
				</span>
			</li>
		{/each}
	</ul>
	{#if check.files.length}
		<div class="act">
			<span>{documentCount(check.files.length)}</span>
			<button
				type="button"
				class="bk"
				disabled={check.busy}
				onclick={() => check.run()}><Icon name="search" />{tool.run}</button
			>
		</div>
	{/if}
	<p class="priv"><Icon name="lock" />{tool.privacy}</p>
</div>

<style>
	.tool {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 18px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
		scroll-margin-top: 90px;
	}
	.drop {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 6px;
		border: 1.5px dashed #c9d2ce;
		border-radius: 16px;
		padding: 30px 18px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.drop:hover,
	.drop.ov {
		border-color: var(--ok);
		background: #f5faf6;
	}
	.drop:focus-within {
		outline: 2px solid var(--accent-deep);
		outline-offset: 2px;
	}
	.drop input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}
	.dic {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		margin-bottom: 6px;
		transition: transform 0.3s;
	}
	.drop:hover .dic {
		transform: translateY(-3px);
	}
	.dic :global(svg) {
		width: 20px;
		height: 20px;
	}
	.drop b {
		font-size: 16px;
		font-weight: 600;
	}
	.drop small {
		font-size: 13px;
		color: var(--muted);
	}
	.drop u {
		color: var(--ink);
	}
	.ex {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		margin-top: 10px;
		font-size: 14px;
		font-weight: 600;
		background: #f2f4f3;
		border: 0;
		border-radius: 12px;
		padding: 11px;
		cursor: pointer;
		color: var(--ink);
		transition: background 0.2s;
	}
	.ex:hover {
		background: #e8edea;
	}
	.ex :global(svg) {
		width: 16px;
		height: 16px;
		color: var(--ok);
	}
	@media (scripting: none) {
		.ex {
			display: none;
		}
	}
	.fl {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		max-height: 430px;
		overflow: auto;
	}
	.f {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		gap: 10px;
		align-items: center;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 10px;
		animation: pcIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
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
	.fi {
		width: 34px;
		height: 40px;
		border-radius: 6px;
		background: #f6f7f6;
		border: 1px solid var(--hair);
		display: grid;
		place-items: end center;
		padding-bottom: 4px;
		font-size: 8.5px;
		font-weight: 700;
		color: #a8431a;
		position: relative;
		overflow: hidden;
	}
	.fi.img {
		color: #2f6fa8;
	}
	.fi::after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: -100%;
		height: 3px;
		background: rgba(62, 154, 87, 0.7);
		opacity: 0;
	}
	.f.scan .fi::after {
		opacity: 1;
		animation: pcScan 1.1s linear infinite;
	}
	@keyframes pcScan {
		to {
			top: 110%;
		}
	}
	.fn b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.fn small {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 8px;
		font-size: 11.5px;
		color: var(--muted);
		margin-top: 3px;
	}
	.fn em {
		font-style: normal;
		font-weight: 600;
		color: var(--ink);
		background: #eef4ef;
		border-radius: 5px;
		padding: 1px 6px;
	}
	.fn em.w {
		background: #fbf1e6;
		color: #9a5b12;
	}
	.fs {
		display: flex;
		gap: 3px;
	}
	.fs i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 1.5px solid #d5dcd9;
		display: grid;
		place-items: center;
		transition: all 0.3s;
	}
	.fs i :global(svg) {
		width: 11px;
		height: 11px;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.fs i.on {
		background: #2f7a3c;
		border-color: #2f7a3c;
		color: #fff;
	}
	.fs i.on :global(svg),
	.fs i.wn :global(svg),
	.fs i.lk :global(svg) {
		opacity: 1;
	}
	.fs i.run {
		border-color: var(--ok);
		border-top-color: transparent;
		animation: pcSpin 0.8s linear infinite;
	}
	.fs i.wn {
		background: #f5b342;
		border-color: #f5b342;
		color: #fff;
	}
	.fs i.lk {
		background: #f2f4f3;
		border-color: #f2f4f3;
		color: var(--muted);
	}
	@keyframes pcSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.x {
		border: 0;
		background: none;
		padding: 2px;
		cursor: pointer;
		color: var(--faint);
		display: grid;
		place-items: center;
	}
	.x :global(svg) {
		width: 13px;
		height: 13px;
	}
	.act {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 12px;
	}
	.act span {
		font-size: 13px;
		color: var(--muted);
		white-space: nowrap;
	}
	/* .bk-next, auto width in the row (its 18 px top margin stays) */
	.bk {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 18px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s,
			opacity 0.2s;
	}
	.bk:hover:not(:disabled) {
		background: #2a443d;
	}
	.bk:active:not(:disabled) {
		transform: scale(0.98);
	}
	.bk:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.bk :global(svg) {
		width: 17px;
		height: 17px;
	}
	.priv {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		color: var(--faint);
		margin-top: 12px;
	}
	.priv :global(svg) {
		width: 13px;
		height: 13px;
	}
	@media (max-width: 560px) {
		.tool {
			padding: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.f {
			animation: none;
		}
		.f.scan .fi::after,
		.fs i.run {
			animation: none;
		}
	}
</style>
