import chalk from "chalk";

import { MeApi } from "../api/MeApi";

import { MeQuery_cliMe } from "../types/schema";

/**
 * User basic info and authentication methods
 */
export class MeCommand {
  command = "me";
  aliases = "whoami";
  describe = "Get current user info";

  private async getUser(): Promise<MeQuery_cliMe> {
    try {
      return await new MeApi().results();
    } catch (err) {
      throw err;
    }
  }

  // Fat arrow for lexical scope
  handler = async (): Promise<void> => {
    try {
      const user = await this.getUser();

      console.log(
        `\nLogged in as ${user.firstName} ${user!.lastName} (${user!.email})\n`
      );
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  };

  isAuth = async (): Promise<Boolean> => {
    try {
      const user = await this.getUser();
      return user ? true : false;
    } catch (err) {
      return false;
    }
  };
}
