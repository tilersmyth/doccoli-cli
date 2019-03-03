import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  updates: any;

  constructor(updates?: any) {
    this.updates = updates;
  }

  private async selectParser(events: any) {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          if (this.updates) {
            return await require("@undoc/ts-parse").parseUpdate(
              events,
              this.updates
            );
          }
          return await require("@undoc/ts-parse").parseNew(events);
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      return await this.selectParser(PublishEvents.emitter);
    } catch (err) {
      throw err;
    }
  }
}
