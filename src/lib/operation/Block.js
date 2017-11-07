import {
  RichUtils,
  EditorState,
  ContentBlock,
  genKey,
  Modifier,
  BlockMapBuilder,
  CharacterMetadata,
  AtomicBlockUtils,
} from 'draft-js';
import { List, Repeat, Map } from 'immutable';
import * as BlockType from '../blocks/TypeOfBlock';
import * as OpType from './TypeOfOperation';

export function createBlock(
  { type = BlockType.UNSTYLED, entityKey, character = '', data = {} } = {}
) {
  const constructParams = {
    type,
    text: character,
    key: genKey(),
    data: Map(data),
  };

  if (entityKey) {
    const charData = CharacterMetadata.create({ entity: entityKey });
    constructParams.characterList = List(Repeat(charData, character.length));
  }

  return new ContentBlock(constructParams);
}

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
// export function addNewBlock(editorState, newType = BlockType.UNSTYLED, initialData = {}) {
//   const selectionState = editorState.getSelection();

//   const newBlock = new ContentBlock({
//     key: genKey(),
//     type: newType,
//     text: '',
//     characterList: List(),
//     data: Map().merge(getDefaultBlockData(newType, initialData)),
//   });

//   const contentState = editorState.getCurrentContent();
//   const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock);

//   return EditorState.push(
//     editorState,
//     ContentState.createFromBlockArray(newBlockMap.toArray())
//       .set('selectionBefore', selectionState)
//       .set('selectionAfter', selectionState),
//     OpType.INSERT_BLOCK
//   );
// }

export function insertNewBlock(editorState, block) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  const insertionTarget = afterSplit.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, BlockType.ATOMIC);

  const fragmentArray = [block, createBlock()];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withAtomicBlock = Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, OpType.INSERT_BLOCK);
}

/*
 * 替换选择所在的当前块，被替换的块应该总是空的
 */
export function removeCurrentAndInsertNewBlock(editorState, block) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(afterRemoval, targetSelection, BlockType.ATOMIC);

  const fragmentArray = [block, createBlock()];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withBlock = Modifier.replaceWithFragment(asAtomicBlock, targetSelection, fragment);

  const newContent = withBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, OpType.INSERT_BLOCK);
}

export function replaceCurrentBlock(editorState, newType = BlockType.UNSTYLED, newBlock) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }

  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState,
  });
  return EditorState.push(editorState, newContentState, OpType.INSERT_BLOCK);
}

export function insertAtomicBlock(editorState, entityKey, character) {
  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, character);
}

/*
 * 替换选择所在的当前块，被替换的块应该总是空的
 */
export function removeCurrentAndInsertAtomicBlock(editorState, entityKey, character) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(afterRemoval, targetSelection, BlockType.ATOMIC);

  const charData = CharacterMetadata.create({ entity: entityKey });

  const fragmentArray = [
    new ContentBlock({
      type: BlockType.ATOMIC,
      text: character,
      key: genKey(),
      characterList: List(Repeat(charData, character.length)),
    }),
    createBlock(),
  ];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withBlock = Modifier.replaceWithFragment(asAtomicBlock, targetSelection, fragment);

  const newContent = withBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, OpType.INSERT_BLOCK);
}
