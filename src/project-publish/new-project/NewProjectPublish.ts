import { IsoGit } from "../../lib/IsoGit";
import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetAllProjectFiles } from "./GetAllProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { TrackedFilesApi } from "../../api/TrackedFilesApi";
import { PublishProjectFiles } from "../PublishProjectFiles";
import { PublishCleanup } from "../PublishCleanup";

import PublishEvents from "../../events/publish/Events";

/**
 * New project publish
 */
export class NewProjectPublish extends IsoGit {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const allFiles = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator([], allFiles).run();
      const files = { tracked: [], added: allFiles, modified: [] };
      const results = await new ProjectTypeParser(files).run();
      PublishEvents.emitter("push_new_publish", "Pushing nodes to server");

      if (results.added.length > 0) {
        const addedFiles = results.added.map(({ path, name, kind }: any) => {
          return { path, name, kind };
        });

        const commit = await this.commit();
        await new TrackedFilesApi(commit).insert(addedFiles);
      }

      await new PublishProjectFiles(results.added).run();
      await new PublishCleanup().run();
      PublishEvents.emitter("complete_new_publish", "Publish successful!");
    } catch (err) {
      throw err;
    }
  };
}
