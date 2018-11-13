import chalk from "chalk";

/**
 * User login
 */
export class LoginCommand {
  command = "login";
  describe = "Log user in.";

  async handler(argv: any): Promise<void> {
    console.log(chalk.green("\n\n ======*** User Login ***====== \n\n"));
  }
}
