import chalk from "chalk";
import { readDir, createDir, writeFile } from "../utils/files";

/**
 * Create Undoc folder with config files
 */
export class CreateProjectFiles {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  private tdJson = {
    mode: "module",
    json: "./docs.json",
    excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  run = async (): Promise<void> => {
    const rootDir = process.cwd();
    const undocDir = readDir(`${rootDir}/.undoc`);

    if (!undocDir) {
      createDir(`${rootDir}/.undoc`);
    }

    const projectFile = await writeFile(
      `${rootDir}/.undoc/config.json`,
      `{"key":"${this.id}"}`
    );

    if (!projectFile) {
      console.log(chalk.red(`\nerror creating project file\n`));
      return;
    }

    await writeFile(`${rootDir}/.undoc/td.json`, JSON.stringify(this.tdJson));
  };
}
