import { EditorState, RichUtils } from 'draft-js';
import * as OpType from './TypeOfOperation';

export function getSelectedBlock(editorState: EditorState): ContentBlock {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  return currentContentBlock;
}

export function getSelectionEntityKey(editorState: EditorState): Entity {
  let entity;
  const selection = editorState.getSelection();
  let start = selection.getStartOffset();
  let end = selection.getEndOffset();
  if (start === end && start === 0) {
    end = 1;
  } else if (start === end) {
    start -= 1;
  }
  const block = getSelectedBlock(editorState);

  for (let i = start; i < end; i += 1) {
    const currentEntity = block.getEntityAt(i);
    if (!currentEntity) {
      entity = undefined;
      break;
    }
    if (i === start) {
      entity = currentEntity;
    } else if (entity !== currentEntity) {
      entity = undefined;
      break;
    }
  }
  return entity;
}

export function getSelectedBlocksList(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
    .toList();
}

/**
 * 获得选择的第一个块的文字
 * @param {*} editorState
 */
export function getSelectedText(editorState) {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);
  return selectedText;
}

/**
 * 获得选择的全部的文字
 * @param {*} editorState
 */
export function getSelectionTextAll(editorState) {
  let selectedText = '';
  const currentSelection = editorState.getSelection();
  let start = currentSelection.getAnchorOffset();
  let end = currentSelection.getFocusOffset();
  const selectedBlockList = getSelectedBlocksList(editorState);
  if (selectedBlockList.size > 0) {
    if (currentSelection.getIsBackward()) {
      const temp = start;
      start = end;
      end = temp;
    }
    for (let i = 0; i < selectedBlockList.size; i += 1) {
      const blockStart = i === 0 ? start : 0;
      const blockEnd =
        i === selectedBlockList.size - 1 ? end : selectedBlockList.get(i).getText().length;
      selectedText += selectedBlockList
        .get(i)
        .getText()
        .slice(blockStart, blockEnd);
    }
  }
  return selectedText;
}

export function setSelectedBlockProperty(editorState, property) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const selectedBlock = getSelectedBlock(editorState);
  const newBlock = selectedBlock.merge(property);
  const blockMap = contentState.getBlockMap();
  const newContentState = contentState.merge({
    blockMap: blockMap.set(newBlock.getKey(), newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });

  return EditorState.push(editorState, newContentState, OpType.CHANGE_BLOCK_TYPE);
}
