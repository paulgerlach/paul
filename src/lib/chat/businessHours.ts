/** Mon–Fri 08:00–20:00, Berlin time. */
export function isWithinBusinessHours(now: Date): boolean {
	const berlin = new Date(
		now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }),
	);
	const hour = berlin.getHours();
	const day = berlin.getDay(); // 0 = Sunday
	return day >= 1 && day <= 5 && hour >= 8 && hour < 20;
}
