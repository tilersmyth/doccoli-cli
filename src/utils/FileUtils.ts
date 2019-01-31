import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

/**
 * Command line utils functions.
 */
export class FileUtils {
  /**
   * Returns root directory of project
   */
  static root() {
    return process.cwd();
  }

  /**
   * Creates directories recursively
   */
  static createDirectories(directory: string) {
    return new Promise((ok, fail) => {
      const root = FileUtils.root();
      return mkdirp(`${root}/${directory}`, (err: any) =>
        err ? fail(err) : ok()
      );
    });
  }

  /**
   * Creates a file with the given content in the given path
   */
  static async createFile(
    filePath: string,
    content: string,
    override: boolean = true
  ): Promise<void> {
    await FileUtils.createDirectories(path.dirname(filePath));
    return new Promise<void>((ok, fail) => {
      if (override === false && fs.existsSync(filePath)) return ok();

      fs.writeFile(filePath, content, err => (err ? fail(err) : ok()));
    });
  }

  /**
   * Reads everything from a given file and returns its content as a string
   */
  static async readFile(filePath: string): Promise<string> {
    const root = FileUtils.root();
    return new Promise<string>((ok, fail) => {
      fs.readFile(`${root}/${filePath}`, (err, data) =>
        err ? fail(err) : ok(data.toString())
      );
    });
  }

  /**
   * Return boolean depending on existence of file
   */
  static fileExists(filePath: string): boolean {
    const root = FileUtils.root();
    const path = filePath.indexOf(root) === -1 ? root : "";
    return fs.existsSync(`${path}/${filePath}`);
  }
}
