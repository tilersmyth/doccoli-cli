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

export interface MeQuery_cliMe_me {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface MeQuery_cliMe {
  ok: boolean;
  me: MeQuery_cliMe_me | null;
}

export interface MeQuery {
  cliMe: MeQuery_cliMe;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
