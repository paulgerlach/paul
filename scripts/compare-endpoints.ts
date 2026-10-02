/**
 * Phase 6 check: posts the same fixtures to the Next app and the SvelteKit app
 * and compares status codes and bodies. To compare the outgoing Make.com
 * payloads too, point MAKE_WEBHOOK_UNIFIED at the same request bin in both.
 *
 *   bun scripts/compare-endpoints.ts [nextOrigin] [svelteOrigin]
 *
 * Contact fixtures run in order: the 3-per-10-minutes rate limit is hit by
 * the last one only if both servers were freshly started.
 */
const [next = "http://localhost:3000", svelte = "http://localhost:5173"] =
	process.argv.slice(2);

const contact = {
	name: "Max Mustermann",
	email: "max@example.com",
	message: "Guten Tag, ich hätte gerne ein Angebot.",
	infoChecked: true,
	_hp: "",
	_t: Date.now() - 10_000,
};

const fragebogen = {
	customer_type: "Hausverwaltung",
	property_count_category: "51-800 Immobilien",
	messdienstleister_count: 10,
	zusammenarbeit_status: "Teils / teils",
	akuter_handlungsbedarf: "Ja",
	wohnungen_count: 3,
	funkzaehler_status: null,
	standort_schwerpunkt: "",
	verwaltung_name: "Muster GmbH",
	postleitzahl: "10115",
	ort: "Berlin",
	phone: "+4930123456",
	email: "max@example.com",
	first_name: "Max",
	last_name: "Mustermann",
	form_confirm: true,
	appartment_number: 2,
	heating_costs: null,
	heating_available: null,
	central_water_supply: null,
	central_heating_system: null,
	energy_sources: "Fernwärme",
};

type Fixture = { name: string; path: string; body: unknown };

const fixtures: Fixture[] = [
	{
		name: "contact: honeypot",
		path: "/api/contact",
		body: { ...contact, _hp: "x" },
	},
	{
		name: "contact: too fast",
		path: "/api/contact",
		body: { ...contact, _t: Date.now() },
	},
	{
		name: "contact: invalid",
		path: "/api/contact",
		body: { ...contact, email: "nope" },
	},
	{
		name: "contact: gibberish",
		path: "/api/contact",
		body: { ...contact, name: "wyichtvxKjBGMhTz" },
	},
	{ name: "contact: valid 1", path: "/api/contact", body: contact },
	{ name: "contact: valid 2", path: "/api/contact", body: contact },
	{ name: "contact: valid 3", path: "/api/contact", body: contact },
	{ name: "contact: rate-limited", path: "/api/contact", body: contact },
	{
		name: "send-email: valid",
		path: "/api/send-email",
		body: { email: "max@example.com" },
	},
	{ name: "fragebogen: valid", path: "/api/fragebogen", body: fragebogen },
	// Next accepts these (KI-16); SvelteKit should answer 400
	{
		name: "fragebogen: invalid*",
		path: "/api/fragebogen",
		body: { ...fragebogen, email: "nope" },
	},
	{ name: "leads: invalid*", path: "/api/leads", body: { email: "nope" } },
];

async function post(origin: string, { path, body }: Fixture) {
	try {
		const res = await fetch(origin + path, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		return `${res.status} ${await res.text()}`;
	} catch (e) {
		return `ERR ${(e as Error).message}`;
	}
}

let mismatches = 0;
for (const fixture of fixtures) {
	const [a, b] = [await post(next, fixture), await post(svelte, fixture)];
	const same = a === b;
	if (!same && !fixture.name.endsWith("*")) mismatches++;
	console.log(`${same ? "✓" : "✗"} ${fixture.name}`);
	if (!same) console.log(`    next:   ${a}\n    svelte: ${b}`);
}
console.log(`\n${mismatches} unexpected mismatch(es); * = intended difference`);
process.exit(mismatches ? 1 : 0);
