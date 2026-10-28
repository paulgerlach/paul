<!--
  The result ("Ihr persönlicher Zählercheck"): the preselected devices, the
  preliminary cost estimate as two contracts, the further services with their
  starting prices, the totals and the technical check points with who
  handles them.
-->
<script lang="ts">
	import Markup from "../ui/Markup.svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { ROUTE_ENERGIEAUSWEIS } from "$lib/routes";
	import { CAPSULES, DEVICE_PHOTOS, PHOTOS } from "../../photos";
	import { checkOwner, DEVICES, EXTRAS, PRICES } from "../data";
	import { calc, eur, extraPrice, gateways, tech } from "../model";
	import { CHECK } from "../svg";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const c = $derived(calc(w.s));
	const byDevices = $derived(tech(w.s));
	const many = (d: string) =>
		d !== "rwm" && (w.s.groups[d as keyof typeof w.s.groups]?.length ?? 0) > 1;
</script>

<div class="ss-res-ok">
	<span class="okb"><Markup html={CHECK} /></span><span
		><b>Ihr Zählercheck ist fertig.</b>
		{byDevices
			? "Heidi kann damit Zählertypen, Mengen und Einbausituation technisch vorqualifizieren."
			: "Wir übernehmen Ihre Zähler aus den Unterlagen und bestätigen die Geräteliste mit Ihnen."}</span
	>
</div>
<h3 class="ss-res-h">{byDevices ? "Vorausgewählte Geräte" : "Ihre Geräte"}</h3>
<div class="ss-devs">
	{#if byDevices}
		{#each c.rows as r, i (r.key)}
			<article class="ss-dev" style:animation-delay="{i * 70}ms">
				<figure>
					<Image
						src={(r.capsule && CAPSULES[r.d]) || DEVICE_PHOTOS[r.d]}
						alt=""
						width={0}
						height={0}
						sizes="130px"
					/><span class="n">{r.n} ×</span>
				</figure>
				<div>
					<b
						>{r.req ? r.sub : DEVICES[r.d].name}{r.grp && many(r.d)
							? ` · Gruppe ${r.grp}`
							: ""}</b
					>
					<span
						>{r.req
							? "Weitere Zähler · Preis auf Anfrage"
							: (r.d === "rwm"
									? "Funk-Rauchwarnmelder"
									: `Funk-${DEVICES[r.d].name}`) +
								(r.sub ? ` · ${r.sub}` : "")}</span
					>
					<span class="ss-chips"
						><em class="ss-chip">{r.tag}</em>{#if r.ck}<em class="ss-chip chk"
								>Angabe offen</em
							>{/if}</span
					>
				</div>
			</article>
		{/each}
	{:else}
		<article class="ss-dev">
			<figure>
				<Image
					class="doc"
					src={PHOTOS.statement}
					alt=""
					width={520}
					height={358}
					sizes="200px"
				/>
			</figure>
			<div>
				<b>Aus Ihren Unterlagen</b><span
					>{w.count("liste")} Datei(en) erfasst. Zählerarten und Stückzahlen ergänzen
					wir nach der Dokumentenprüfung.</span
				><em class="ss-chip chk">Dokumentenprüfung</em>
			</div>
		</article>
	{/if}
	{#if c.gw}
		<article class="ss-dev">
			<figure>
				<Image
					src={PHOTOS.gateway}
					alt=""
					width={0}
					height={0}
					sizes="130px"
				/><span class="n">{c.gw} ×</span>
			</figure>
			<div>
				<b>Funk-Gateway</b><span
					>{gateways(w.s) === 1 ? "Bei 1 bis 10 Einheiten" : "Ab 11 Einheiten"}.
					Vorläufige Planung, größere oder funktechnisch schwierige Gebäude
					brauchen ggf. mehr.</span
				><em class="ss-chip">Automatisch geplant</em>
			</div>
		</article>
	{/if}
</div>

<h3 class="ss-res-h">Vorläufiger Kostenvoranschlag</h3>
<p class="ss-chk-l">
	Gerätemiete und Heizkostenabrechnung sind <b>zwei getrennte Verträge</b>. Sie
	sehen beide hier nebeneinander.
</p>
<div class="ss-k2">
	<div class="ss-cost">
		<div class="ss-cost-h">
			<small>Vertrag 1</small><b
				>{c.buy ? "Gerätekauf" : "Gerätemiete"} und Service</b
			>
		</div>
		<div class="ss-cost-r">
			<span>Geräte</span><b
				>{byDevices ? `${c.dev} Geräte` : "nach Dokumentenprüfung"}</b
			>
		</div>
		{#if byDevices}
			<div class="ss-cost-r">
				<span
					>{c.buy
						? "Gerätekauf (einmalig)"
						: `Gerätemiete pro Jahr${c.keep ? ` (ohne ${c.keep} übernehmbare Geräte)` : ""}`}</span
				><b class={[c.buy && "o"]}>{c.buy ? "auf Anfrage" : eur(c.rent)}</b>
			</div>
			<div class="ss-cost-r">
				<span>Wartung ({c.dev} × {eur(PRICES.wart)} pro Jahr)</span><b
					>{eur(c.wart)}</b
				>
			</div>
		{/if}
		{#if c.gw}
			<div class="ss-cost-r">
				<span
					>Funk-Gateway ({c.gw}{c.buy
						? " × Kauf"
						: ` × ${eur(PRICES.gw)} pro Jahr`})</span
				><b class={[c.buy && "o"]}>{c.buy ? "auf Anfrage" : eur(c.gwc)}</b>
			</div>
		{/if}
		{#if c.rows.some((r) => r.req)}
			<div class="ss-cost-r">
				<span>Weitere Zähler</span><b class="o">auf Anfrage</b>
			</div>
		{/if}
		{#if byDevices && c.dev}
			<div class="ss-cost-r">
				<span>Installationspauschale</span><b class={[!c.inst && "o"]}
					>{c.inst
						? eur(c.inst)
						: c.self
							? "entfällt, Selbstmontage"
							: "Montage noch offen"}</b
				>
			</div>
			<div class="ss-cost-r">
				<span>Inbetriebnahme ({c.dev} × {eur(PRICES.ibn)} einmalig)</span><b
					>{eur(c.ibn)}</b
				>
			</div>
		{/if}
	</div>
	<div class="ss-cost">
		<div class="ss-cost-h">
			<small>Vertrag 2</small><b>Heizkostenabrechnung</b>
		</div>
		<div class="ss-cost-r">
			<span
				>{c.withAbr
					? `${c.units} Wohnungen × ${eur(PRICES.abr)} pro Jahr`
					: "Abrechnung"}</span
			><b class={[!c.withAbr && "o"]}
				>{c.withAbr
					? eur(c.abr)
					: w.s.leist === "d"
						? "nach Beratung"
						: "nicht gewählt"}</b
			>
		</div>
		<p class="ss-cost-n">
			Jährliche Abrechnung nach Heizkostenverordnung, inklusive unterjähriger
			Verbrauchsinformation.
		</p>
	</div>
</div>
{#if c.extras.length}
	<div class="ss-cost ss-cost-z">
		<div class="ss-cost-h">
			<small>Zusätzlich gewählt</small><b>Weitere Leistungen</b>
		</div>
		{#each EXTRAS.filter((z) => w.s.zusatz.includes(z.v)) as z (z.v)}
			<div class="ss-cost-r">
				<span
					>{z.v === "ea" ? `${z.title} · ` : z.title}{#if z.v === "ea"}<a
							class="ss-zl"
							href={ROUTE_ENERGIEAUSWEIS}
							target="_blank"
							rel="noopener">Mehr erfahren</a
						>{/if}</span
				><b>{extraPrice(z.v)}</b>
			</div>
		{/each}
		<p class="ss-cost-n">
			Einstiegspreise als Richtwert, netto. Den genauen Preis ergänzen wir im
			Angebot.
		</p>
	</div>
{/if}
<div class="ss-tiles">
	<div class="ss-tile ink">
		<small>Laufende Kosten</small><b>{eur(c.yearly)}</b><span
			>pro Jahr, netto zzgl. MwSt.</span
		>
	</div>
	<div class="ss-tile">
		<small>Einmalkosten</small><b>{byDevices ? eur(c.once) : "Offen"}</b><span
			>netto zzgl. MwSt.</span
		>
	</div>
</div>
<p class="ss-fine">
	Vorläufige Preise, netto zzgl. MwSt. Gerätemiete, Gateway, Wartung und
	Abrechnung jährlich, Inbetriebnahme und Installation einmalig. Einbausätze,
	Rohr- und Sanitärarbeiten sind nicht enthalten. Bei Übernahme vorhandener
	Funkzähler hängt die Machbarkeit unter anderem von Funkprotokoll,
	Zugangsschlüsseln und Vertragslage ab.
</p>
{#if c.checks.length}
	<h3 class="ss-res-h">Technische Prüfpunkte</h3>
	<p class="ss-chk-l">
		Diese Punkte klären wir vor der Montage. Bei <b>Heidi</b> müssen Sie nichts
		tun. Punkte mit <b>Sie</b> können Sie vorab erledigen, oder wir klären sie gemeinsam.
	</p>
	<ul class="ss-checks">
		{#each c.checks as x, i (i)}
			{@const [who, text] = checkOwner(x)}
			<li>
				<span class="ss-ck-t"
					><b>{x}</b><em class={["ss-who", who === "Heidi" && "h"]}>{who}</em
					></span
				><small>{text}</small>
			</li>
		{/each}
	</ul>
{/if}
