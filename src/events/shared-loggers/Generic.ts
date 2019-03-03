import chalk from "chalk";
import * as ora from "ora";

import { EventToken } from "../Types";

export class GenericLogger {
  spinner: ora.Ora;
  parentEvent: EventToken;

  constructor(spinner: ora.Ora, parentEvent: EventToken) {
    this.spinner = spinner;
    this.parentEvent = parentEvent;
  }

  log = (context: any, newEvent: EventToken, oldEvent?: EventToken): void => {
    // New event group
    if (!oldEvent || oldEvent.group !== newEvent.group) {
      this.spinner.start(chalk.bold.whiteBright(context));
      return;
    }

    // Verbose
    if (this.parentEvent.payload !== newEvent.payload) {
      this.spinner.start(chalk.white(`  ${context}`));
      return;
    }
  };
}
