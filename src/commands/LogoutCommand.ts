import chalk from "chalk";

import keytar from "../utils/keytar";

/**
 * Log out current user
 */
export class LogoutCommand {
  command = "logout";
  describe = "Log out current user";

  async handler(): Promise<void> {
    const logout = await keytar.removeToken();
    if (logout) {
      console.log("\nSuccessfully logged out\n");
      return;
    }
  }
}
