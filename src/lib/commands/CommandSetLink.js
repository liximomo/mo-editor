import { EditorState, RichUtils } from 'draft-js';
import withLinkEntity from '../cells/LinkEntity';
import removeLink from './CommandRemoveLink';

export default function setLink(editorState, url) {
  if (url.trim() === '') {
    return removeLink(editorState);
  }

  const contentState = editorState.getCurrentContent();
  let newUrl = url;
  if (url !== '') {
    if (url.indexOf('http') === -1) {
      if (url.indexOf('@') >= 0) {
        newUrl = `mailto:${newUrl}`;
      } else {
        newUrl = `http://${newUrl}`;
      }
    }
  }

  const { contentStateWithEntity, entityKey } = withLinkEntity(contentState, newUrl);
  const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
  return RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);
}
