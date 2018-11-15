import "./utils/polyfills";
import * as yargs from "yargs";

import { LoginCommand } from "./commands/LoginCommand";
import { LogoutCommand } from "./commands/LogoutCommand";
import { MeCommand } from "./commands/MeCommand";
import { ProjectInitCommand } from "./commands/ProjectInitCommand";

export default (args: any) => {
  yargs(args)
    .usage("Usage: $0 <command> [options]")
    .command(new LoginCommand())
    .command(new LogoutCommand())
    .command(new MeCommand())
    .command(new ProjectInitCommand())
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help").argv;
};
