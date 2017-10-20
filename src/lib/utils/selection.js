export const getSelectionRange = (selection) => {
  if (selection.rangeCount <= 0) {
    return null;
  }
  return selection.getRangeAt(0);
};

export const getSelectionRect = (selection) => {
  if (selection.rangeCount <= 0) {
    return null;
  }

  const _rect = selection.getRangeAt(0).getBoundingClientRect();
  let rect = _rect && _rect.top ? _rect : selection.getRangeAt(0).getClientRects()[0];
  if (!rect) {
    if (selection.anchorNode && selection.anchorNode.getBoundingClientRect) {
      rect = selection.anchorNode.getBoundingClientRect();
      rect.isEmptyline = true;
    } else {
      return null;
    }
  }
  return rect;
};

export const getSelection = (root) => {
  let t = null;
  if (root.getSelection) {
    t = root.getSelection();
  } else if (root.document.getSelection) {
    t = root.document.getSelection();
  } else if (root.document.selection) {
    t = root.document.selection.createRange().text;
  }
  return t;
};