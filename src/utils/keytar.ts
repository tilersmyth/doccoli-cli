import * as keytar from "keytar";

export default {
  setToken: async (token: string): Promise<void> => {
    await keytar.setPassword("undoc", "user", token as string);
  },
  getToken: async (): Promise<string | null> => {
    return await keytar.getPassword("undoc", "user");
  },
  removeToken: async (): Promise<boolean> => {
    return await keytar.deletePassword("undoc", "user");
  }
};
