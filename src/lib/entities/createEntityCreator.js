import { EditorState } from 'draft-js';

export default function createEntityCreator({ type, mutatble } = {}) {
  return function createEntity(editorState, data = {}) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(type, mutatble, data);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    return {
      newEditorState,
      entityKey,
    };
  };
}
