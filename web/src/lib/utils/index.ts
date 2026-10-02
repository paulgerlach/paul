export function formatDate(input?: string): string {
	const months = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember",
	];
	if (!input) return "";

	const [year, month, day] = input.split("-");
	const monthName = months[parseInt(month, 10) - 1];

	return `${parseInt(day, 10)} ${monthName} ${year}`;
}
