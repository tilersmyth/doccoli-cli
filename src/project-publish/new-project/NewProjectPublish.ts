import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetAllProjectFiles } from "./GetAllProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectFiles } from "../PublishProjectFiles";

import PublishEvents from "../../events/publish/Events";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator(files, []).run();
      const results = await new ProjectTypeParser().run();
      PublishEvents.emitter("push_new_publish", "Pushing nodes to server");
      await new PublishProjectFiles(results).run();
      PublishEvents.emitter("complete_new_publish", "Publish successful!");
    } catch (err) {
      throw err;
    }
  };
}
