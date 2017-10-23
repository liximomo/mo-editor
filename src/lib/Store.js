import * as Command from './commands/CommandHub';

let editorState;
let applyEditorState = () => null;

export function injectApplyEditorState(fn) {
  applyEditorState = fn;
}

export function injectEditorState(state) {
  editorState = state;
}

const Store = {
  getEditorState() {
    return editorState;
  },

  injectCommand(...args) {
    Command.injectCommand(...args);
  },

  invokeCommand(command, ...args) {
    const nextState = Command.execCommand(command, editorState, ...args);

    applyEditorState(nextState);
    return nextState;
  },
};

export default Store;
