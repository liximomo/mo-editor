import { HANDLED, NOT_HANDLED } from '../DraftConstants';
const modList = [];

export function registerMod(mod) {
  modList.push(mod);
}

export function handleInput(inputString, editorState, setEditorState) {
  for (let index = 0; index < modList.length; index++) {
    const mod = modList[index];
    const modEditorState = mod.extract(inputString, editorState);
    if (modEditorState) {
      setEditorState(modEditorState);
      return HANDLED;
    }
  }

  return NOT_HANDLED;
}
