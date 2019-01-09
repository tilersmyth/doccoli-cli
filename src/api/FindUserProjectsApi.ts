import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { UserProjectsQuery_cliUserProjects } from "../types/schema";
import keytar from "../utils/keytar";

export class FindUserProjectsApi {
  async results(): Promise<UserProjectsQuery_cliUserProjects[]> {
    try {
      const token = await keytar.getToken();
      const operation = {
        query: gql`
          query UserProjectsQuery {
            cliUserProjects {
              projects {
                id
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
        context: {
          headers: {
            Authorization: token
          }
        }
      };

      const {
        cliUserProjects: { projects, error }
      } = await new Apollo(operation).fetch();

      if (error) {
        throw error;
      }

      return projects;
    } catch (err) {
      throw err;
    }
  }
}
