import * as keytar from "keytar";

export default {
  setToken: async (token: string): Promise<void> => {
    try {
      await keytar.setPassword("undoc", "user", token as string);
    } catch (err) {
      throw err;
    }
  },
  getToken: async (): Promise<string> => {
    try {
      const token = await keytar.getPassword("undoc", "user");

      if (!token) {
        throw "Not authorized. Please login.";
      }

      return token as string;
    } catch (err) {
      throw err;
    }
  },
  removeToken: async (): Promise<boolean> => {
    try {
      return await keytar.deletePassword("undoc", "user");
    } catch (err) {
      throw err;
    }
  }
};
