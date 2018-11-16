import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { CliLastCommit_cliLastCommit } from "../types/schema";

export class LastCommitApi {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async results(
    projectId: string,
    branch: string
  ): Promise<CliLastCommit_cliLastCommit> {
    const operation = {
      query: gql`
        query CliLastCommit($projectId: ID!, $branch: String!) {
          cliLastCommit(projectId: $projectId, branch: $branch) {
            sha
            branch
          }
        }
      `,
      variables: { projectId, branch },
      context: {
        headers: {
          Authorization: this.token
        }
      }
    };
    try {
      const { cliLastCommit } = await new Apollo(operation).fetch();
      return cliLastCommit;
    } catch (err) {
      throw err;
    }
  }
}
