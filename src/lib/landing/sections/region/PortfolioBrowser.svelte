<!--
  Browser frame with the portfolio dashboard. Tabs switch the property: the
  meter counts tween, the split bar follows and the table shows that
  property's events. Hovering a count or its bar segment highlights the pair.
  Only the addresses differ between the designs.
-->
<script lang="ts">
	import { tweenNumber } from "$lib/landing/motion";

	let {
		name,
		address,
		secondAddress,
	}: { name: string; address: string; secondAddress: string } = $props();

	type Icon = "doc" | "cal" | "chart" | "mail";
	type Row = {
		date: string;
		icon: Icon;
		title: string;
		sub: string;
		status: string;
		ok: boolean;
	};
	type Tab = {
		key: "all" | "a" | "b";
		label: string;
		f: number;
		b: number;
		rows: Row[];
	};

	const tabs: Tab[] = $derived([
		{
			key: "all",
			label: "Alle",
			f: 612,
			b: 1284,
			rows: [
				{
					date: "02.10.26",
					icon: "doc",
					title: "Heizkostenabrechnung 2025",
					sub: `${address} · 24 Einheiten`,
					status: "Erstellt",
					ok: true,
				},
				{
					date: "14.10.26",
					icon: "cal",
					title: "Montage Funkzähler",
					sub: `${secondAddress} · 18 Einheiten`,
					status: "Geplant",
					ok: false,
				},
			],
		},
		{
			key: "a",
			label: address,
			f: 0,
			b: 96,
			rows: [
				{
					date: "02.10.26",
					icon: "doc",
					title: "Heizkostenabrechnung 2025",
					sub: "24 Einheiten · an Ihre Software übergeben",
					status: "Erstellt",
					ok: true,
				},
				{
					date: "01.10.26",
					icon: "chart",
					title: "uVI September",
					sub: "an 24 Mietparteien",
					status: "Versendet",
					ok: true,
				},
			],
		},
		{
			key: "b",
			label: secondAddress,
			f: 72,
			b: 0,
			rows: [
				{
					date: "14.10.26",
					icon: "cal",
					title: "Montage Funkzähler",
					sub: "18 Einheiten · 8–14 Uhr",
					status: "Geplant",
					ok: false,
				},
				{
					date: "30.09.26",
					icon: "mail",
					title: "Mieterinformation",
					sub: "14 Tage vor der Montage",
					status: "Versendet",
					ok: true,
				},
			],
		},
	]);

	let active = $state(0);
	/** Set after the first switch, so the rows only animate on a change. */
	let switched = $state(false);
	let hover = $state<"f" | "b" | null>(null);
	let f = $state(612);
	let b = $state(1284);
	const tab = $derived(tabs[active]);
	const de = new Intl.NumberFormat("de-DE");

	let cancel: (() => void)[] = [];
	function select(i: number) {
		if (i === active) return;
		active = i;
		switched = true;
		cancel.forEach((c) => c());
		const t = tabs[i];
		cancel = [
			tweenNumber(f, t.f, 450, (v) => (f = v)),
			tweenNumber(b, t.b, 450, (v) => (b = v)),
		];
	}

	let buttons: HTMLButtonElement[] = $state([]);
	function onkeydown(event: KeyboardEvent) {
		const n = tabs.length;
		const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		const to =
			event.key === "Home"
				? 0
				: event.key === "End"
					? n - 1
					: step === undefined
						? -1
						: (active + step + n) % n;
		if (to < 0) return;
		event.preventDefault();
		select(to);
		buttons[to]?.focus();
	}

	$effect(() => () => cancel.forEach((c) => c()));
</script>

{#snippet icon(kind: Icon)}
	<svg
		viewBox="0 0 16 16"
		fill="none"
		stroke="#1E322D"
		stroke-width="1.4"
		aria-hidden="true"
	>
		{#if kind === "doc"}
			<rect x="2.5" y="1.5" width="11" height="13" rx="1.5" /><path
				d="M5 5.5h6M5 8h6M5 10.5h4"
			/>
		{:else if kind === "cal"}
			<rect x="1.5" y="2.5" width="13" height="12" rx="1.5" /><path
				d="M1.5 6.5h13M5 1v3M11 1v3"
			/>
		{:else if kind === "chart"}
			<path d="M3 13V8M8 13V3M13 13V6" />
		{:else}
			<rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path
				d="M2 4l6 5 6-5"
			/>
		{/if}
	</svg>
{/snippet}

<div class={["bw", hover === "f" && "hf", hover === "b" && "hb"]}>
	<div class="bw-bar" aria-hidden="true"><i></i><i></i><i></i></div>
	<div class="bw-in">
		<div class="bw-head">
			<div class="bw-t">Portfolio {name}</div>
			<div class="bw-tabs" role="tablist" aria-label="Liegenschaft wählen">
				{#each tabs as t, i (t.key)}
					<button
						type="button"
						role="tab"
						aria-selected={i === active}
						aria-controls="bw-panel"
						tabindex={i === active ? 0 : -1}
						class={[i === active && "on"]}
						bind:this={buttons[i]}
						onclick={() => select(i)}
						{onkeydown}>{t.label}</button
					>
				{/each}
			</div>
		</div>
		<div id="bw-panel" role="tabpanel" aria-label={tab.label}>
			<div class="bw-kp">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="bw-k f"
					onmouseenter={() => (hover = "f")}
					onmouseleave={() => (hover = null)}
				>
					<small>Heidi-Funkzähler</small>
					<b
						><i style:background="var(--accent)"></i><span
							>{de.format(Math.round(f))}</span
						></b
					>
				</div>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="bw-k b"
					onmouseenter={() => (hover = "b")}
					onmouseleave={() => (hover = null)}
				>
					<small>Übernommene Bestandszähler</small>
					<b
						><i style:background="var(--ink)"></i><span
							>{de.format(Math.round(b))}</span
						></b
					>
				</div>
			</div>
			<div class="bw-split" aria-hidden="true">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span
					class="sf"
					style:flex-grow={tab.f}
					style:background="var(--accent)"
					onmouseenter={() => (hover = "f")}
					onmouseleave={() => (hover = null)}
				></span>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span
					class="sb"
					style:flex-grow={tab.b}
					style:background="var(--ink)"
					onmouseenter={() => (hover = "b")}
					onmouseleave={() => (hover = null)}
				></span>
			</div>
			<table class="bw-tbl">
				<colgroup
					><col style:width="86px" /><col /><col
						style:width="110px"
					/></colgroup
				>
				<thead><tr><th>Datum</th><th>Vorgang</th><th>Status</th></tr></thead>
				{#key active}
					<tbody class={[switched && "in"]}>
						{#each tab.rows as row (row.date + row.title)}
							<tr>
								<td>{row.date}</td>
								<td>
									<div class="bw-ic">
										{@render icon(row.icon)}
										<div>{row.title}<small>{row.sub}</small></div>
									</div>
								</td>
								<td
									><span class={["bw-st", row.ok && "ok"]}>{row.status}</span
									></td
								>
							</tr>
						{/each}
					</tbody>
				{/key}
			</table>
		</div>
	</div>
</div>

<style>
	.bw {
		position: absolute;
		left: 52px;
		right: -28px;
		bottom: -30px;
		height: 380px;
		background: #fff;
		border: 1px solid #e2e4e1;
		border-radius: 12px 0 0 0;
		box-shadow: 0 30px 60px -30px rgba(30, 50, 45, 0.18);
		overflow: hidden;
	}
	.bw-bar {
		height: 26px;
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 0 12px;
		border-bottom: 1px solid #eeefed;
		background: #fafaf9;
	}
	.bw-bar i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #dcdedb;
	}
	.bw-in {
		padding: 26px 0 0 34px;
	}
	.bw-head {
		display: flex;
		align-items: center;
		gap: 18px;
		padding-right: 34px;
	}
	.bw-t {
		font-size: 20px;
		letter-spacing: -0.015em;
		font-weight: 500;
	}
	.bw-tabs {
		display: flex;
		gap: 4px;
		background: #f3f4f2;
		border-radius: 8px;
		padding: 3px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.bw-tabs::-webkit-scrollbar {
		display: none;
	}
	.bw-tabs button {
		border: 0;
		background: none;
		font: inherit;
		font-size: 12px;
		color: var(--muted);
		padding: 5px 10px;
		border-radius: 6px;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background 0.2s,
			color 0.2s,
			box-shadow 0.2s;
	}
	.bw-tabs button:hover {
		color: var(--ink);
	}
	.bw-tabs button.on {
		background: #fff;
		color: var(--ink);
		font-weight: 500;
		box-shadow: 0 1px 3px rgba(30, 50, 45, 0.15);
	}
	.bw-kp {
		display: flex;
		gap: 44px;
		margin-top: 20px;
	}
	.bw-k {
		transition: opacity 0.25s;
		cursor: default;
	}
	.bw-k small {
		display: block;
		color: var(--muted);
		font-size: 12px;
	}
	.bw-k b {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 500;
		font-size: 19px;
		margin-top: 4px;
		font-variant-numeric: tabular-nums;
	}
	.bw-k b i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.bw-split {
		display: flex;
		gap: 4px;
		margin-top: 26px;
		height: 14px;
	}
	.bw-split span {
		border-radius: 3px;
		min-width: 0;
		cursor: default;
		transition:
			flex-grow 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.25s;
	}
	.hf .bw-k.b,
	.hb .bw-k.f {
		opacity: 0.35;
	}
	.hf .sb,
	.hb .sf {
		opacity: 0.3;
	}
	.bw-tbl {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		margin-top: 28px;
		font-size: 12.5px;
	}
	.bw-tbl th {
		text-align: left;
		font-weight: 500;
		color: var(--muted);
		font-size: 11px;
		padding: 8px 10px;
		border-top: 1px solid #eeefed;
		border-bottom: 1px solid #eeefed;
	}
	.bw-tbl td {
		padding: 12px 10px;
		border-bottom: 1px solid #f1f2f0;
		vertical-align: middle;
	}
	.bw-tbl th + th,
	.bw-tbl td + td {
		border-left: 1px solid #eeefed;
	}
	.bw-tbl td small {
		display: block;
		color: var(--muted);
		font-size: 11px;
		margin-top: 2px;
	}
	.bw-tbl tbody tr {
		transition: background 0.15s;
	}
	.bw-tbl tbody tr:hover {
		background: #f7f9f7;
	}
	.bw-tbl tbody.in tr {
		animation: k-in 0.35s both;
	}
	.bw-tbl tbody.in tr:nth-child(2) {
		animation-delay: 0.06s;
	}
	@keyframes k-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.bw-st {
		display: inline-block;
		border: 1px solid #cfd5d2;
		border-radius: 4px;
		padding: 2px 7px;
		font-size: 11px;
		white-space: nowrap;
	}
	.bw-st.ok {
		border-color: #bfe3c2;
		background: #f3faf3;
		color: #2f7a3c;
	}
	.bw-ic {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.bw-ic :global(svg) {
		width: 15px;
		flex: none;
		margin-top: 1px;
	}

	@media (max-width: 560px) {
		.bw {
			left: 24px;
			height: 440px;
		}
		.bw-in {
			padding: 20px 0 0 20px;
		}
		.bw-kp {
			gap: 24px;
		}
		.bw-k b {
			font-size: 16px;
		}
		.bw-head {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			padding-right: 20px;
		}
		.bw-tabs {
			max-width: 100%;
		}
	}
</style>
