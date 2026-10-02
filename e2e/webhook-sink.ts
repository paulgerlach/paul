/**
 * Stand-in for the Make.com webhook during e2e runs, so tests can assert the
 * payloads and nothing reaches the real scenario. POST stores the JSON body,
 * GET /events returns everything stored so far.
 */
import { createServer } from "node:http";

const PORT = 4199;

const events: unknown[] = [];

createServer((req, res) => {
	if (req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			events.push(JSON.parse(body));
			res.end("ok");
		});
		return;
	}
	res.setHeader("content-type", "application/json");
	res.end(JSON.stringify(events));
}).listen(PORT);
