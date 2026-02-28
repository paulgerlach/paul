import { parseArgs } from "util";
// import CSVTelegramSupabaseUploader from "./tool/run";
import { Utils } from "./csv/utils";
import { readFileSync } from "fs";
import { parseRow } from "./parser/parse";
import { getMeterIds } from "./parser/getmeterids";
import CSVDirectInjector from "./tool/run";
// import { getSupabaseClient } from "./supabase/client";


// let bs = [168, 68, 197, 20, 66, 99, 133, 51, 0, 4, 122, 51, 19, 0, 32, 47, 47, 4, 109, 23, 38, 91, 50, 4, 6, 0, 0, 0, 0, 4, 19, 0, 0, 0, 0, 1, 253, 23, 16, 66, 108, 63, 60, 68, 6, 0, 0, 0, 0, 196, 1, 6, 0, 0, 0, 0, 196, 2, 6, 0, 0, 0, 0, 196, 3, 6, 0, 0, 0, 0, 196, 4, 6, 0, 0, 0, 0, 196, 5, 6, 0, 0, 0, 0, 196, 6, 6, 0, 0, 0, 0, 196, 7, 6, 0, 0, 0, 0, 196, 8, 6, 0, 0, 0, 0, 196, 9, 6, 0, 0, 0, 0, 196, 10, 6, 0, 0, 0, 0, 196, 11, 6, 0, 0, 0, 0, 196, 12, 6, 0, 0, 0, 0, 196, 13, 6, 0, 0, 0, 0, 196, 14, 6, 0, 0, 0, 0, 196, 15, 6, 0, 0, 0, 0, 3, 253, 12, 5, 1, 0, 2, 253, 11, 33, 17];


async function main() {



    const { values: args } = parseArgs({
        args: Bun.argv,
        options: {
            input: {
                type: 'string',
                short: 'i',
            },
            ingest: {
                type: "boolean",
                short: "u",
                default: false,
            },
            verbose: {
                type: "boolean",
                short: "v",
                default: false,
            },
        },
        strict: true,
        allowPositionals: true,
    });

    if (!args.input) {
        console.error("please specify input .csv file with -i <file>");
        return;
    }


    const tool = new CSVDirectInjector(
        args.input!,
        args.verbose,
        args.ingest,
    );

    await tool.run();
}


main();
