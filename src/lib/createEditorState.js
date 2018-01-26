import { EditorState, ContentState, CompositeDecorator } from 'draft-js';
import DecoratorLink from './decorators/DecoratorLink';

function composeDefaultDecorator(decoratorList) {
  return new CompositeDecorator([DecoratorLink, ...decoratorList]);
}

export default function createEditorState(content, convert, decorators = []) {
  let contentState;
  if (content == null) {
    contentState = ContentState.createFromText('');
  } else if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convert(content);
  }

  return EditorState.createWithContent(contentState, composeDefaultDecorator(decorators));
};
