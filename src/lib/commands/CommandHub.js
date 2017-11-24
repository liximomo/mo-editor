import keycode from 'keycode';

const commander = {};

export function registerCommand(cmd, handle, keyBinding) {
  if (commander[cmd]) {
    throw new Error(`command '${cmd}' has already registered`);
  }
  commander[cmd] = handle;
}

export function execCommand(command, ...args) {
  const cmdFn = commander[command];
  if (!cmdFn) {
    throw new Error(`can not exec command '${command}' without registration`);
  }

  return cmdFn(...args);
}

export function keyBinding() {}
