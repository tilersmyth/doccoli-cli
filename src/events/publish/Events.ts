import * as events from "events";
import * as ora from "ora";

import { EventsUtils } from "../EventsUtils";
import { PublishEventGroup } from "./EventGroup";

class PublishEvents extends events.EventEmitter {
  private publishEventGroup?: PublishEventGroup;
  private spinner: ora.Ora = ora({ color: "white" });

  constructor() {
    super();
  }

  private action(verbose: boolean, event: string, context: any): void {
    const newEvent = EventsUtils.parser(event);

    // Create new event group instance - first run
    if (!this.publishEventGroup) {
      this.publishEventGroup = new PublishEventGroup(
        this.spinner,
        verbose,
        newEvent
      );
      this.publishEventGroup.route(newEvent, context);
      return;
    }

    const { oldEvent } = this.publishEventGroup;

    // Create new event group instance - event group change
    if (!oldEvent || oldEvent.group !== newEvent.group) {
      this.publishEventGroup = new PublishEventGroup(
        this.spinner,
        verbose,
        newEvent
      );
    }

    this.publishEventGroup.route(newEvent, context);
  }

  emitter = (event: string, context: any): void => {
    this.emit("undoc_publish", event, context);
  };

  start = (verbose: boolean): void => {
    this.on("undoc_publish", this.action.bind(this, verbose));
  };

  spinnerReset = (): void => {
    if (this.publishEventGroup) {
      this.publishEventGroup.spinnerReset();
    }
  };

  stop = (): void => {
    this.spinnerReset();
    this.removeListener("undoc_publish", this.action);
  };
}

export default new PublishEvents();
