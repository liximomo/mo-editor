// import './commands/CommandInject';
import './services/ServiceInject';
import './blocks/BlockInject';
import { registerMod } from './input-mods/InputMods';
import createBlockMod from './input-mods/mods/createBlockMod';
import * as TypeOfBlock from './blocks/TypeOfBlock';
import MoEditor from './Editor';

registerMod(createBlockMod({
  '1.': TypeOfBlock.OL,
  '*': TypeOfBlock.UL,
}));

export default MoEditor;
