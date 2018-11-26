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
    dependency: string
  ) {
    return new Promise<void>((resolve, reject) => {
      const stream = spawn(command, [action, dependency], {
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

  static async packageExists(dependency: string): Promise<boolean> {
    const localCheck = await ProjectTypeInstall.executeCommand(
      "npm list --depth=0"
    );

    const regex = new RegExp(`${dependency}@(.*)\n`);
    const localMatches = localCheck.match(regex);
    return localMatches ? true : false;
  }

  static async installPackage(dependency: string): Promise<void> {
    console.log(chalk.white(`Installing ${dependency} dependency`));
    const yarn = ProjectTypeInstall.packageMgr();
    const command = yarn ? "yarn" : "npm";
    const action = yarn ? "add" : "install";
    return await ProjectTypeInstall.executeCommandStream(
      command,
      action,
      dependency
    );
  }
}