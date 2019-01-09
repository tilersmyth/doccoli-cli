/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_cliCreateProject {
  key: string;
  name: string;
}

export interface CreateProjectMutation {
  cliCreateProject: CreateProjectMutation_cliCreateProject;
}

export interface CreateProjectMutationVariables {
  name: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProjectsQuery
// ====================================================

export interface UserProjectsQuery_cliUserProjects {
  id: string;
  key: string;
  name: string;
}

export interface UserProjectsQuery {
  cliUserProjects: UserProjectsQuery_cliUserProjects[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CliLastCommit
// ====================================================

export interface CliLastCommit_cliLastCommit {
  sha: string;
  branch: string;
}

export interface CliLastCommit {
  cliLastCommit: CliLastCommit_cliLastCommit | null;
}

export interface CliLastCommitVariables {
  projectId: string;
  branch: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_cliLogin {
  token: string | null;
  error: string | null;
}

export interface LoginMutation {
  cliLogin: LoginMutation_cliLogin;
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_cliMe {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface MeQuery {
  cliMe: MeQuery_cliMe | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PublishMutation
// ====================================================

export interface PublishMutation {
  cliPublishCreate: boolean;
}

export interface PublishMutationVariables {
  projectId: string;
  file: ModuleFileInput;
  commit: ModuleCommit;
  progress: PublishProgress;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface ModuleChildCommentInput {
  shortText?: string | null;
  text?: string | null;
}

export interface ModuleChildParametersInput {
  name: string;
  type?: ModuleChildTypeInput | null;
}

export interface ModuleChildSignatureInput {
  name: string;
  kind: string;
  type: ModuleChildTypeInput;
  comment?: ModuleChildCommentInput | null;
  parameters?: ModuleChildParametersInput[] | null;
  typeParameter?: ModuleChildParametersInput[] | null;
}

export interface ModuleChildTypeInput {
  type: string;
  name?: string | null;
  refPath?: string | null;
  types?: ModuleChildTypeInput[] | null;
}

export interface ModuleChildrenInput {
  name: string;
  comment?: ModuleChildCommentInput | null;
  children?: ModuleChildrenInput[] | null;
  type?: ModuleChildTypeInput | null;
  indexSignature?: ModuleChildSignatureInput | null;
  getSignature?: ModuleChildSignatureInput | null;
  signatures?: ModuleChildSignatureInput[] | null;
  typeParameter?: ModuleChildParametersInput[] | null;
}

export interface ModuleCommit {
  sha: string;
  branch: string;
}

export interface ModuleFileInput {
  name: string;
  kind?: string | null;
  path: string;
  children?: ModuleChildrenInput[] | null;
}

export interface PublishProgress {
  size: number;
  index: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
