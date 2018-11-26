import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { ProjectTypeGenerator } from "../project-type/ProjectTypeGenerator";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetUpdatedFiles(null).target();
      await new ProjectTypeGenerator(files).run();

      // await new ParseModules().run();
    } catch (err) {
      throw err;
    }
  };
}
