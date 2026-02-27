import { decodeSerial } from "./src/decoder/decode";
import Interceptor from "./src/interceptor";

import { parseArgs } from "util";

async function main() {
    const { values } = parseArgs({
        args: Bun.argv,
        options: {
            topic: {
                type: "string",
                short: "t",
                default: "#", 
            },
            output: {
                type: "string",
                short: "o",
                default: "",
            },
        },
        strict: true,
        allowPositionals: true,
    });
    
    try {
        const app = new Interceptor(values.topic, values.output || undefined);
    }
    catch (e: any) {
        console.error("Error running interceptor: ", e);
    }
}


await main();