import { EditorState, ContentState } from 'draft-js';

export default function createEditorState(content, convert, decorators) {
  let contentState;
  if (content == null) {
    contentState = ContentState.createFromText('');
  }else if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convert(content);
  }

  return EditorState.createWithContent(contentState, decorators);
};
