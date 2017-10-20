import * as Command from './TypeOfCommand';
import setLink from './setLink';

const commander = {
  setLink,
};

export default commander;

export function execCommand(command, ...args) {
  let cmdFn;
  switch (command) {
    case Command.SET_LINK:
      cmdFn = setLink;
      break;
    default:
      cmdFn = () => new Error(`unkonw command '${command}'`);
      break;
  }

  return cmdFn(...args);
}
