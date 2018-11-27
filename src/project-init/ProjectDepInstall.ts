import { ProjectTypeDeps } from "../project-type/ProjectTypeDeps";
import { ProjectTypeInstall } from "../project-type/ProjectTypeInstall";

/**
 * Install dependencies depending on selected project type
 */
export class ProjectDepInstall {
  private static async generator(dependencies: any) {
    const generator = await dependencies.generator();
    const hasGenerator = await ProjectTypeInstall.packageExists(generator);
    if (!hasGenerator) {
      await ProjectTypeInstall.installPackage(generator);
    }
  }

  private static async parser(dependencies: any) {
    const parser = await dependencies.parser();
    const hasParser = await ProjectTypeInstall.packageExists(parser);
    if (!hasParser) {
      await ProjectTypeInstall.installPackage(parser);
    }
  }

  async run(): Promise<void> {
    try {
      const dependencies = new ProjectTypeDeps();
      await ProjectDepInstall.generator(dependencies);
      await ProjectDepInstall.parser(dependencies);

      // fix for https://github.com/nodegit/nodegit/issues/1550
      await ProjectTypeInstall.rebuildNodegit();
    } catch (err) {
      throw err;
    }
  }
}
