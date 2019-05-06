import { FileUtils } from "./FileUtils";

interface ConfigFile {
  key: string;
  name: string;
  language: string;
}

export class UndocFile {
  static async config(): Promise<ConfigFile> {
    try {
      const file = await FileUtils.readFile(".undoc/config.json");

      if (!file) {
        throw "Unable to locate Undoc config file. Run command: 'undoc init'.";
      }

      const parsedFile = JSON.parse(file);

      if (!parsedFile.key) {
        throw "Key field is missing from config file";
      }

      if (!parsedFile.name) {
        throw "Name field is missing from config file";
      }

      if (!parsedFile.language) {
        throw "Language field is missing from config file";
      }

      return parsedFile;
    } catch (err) {
      throw err;
    }
  }
}
