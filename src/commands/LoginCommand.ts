import chalk from "chalk";
import * as inquirer from "inquirer";

import { LoginApi } from "../api/LoginApi";

import { loginInputs } from "../utils/inputs";
import { LoginMutationVariables } from "../types/schema";
import keytar from "../utils/keytar";

/**
 * User login
 */
export class LoginCommand {
  command = "login";
  describe = "Log user in.";

  async handler(argv: any): Promise<void> {
    console.log(chalk.green("\n\n ======*** Login to Doccoli ***====== \n\n"));

    const values = await inquirer.prompt<LoginMutationVariables>(loginInputs);

    // Validation
    if (!values.email || !values.password) {
      console.log(chalk.red("\nemail and password are required for login\n"));
      return;
    }

    try {
      const { token, errors } = await new LoginApi(values).results();

      if (errors) {
        errors.forEach((err: any) => {
          console.log(`\n${chalk.red(err.message)}\n`);
        });
        return;
      }

      await keytar.setToken(token as string);

      await console.log("\nSuccessfully logged in\n");
    } catch (err) {
      console.log(`\n${chalk.red("Unexpected server error")}\n`);
    }
  }
}
