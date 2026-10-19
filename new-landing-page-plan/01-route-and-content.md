# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_ASSET_MANAGER = "/asset-manager"` in `$lib/routes.ts`, after `ROUTE_WOHNUNGSUNTERNEHMEN`.
- The landing footer's "Asset Manager & Fonds" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_ASSET_MANAGER`. "Private Vermieter" stays plain text.
- `/wohnungsunternehmen`'s tab "Asset Manager & Fonds" (`tabs` in its `content.ts`) gets `href: ROUTE_ASSET_MANAGER`; its `content.test.ts` and e2e tab test follow.
- `src/routes/(landing-page)/asset-manager/+page.server.ts`, a copy of `wohnungsunternehmen/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Verbrauchsdaten für Asset Manager und Fonds: das ganze Portfolio auf einen Blick | Heidi Systems",
		description:
			"Heidi liefert Asset Managern und Fonds eine einheitliche Datenbasis über alle Objekte und Verwaltungen: fernablesbare Zähler, monatliche Verbräuche und Abrechnungen nach HKVO in einem Dashboard.",
		ogTitle: "Verbräuche im ganzen Portfolio. Auf einen Blick.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "asset-manager", page: ROUTE_ASSET_MANAGER }),
};
```

  No `cache-control` (the layout sets it). `leads.source` is free text: no migration.
- **Other links to the page:** `/wohnungsunternehmen`'s tab (above). Searched every saved design for `AEn4zzY1ZEwShZW7cUf5fF`: otherwise only the designs' nav and footer.
- `+page.svelte`: `<main id="content" class="am" {@attach reveal()}>` with `SgMain` around every section, `FloatingCta` after `</main>`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/asset-manager/content.ts`, in the `sg` shapes, word for word from the design, with a non-breaking space between a figure and its unit (as on the other pages). The texts that differ from `/wohnungsunternehmen` (02 §2.1):

- `hero`: pill "Für Asset Manager & Fonds" (icon `bars`), H1 "Verbräuche im ganzen Portfolio." + accent "Auf einen Blick.", lead "Für Asset Manager und Fonds liefert Heidi eine einheitliche Datenbasis über alle Objekte und Verwaltungen hinweg: fernablesbare Zähler, monatliche Verbräuche und Abrechnungen nach HKVO."
- `calc.start`: `12000`.
- `tabs`: Wohnungsunternehmen → `ROUTE_WOHNUNGSUNTERNEHMEN`, Asset Manager & Fonds current → `ROUTE_ASSET_MANAGER`.
- `benefits`: pill "Für Asset Manager & Fonds" (`sparkle`); "Ein Dashboard" (`bars`, dark) – "Verbräuche aller Liegenschaften an einem Ort, statt verteilt auf Portale und PDFs.", "Monatliche Daten" (`trend`) – "Verbräuche per Funk statt einmal im Jahr. Auffälligkeiten erkennen Sie früh.", "Pflichten im Griff" (`alert`) – "Fernablesbarkeit ab 2027, monatliche Verbrauchsinfo und CO₂-Kostenaufteilung, für alle Objekte gleich.", "Daten, wo Sie sie brauchen" (`erp`) – "Anbindung an bestehende Systeme statt Exporte per E-Mail."
- `quotes`: keys `gerhard`, `werne`.
- `faq` 1–2: "Welche Daten sehen wir?" – "Die Verbräuche aller angebundenen Liegenschaften, monatlich per Funk, und die fertigen Heizkostenabrechnungen. Auf Wunsch direkt in Ihrem System."; "Wie schnell sind alle Objekte fernablesbar?" – "Das hängt von Bestand und Vertragslage ab. Mit dem Portfolio-Check planen wir einen Rollout, der zu Ihren Fristen passt."

Everything else (calculator texts, logos, 1000+, problems, feature rows, steps, FAQ 3–4, closing) is the same text as `/wohnungsunternehmen`'s.

`content.test.ts`: as `/wohnungsunternehmen`'s (the H1, `href`s, trimmed texts, non-breaking spaces, five tabs with one current, eight problems, four benefits and steps, the tiles' example data, the quotes word for word, four questions), plus: every shared section equals `/wohnungsunternehmen`'s (so a fix to one is noticed on the other).

## 1.3 Images

None new.

## 1.4 Hero and the `#start` anchor

As on `/wohnungsunternehmen`: the closing card is `#start`; the hero section has no id.

## 1.5 Link mapping

As `/wohnungsunternehmen`'s (its plan at `4f1f649e`, 01 §1.5), except: `#start` on the current tab → `ROUTE_ASSET_MANAGER`; `2XwVWrEs9cvcDpBtQxzGnt` (tab "Wohnungsunternehmen") → `ROUTE_WOHNUNGSUNTERNEHMEN`.
