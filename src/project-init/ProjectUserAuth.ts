import { MeCommand } from "../commands/MeCommand";
import { LoginCommand } from "../commands/LoginCommand";

import InitEvents from "../events/init/Events";

/**
 * Check user auth for Undoc project setup
 */
export class ProjectUserAuth {
  async run(): Promise<void> {
    try {
      const isAuth = await new MeCommand().isAuth();

      if (!isAuth) {
        InitEvents.emitter(
          "user_auth",
          "\n\nSign in to Undoc your project!\n\n"
        );

        await new LoginCommand().handler();
      }

      return;
    } catch (err) {
      throw err;
    }
  }
}
