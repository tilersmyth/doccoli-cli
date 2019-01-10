import chalk from "chalk";

import { exec, spawn } from "child_process";
import { FileUtils } from "../utils/FileUtils";

/**
 * Install required dependencies depending on selected project type (TS only for now)
 */
export class ProjectTypeInstall {
  private static packageMgr() {
    return FileUtils.fileExists("yarn.lock");
  }

  private static executeCommandStream(
    command: string,
    action: string,
    dependency: string,
    args: string[]
  ) {
    return new Promise<void>((resolve, reject) => {
      console.log(action, dependency, ...args);
      const stream = spawn(command, [action, dependency, ...args], {
        stdio: "pipe"
      });

      const output = (data: any) => {
        if (`${data}`.match(/^\[[0-9]\/[0-9]+\]/)) {
          process.stdout.write(chalk.white(`${data}`));
        }
      };

      stream.stdout.on("data", output);
      stream.stderr.on("data", output);
      stream.on("error", () => reject());
      stream.on("close", () => {
        process.stdout.write(
          chalk.white(`${dependency} successfully installed\n\n`)
        );
        resolve();
      });
    });
  }

  private static executeCommand(command: string) {
    return new Promise<string>((ok, fail) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (stdout) return ok(stdout);
        if (stderr) return ok(stderr);
        if (error) return fail(error);
        ok("");
      });
    });
  }

  static async packageExists(
    dependency: string,
    path?: string
  ): Promise<boolean> {
    const prefix = path ? `--prefix ${path}` : "";

    let localCheck = await ProjectTypeInstall.executeCommand(
      `npm list --depth=0 ${prefix}`
    );

    //for testing locally
    if (localCheck.startsWith("undoc-cli")) {
      localCheck = localCheck.replace("undoc-cli", "");
    }

    const regex = new RegExp(`${dependency}@(.*)\n`);
    const localMatches = localCheck.match(regex);
    return localMatches ? true : false;
  }

  static async packageExistsGlobal(dependency: string): Promise<boolean> {
    const localCheck = await ProjectTypeInstall.executeCommand(
      "npm list -g --depth=0"
    );

    const regex = new RegExp(`${dependency}@(.*)\n`);
    const localMatches = localCheck.match(regex);
    return localMatches ? true : false;
  }

  static async undocDir() {
    //Is undoc local
    try {
      const local = await this.packageExists("undoc-cli");
      if (local) {
        return `${process.cwd()}/node_modules/undoc-cli`;
      }

      const global = await this.packageExistsGlobal("undoc-cli");
      if (global) {
        const path = await this.executeCommand("npm root -g");
        console.log(path);
        return `${path.trim()}/undoc-cli`;
      }

      throw "Unable to locate Undoc locally or globally via NPM";
    } catch (err) {
      throw err;
    }
  }

  static async installPackage(dependency: string, path: string): Promise<void> {
    console.log(chalk.white(`Adding ${dependency} dependency to Undoc`));
    const yarn = ProjectTypeInstall.packageMgr();
    const command = yarn ? "yarn" : "npm";
    const action = yarn ? "add" : "install";
    const args = yarn ? ["--cwd", path] : ["--prefix", path];
    await ProjectTypeInstall.executeCommandStream(
      command,
      action,
      dependency,
      args
    );
    return;
  }
}
