import { RichUtils } from 'draft-js';

export function toggleInlineStyle(editorState, inlineStyle) {
  return RichUtils.toggleInlineStyle(editorState, inlineStyle);
}

export function getCurrentInlineStyle(editorState) {
  return editorState.getCurrentInlineStyle(editorState);
}
