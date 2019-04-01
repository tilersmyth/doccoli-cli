import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";
import { NpmFile } from "../utils/NpmFile";

//import { CreateProjectMutation_cliCreateProject } from "../types/schema";

export class PublishApi {
  file: any;
  commit: any;
  progress: any;

  constructor(file: any, commit: any, progress: any) {
    this.file = file;
    this.commit = commit;
    this.progress = progress;
  }

  async results(): Promise<any> {
    const token = await keytar.getToken();
    const config = await UndocFile.config();
    const version = await NpmFile.version();

    const operation = {
      query: gql`
        mutation PublishMutation(
          $file: ModuleFileInput!
          $version: String!
          $commit: ModuleCommit!
          $progress: PublishProgress!
        ) {
          cliPublishCreate(
            file: $file
            version: $version
            commit: $commit
            progress: $progress
          ) {
            created
            error {
              path
              message
            }
          }
        }
      `,
      variables: {
        file: this.file,
        version,
        commit: this.commit,
        progress: this.progress
      },
      context: {
        headers: {
          Authorization: token,
          ProjectKey: config.key
        }
      }
    };
    try {
      const {
        cliPublishCreate: { created, error }
      } = await new Apollo(operation).fetch();

      if (error) {
        throw error;
      }

      return created;
    } catch (err) {
      throw err;
    }
  }
}
