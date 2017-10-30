import { RichUtils, EditorState, ContentState, ContentBlock, genKey } from 'draft-js';
import { List, Map } from 'immutable';
import * as BlockType from '../blocks/TypeOfBlock';
import * as OpType from './TypeOfOperation';

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
export function getDefaultBlockData(blockType, initialData = {}) {
  return initialData;
}

export function getCurrentBlock(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
}

export function getCurrentBlockType(editorState) {
  return RichUtils.getCurrentBlockType(editorState);
}

export function toggleBlockType(editorState, blockType) {
  return RichUtils.toggleBlockType(editorState, blockType);
}

/*
 * 在最后插入一个快
 */
export function addNewBlock(editorState, newType = BlockType.UNSTYLED, initialData = {}) {
  const selectionState = editorState.getSelection();

  const newBlock = new ContentBlock({
    key: genKey(),
    type: newType,
    text: '',
    characterList: List(),
    data: Map().merge(getDefaultBlockData(newType, initialData)),
  });

  const contentState = editorState.getCurrentContent();
  const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock);

  return EditorState.push(
    editorState,
    ContentState.createFromBlockArray(newBlockMap.toArray())
      .set('selectionBefore', selectionState)
      .set('selectionAfter', selectionState),
    OpType.INSERT_BLOCK
  );
}

/*
 * 替换选择所在的当前块，被替换的块应该总是空的
 */
export function replaceCurrentBlock(editorState, newType = BlockType.UNSTYLED, initialData = {}) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
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
}
