// /**
// * Function returns collection of currently selected blocks.
// */
// export function getSelectedBlocksMap(editorState: EditorState): OrderedMap {
//   const selectionState = editorState.getSelection();
//   const contentState = editorState.getCurrentContent();
//   const startKey = selectionState.getStartKey();
//   const endKey = selectionState.getEndKey();
//   const blockMap = contentState.getBlockMap();
//   return blockMap
//     .toSeq()
//     .skipUntil((_, k) => k === startKey)
//     .takeUntil((_, k) => k === endKey)
//     .concat([[endKey, blockMap.get(endKey)]]);
// }

// /**
// * Function returns collection of currently selected blocks.
// */
// export function getSelectedBlocksList(editorState: EditorState): List {
//   return getSelectedBlocksMap(editorState).toList();
// }

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
