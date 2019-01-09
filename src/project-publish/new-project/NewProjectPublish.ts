import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetAllProjectFiles } from "./GetAllProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectFiles } from "../PublishProjectFiles";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator(files).run();
      const results = await new ProjectTypeParser().run();
      await new PublishProjectFiles(results).run();
    } catch (err) {
      throw err;
    }
  };
}
