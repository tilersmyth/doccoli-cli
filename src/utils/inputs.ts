export let loginInputs: Array<Object> = [
  {
    type: "input",
    name: "email",
    message: "Enter email"
  },
  {
    type: "password",
    name: "password",
    message: "Enter password"
  }
];

export const createProjectInput = [
  {
    type: "list",
    name: "id",
    message: "Choose existing Doccoli project or create new",
    choices: []
  }
];
