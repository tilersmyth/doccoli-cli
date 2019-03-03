import chalk from "chalk";
import * as ora from "ora";

import { EventToken } from "../../Types";

export class DependenciesLogger {
  spinner: ora.Ora;

  constructor(spinner: ora.Ora) {
    this.spinner = spinner;
  }

  private verbose(event: string, context: any) {
    if (event === "install_dep_done") {
      this.spinner.start(chalk.white(`  ${context}\n`));
      return;
    }

    this.spinner.start(chalk.white(`  ${context}`));
  }

  log = (context: any, newEvent: EventToken, __: EventToken): void => {
    if (newEvent.payload === "install_init") {
      this.spinner.start(chalk.bold.whiteBright(context));
      return;
    }

    this.verbose(newEvent.payload, context);
  };
}
