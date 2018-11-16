/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_cliCreateProject_project {
  key: string;
  name: string;
  target: string;
}

export interface CreateProjectMutation_cliCreateProject {
  ok: boolean;
  project: CreateProjectMutation_cliCreateProject_project | null;
  error: string | null;
}

export interface CreateProjectMutation {
  cliCreateProject: CreateProjectMutation_cliCreateProject;
}

export interface CreateProjectMutationVariables {
  name: string;
  target: string;
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

export interface LoginMutation_cliLogin_errors {
  path: string;
  message: string;
}

export interface LoginMutation_cliLogin {
  token: string | null;
  errors: LoginMutation_cliLogin_errors[] | null;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
