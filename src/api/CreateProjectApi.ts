import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { CreateProjectMutation_cliCreateProject } from "../types/schema";
import keytar from "../utils/keytar";

export class CreateProjectApi extends Apollo {
  async results(name: string): Promise<CreateProjectMutation_cliCreateProject> {
    try {
      const token = await keytar.getToken();
      const operation = {
        query: gql`
          mutation CreateProjectMutation($name: String!) {
            cliCreateProject(name: $name) {
              project {
                key
                name
              }
              error {
                path
                message
              }
            }
          }
        `,
        variables: { name },
        context: {
          headers: {
            Authorization: token
          }
        }
      };

      const {
        cliCreateProject: { project, error }
      } = await this.fetch(operation);

      if (error) {
        throw error.message;
      }

      return project;
    } catch (err) {
      throw err;
    }
  }
}
