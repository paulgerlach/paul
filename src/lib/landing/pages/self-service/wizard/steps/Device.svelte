<!--
  A device step ("<Gerät> bestimmen"): one card per group of identical
  devices with the questions for its kind, and "Weitere Bauart oder
  Zählergruppe hinzufügen".
-->
<script lang="ts">
	import Markup from "../ui/Markup.svelte";
	import { tick } from "svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { CAPSULES, DEVICE_PHOTOS, SITE_PHOTOS } from "../../photos";
	import {
		DEVICES,
		fieldTip,
		MID_NORMS,
		QUESTION_TIPS,
		SITE_PHOTO_TIPS,
		YES_NO_UNKNOWN,
		type GroupDev,
	} from "../data";
	import { capsuleMeter, swapAll, type Group } from "../model";
	import { ICONS, RADIATORS, SKETCHES } from "../svg";
	import Drop from "../ui/Drop.svelte";
	import Note from "../ui/Note.svelte";
	import Options from "../ui/Options.svelte";
	import Question from "../ui/Question.svelte";
	import Select from "../ui/Select.svelte";
	import SizeSelect from "../ui/SizeSelect.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	let { d }: { d: GroupDev } = $props();
	const w = getSelfService();
	const groups = $derived(w.s.groups[d]);
	const name = $derived(DEVICES[d].name);
	const water = $derived(d === "kwz" || d === "wwz");
	const tip = (k: string) => fieldTip(d, k);
	let list: HTMLDivElement;

	const photo = (g: Group) =>
		(water && g.einbau === "up" && CAPSULES[d]) || DEVICE_PHOTOS[d];

	async function add() {
		w.addGroup(d);
		await tick();
		const cards = list.querySelectorAll(".ss-grp");
		cards[cards.length - 1]?.scrollIntoView({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			block: "center",
		});
	}

	const meterPhotoHint = $derived(
		d === "hkv"
			? "Heizkostenverteiler mit gut lesbarer Aufschrift"
			: d === "wmz"
				? "Zähler mit Rechenwerk und Typenschild"
				: "Zähler mit gut lesbarem Typenschild",
	);
	const sitePhotoHint = $derived(
		d === "hkv"
			? "Heizkörper von vorne und von der Seite"
			: d === "wmz"
				? "Einbaustelle und Stellen der Temperaturfühler"
				: "Einbauort mit Anschlüssen links und rechts",
	);
</script>

<div bind:this={list}>
	{#each groups as g, i (g.id)}
		<div class="ss-grp" data-g={g.id}>
			<div class="ss-grp-h">
				<span class="l"
					><Image
						class="gimg"
						src={photo(g)}
						alt=""
						width={0}
						height={0}
						sizes="34px"
					/><b>{name} · Gruppe {i + 1}</b></span
				>
				{#if groups.length > 1}
					<button
						type="button"
						class="ss-del"
						onclick={() => w.removeGroup(d, g.id)}>Gruppe entfernen</button
					>
				{/if}
			</div>

			{#if d === "weitere"}
				<div class="f2">
					<Select
						label="Welche Zählerart?"
						bind:value={g.art}
						options={[
							["strom", "Stromzähler"],
							["gas", "Gaszähler"],
							["sonst", "Sonstiger Zähler"],
						]}
						tip={tip("art")}
					/>
					<Text
						label="Wie viele Zähler?"
						bind:value={g.n}
						type="number"
						tip={tip("n")}
					/>
				</div>
				<Text
					label="Hersteller oder Typ (falls bekannt)"
					bind:value={g.mod}
					placeholder="z. B. Aufschrift auf dem Zähler"
					tip={tip("mod")}
				/>
				<Question
					text="Fotos des Zählers"
					top={18}
					tip={QUESTION_TIPS.meterPhotos}
				/>
				<Drop
					id={g.id}
					label="Fotos hinzufügen"
					hint="Zähler und Typenschild"
					small
					max={4}
				/>
				<Text
					area
					label="Besonderheiten"
					bind:value={g.bem}
					placeholder="z. B. Zweck, Standort"
					tip={tip("bem")}
				/>
			{:else}
				<div class="f2">
					<Text
						label="Wie viele baugleiche Geräte?"
						bind:value={g.n}
						type="number"
						tip={tip("n")}
					/>
					<Select
						label="Aktuell installiert?"
						bind:value={g.inst}
						options={[
							["ja", "Ja, Zähler vorhanden"],
							["nein", "Nein, neuer Einbau"],
							["unbekannt", "Unbekannt"],
						]}
						tip={tip("inst")}
					/>
				</div>

				{#if d === "hkv"}
					<Question
						text="Heizkörperbauart*"
						top={18}
						tip={QUESTION_TIPS.radiator}
					/>
					<Options
						class="cards grid2 art"
						options={[
							{
								v: "platte",
								label: "Plattenheizkörper",
								icon: RADIATORS.platte,
								small: "Glatte oder profilierte Platten",
							},
							{
								v: "glieder",
								label: "Röhren-, Glieder- oder Rippenheizkörper",
								icon: RADIATORS.glieder,
								small: "Einzelne Glieder oder Röhren",
							},
						]}
						value={g.art}
						onpick={(v) => (g.art = v)}
					/>
				{:else if g.inst === "ja" && swapAll(w.s)}
					<div class="ss-cond">
						<Note
							><b>Kompletter Austausch:</b> Da Sie alle Zähler erneuern, brauchen
							wir keine Angaben zu den bisherigen Zählern wie Hersteller, Funk oder
							Eichfrist.</Note
						>
					</div>
				{:else if g.inst === "ja"}
					<div class="ss-cond">
						<div class="f2">
							<Select
								label="Aktueller Zähler"
								bind:value={g.funk}
								options={[
									["funk", "Funkfähig"],
									["nicht", "Nicht funkfähig"],
									["unbekannt", "Unbekannt"],
								]}
								tip={tip("funk")}
							/>
							<Text
								label="Hersteller oder Messdienst"
								bind:value={g.her}
								placeholder="z. B. Hersteller auf dem Zähler"
								tip={tip("her")}
							/>
						</div>
						<div class="f2">
							<Text
								label="Typ oder Modell"
								bind:value={g.mod}
								placeholder="Typbezeichnung vom Zähler"
								tip={tip("mod")}
							/>
							<Text
								label="Eichfrist oder Austauschjahr"
								bind:value={g.jahr}
								placeholder="z. B. 2028"
								tip={tip("jahr")}
							/>
						</div>
						{#if g.funk === "funk"}
							<div class="ss-cond">
								<div class="f2">
									<Select
										label="Funkstandard"
										bind:value={g.std}
										options={[
											["wmbus", "wM-Bus"],
											["lora", "LoRaWAN"],
											["sonst", "Sonstiger"],
											["unbekannt", "Unbekannt"],
										]}
										tip={tip("std")}
									/>
									<Select
										label="Zugangsschlüssel verfügbar?"
										bind:value={g.key}
										options={YES_NO_UNKNOWN}
										tip={tip("key")}
									/>
								</div>
							</div>
						{/if}
					</div>
				{/if}

				{#if water}
					<Question
						text="Einbau und Anschlüsse"
						kind="sub"
						tip={QUESTION_TIPS.connections}
					/>
					<Question
						text="Wie ist der Wasserzähler eingebaut?"
						kind="lab"
						tip={QUESTION_TIPS.waterMount}
					/>
					<Options
						class="cards grid2 einbau"
						options={[
							{
								v: "up",
								label: "Unterputz",
								icon: SKETCHES.up,
								small: "Runde Abdeckung in der Wand",
							},
							{
								v: "ap",
								label: "Aufputz",
								icon: SKETCHES.ap,
								small: "Zähler sichtbar im Rohr",
							},
							{ v: "neu", label: "Kein Einbauplatz", icon: SKETCHES.neu },
							{ v: "unbekannt", label: "Unbekannt", icon: SKETCHES.unk },
						]}
						value={g.einbau}
						onpick={(v) => (g.einbau = v)}
					/>
					{#if g.einbau === "up"}
						{#if g.inst !== "nein"}
							<div class="ss-cond">
								<Question
									text="MID-Norm der Messkapsel*"
									kind="sub"
									hint="(Aufschrift auf dem Zähler oder Einbausatz)"
								/>
								<div class="ss-mid">
									{#each MID_NORMS as x (x)}
										<button
											type="button"
											data-v={x}
											class={[g.ksys === x && "on"]}
											aria-pressed={g.ksys === x}
											onclick={() => (g.ksys = g.ksys === x ? "" : x)}
											>{x === "andere" ? "Andere / unklar" : x}</button
										>
									{/each}
								</div>
								{#if g.ksys === "andere"}
									<div class="ss-cond">
										<Text
											label="Aufschrift (falls lesbar)"
											bind:value={g.ksysx}
											placeholder="z. B. Aufschrift am Zähler oder Einbausatz"
										/>
									</div>
								{/if}
							</div>
						{/if}
					{:else if g.einbau === "ap"}
						<div class="ss-cond">
							<div class="ss-f3">
								<SizeSelect k="bl" label="Einbaulänge*" {g} step={d} unknown />
								<SizeSelect
									k="q3"
									label="Dauerdurchfluss Q3/Qn*"
									{g}
									step={d}
									unknown
								/>
								<SizeSelect
									k="gew"
									label="Anschlussgewinde*"
									{g}
									step={d}
									unknown
								/>
							</div>
							<p class="ss-hint">
								Erst alle drei Angaben zusammen bestimmen den Zähler eindeutig.
							</p>
						</div>
					{:else if g.einbau === "neu" || g.einbau === "unbekannt"}
						<div class="ss-cond">
							<Note warn
								>Kein Problem. Laden Sie gern Fotos hoch. Heidi prüft, ob ein
								neuer Einbausatz, ein Rohrumbau oder eine andere Vorbereitung
								nötig ist.</Note
							>
						</div>
					{/if}
				{/if}

				{#if d === "wmz"}
					<Question
						text="Bauart des Wärmemengenzählers*"
						kind="sub"
						tip={QUESTION_TIPS.heatType}
					/>
					<Options
						class="cards grid2 wtyp"
						options={[
							{
								v: "ap",
								label: "Aufputz-Wärmezähler",
								icon: SKETCHES.ap,
								small: "Zähler sitzt sichtbar in der Rohrleitung",
							},
							{
								v: "up",
								label: "Unterputz-/Kapsel-Wärmezähler",
								icon: SKETCHES.up,
								small: "Messkapsel in einem Anschlussgehäuse",
							},
						]}
						value={g.wtyp}
						onpick={(v) => (g.wtyp = v)}
					/>
					{#if g.wtyp === "ap"}
						<div class="ss-cond">
							<div class="ss-f3">
								<SizeSelect k="bl" label="Einbaulänge*" {g} step={d} />
								<SizeSelect k="dn" label="Nennweite DN" {g} step={d} />
								<SizeSelect k="gew" label="Anschlussgewinde" {g} step={d} />
							</div>
							<p class="ss-hint">
								Bitte Nennweite DN <b>oder</b> Anschlussgewinde angeben.
							</p>
						</div>
					{/if}
					{#if g.wtyp}
						<div class="ss-cond">
							<div class="f2">
								<SizeSelect k="qp" label="Nenndurchfluss qp*" {g} step={d} />
								<Select
									label="Temperaturfühlergröße*"
									bind:value={g.fg}
									options={[
										["5.0", "5,0 mm"],
										["5.2", "5,2 mm"],
										["6.0", "6,0 mm"],
										["unbekannt", "Unbekannt"],
									]}
									tip={tip("fg")}
								/>
							</div>
							<Question text="Weitere Angaben (optional)" kind="sub" />
							<div class="f2">
								<Select
									label="Was wird gemessen?"
									bind:value={g.was}
									options={[
										["heizung", "Heizung"],
										["ww", "Warmwasser"],
										["kaelte", "Kälte"],
										["unbekannt", "Unbekannt"],
									]}
									tip={tip("was")}
								/>
								<Select
									label="Temperaturfühler-Aufnahme"
									bind:value={g.fuehler}
									options={[
										["direkt", "Direktfühler"],
										["tauch", "Tauchhülse"],
										["keine", "Nicht vorhanden"],
										["unbekannt", "Unbekannt"],
									]}
									tip={tip("fuehler")}
								/>
							</div>
						</div>
					{/if}
					<Note warn
						>Bei Wärmezählern sind auch die beiden Temperaturfühler und ihre
						Einbaustellen entscheidend. Die finale Auslegung prüft Heidi.</Note
					>
				{/if}

				{#if g.inst !== "nein"}
					<div class="ss-cond">
						<Question
							text="Fotos des Zählers"
							kind="sub"
							hint="(optional)"
							tip={QUESTION_TIPS.meterPhotos}
						/>
						<Drop
							id="{g.id}z"
							label="Fotos hinzufügen"
							hint={meterPhotoHint}
							small
							max={4}
						/>
					</div>
				{:else}
					<div class="ss-cond">
						<Question
							text="Fotos der Einbausituation"
							kind="sub"
							hint="(optional, hilft uns sehr)"
							tip={SITE_PHOTO_TIPS[d] ?? QUESTION_TIPS.sitePhotos}
							img={SITE_PHOTOS[d]}
						/>
						{#if SITE_PHOTOS[d]}
							<div class="ss-exw">
								<figure class="ss-ex">
									<Image
										src={SITE_PHOTOS[d]}
										alt="Beispiel einer Einbausituation"
										width={720}
										height={720}
										sizes="150px"
									/>
									<figcaption>So sollte es aussehen</figcaption>
								</figure>
								<div class="ss-exd">
									<Drop
										id={g.id}
										label="Fotos hinzufügen"
										hint={sitePhotoHint}
										small
										max={4}
									/>
								</div>
							</div>
						{:else}
							<Drop
								id={g.id}
								label="Fotos hinzufügen"
								hint={sitePhotoHint}
								small
								max={4}
							/>
						{/if}
					</div>
				{/if}

				{#if d !== "hkv" && !capsuleMeter(d, g)}
					<p class="ss-sub">Absperrventil vorhanden?*</p>
					<Options
						class="grid2 absv"
						options={[
							{
								v: "ja",
								label: "Ja",
								icon: ICONS.keep,
								small: "Vor und hinter dem Zähler absperrbar",
							},
							{
								v: "nein",
								label: "Nein",
								icon: ICONS.none,
								small: "Leitung lässt sich nicht absperren",
							},
						]}
						value={g.absv}
						onpick={(v) => (g.absv = v)}
					/>
					{#if g.absv === "nein"}
						<div class="ss-cond">
							<Note warn
								>Ohne Absperrventil muss vor dem Zählertausch ein Sanitärbetrieb
								ein Ventil setzen. Das planen wir mit ein.</Note
							>
						</div>
					{/if}
				{/if}
				<Text
					area
					label="Besonderheiten"
					bind:value={g.bem}
					placeholder="Falls etwas unklar ist, hier erläutern"
					tip={tip("bem")}
				/>
			{/if}
		</div>
	{/each}
</div>
<button type="button" class="ss-add" onclick={add}
	><Markup
		html={ICONS.plus.replace("<svg", '<svg width="18" height="18"')}
	/>Weitere Bauart oder Zählergruppe hinzufügen</button
>
