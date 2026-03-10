import { parseArgs } from "util";
import { Injector } from "./inject/injector";

async function main() {

    const { values: args } = parseArgs({
        args: Bun.argv,
        options: {
            input: {
                type: 'string',
                short: 'i',
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
        console.error("-i: file input field required");
        return;
    }

    const injector = new Injector(args.input);
    injector.run();
}


main();