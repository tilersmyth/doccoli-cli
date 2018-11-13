import "./utils/polyfills";
import * as yargs from "yargs";

import { LoginCommand } from "./commands/LoginCommand";

export default (args: any) => {
  yargs(args)
    .usage("Usage: $0 <command> [options]")
    .command(new LoginCommand())
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help").argv;
};
