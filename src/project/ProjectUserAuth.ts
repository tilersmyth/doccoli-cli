import chalk from "chalk";

import { MeCommand } from "../commands/MeCommand";
import { LoginCommand } from "../commands/LoginCommand";

/**
 * Check user auth for Undoc project setup
 */
export class ProjectUserAuth {
  async run(): Promise<void> {
    try {
      const isAuth = await new MeCommand().isAuth();

      if (!isAuth) {
        console.log(chalk.green("\n\nSign in to Undoc your project!\n\n"));

        await new LoginCommand().handler();
      }
    } catch (err) {
      throw err;
    }
  }
}
