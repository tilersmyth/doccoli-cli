import * as keytar from "keytar";

export default {
  setToken: async (token: string): Promise<void> => {
    await keytar.setPassword("doccoli", "user", token as string);
  },
  getToken: async (): Promise<string | null> => {
    return await keytar.getPassword("doccoli", "user");
  },
  removeToken: async (): Promise<boolean> => {
    return await keytar.deletePassword("doccoli", "user");
  }
};
