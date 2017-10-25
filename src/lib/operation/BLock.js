import { RichUtils, EditorState } from 'draft-js';
import * as BlockType from '../blocks/TypeOfBlock';
import * as OpType from './TypeOfOperation';

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
export const getDefaultBlockData = (blockType, initialData = {}) => {
  return initialData;
};

/*
Get currentBlock in the editorState.
*/
export const getCurrentBlock = editorState => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
};

export default function toggleBlockType(editorState, blockType) {
  return RichUtils.toggleBlockType(editorState, blockType);
}

/*
Adds a new block (currently replaces an empty block) at the current cursor position
of the given `newType`.
*/
export const replaceCurrentBlockIfEmpty = (
  editorState,
  newType = BlockType.UNSTYLED,
  initialData = {}
) => {
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }

  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }

  if (currentBlock.getLength() > 0) {
    return editorState;
  }

  if (currentBlock.getType() === newType) {
    return editorState;
  }
  const newBlock = currentBlock.merge({
    type: newType,
    data: getDefaultBlockData(newType, initialData),
  });
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState,
  });
  return EditorState.push(editorState, newContentState, OpType.REPLACE_BLOCK);
};
