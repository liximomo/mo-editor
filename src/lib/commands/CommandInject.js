import { injectCommand } from './CommandHub';
import * as CommandType from './TypeOfCommand';
import CommandToggleBlockType from './CommandToggleBlockType';
import CommandSetLink from './CommandSetLink';

injectCommand(CommandType.TOGGLE_BLOCK_TYPE, CommandToggleBlockType);
injectCommand(CommandType.SET_LINK, CommandSetLink);
