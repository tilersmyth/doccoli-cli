import * as ora from "ora";

import { GenericLogger, ErrorsLogger } from "../shared-loggers";
import { GeneratorLogger, ParserLogger, NoActionLogger } from "./loggers";
import { EventToken } from "../Types";

export class PublishEventGroup {
  oldEvent?: EventToken;
  private spinner: ora.Ora;
  private verbose: boolean;
  private parentEvent: EventToken;
  private logger: any;

  private loggerQB: any = [
    {
      init: GenericLogger,
      connect: GenericLogger,
      existing: GenericLogger,
      existingFiles: GenericLogger,
      generator: GeneratorLogger,
      parser: ParserLogger,
      push: GenericLogger,
      cleanup: GenericLogger,
      complete: GenericLogger,
      error: ErrorsLogger,
      noaction: NoActionLogger
    }
  ];

  private setLogger(parentEvent: EventToken) {
    try {
      const loggerIndex: any = this.loggerQB.findIndex(
        (type: any) => type[parentEvent.group]
      );

      if (loggerIndex < 0) {
        throw `No handler for group: "${parentEvent.group}"`;
      }

      const logger = this.loggerQB[loggerIndex][parentEvent.group];

      return new logger(this.spinner, parentEvent);
    } catch (err) {
      throw err;
    }
  }

  constructor(spinner: ora.Ora, verbose: boolean, parentEvent: EventToken) {
    this.spinner = spinner;
    this.verbose = verbose;
    this.parentEvent = parentEvent;

    this.logger = this.setLogger(parentEvent);
  }

  spinnerReset = () => {
    if (!this.spinner.isSpinning) {
      return;
    }

    if (this.verbose) {
      this.spinner.stopAndPersist();
      return;
    }

    this.spinner.succeed();
  };

  route = (newEvent: EventToken, context: any) => {
    try {
      // If verbose flag not included, do not display child events
      if (!this.verbose && this.parentEvent.payload !== newEvent.payload) {
        return;
      }

      // Close out spinner if not error
      if (newEvent.group !== "error") {
        this.spinnerReset();
      }

      this.logger.log(context, newEvent, this.oldEvent);

      this.oldEvent = newEvent;
    } catch (err) {
      throw err;
    }
  };
}
