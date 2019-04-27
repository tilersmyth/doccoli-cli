import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as rimraf from "rimraf";

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
  static createDirectories(directory: string): Promise<void> {
    return new Promise<void>((ok, fail) => {
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
  ): Promise<string> {
    await FileUtils.createDirectories(path.dirname(filePath));
    return new Promise<string>((ok, fail) => {
      if (override === false && fs.existsSync(filePath)) return ok(filePath);

      fs.writeFile(filePath, content, err => (err ? fail(err) : ok(filePath)));
    });
  }

  /**
   * Reads everything from a given file and returns its content as a string
   */
  static async readFile(filePath: string): Promise<string> {
    const root = FileUtils.root();
    return new Promise<string>(ok => {
      fs.readFile(`${root}/${filePath}`, (err, data) =>
        err ? ok() : ok(data.toString())
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

  /**
   * Return boolean depending on existence of file
   */
  static deleteDirectory(dirPath: string): Promise<void> {
    const root = FileUtils.root();
    return new Promise<void>((ok, fail) => {
      rimraf(`${root}/${dirPath}`, (err: any) => {
        err ? fail(err) : ok();
      });
    });
  }
}
