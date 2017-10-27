import BlockImage from './BlockImage';
import BlockBreak from './BlockBreak';

import * as BlockType from './TypeOfBlock';

export default contentBlock => {
  // console.log(editorState, onChange);
  const type = contentBlock.getType();
  switch (type) {
    case BlockType.IMAGE:
      return {
        component: BlockImage,
      };
    case BlockType.BREAK:
      return {
        component: BlockBreak,
      };
    default:
      return null;
  }
};
