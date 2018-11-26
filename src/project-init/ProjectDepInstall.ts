import { ProjectTypeDeps } from "../project-type/ProjectTypeDeps";
import { ProjectTypeInstall } from "../project-type/ProjectTypeInstall";

/**
 * Install dependencies depending on selected project type
 */
export class ProjectDepInstall {
  async run() {
    try {
      const dependencies = new ProjectTypeDeps();
      const generator = await dependencies.generator();
      const hasGenerator = await ProjectTypeInstall.packageExists(generator);
      if (!hasGenerator) {
        await ProjectTypeInstall.installPackage(generator);
      }
    } catch (err) {
      throw err;
    }
  }
}
