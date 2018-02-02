import {
  RichUtils,
  EditorState,
  ContentBlock,
  genKey,
  Modifier,
  BlockMapBuilder,
  CharacterMetadata,
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

  const asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, block.getType());

  const fragmentArray = [block];
  const fragment = BlockMapBuilder.createFromArray(fragmentArray);
  const withBlock = Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

  const newContent = withBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, OpType.INSERT_BLOCK);
}


function replaceBlock(editorState, fragmentArray) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(afterRemoval, targetSelection, BlockType.ATOMIC);

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withBlock = Modifier.replaceWithFragment(asAtomicBlock, targetSelection, fragment);

  const newContent = withBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, OpType.INSERT_BLOCK);
}


/*
 * 替换选择所在的当前块，被替换的块应该总是空的
 */
export function removeCurrentAndInsertNewBlock(editorState, block) {
  return replaceBlock(editorState, [block, createBlock()]);
}

/*
 * 用原子块替换选择所在的当前块，被替换的块应该总是空的
 */
export function replaceWithAtomicBlockAndInsertEmptyBlock(editorState, entityKey, character) {
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

  return replaceBlock(editorState, fragmentArray);
}

/*
 * 用原子块替换当前块
 */
export function replaceWithAtomicBlock(editorState, entityKey, character) {
  const charData = CharacterMetadata.create({ entity: entityKey });

  const fragmentArray = [
    new ContentBlock({
      type: BlockType.ATOMIC,
      text: character,
      key: genKey(),
      characterList: List(Repeat(charData, character.length)),
    }),
  ];

  return replaceBlock(editorState, fragmentArray);
}

export function getNextBlock(block, content) {
  const blockMap = content.getBlockMap();
  const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest().first();
  return blocksAfter;
}
