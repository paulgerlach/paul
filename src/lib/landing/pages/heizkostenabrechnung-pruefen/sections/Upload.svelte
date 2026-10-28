<!--
  The upload pane (#mc-up): the drop zone (a label around the file input,
  compact once there are files), the thumbnails, the guided flow, the
  privacy note, the message and "Beispiel ansehen" (whose file card flies
  into the drop zone first, .mc-fly). Only the files' names and local
  previews are used; nothing is read or sent.
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { getBillCheck } from "../check.svelte";
	import { card } from "../content";
	import Wizard from "./Wizard.svelte";

	const check = getBillCheck();
	const t = card.upload;
	const file = t.exampleFile;

	let over = $state(false);

	function onchange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		if (input.files) check.add(input.files);
		input.value = "";
	}

	function ondrop(event: DragEvent) {
		event.preventDefault();
		over = false;
		if (event.dataTransfer?.files) check.add(event.dataTransfer.files);
	}

	function ondragover(event: DragEvent) {
		event.preventDefault();
		over = true;
	}
</script>

<div class={["up", check.flowOpen && "has"]}>
	<label
		class={[
			"drop",
			over && "over",
			check.exampleFile && "ex",
			check.exampleFile === "got" && "got",
		]}
		ondragenter={ondragover}
		{ondragover}
		ondragleave={() => (over = false)}
		{ondrop}
	>
		<input type="file" accept={t.accept} multiple {onchange} />
		<span class="dic"><Icon name="upload" /></span>
		<b>{check.flowOpen ? t.more : t.drop}</b>
		<small>{t.or}<u>{t.pick}</u>{t.formats}</small>
		{#if check.exampleFile}
			<span class="fly" aria-hidden="true"
				><span class="fi"
					><svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linejoin="round"
						><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></svg
					><em>{file.type}</em></span
				><span class="fn"
					><b>{file.name}</b><small
						>{check.exampleFile === "got"
							? file.uploaded
							: file.uploading}</small
					><i><u></u></i></span
				></span
			>
		{/if}
	</label>
	{#if check.files.length}
		<div class="thumbs">
			{#each check.files as file (file.id)}
				<figure>
					{#if file.url}
						<img src={file.url} alt="" />
					{:else}
						<span class="pdf">{t.pdf}</span>
					{/if}
					<button
						type="button"
						aria-label="{t.remove}: {file.name}"
						onclick={() => check.remove(file.id)}>×</button
					>
					<figcaption>{file.name}</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
	{#if check.flowOpen}
		<Wizard />
	{/if}
	<p class="priv"><Icon name="lock" />{t.privacy}</p>
	{#if check.message}
		<p class="note" role="alert">{check.message}</p>
	{/if}
	<button type="button" class="demo" onclick={() => check.example()}
		>{t.example}</button
	>
</div>

<style>
	.drop {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 4px;
		border: 1.5px dashed #c9d2ce;
		border-radius: 16px;
		background: #fafbfa;
		padding: 26px 16px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s,
			padding 0.35s ease;
	}
	.drop:hover,
	.drop.over {
		border-color: var(--accent-deep, #5db864);
		background: #f2faf3;
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
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		margin-bottom: 8px;
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
	/* The example's file card (.mc-drop.demo, .mc-fly) */
	.drop.ex {
		border-color: var(--accent-deep, #5db864);
		background: #f2faf3;
	}
	.drop.ex > :is(.dic, b, small) {
		opacity: 0;
		transition: opacity 0.25s;
	}
	.fly {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(370px, 92%);
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 12px 14px;
		box-shadow: 0 22px 40px -24px rgba(30, 50, 45, 0.55);
		transform: translate(-50%, -190%) rotate(-6deg);
		opacity: 0;
		pointer-events: none;
		text-align: left;
		animation: fly 0.9s cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
	}
	@keyframes fly {
		0% {
			transform: translate(-50%, -190%) rotate(-6deg);
			opacity: 0;
		}
		60% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) rotate(0);
			opacity: 1;
		}
	}
	.fi {
		position: relative;
		width: 38px;
		height: 46px;
		border-radius: 8px;
		background: #f2f6f3;
		display: grid;
		place-items: center;
		flex: none;
		color: var(--ink);
	}
	.fi svg {
		width: 24px;
		height: 24px;
	}
	.fi em {
		position: absolute;
		bottom: -5px;
		right: -6px;
		font-style: normal;
		font-size: 9px;
		font-weight: 700;
		background: #d9622b;
		color: #fff;
		border-radius: 5px;
		padding: 1px 4px;
	}
	.fn {
		display: grid;
		gap: 3px;
		min-width: 0;
		flex: 1;
	}
	.fn b {
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.fn small {
		font-size: 12px;
		color: var(--muted);
	}
	.fn i {
		display: block;
		height: 4px;
		border-radius: 2px;
		background: #edf1ee;
		overflow: hidden;
	}
	.fn u {
		display: block;
		height: 100%;
		width: 0;
		background: #8ad68f;
		border-radius: 2px;
		animation: up 0.7s 0.75s ease-out forwards;
	}
	@keyframes up {
		to {
			width: 100%;
		}
	}
	.got .fn small {
		color: #2f7a3c;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		.fly {
			animation: none;
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}
	/* #mc-up.has */
	.has .drop {
		padding-block: 14px;
		flex-direction: row;
		gap: 12px;
	}
	.has .drop b {
		font-size: 14px;
	}
	.has .drop small {
		display: none;
	}
	.has .dic {
		width: 32px;
		height: 32px;
		border-radius: 9px;
	}
	.thumbs {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 12px;
	}
	figure {
		position: relative;
		margin: 0;
		width: 62px;
		height: 80px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--hair);
		background: var(--bg);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.pdf {
		display: grid;
		place-items: center;
		height: 100%;
		font-size: 12px;
		font-weight: 700;
		color: #b5471a;
	}
	figcaption {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 10px;
		background: rgba(30, 50, 45, 0.8);
		color: #fff;
		padding: 2px 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	figure button {
		position: absolute;
		right: 3px;
		top: 3px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 0;
		background: #fff;
		font-size: 12px;
		line-height: 1;
		padding: 1px 6px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}
	.priv {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 12px;
		line-height: 1.45;
	}
	.priv :global(svg) {
		width: 14px;
		height: 14px;
		flex: none;
		margin-top: 2px;
	}
	.note {
		font-size: 13px;
		line-height: 1.45;
		background: #fff4e5;
		color: #7a4a00;
		border-radius: 10px;
		padding: 10px 12px;
		margin-top: 12px;
	}
	.demo {
		display: block;
		margin: 12px auto 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
		cursor: pointer;
		/* The browser's button padding (Tailwind's preflight zeroes it). */
		padding: 1px 6px;
	}
</style>
