import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { FileTree } from "../FileTree";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { TrackedFilesApi } from "../../api/TrackedFilesApi";
import { PublishProjectFiles } from "../PublishProjectFiles";
import { PublishCleanup } from "../PublishCleanup";

import PublishEvents from "../../events/publish/Events";

/**
 * New project publish
 */
export class NewProjectPublish {
  constructor(private branches: string[]) {
    this.branches = branches;
  }

  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump(this.branches).run();

      const localFiles = await new FileTree(false).walk();

      await new ProjectTypeGenerator([], localFiles.all).run();

      const files = { tracked: [], added: localFiles.all, modified: [] };
      const results = await new ProjectTypeParser(files).run();

      PublishEvents.emitter("push_new_publish", "Pushing nodes to server");

      if (results.added.length > 0) {
        const addedFiles = results.added.map(({ path, name, kind }: any) => {
          return { path, name, kind };
        });

        await new TrackedFilesApi().insert(addedFiles);
      }

      await new PublishProjectFiles(results.added).run();
      await new PublishCleanup().run();
      PublishEvents.emitter("complete_new_publish", "Publish successful!");
    } catch (err) {
      throw err;
    }
  };
}
