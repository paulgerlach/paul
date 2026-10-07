<script lang="ts">
	import { equalHeights } from "$lib/landing/attachments/equalHeights";
	import { playOnView } from "$lib/landing/attachments/playOnView";
	import CheckBadge from "$lib/landing/components/icons/CheckBadge.svelte";
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";

	const appointmentChecks = [
		"Mieter rechtzeitig informiert",
		"Zugang mit Hausmeister bestätigt",
		"36 von 36 Einheiten montiert",
	];
</script>

<section class="dark" id="service">
	<div class="wrap inner">
		<div class="shead">
			<div class="eyebrow">Service</div>
			<h2>Service, der nicht an der Haustür endet.</h2>
			<p>
				Ein fester Ansprechpartner für Ihre Verwaltung und eigene Monteure, die
				Termine halten.
			</p>
		</div>
		<div class="twocol" {@attach equalHeights("h3")}>
			<div class="panel">
				<h3>Ein Ansprechpartner. Für alles.</h3>
				<p>
					Eine feste Person bei Heidi kennt Ihr Portfolio und ist direkt
					erreichbar. Kein Callcenter, keine Ticketnummern.
				</p>
				<div class="vis" aria-hidden="true">
					<div class="photo" {@attach playOnView({ loop: 9000 })}>
						<div class="win"></div>
						<div class="rad"></div>
						<div class="meter"></div>
						<div class="chat-q a-pop" style="--d:.3s">
							Können Sie die Abrechnung für Hofstraße 21 vorziehen?
						</div>
						<div class="typing"><i></i><i></i><i></i></div>
						<div class="chat-a a-up" style="--d:2.4s">
							<span class="who-a">
								<span class="av-h"><HeidiMark /></span>Ihr Ansprechpartner bei
								Heidi
							</span>
							Ja, das übernehme ich. Sie liegt Ihnen bis Freitag im Portal vor.
						</div>
					</div>
				</div>
			</div>
			<div class="panel">
				<h3>Monteure, die den Termin halten.</h3>
				<p>
					Viele Verwaltungen kennen es: Der Monteur steht vor der Tür, kommt
					nicht rein und fährt wieder. Heidi kündigt Termine früh an, bestätigt
					den Zugang vorab und organisiert Ersatztermine selbst.
				</p>
				<div class="vis">
					<div class="appt" aria-hidden="true">
						<div class="appt-h">
							<div>
								<div class="s">Montagetermin</div>
								<div class="t">Lindenallee 8 · Di, 14.10.</div>
							</div>
							<span class="cert">Zertifizierter Monteur</span>
						</div>
						{#each appointmentChecks as check (check)}
							<div class="appt-r"><CheckBadge />{check}</div>
						{/each}
					</div>
					<!-- The XX values are placeholders: see the go-live gate, plan 5.4. -->
					<dl class="kpis">
						<div class="kpi">
							<dt>Montagen beim ersten Termin erfolgreich</dt>
							<dd data-placeholder>XX %</dd>
						</div>
						<div class="kpi">
							<dt>Tage Vorankündigung an Mieter</dt>
							<dd data-placeholder>XX</dd>
						</div>
						<div class="kpi">
							<dt>Kosten für Installation</dt>
							<dd>0 €</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.dark {
		background: var(--ink);
		color: #fff;
	}
	.inner {
		padding-block: 110px;
	}
	.dark .eyebrow {
		color: var(--accent);
	}
	.dark .shead p {
		color: #b7c4bf;
	}
	.twocol {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
		margin-top: 28px;
	}
	.panel {
		background: var(--stone);
		color: var(--ink);
		border-radius: 18px;
		padding: 44px 48px;
		display: flex;
		flex-direction: column;
	}
	.panel h3 {
		font-size: clamp(24px, 2.2vw, 30px);
		line-height: 1.15;
	}
	.panel > p {
		color: var(--muted);
		margin-top: 14px;
		font-size: 18px;
		max-width: 40ch;
	}
	.vis {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: flex-end;
		padding-top: 32px;
	}

	.photo {
		position: relative;
		width: 100%;
		height: 330px;
		border-radius: 12px;
		overflow: hidden;
		background: linear-gradient(180deg, #d9d6cf 0 62%, #bba58a 62%);
	}
	.win {
		position: absolute;
		right: 8%;
		top: 8%;
		width: 34%;
		height: 46%;
		background: linear-gradient(180deg, #f7f7f4, #e6e8e4);
		border: 6px solid #efede8;
	}
	.rad {
		position: absolute;
		left: 10%;
		bottom: 30%;
		width: 42%;
		height: 18%;
		background: repeating-linear-gradient(
			90deg,
			#f1f1ee 0 10px,
			#cfcfca 10px 13px
		);
		border-radius: 4px;
	}
	.meter {
		position: absolute;
		left: 30%;
		bottom: 36%;
		width: 4%;
		height: 8%;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}
	.chat-q {
		position: absolute;
		left: 6%;
		max-width: 84%;
		top: 9%;
		background: #3b82f6;
		color: #fff;
		border-radius: 18px;
		padding: 9px 16px;
		font-size: 16px;
		transform-origin: left center;
	}
	.chat-a {
		position: absolute;
		left: 6%;
		bottom: 9%;
		background: #fff;
		color: var(--ink);
		border-radius: 18px;
		padding: 14px 20px;
		font-size: 16px;
		line-height: 1.4;
		max-width: 84%;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
	}
	.typing {
		position: absolute;
		left: 6%;
		bottom: 12%;
		background: #fff;
		border-radius: 18px;
		padding: 14px 18px;
		display: flex;
		gap: 5px;
		opacity: 0;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
	}
	.typing i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #9aa5a1;
		animation: a-dot 1s infinite;
	}
	.typing i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing i:nth-child(3) {
		animation-delay: 0.3s;
	}
	.photo:global(.play) .typing {
		animation: a-typing 1.5s 0.9s both;
	}
	.who-a {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		margin-bottom: 6px;
	}
	.av-h {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--line);
		display: grid;
		place-items: center;
		color: var(--ink);
		flex: none;
	}
	.av-h :global(svg) {
		width: 12px;
	}

	.appt {
		background: #fff;
		border-radius: 14px;
		padding: 16px 18px;
		box-shadow: 0 8px 24px rgba(30, 50, 45, 0.08);
		display: grid;
		gap: 10px;
		font-size: 14px;
	}
	.appt-h {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
		border-bottom: 1px solid var(--line);
		padding-bottom: 10px;
	}
	.appt-h .s {
		font-size: 12px;
		color: var(--muted);
	}
	.appt-h .t {
		font-weight: 600;
		font-size: 16px;
	}
	.cert {
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 3px 10px;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
	}
	.appt-r {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		margin: 0;
	}
	.kpi {
		background: #fff;
		border-radius: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: 4px;
	}
	.kpi dd {
		margin: 0;
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		align-self: flex-start;
	}
	/* As in the design: the XX values are outlined in production too. */
	.kpi dd[data-placeholder] {
		color: var(--muted);
		outline: 1.5px dashed #b9c4c0;
		outline-offset: 2px;
		border-radius: 4px;
	}
	.kpi dt {
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.3;
	}

	@media (max-width: 980px) {
		.twocol {
			grid-template-columns: 1fr;
		}
		.panel {
			padding: 32px 24px;
		}
	}
	@media (max-width: 560px) {
		.kpis {
			grid-template-columns: 1fr;
		}
		.photo {
			height: 300px;
		}
	}
	@media (max-width: 520px) {
		.chat-a {
			left: 5%;
			max-width: 90%;
			font-size: 15px;
		}
		.chat-q {
			left: 5%;
			font-size: 15px;
		}
		.typing {
			left: 5%;
		}
	}
</style>
