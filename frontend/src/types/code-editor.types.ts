export type codeFiles = codeFile[];

export type codeFile = {
  label: string;
  newLabel: string;
  editMode: boolean;
  code: string;
  focus: boolean;
  consoleOutput: string;
  serialOutput: string;
  saved: boolean;
};

export type outputLog = {
  label: string;
  id: number;
  msg: string;
};
