import * as keytar from "keytar";
import chalk from "chalk";

export default {
  setToken: async (token: string): Promise<void> => {
    await keytar.setPassword("undoc", "user", token as string);
  },
  getToken: async (): Promise<string | null> => {
    const token = await keytar.getPassword("undoc", "user");

    if (!token) {
      console.log(chalk.red("Not authorized. Please login."));
      return null;
    }

    return token as string;
  },
  removeToken: async (): Promise<boolean> => {
    return await keytar.deletePassword("undoc", "user");
  }
};
