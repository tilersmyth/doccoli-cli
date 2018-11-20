import { FileUtils } from "./FileUtils";

export class NpmFile {
  static async version(): Promise<any> {
    try {
      const file = await FileUtils.readFile("package.json");
      const parsedFile = JSON.parse(file);

      if (!parsedFile.version) {
        throw "package.json is missing version";
      }

      return parsedFile.version;
    } catch (err) {
      throw err;
    }
  }
}
