import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { TypeDoc } from "../lib/TypeDoc";
import { ParseModules } from "./ParseModules";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetUpdatedFiles(null).target();
      await new TypeDoc(files).generate();
      await new ParseModules().run();
    } catch (err) {
      throw err;
    }
  };
}
