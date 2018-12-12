import { ProjectTypeDeps } from "../project-type/ProjectTypeDeps";
import { ProjectTypeInstall } from "../project-type/ProjectTypeInstall";

/**
 * Install dependencies depending on selected project type
 */
export class ProjectDepInstall {
  private static async generator(undocDir: string, dependencies: any) {
    const generator = await dependencies.generator();
    const hasGenerator = await ProjectTypeInstall.packageExists(
      generator,
      undocDir
    );
    if (!hasGenerator) {
      await ProjectTypeInstall.installPackage(generator, undocDir);
    }
  }

  private static async parser(undocDir: string, dependencies: any) {
    const parser = await dependencies.parser();
    const hasParser = await ProjectTypeInstall.packageExists(parser);
    if (!hasParser) {
      await ProjectTypeInstall.installPackage(parser, undocDir);
    }
  }

  async run(): Promise<void> {
    try {
      const undocDir = await ProjectTypeInstall.undocDir();
      const dependencies = new ProjectTypeDeps();
      await ProjectDepInstall.generator(undocDir, dependencies);
      await ProjectDepInstall.parser(undocDir, dependencies);
    } catch (err) {
      throw err;
    }
  }
}
