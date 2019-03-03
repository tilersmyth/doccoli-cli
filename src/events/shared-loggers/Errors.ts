import chalk from "chalk";
import * as ora from "ora";

import { EventToken } from "../Types";

export class ErrorsLogger {
  spinner: ora.Ora;

  constructor(spinner: ora.Ora) {
    this.spinner = spinner;
  }

  log = (context: any, _: EventToken, __: EventToken) => {
    this.spinner.fail(chalk.red(`${context}`));
  };
}
