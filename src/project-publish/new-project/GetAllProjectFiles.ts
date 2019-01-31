import { IsoGit } from "../../lib/IsoGit";

/**
 * Get all project files for new publish
 */
export class GetAllProjectFiles {
  private async files() {
    try {
      const iso = new IsoGit();
      const files = await iso.git().listFiles({ dir: IsoGit.dir });
      return files.filter((file: string) => file.startsWith("src/"));
    } catch (err) {
      throw err;
    }
  }

  target = async (): Promise<string[]> => {
    try {
      return await this.files();
    } catch (err) {
      throw err;
    }
  };
}
