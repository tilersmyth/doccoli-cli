import * as moment from "moment";

import { IsoGit } from "../../lib/IsoGit";

import PublishEvents from "../../events/publish/Events";

export class RepoSpeedBump extends IsoGit {
  constructor(private remoteCommit: any) {
    super();
    this.remoteCommit = remoteCommit;
  }

  private static shortSha(sha: string) {
    return sha.substring(0, 6);
  }

  private commitStatusEvent = async (newCommits: any) => {
    const localCommit = await this.commit();
    const localSha = RepoSpeedBump.shortSha(localCommit.sha);
    PublishEvents.emitter(
      "existing_publish",
      `Publishing update [${localCommit.branch} ${localSha}]`
    );

    const remoteSha = RepoSpeedBump.shortSha(this.remoteCommit.sha);

    PublishEvents.emitter(
      "existing_last_commit",
      `[${remoteSha}] -- ${newCommits.length} --> [${localSha}] (${moment(
        this.remoteCommit.createdAt
      ).fromNow()})`
    );
  };

  private newCommits = (acc: any, commit: any, index: number, array: any) => {
    if (acc.error.path) {
      return acc;
    }

    if (acc.capture) {
      acc.commits = [commit.oid, ...acc.commits];
    }

    if (this.remoteCommit.sha === commit.oid) {
      if (index === 0) {
        acc.error = {
          path: "notice_up_to_date",
          text: "Project up-to-date. Nothing to do."
        };
        return acc;
      }

      acc.capture = false;
    }

    // Last commit to review
    if (index + 1 === array.length) {
      // If capture still true remote commit was never found
      if (acc.capture) {
        const remoteSha = RepoSpeedBump.shortSha(this.remoteCommit.sha);
        const currentSha = RepoSpeedBump.shortSha(array[0].oid);

        acc.error = {
          path: "error_remote_not_found",
          text: `Last published commit [${remoteSha}] not found. Current commit [${currentSha}] behind HEAD?`
        };
      }
    }

    return acc;
  };

  check = async (): Promise<[]> => {
    const commits = await this.git().log({
      dir: IsoGit.dir
    });

    const newCommits = commits.reduce(this.newCommits, {
      capture: true,
      commits: [],
      error: { path: "", text: "" }
    });

    if (newCommits.error.path) {
      PublishEvents.emitter(newCommits.error.path, newCommits.error.text);
      return [];
    }

    await this.commitStatusEvent(newCommits.commits);

    return newCommits.commits;
  };
}
