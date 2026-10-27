<!--
  "Rechnung hochladen. Den Rest liest DocuScan." (#scan, .hk-ds): the example
  invoice beside the scan pane. The scan (the design's `run`, 6.25 s): a beam
  sweeps the invoice, the ring fills, four steps tick off while their fields
  on the invoice light up, then the two result cards come in and the open
  card's date and amount type themselves. The cards are an editable form:
  open one at a time, a field's focus lights its place on the invoice, the
  amount reformats on change, "Nein" asks for the period, "Speichern" checks
  the visible fields (the first invalid one gets the focus) or reports the
  saved sum with confetti. Nothing is sent or stored.

  Server-rendered finished (the design's reduced-motion state); below the
  fold on load the scan plays once when it scrolls into view (`enterView`),
  and again on "Neu scannen", at once with reduced motion. Without JS the
  buttons are hidden.
-->
<script lang="ts">
	import { tick, untrack } from "svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import Icon from "../components/Icon.svelte";
	import { docuscan, type InvoiceField } from "../content";
	import {
		amountLabel,
		formatAmount,
		isAmount,
		isDate,
		parseAmount,
		SCAN,
	} from "../docuscan";

	const { invoice } = docuscan;
	const FIELDS: InvoiceField[] = ["nr", "dat", "zr", "gas", "gp", "str", "sum"];
	/** The ring's circumference (r = 34). */
	const RING = 213.6;

	type Check = "date" | "amount" | "purpose";
	type Card = {
		open: boolean;
		date: string;
		amount: string;
		/** The amount in the card's head; follows typing by the visitor only. */
		head: string;
		/** "Leistungszeitraum übernehmen": Ja. */
		take: boolean;
		period: string;
		scope: number;
		purpose: string;
		bad: Record<Check, boolean>;
		typing: { date: boolean; amount: boolean };
	};

	const initialCards = (): Card[] =>
		docuscan.cards.map((c, i) => ({
			open: i === 0,
			date: docuscan.date.value,
			amount: c.amount,
			head: `${c.amount} €`,
			take: true,
			period: docuscan.period.value,
			scope: 0,
			purpose: c.purpose,
			bad: { date: false, amount: false, purpose: false },
			typing: { date: false, amount: false },
		}));
	const allRead = () =>
		Object.fromEntries(FIELDS.map((f) => [f, "done"])) as Partial<
			Record<InvoiceField, "hit" | "done">
		>;

	// The server's state: finished.
	let phase = $state<"load" | "out" | "result">("result");
	let progress = $state(1);
	let stepState = $state<("" | "run" | "ok")[]>(docuscan.steps.map(() => "ok"));
	let line = $state(docuscan.finished);
	let scanning = $state(false);
	let lit = $state(allRead());
	let cardsIn = $state(docuscan.cards.map(() => true));
	let cards = $state(initialCards());
	let saved = $state<string | null>(null);
	let savedEl = $state<HTMLElement>();

	let timers: ReturnType<typeof setTimeout>[] = [];
	let frame = 0;

	const wait = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
		cancelAnimationFrame(frame);
	}

	$effect(() => clear);

	/** The scan's start state (write only: `enterView`'s prepare calls it). */
	function reset() {
		clear();
		cards = initialCards();
		saved = null;
		phase = "load";
		progress = 0;
		stepState = docuscan.steps.map(() => "");
		line = docuscan.loading;
		scanning = false;
		lit = {};
		cardsIn = docuscan.cards.map(() => false);
	}

	function finish() {
		phase = "result";
		progress = 1;
		stepState = docuscan.steps.map(() => "ok");
		line = docuscan.finished;
		scanning = false;
		lit = allRead();
		cardsIn = docuscan.cards.map(() => true);
	}

	function typeIn(card: Card, field: "date" | "amount", text: string) {
		let n = 0;
		card[field] = "";
		card.typing[field] = true;
		const next = () => {
			card[field] = text.slice(0, ++n);
			if (n < text.length) wait(next, SCAN.typeStep);
			else card.typing[field] = false;
		};
		next();
	}

	function run() {
		reset();
		if (prefersReducedMotion()) {
			finish();
			return;
		}
		scanning = true;
		const start = performance.now();
		const fill = (now: number) => {
			progress = Math.min(1, (now - start) / SCAN.duration);
			if (progress < 1) frame = requestAnimationFrame(fill);
		};
		frame = requestAnimationFrame(fill);

		docuscan.steps.forEach((_, i) =>
			wait(
				() => {
					if (i) stepState[i - 1] = "ok";
					stepState[i] = "run";
					line = docuscan.stepLines[i];
					for (const f of docuscan.stepFields[i]) {
						lit[f] = "hit";
						wait(() => (lit[f] = "done"), SCAN.hitFor);
					}
				},
				SCAN.stepAt + i * SCAN.stepEvery,
			),
		);
		wait(() => {
			stepState[docuscan.steps.length - 1] = "ok";
			line = docuscan.finished;
			scanning = false;
		}, SCAN.done);
		wait(() => (phase = "out"), SCAN.fadeOut);
		wait(() => {
			phase = "result";
			docuscan.cards.forEach((_, i) =>
				wait(() => (cardsIn[i] = true), SCAN.cardAt + i * SCAN.cardEvery),
			);
			const card = cards.find((c) => c.open);
			if (!card) return;
			const texts = { date: card.date, amount: card.amount };
			card.date = "";
			card.amount = "";
			(["date", "amount"] as const).forEach((field, i) =>
				wait(
					() => typeIn(card, field, texts[field]),
					SCAN.typeAt + i * SCAN.typeEvery,
				),
			);
		}, SCAN.result);
	}

	function toggle(index: number) {
		const on = !cards[index].open;
		cards.forEach((c, i) => (c.open = i === index ? on : false));
	}

	async function setTake(card: Card, key: string, take: boolean) {
		card.take = take;
		if (take) return;
		await tick();
		document.getElementById(`ds-${key}-period`)?.focus();
	}

	const valid = (card: Card, check: Check) =>
		check === "date"
			? isDate(card.date)
			: check === "amount"
				? isAmount(card.amount)
				: !!card.purpose;

	function edited(card: Card, check?: Check) {
		if (check) card.bad[check] = false;
		saved = null;
	}

	function changed(card: Card, check: Check) {
		card.bad[check] = !valid(card, check);
		if (check !== "amount") return;
		const n = parseAmount(card.amount);
		if (!Number.isNaN(n)) card.amount = formatAmount(n);
	}

	function light(fields: InvoiceField[]) {
		for (const f of fields) lit[f] = "hit";
	}

	function unlight() {
		for (const f of FIELDS) if (lit[f] === "hit") lit[f] = "done";
	}

	async function save() {
		const checks: Check[] = ["date", "amount", "purpose"];
		let first: { index: number; check: Check } | undefined;
		for (const [index, card] of cards.entries()) {
			for (const check of checks) {
				card.bad[check] = !valid(card, check);
				if (card.bad[check]) first ??= { index, check };
			}
		}
		if (first) {
			const { index, check } = first;
			cards.forEach((c, i) => (c.open = i === index));
			await tick();
			document
				.getElementById(`ds-${docuscan.cards[index].key}-${check}`)
				?.focus();
			return;
		}
		const sum = cards.reduce((s, c) => s + parseAmount(c.amount), 0);
		saved = docuscan.saved(cards.length, formatAmount(sum));
		await tick();
		if (savedEl) confettiFrom(savedEl);
	}
</script>

<section class="pg-sec alt" id="scan" aria-labelledby="hk-sh">
	<div class="wrap">
		<span class="pill c rv"><Icon name="sparkle" />{docuscan.pill}</span>
		<h2 class="h2 c rv" id="hk-sh">{docuscan.h2}</h2>
		<p class="hk-sub rv">{docuscan.sub}</p>

		<div
			class={["ds rv", scanning && "scan"]}
			{@attach enterView({
				prepare: () => untrack(reset),
				play: () => {
					run();
					return clear;
				},
			})}
		>
			<div class="ds-l">
				<div class="doc">
					<div class="dh">
						<div>
							<b>{invoice.supplier}</b><small>{invoice.address}</small>
						</div>
						<b class="tt">{invoice.title}</b>
					</div>
					<div class="meta">
						<div>
							<small>{invoice.recipientLabel}</small>{invoice.recipient[0]}<br
							/>{invoice.recipient[1]}
						</div>
						<div class="kv">
							{#each invoice.meta as m (m.field)}
								<span>{m.label}</span><span class={["f", lit[m.field]]}
									>{m.value}</span
								>
							{/each}
						</div>
					</div>
					<table class="tb">
						<thead>
							<tr>
								{#each invoice.head as h (h)}<th>{h}</th>{/each}
							</tr>
						</thead>
						<tbody>
							{#each invoice.rows as row (row.field)}
								<tr class={["f", lit[row.field]]}>
									{#each row.cells as cell (cell)}<td>{cell}</td>{/each}
								</tr>
							{/each}
						</tbody>
					</table>
					<div class="sum">
						<span>{invoice.sumLabel}</span><b class={["f", lit.sum]}
							>{invoice.sum}</b
						>
					</div>
					<i class="beam" aria-hidden="true"></i>
					<span class="ex" aria-hidden="true">{invoice.tag}</span>
				</div>
			</div>

			<div class="ds-r">
				<div class="rh">
					<b>{docuscan.uploaded}</b><span class="nav" aria-hidden="true"
						>‹ ›</span
					>
				</div>

				<div
					class={["load", phase === "out" && "out"]}
					hidden={phase === "result"}
					aria-live="polite"
				>
					<div class="ring" aria-hidden="true">
						<svg viewBox="0 0 80 80"
							><circle cx="40" cy="40" r="34" /><circle
								class="p"
								cx="40"
								cy="40"
								r="34"
								style:stroke-dashoffset={RING * (1 - progress)}
							/></svg
						><b>{Math.round(progress * 100)}%</b>
					</div>
					<b class="lt">{line}</b>
					<ol class="steps">
						{#each docuscan.steps as step, i (step)}
							<li class={stepState[i]}>{step}</li>
						{/each}
					</ol>
					<div class="sk" aria-hidden="true"><i></i><i></i><i></i></div>
				</div>

				<div class="res" hidden={phase !== "result"}>
					{#each docuscan.cards as meta, i (meta.key)}
						{@const card = cards[i]}
						{@const id = `ds-${meta.key}`}
						<div class={["card", card.open && "open", cardsIn[i] && "in"]}>
							<button
								type="button"
								class="ch"
								aria-expanded={card.open}
								aria-controls={`${id}-form`}
								onclick={() => toggle(i)}
							>
								<span class="ic"><Icon name={meta.icon} /></span>
								<span>{docuscan.cardPrefix}<b>{meta.kind}</b></span>
								<b class="am">{card.head}</b>
								<span class="cv" aria-hidden="true"
									><svg width="11" viewBox="0 0 10 6"
										><path
											d="M1 1l4 4 4-4"
											stroke="currentColor"
											fill="none"
											stroke-width="1.5"
										/></svg
									></span
								>
							</button>
							<div class="fm" id={`${id}-form`}>
								<label>
									<span>{docuscan.date.label}</span>
									<div class={["in", card.bad.date && "bad"]}>
										<input
											id={`${id}-date`}
											class={["i", card.typing.date && "typing"]}
											bind:value={card.date}
											placeholder={docuscan.date.placeholder}
											inputmode="numeric"
											aria-label={docuscan.date.label}
											aria-invalid={card.bad.date}
											oninput={() => edited(card, "date")}
											onchange={() => changed(card, "date")}
											onfocus={() => light(["dat"])}
											onblur={unlight}
										/><Icon name="calendar" />
									</div>
								</label>
								<label>
									<span>{docuscan.amount.label}</span>
									<div class={["in", card.bad.amount && "bad"]}>
										<input
											id={`${id}-amount`}
											class={["i", card.typing.amount && "typing"]}
											bind:value={card.amount}
											placeholder={docuscan.amount.placeholder}
											inputmode="decimal"
											aria-label={docuscan.amount.aria}
											aria-invalid={card.bad.amount}
											oninput={() => {
												edited(card, "amount");
												card.head = amountLabel(card.amount);
											}}
											onchange={() => changed(card, "amount")}
											onfocus={() => light(meta.amountFields)}
											onblur={unlight}
										/>€
									</div>
								</label>
								<div class="row">
									<span
										>{card.take
											? docuscan.period.taken(card.period)
											: docuscan.period.own}</span
									>
									<span
										class="tg"
										role="group"
										aria-label={docuscan.period.group}
									>
										<button
											type="button"
											class={[!card.take && "on"]}
											aria-pressed={!card.take}
											onclick={() => setTake(card, meta.key, false)}
											>{docuscan.period.no}</button
										><button
											type="button"
											class={[card.take && "on"]}
											aria-pressed={card.take}
											onclick={() => setTake(card, meta.key, true)}
											>{docuscan.period.yes}</button
										>
									</span>
								</div>
								<label class="w" hidden={card.take}>
									<span>{docuscan.period.label}</span>
									<div class="in">
										<input
											id={`${id}-period`}
											class="i"
											bind:value={card.period}
											placeholder={docuscan.period.placeholder}
											aria-label={docuscan.period.label}
											oninput={() => edited(card)}
											onfocus={() => light(["zr"])}
											onblur={unlight}
										/>
									</div>
								</label>
								<div class="w lb" role="group" aria-labelledby={`${id}-scope`}>
									<span id={`${id}-scope`}>{docuscan.scope.label}</span>
									<div class="chips">
										{#each docuscan.scope.options as option, k (option)}
											<button
												type="button"
												class={[card.scope === k && "on"]}
												aria-pressed={card.scope === k}
												onclick={() => {
													card.scope = k;
													edited(card);
												}}>{card.scope === k ? "✓ " : ""}{option}</button
											>
										{/each}
									</div>
								</div>
								<label class="w">
									<span>{docuscan.purpose.label}</span>
									<div class={["in sel", card.bad.purpose && "bad"]}>
										<select
											id={`${id}-purpose`}
											class="i"
											bind:value={card.purpose}
											aria-label={docuscan.purpose.aria}
											aria-invalid={card.bad.purpose}
											onchange={() => {
												edited(card, "purpose");
												changed(card, "purpose");
											}}
										>
											<option value="">{docuscan.purpose.empty}</option>
											{#each docuscan.purpose.options as option (option)}
												<option value={option}>{option}</option>
											{/each}
										</select><span aria-hidden="true">▾</span>
									</div>
								</label>
							</div>
						</div>
					{/each}
					<div class="ft">
						<button type="button" class="b2" onclick={run}
							>{docuscan.again}</button
						><button type="button" class="b1" onclick={save}
							>{docuscan.save}</button
						>
					</div>
					<div class="ok" role="status" bind:this={savedEl} hidden={!saved}>
						{#if saved}
							<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
								><path
									d="M1 5l3.5 3.5L11 1"
									stroke-width="2"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							><span><b>{saved}</b><small>{docuscan.savedText}</small></span>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<p class="hk-note c rv">{docuscan.note}</p>
	</div>
</section>

<style>
	.ds {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
		gap: 18px;
		background: #edefee;
		border-radius: 24px;
		padding: 18px;
		margin-top: 40px;
	}
	.ds-l,
	.ds-r {
		background: #fdfdfc;
		border-radius: 16px;
		position: relative;
		overflow: hidden;
	}
	.ds-l {
		padding: 24px;
		display: flex;
		justify-content: center;
	}
	.doc {
		position: relative;
		width: 100%;
		max-width: 440px;
		background: #fff;
		box-shadow: 0 1px 3px rgba(30, 50, 45, 0.08);
		padding: 26px 24px;
		font-size: 11.5px;
		color: #26332f;
		overflow: hidden;
	}
	.dh {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
	}
	.dh b {
		font-size: 14px;
	}
	.dh small {
		display: block;
		color: #6b7a74;
		font-size: 10.5px;
		margin-top: 3px;
	}
	.tt {
		letter-spacing: 0.06em;
	}
	.meta {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 14px;
		margin-top: 22px;
		line-height: 1.5;
	}
	.meta small {
		display: block;
		font-weight: 700;
		font-size: 10px;
		margin-bottom: 2px;
	}
	.kv {
		display: grid;
		grid-template-columns: auto auto;
		gap: 3px 10px;
		justify-content: end;
	}
	.kv span:nth-child(odd) {
		font-weight: 700;
		text-align: right;
	}
	.tb {
		width: 100%;
		border-collapse: collapse;
		margin-top: 22px;
		font-size: 11.5px;
	}
	.tb th {
		background: #f2f3f2;
		text-align: left;
		font-size: 11.5px;
		line-height: 1.35;
		padding: 6px 8px;
		border: 1px solid #dde2df;
	}
	.tb td {
		font-size: 11.5px;
		line-height: 1.35;
		padding: 7px 8px;
		border: 1px solid #dde2df;
	}
	.tb td:last-child,
	.tb th:last-child {
		text-align: right;
	}
	.sum {
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		align-items: baseline;
		margin-top: 12px;
		font-size: 12px;
	}
	.sum b {
		font-size: 15px;
	}
	.ex {
		position: absolute;
		right: 10px;
		bottom: 8px;
		font-size: 10px;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 5px;
		padding: 1px 6px;
	}
	.f {
		border-radius: 3px;
		transition:
			background 0.35s,
			box-shadow 0.35s;
	}
	.f.hit {
		background: rgba(138, 214, 143, 0.38);
		box-shadow: 0 0 0 2px rgba(62, 154, 87, 0.5);
	}
	.f.done {
		background: rgba(138, 214, 143, 0.18);
		box-shadow: none;
	}
	.beam {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 3px;
		background: var(--ok);
		box-shadow: 0 0 18px 6px rgba(138, 214, 143, 0.55);
		opacity: 0;
	}
	.ds.scan .beam {
		opacity: 1;
		animation: ds-sweep 1.6s ease-in-out infinite alternate;
	}
	@keyframes ds-sweep {
		from {
			top: 0;
		}
		to {
			top: calc(100% - 3px);
		}
	}
	.ds.scan .doc::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(228, 239, 230, 0.18);
	}
	.ds-r {
		padding: 22px;
		display: flex;
		flex-direction: column;
		min-height: 520px;
	}
	.rh {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 14.5px;
		margin-bottom: 16px;
	}
	.nav {
		color: var(--faint);
		letter-spacing: 0.4em;
	}
	/* The loading screen */
	.load {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 26px;
		transition: opacity 0.35s;
	}
	.load.out {
		opacity: 0;
	}
	.ring {
		position: relative;
		width: 86px;
		height: 86px;
	}
	.ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	.ring circle {
		fill: none;
		stroke: #eef1ef;
		stroke-width: 6;
	}
	.ring circle.p {
		stroke: var(--ok);
		stroke-linecap: round;
		stroke-dasharray: 213.6;
		transition: stroke-dashoffset 0.3s;
	}
	.ring b {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 17px;
		font-variant-numeric: tabular-nums;
	}
	.lt {
		font-size: 16px;
	}
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 9px;
		width: min(300px, 100%);
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: var(--faint);
		transition: color 0.3s;
	}
	.steps li::before {
		content: "";
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #d7dfda;
		flex: none;
		box-sizing: border-box;
		transition: all 0.3s;
	}
	.steps li.run,
	.steps li.ok {
		color: var(--ink);
	}
	.steps li.run::before {
		border-color: var(--ok);
		border-top-color: transparent;
		animation: ds-rot 0.8s linear infinite;
	}
	.steps li.ok::before {
		background: var(--ok)
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'%3E%3Cpath d='M1 5l3.5 3.5L11 1' stroke='%23fff' stroke-width='2' fill='none'/%3E%3C/svg%3E")
			center/9px no-repeat;
		border-color: var(--ok);
	}
	@keyframes ds-rot {
		to {
			transform: rotate(360deg);
		}
	}
	.sk {
		width: 100%;
		display: grid;
		gap: 8px;
		margin-top: 6px;
	}
	.sk i {
		height: 40px;
		border-radius: 10px;
		background: #f2f3f2;
		animation: ds-pl 1.3s ease-in-out infinite;
	}
	.sk i:nth-child(2) {
		animation-delay: 0.2s;
	}
	.sk i:nth-child(3) {
		animation-delay: 0.4s;
	}
	@keyframes ds-pl {
		50% {
			opacity: 0.45;
		}
	}
	/* The result */
	.res {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}
	.card {
		border: 1px solid var(--hair);
		border-radius: 12px;
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.card.in {
		opacity: 1;
		transform: none;
	}
	.ch {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 14px;
		border: 0;
		background: none;
		font-size: 14px;
		text-align: left;
		cursor: pointer;
		border-radius: 12px;
	}
	.ch:hover {
		background: #fafbfa;
	}
	.ic {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: #e4efe6;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 17px;
		height: 17px;
	}
	.am {
		margin-left: auto;
		font-size: 14px;
		white-space: nowrap;
	}
	.cv {
		color: var(--faint);
		display: grid;
		place-items: center;
		transition: transform 0.25s;
	}
	.card.open .cv {
		transform: rotate(180deg);
	}
	.fm {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding: 4px 14px 16px;
	}
	.card:not(.open) .fm {
		display: none;
	}
	.card.open .fm {
		animation: dsfm 0.3s ease;
	}
	@keyframes dsfm {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	.fm label,
	.lb {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 12.5px;
		color: var(--ok);
		font-weight: 500;
	}
	.fm .w {
		grid-column: 1/-1;
	}
	.fm label[hidden] {
		display: none;
	}
	.in {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		border: 1px solid #cfe3d3;
		border-radius: 8px;
		padding: 0 11px;
		min-height: 40px;
		color: var(--ink);
		font-size: 14px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.in :global(svg) {
		width: 16px;
		height: 16px;
		color: var(--ok);
	}
	.in:focus-within {
		border-color: var(--ok);
		box-shadow: 0 0 0 3px rgba(47, 158, 68, 0.14);
	}
	.in.bad {
		border-color: #d9622b;
		box-shadow: 0 0 0 3px rgba(217, 98, 43, 0.12);
	}
	.i {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: none;
		font: inherit;
		font-size: 14px;
		color: var(--ink);
		padding: 9px 0;
		height: 38px;
	}
	.i.typing {
		caret-color: var(--ok);
	}
	.sel {
		position: relative;
	}
	.sel select {
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		padding-right: 18px;
	}
	.sel > span {
		position: absolute;
		right: 11px;
		pointer-events: none;
		color: var(--muted);
		font-size: 12px;
	}
	.row {
		grid-column: 1/-1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		font-size: 13.5px;
	}
	.tg {
		display: inline-flex;
		background: #eef1ef;
		border-radius: 999px;
		padding: 3px;
	}
	.tg button {
		border: 0;
		background: none;
		font-size: 12.5px;
		padding: 4px 12px;
		border-radius: 999px;
		color: var(--muted);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.tg button.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		border: 1px solid #cfe3d3;
		border-radius: 8px;
		padding: 6px;
	}
	.chips button {
		border: 1px solid transparent;
		background: #f2f4f3;
		color: var(--muted);
		font-size: 12.5px;
		border-radius: 999px;
		padding: 4px 10px;
		cursor: pointer;
		transition: all 0.2s;
	}
	.chips button.on {
		background: #e4f3e6;
		color: #245f33;
	}
	.chips button:not(.on):hover {
		border-color: #cfe3d3;
	}
	.ft {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: auto;
		padding-top: 10px;
	}
	.ft button {
		font-size: 15px;
		font-weight: 600;
		border-radius: 10px;
		padding: 11px 20px;
		cursor: pointer;
	}
	.b2 {
		background: #fff;
		border: 1px solid var(--hair);
	}
	.b2:hover {
		border-color: #c3cdc8;
	}
	/* `.ft .b1`: beats the landing button reset's colour. */
	.ft .b1 {
		background: var(--ink);
		border: 0;
		color: #fff;
	}
	.ft .b1:hover {
		background: #2a443d;
	}
	.ok {
		display: flex;
		gap: 10px;
		align-items: center;
		background: #eef6ef;
		border-radius: 10px;
		padding: 11px 14px;
	}
	.ok[hidden] {
		display: none;
	}
	.ok svg {
		width: 16px;
		flex: none;
	}
	.ok path {
		stroke: #2f7a3c;
	}
	.ok b {
		display: block;
		font-size: 14px;
	}
	.ok small {
		font-size: 12.5px;
		color: var(--muted);
	}
	@media (max-width: 900px) {
		.ds {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.fm {
			grid-template-columns: 1fr;
		}
		.ds {
			padding: 10px;
		}
		.ds-l {
			padding: 12px;
		}
		.ds-r {
			padding: 14px;
		}
		.rh {
			font-size: 13px;
		}
		.meta {
			grid-template-columns: 1fr;
		}
		.kv {
			justify-content: start;
		}
		.kv span:nth-child(odd) {
			text-align: left;
		}
	}
	@media (scripting: none) {
		.ft {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.beam,
		.sk i {
			animation: none;
		}
	}
</style>
