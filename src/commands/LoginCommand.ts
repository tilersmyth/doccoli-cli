import chalk from "chalk";
import * as inquirer from "inquirer";

import { LoginApi } from "../api/LoginApi";

import { LoginMutationVariables } from "../types/schema";
import keytar from "../utils/keytar";

/**
 * User login
 */
export class LoginCommand {
  command = "login";
  describe = "Log user in.";

  private inputs = [
    {
      type: "input",
      name: "email",
      message: "Enter email"
    },
    {
      type: "password",
      name: "password",
      message: "Enter password"
    }
  ];

  handler = async (): Promise<void> => {
    console.log(chalk.green("\n\n ======*** Login to Undoc ***====== \n\n"));

    const values = await inquirer.prompt<LoginMutationVariables>(this.inputs);

    try {
      // Validation
      if (!values.email || !values.password) {
        throw "\nemail and password are required for login\n";
      }

      const { token, error } = await new LoginApi(values).results();

      if (error) {
        throw error;
      }

      await keytar.setToken(token as string);
      console.log(`\n${chalk.green("Successfully logged in")}\n`);
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  };
}
