import {
  getSelectedBlock,
  setSelectedBlockProperty,
} from '../../operation/Selection';
import { ATOMIC } from '../../blocks/TypeOfBlock';

export default function createBlockMod(textComboMap) {
  return {
    extract(str, editorState) {
      if (!str.endsWith(' ')) {
        return;
      }

      const block = getSelectedBlock(editorState);
      const blockType = block.getType();
      if (blockType.indexOf(ATOMIC) === 0) {
        return;
      }

      const selection = editorState.getSelection();
      const cursorOffset = selection.getAnchorOffset();
      if (cursorOffset > 2) {
        return;
      }

      const blockText = block.getText();
      const precede = blockText.slice(0, cursorOffset);
      const type = textComboMap[precede];

      if (!type) {
        return;
      }

      if (type === blockType) {
        return;
      }

      return setSelectedBlockProperty(editorState, { type, text: blockText.slice(cursorOffset) });
    },
  };
}
