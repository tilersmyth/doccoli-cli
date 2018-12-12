import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetAllProjectFiles } from "./GetAllProjectFiles";
import { ProjectTypeGenerator } from "../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../project-type/ProjectTypeParser";

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
      console.log(results);
    } catch (err) {
      throw err;
    }
  };
}
