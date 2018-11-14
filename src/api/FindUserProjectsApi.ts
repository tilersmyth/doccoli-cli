import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { UserProjectsQuery_cliUserProjects } from "../types/schema";

export class FindUserProjectsApi {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async results(): Promise<UserProjectsQuery_cliUserProjects[]> {
    const operation = {
      query: gql`
        query UserProjectsQuery {
          cliUserProjects {
            id
            key
            name
          }
        }
      `,
      context: {
        headers: {
          Authorization: this.token
        }
      }
    };
    try {
      const { cliUserProjects } = await new Apollo(operation).fetch();
      return cliUserProjects;
    } catch (err) {
      throw err;
    }
  }
}
