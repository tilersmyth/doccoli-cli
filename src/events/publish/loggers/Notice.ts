import chalk from "chalk";
import * as ora from "ora";

import { EventToken } from "../../Types";

export class NoticeLogger {
  spinner: ora.Ora;

  constructor(spinner: ora.Ora) {
    this.spinner = spinner;
  }

  log = (context: any, _: EventToken, __: EventToken): void => {
    this.spinner.warn(chalk.yellow(`${context}`));
    return;
  };
}
