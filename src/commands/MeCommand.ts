import chalk from "chalk";

import { MeApi } from "../api/MeApi";
import { MeQuery_cliMe } from "../types/schema";
import keytar from "../utils/keytar";

/**
 * User basic info and authentication methods
 */
export class MeCommand {
  command = "me";
  describe = "Get current user info";

  private async getUser() {
    const token = await keytar.getToken();
    if (!token) {
      return null;
    }
    return await new MeApi(token as string).results();
  }

  // Fat arrow for lexical scope
  handler = async (): Promise<void> => {
    try {
      const user = await this.getUser();

      if (!user) {
        console.log(`\n${chalk.red("Not authorized. Please login.")}\n`);
        return;
      }

      console.log(
        `\nLogged in as ${user.firstName} ${user!.lastName} (${user!.email})\n`
      );
    } catch (err) {
      console.log(`\n${chalk.red("Unexpected server error")}\n`);
    }
  };

  isAuth = async (): Promise<Boolean> => {
    try {
      const user = await this.getUser();
      return user ? true : false;
    } catch (err) {
      console.log(`\n${chalk.red("Unexpected server error")}\n`);
      return false;
    }
  };
}
