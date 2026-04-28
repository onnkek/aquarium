export type LogEntry = {
	type: LogSource;
	timestamp: string;
	level: string;
	message: string;
};
type LogSource = "system" | "relay" | "doser";
const logBlockRegex =
	/\[\s*(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\s*\d{2}:\s*\d{2})\s*\]\s*\[\s*([A-Z]+)\s*\]\s*:\s*([\s\S]*?)(?=\n\[\s*\d{2}\/\d{2}\/\d{4}\s+\d{2}:\s*\d{2}:\s*\d{2}\s*\]\s*\[\s*[A-Z]+\s*\]\s*:|$)/g;
export function parseLogs(input: string, type: LogSource): LogEntry[] {
	const re =
		/\[\s*(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\s*\d{2}:\s*\d{2})\s*\]\s*\[\s*([A-Z]+)\s*\]\s*:\s*([\s\S]*?)(?=\n\[\s*\d{2}\/\d{2}\/\d{4}\s+\d{2}:\s*\d{2}:\s*\d{2}\s*\]\s*\[\s*[A-Z]+\s*\]\s*:|$)/g;

	const result: LogEntry[] = [];
	let match: RegExpExecArray | null;

	while ((match = re.exec(input)) !== null) {
		const [, rawTimestamp, level, message] = match;
		const normalizedTimestamp = rawTimestamp.replace(/\s+/g, " ").trim();
		const [datePart, timePart] = normalizedTimestamp.split(" ");
		const [month, day, year] = datePart.split("/");
		const iso = `${year}-${month}-${day}T${timePart}`;

		result.push({
			type,
			timestamp: iso,
			level,
			message: message.trim(),
		});
	}

	return result;
}