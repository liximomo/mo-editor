import { RichUtils } from 'draft-js';

export default function removeLink(editorState) {
  return RichUtils.toggleLink(editorState, editorState.getSelection(), null);
}
