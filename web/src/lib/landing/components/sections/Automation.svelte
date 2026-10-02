<script lang="ts">
	import { countUp } from "../../attachments/countUp";
	import { equalHeights } from "../../attachments/equalHeights";
	import { playOnView } from "../../attachments/playOnView";
	import { focusSignup, START_HREF } from "../../cta";
	import CheckBadge from "../icons/CheckBadge.svelte";

	const warnings = [
		"Verbrauch deutlich über Vorjahr",
		"Heizkostenverteiler seit 12 Tagen ohne Funksignal",
		"Nutzerwechsel ohne Zwischenablesung",
	];
</script>

<section class="sec wrap">
	<div class="shead">
		<h2>Heidi liest ab, prüft und rechnet ab.</h2>
		<p>
			Routinearbeit automatisieren und Zeit für die Verwaltung zurückgewinnen.
		</p>
	</div>
	<div class="review-card">
		<div class="copy">
			<h3>Auffällige Verbräuche automatisch erkennen.</h3>
			<p>
				Heidi prüft jede Ablesung, übernimmt plausible Werte in die Abrechnung
				und markiert nur, was Ihre Aufmerksamkeit braucht. Mit nachvollziehbarem
				Verlauf für jede Einheit.
			</p>
		</div>
		<!-- Decoration: a flagged reading as Heidi shows it -->
		<div class="doc" aria-hidden="true" {@attach playOnView()}>
			<div class="seal">
				<svg viewBox="0 0 24 24" fill="none">
					<path
						d="M12 3v18M7 8c0-3 10-3 10 0 0 4-10 4-10 8 0 3 10 3 10 0"
						stroke="currentColor"
						stroke-width="1.6"
					/>
				</svg>
			</div>
			<div class="amt">Whg. 3.2 · Heizung +64 %</div>
			<div class="flag a-pop" style="--d:.3s">
				<b>Genauer prüfen</b>
				{#each warnings as warning, i (warning)}
					<div class="a-up" style="--d:{0.8 + i * 0.4}s">⚠ {warning}</div>
				{/each}
			</div>
			<div class="skel" style="width:30%;margin-top:22px"></div>
			<div class="skel" style="width:80%"></div>
			<div class="skel" style="width:60%"></div>
			<span class="btn">Rückfrage senden</span>
		</div>
	</div>
	<div class="three" {@attach equalHeights("h3")}>
		<div class="tc">
			<h3>Umlage, die mitwächst.</h3>
			<p>
				Verteilerschlüssel und Kostenarten bleiben pro Liegenschaft einstellbar.
				Heidi zeigt Lücken und Unklarheiten, bevor die Abrechnung rausgeht.
			</p>
			<a class="more" href={START_HREF} onclick={focusSignup}>
				Kostenlosen Abrechnungscheck starten →
			</a>
			<div class="vis" aria-hidden="true">
				<div class="clarify" {@attach playOnView()}>
					<div class="h"><i>i</i>Umlage klären</div>
					<div class="b">
						Soll Gartenweg 3 weiter nach 70/30 statt 50/50 verteilt werden?<u
							>16 betroffene Einheiten</u
						>
					</div>
					<div class="ok a-pop" style="--d:.9s">✓ Erledigt</div>
				</div>
			</div>
		</div>
		<div class="tc">
			<h3>Pflichten ohne Aufwand.</h3>
			<p>
				Die monatliche Verbrauchsinformation nach HKVO geht automatisch an alle
				Mieter. Fehlende Daten fordert Heidi selbst an.
			</p>
			<div class="vis" aria-hidden="true">
				<div class="prog">
					<div class="box">
						Monatliche Verbrauchsinfo
						<div class="nums">
							<span
								><span {@attach countUp({ to: 212, hoverTarget: ".tc" })}
									>212</span
								> versendet</span
							><span>216</span>
						</div>
						<div class="track"><b></b></div>
					</div>
					<div class="lock">
						<i>!</i>
						<div>4 Einheiten ohne E-Mail<small>Adresse fehlt</small></div>
					</div>
				</div>
			</div>
		</div>
		<div class="tc">
			<h3>Direkt in Ihre Software.</h3>
			<p>
				Heidi ordnet jede Position der richtigen Kostenart zu und übergibt die
				Abrechnung an Ihr ERP. Der Abschluss geht schneller, ohne Abtippen.
			</p>
			<div class="vis" aria-hidden="true">
				<div class="erp">
					<div class="r"><span>Position</span><b>Heizung · Whg. 3.2</b></div>
					<div class="r"><span>Kostenart</span><b>KoA 4902</b></div>
					<div class="auto">Automatisch zugeordnet</div>
					<div class="sent"><CheckBadge />An ERP übertragen</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.review-card {
		margin-top: 64px;
		background: var(--stone);
		border-radius: 18px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		padding: 48px 64px;
		min-height: 560px;
	}
	.copy {
		align-self: center;
	}
	.review-card h3 {
		font-size: clamp(24px, 2.2vw, 30px);
		line-height: 1.15;
	}
	.copy p {
		color: var(--muted);
		font-size: 18px;
		margin-top: 14px;
		max-width: 40ch;
	}
	.doc {
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(30, 50, 45, 0.08);
		padding: 30px;
		align-self: end;
		width: min(420px, 100%);
		justify-self: center;
		position: relative;
	}
	.seal {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #f6eedc;
		display: grid;
		place-items: center;
		color: #a68a4a;
	}
	.seal svg {
		width: 22px;
	}
	.amt {
		font-size: 22px;
		margin-top: 16px;
		font-variant-numeric: tabular-nums;
	}
	.flag {
		background: #f7f4e4;
		border-radius: 8px;
		padding: 14px 18px;
		margin-top: 14px;
		color: #8c7a2e;
	}
	.flag b {
		font-weight: 600;
		display: block;
	}
	.flag div {
		font-size: 13px;
		display: flex;
		gap: 8px;
		align-items: center;
		margin-top: 6px;
	}
	.skel {
		height: 10px;
		background: #f1f1ef;
		border-radius: 3px;
		margin-top: 10px;
	}
	.doc .btn {
		margin-top: 20px;
		background: #b9c77a;
		color: #fff;
		width: 70%;
		cursor: default;
	}
	.doc:global(.play) .btn {
		animation: a-pulse 2.2s 2.2s infinite;
	}

	.three {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
		margin-top: 24px;
	}
	.tc {
		background: var(--stone);
		border-radius: 18px;
		padding: 32px 30px 30px;
		display: flex;
		flex-direction: column;
	}
	.tc h3 {
		font-size: 22px;
	}
	.tc p {
		color: var(--muted);
		font-size: 17px;
		margin-top: 10px;
	}
	.more {
		margin-top: 14px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 3px;
		align-self: flex-start;
	}
	.vis {
		margin-top: auto;
		padding-top: 28px;
	}
	.vis > * {
		height: 230px;
		box-sizing: border-box;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	.tc:hover .vis > * {
		box-shadow: 0 14px 34px rgba(30, 50, 45, 0.14);
	}
	.clarify {
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 10px rgba(30, 50, 45, 0.05);
		display: flex;
		flex-direction: column;
	}
	.clarify .h {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 12px 18px;
		border-bottom: 1px solid var(--line);
		font-size: 18px;
	}
	.clarify .h i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #e6ecf6;
		color: var(--blue);
		display: grid;
		place-items: center;
		font-style: normal;
		font-size: 12px;
	}
	.clarify .b {
		padding: 12px 18px 10px;
		font-size: 15px;
	}
	.clarify .b u {
		color: var(--muted);
		font-size: 13px;
		display: block;
		margin-top: 6px;
	}
	.clarify .ok {
		margin: auto 18px 16px;
		border: 1px solid #d5dad8;
		border-radius: 6px;
		text-align: center;
		padding: 6px;
		font-size: 14px;
	}
	.prog {
		background: #fff;
		border-radius: 12px;
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.box {
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 14px 16px;
	}
	.nums {
		display: flex;
		justify-content: space-between;
		color: var(--muted);
		font-size: 13px;
		margin-top: 24px;
		font-variant-numeric: tabular-nums;
	}
	.track {
		height: 8px;
		background: #edeeed;
		border-radius: 4px;
		margin-top: 6px;
		overflow: hidden;
	}
	.track b {
		display: block;
		height: 100%;
		width: 98%;
		background: #cfd3d1;
	}
	.lock {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-top: 14px;
		font-size: 14px;
	}
	.lock i {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		background: #fbe6da;
		display: grid;
		place-items: center;
		color: var(--orange);
		font-style: normal;
	}
	.lock small {
		display: block;
		color: var(--orange);
	}
	.erp {
		background: #fff;
		border-radius: 12px;
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
		font-size: 14px;
	}
	.erp .r {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		border-bottom: 1px solid var(--line);
		padding-bottom: 8px;
	}
	.erp .r span {
		color: var(--muted);
	}
	.erp .r b {
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}
	.auto {
		align-self: flex-start;
		background: #e6ecf6;
		color: #3c5ba8;
		border-radius: 999px;
		padding: 5px 12px;
		font-size: 13px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.auto::before {
		content: "";
		width: 8px;
		height: 8px;
		background: var(--blue);
		border-radius: 50%;
	}
	.sent {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: #2f7a3c;
		font-weight: 500;
	}

	/* Hover animations of the three cards */
	.tc:hover .clarify .b {
		animation: h-in 0.45s 0.1s both;
	}
	.tc:hover .clarify .b u {
		animation: h-in 0.4s 0.35s both;
	}
	.tc:hover .clarify .ok {
		animation: t-ok 1.4s 0.5s both;
	}
	.tc:hover .track b {
		background: var(--accent);
		animation: h-fill 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both;
	}
	.tc:hover .lock {
		animation: h-pop 0.45s 1.4s both;
	}
	.tc:hover .erp .r {
		animation: h-in 0.4s both;
	}
	.tc:hover .erp .r:nth-child(2) {
		animation-delay: 0.15s;
	}
	.tc:hover .auto {
		animation: h-pop 0.45s 0.45s both;
	}
	.tc:hover .sent {
		animation: h-in 0.4s 0.85s both;
	}
	.tc:hover .sent :global(.okb) {
		animation: h-pop 0.4s 1.05s both;
	}

	@media (max-width: 980px) {
		.review-card {
			grid-template-columns: 1fr;
			padding: 36px 24px;
		}
		.three {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
