import gql from "graphql-tag";

import { Apollo } from "./Apollo";

//import { CreateProjectMutation_cliCreateProject } from "../types/schema";

export class PublishApi {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async results(
    projectId: string,
    file: any,
    commit: any,
    progress: any
  ): Promise<any> {
    const operation = {
      query: gql`
        mutation PublishMutation(
          $projectId: String!
          $file: ModuleFile!
          $commit: ModuleCommit!
          $progress: PublishProgress!
        ) {
          cliPublishCreate(
            projectId: $projectId
            file: $file
            commit: $commit
            progress: $progress
          )
        }
      `,
      variables: { projectId, file, commit, progress },
      context: {
        headers: {
          Authorization: this.token
        }
      }
    };
    try {
      const { cliPublishCreate } = await new Apollo(operation).fetch();
      return cliPublishCreate;
    } catch (err) {
      throw err;
    }
  }
}
