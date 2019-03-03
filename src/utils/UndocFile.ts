import { FileUtils } from "./FileUtils";

export class UndocFile {
  static async config(): Promise<any> {
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

      if (!parsedFile.target) {
        throw "Target field is missing from config file";
      }

      return parsedFile;
    } catch (err) {
      throw err;
    }
  }
}
