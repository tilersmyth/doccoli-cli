import { NodeGit } from "../lib/NodeGit";
import { FileUtils } from "../utils/FileUtils";

/**
 * Get all project files for new publish
 */
export class GetAllProjectFiles {
  private walkTree(tree: any): Promise<string[]> {
    const walker = tree.walk();
    return new Promise((resolve, reject) => {
      try {
        const paths: string[] = [];
        walker.on("entry", (entry: any) => {
          if (entry.path().startsWith("src/")) {
            const base = FileUtils.rootDirectory();
            paths.push(`${base}/${entry.path()}`);
          }
        });
        walker.on("end", () => resolve(paths));
        walker.start();
      } catch (err) {
        reject(err);
      }
    });
  }

  target = async (): Promise<string[]> => {
    try {
      const tree = await new NodeGit().getTree();
      return await this.walkTree(tree);
    } catch (err) {
      throw err;
    }
  };
}
