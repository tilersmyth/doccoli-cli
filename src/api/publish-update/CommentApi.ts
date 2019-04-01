import gql from "graphql-tag";

import { Apollo } from "../Apollo";
import keytar from "../../utils/keytar";
import { UndocFile } from "../../utils/UndocFile";

//import { CreateProjectMutation_cliCreateProject } from "../types/schema";

export class CommentApi {
  comment: any;
  commit: any;
  progress: any;

  constructor(comment: any, commit: any, progress: any) {
    this.comment = comment;
    this.commit = commit;
    this.progress = progress;
  }

  async results(): Promise<any> {
    const token = await keytar.getToken();
    const config = await UndocFile.config();
    const operation = {
      query: gql`
        mutation CliPublishUpdateComment(
          $comment: ModuleChildCommentInput!
          $commit: ModuleCommit!
          $progress: PublishProgress!
        ) {
          cliPublishUpdateComment(
            comment: $comment
            commit: $commit
            progress: $progress
          )
        }
      `,
      variables: {
        comment: this.comment,
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
      const { cliPublishCreate } = await new Apollo(operation).fetch();

      return cliPublishCreate;
    } catch (err) {
      throw err;
    }
  }
}
