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

export const projectOptionsInput = [
  {
    type: "list",
    name: "id",
    message: "Choose existing Undoc project or create new",
    choices: []
  }
];

export const createProjectInput = [
  {
    type: "input",
    name: "projectName",
    message: "Project name:"
  }
];
