const commander = {};

export function injectCommand(cmd, hanlde) {
  if (commander[cmd]) {
    throw new Error(`command '${cmd}' has already registed`);
  }
  commander[cmd] = hanlde;
}

export function execCommand(command, ...args) {
  const cmdFn = commander[command];
  if (!cmdFn) {
    throw new Error(`can not exec command '${command}' without registration`);
  }

  console.log(...args);
  return cmdFn(...args);
}
