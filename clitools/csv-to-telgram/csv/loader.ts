import { parse, Parser } from 'csv-parse';
import { createReadStream } from 'fs';


export async function getCSVData(filepath: string): Promise<Parser> {
    const parser = createReadStream(filepath).pipe(parse({
        columns: ['gateway_eui', 'telegram'],
        from_line: 2,
        cast: (value, context) => {
            if (context.column === 'telegram') {
                const parsed = JSON.parse(value);
                return Buffer.from(parsed.data);
            }
            return value;
        }
    }));

    return parser;
}