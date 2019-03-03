import { EventToken } from "./Types";

export class EventsUtils {
  static parser(event: string): EventToken {
    try {
      const splitUnderscore = event.split(/_(.+)/, 2);

      // Event indicator must have prefix and payload
      if (!splitUnderscore[1]) {
        throw "Invalid event token";
      }

      return {
        group: splitUnderscore[0],
        payload: splitUnderscore[1]
      };
    } catch (err) {
      throw err;
    }
  }
}
