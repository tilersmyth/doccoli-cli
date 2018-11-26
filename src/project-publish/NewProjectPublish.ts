import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { DocGenerator } from "./DocGenerator";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetUpdatedFiles(null).target();
      await new DocGenerator(files).run();

      // await new ParseModules().run();
    } catch (err) {
      throw err;
    }
  };
}
