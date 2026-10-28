/**
 * Stand-in for the Make.com webhook during e2e runs, so tests can assert the
 * payloads and nothing reaches the real scenario. POST stores the JSON body,
 * GET /events returns everything stored so far.
 *
 * An event whose email is at FAIL_DOMAIN gets a 500 and isn't stored, for
 * tests of a failing Make.com scenario. Keyed on the payload, not a toggle,
 * so tests running in parallel can't trip each other.
 */
import { createServer } from "node:http";

const PORT = 4199;
const FAIL_DOMAIN = "@sink-fails.example";

const events: unknown[] = [];

createServer((req, res) => {
	if (req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			const event = JSON.parse(body);
			if (String(event.email ?? "").endsWith(FAIL_DOMAIN)) {
				res.statusCode = 500;
				res.end("fail");
				return;
			}
			events.push(event);
			res.end("ok");
		});
		return;
	}
	res.setHeader("content-type", "application/json");
	res.end(JSON.stringify(events));
}).listen(PORT);
