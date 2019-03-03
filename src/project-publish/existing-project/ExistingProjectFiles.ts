import * as git from "isomorphic-git";

import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { UpdateFilesApi } from "../../api/UpdateFilesApi";
import { IsoGit } from "../../lib/IsoGit";
import { ModifiedFile } from "./types";

import PublishEvents from "../../events/publish/Events";

/**
 * Get existing project files - including those that are updated
 */
export class ExistingProjectFiles {
  private sha: string;
  private isoGit: IsoGit;
  private commitsThatMatter: string[] = [];

  constructor(sha: string) {
    this.sha = sha;
    this.isoGit = new IsoGit();
  }

  get = async (): Promise<{
    addedFiles: string[];
    modifiedFiles: string[];
  }> => {
    const files = await new GetUpdatedFiles(this.sha).walk();

    // If no deletions and no modified files
    if (files.deleted.length === 0 && files.modified.length === 0) {
      return { addedFiles: files.added, modifiedFiles: [] };
    }

    // Files modified locally that exist remotely (tracked)
    const modifiedTrackedFiles = await new UpdateFilesApi(
      files.modified,
      files.deleted
    ).results();

    // no tracked files have been updated, return added
    if (modifiedTrackedFiles.length === 0) {
      return { addedFiles: files.added, modifiedFiles: [] };
    }

    const modifiedFiles = modifiedTrackedFiles.map((file: any) => file.path);

    return { addedFiles: files.added, modifiedFiles };
  };

  private findCommitsThatMatter(commits: git.CommitDescription[]): string[] {
    try {
      const shas: string[] = [];
      for (const commit of commits) {
        // switch back after
        shas.push(commit.oid!);
        if (commit.oid === this.sha) {
          return shas.reverse();
        }
      }

      throw "unable to locate last published commit";
    } catch (err) {
      throw err;
    }
  }

  private mapFiles = async (file: string): Promise<ModifiedFile> => {
    const fileObj: ModifiedFile = { path: file, oldOid: "", newOid: "" };
    const git = this.isoGit.git();
    const commits = this.commitsThatMatter;
    let lastFileSha = null;

    for (const commit of commits) {
      const fileObject = await git.readObject({
        dir: IsoGit.dir,
        oid: commit,
        filepath: fileObj.path
      });

      if (fileObject.oid !== lastFileSha) {
        if (lastFileSha !== null) {
          // Set to initial oid
          if (!fileObj.oldOid) {
            fileObj.oldOid = lastFileSha;
          }

          // Keep seting until most recent oid is set
          fileObj.newOid = fileObject.oid;
        }
        lastFileSha = fileObject.oid;
      }
    }

    return fileObj;
  };

  getModifiedWithCommits = async (modifiedFiles: string[]) => {
    const git = this.isoGit.git();
    const commits = await git.log({
      dir: IsoGit.dir
    });

    this.commitsThatMatter = this.findCommitsThatMatter(commits);

    const commitCount = this.commitsThatMatter.length;
    const firstCommit = this.commitsThatMatter[0].substring(0, 6);
    const detailContext = `${commitCount} commits since [${firstCommit}]`;
    PublishEvents.emitter("isogit_detail", detailContext);

    return Promise.all<ModifiedFile>(modifiedFiles.map(this.mapFiles));
  };
}
