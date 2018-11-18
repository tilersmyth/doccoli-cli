import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { CreateProjectMutation_cliCreateProject } from "../types/schema";

export class CreateProjectApi {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async results(name: string): Promise<CreateProjectMutation_cliCreateProject> {
    const operation = {
      query: gql`
        mutation CreateProjectMutation($name: String!) {
          cliCreateProject(name: $name) {
            ok
            project {
              key
              name
            }
            error
          }
        }
      `,
      variables: { name },
      context: {
        headers: {
          Authorization: this.token
        }
      }
    };
    try {
      const { cliCreateProject } = await new Apollo(operation).fetch();
      return cliCreateProject;
    } catch (err) {
      throw err;
    }
  }
}
