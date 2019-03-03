import chalk from "chalk";
import * as ora from "ora";
import * as readline from "readline";

import { EventToken } from "../../Types";
import { EventsUtils } from "../../EventsUtils";

export class ParserLogger {
  spinner: ora.Ora;
  private newNodeCount: number = 0;
  private refNodeCount: number = 0;

  constructor(spinner: ora.Ora) {
    this.spinner = spinner;
  }

  private static console(value: string) {
    process.stdout.write(chalk.white(`    ${value}`));
  }

  private static writeOutput(value: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    ParserLogger.console(value);
  }

  private verboseNew(event: string, context: any) {
    if (event === "node_found") {
      this.newNodeCount++;

      ParserLogger.writeOutput(
        `${this.newNodeCount} tagged module${
          this.newNodeCount > 1 ? "s" : ""
        } found`
      );
    }

    if (event === "find_nodes_end") {
      console.log("");
    }
  }

  private verboseUpdate(event: string, context: any) {
    if (event === "find_file_nodes_start") {
      ParserLogger.console(`${context}\n`);
    }

    if (event === "file_node_line_updates") {
      ParserLogger.console(`${context}\n`);
    }
  }

  private verboseRef(event: string, context: any) {
    if (event === "find_nodes") {
      ParserLogger.console(`${context}\n`);
    }

    if (event === "new_node_found") {
      this.refNodeCount++;
      ParserLogger.writeOutput(
        `${this.refNodeCount} node interface references found`
      );
    }

    if (event === "new_node_end") {
      console.log("");
    }
  }

  log = (context: any, newEvent: EventToken, __: EventToken): void => {
    if (newEvent.payload === "init") {
      this.spinner.start(chalk.bold.whiteBright(context));
      return;
    }

    // Parsing sub token
    const subEvent = EventsUtils.parser(newEvent.payload);

    if (subEvent.group === "update") {
      this.verboseUpdate(subEvent.payload, context);
      return;
    }

    if (subEvent.group === "ref") {
      this.verboseRef(subEvent.payload, context);
      return;
    }

    if (subEvent.group === "new") {
      this.verboseNew(subEvent.payload, context);
      return;
    }
  };
}
