import BlockImage from './BlockImage';
import BlockAtomic from './BlockAtomic';

import * as BlockType from './TypeOfBlock';

export default contentBlock => {
  // console.log(editorState, onChange);
  const type = contentBlock.getType();
  switch (type) {
    case BlockType.IMAGE:
      return {
        component: BlockImage,
      };
    case BlockType.ATOMIC:
      return {
        component: BlockAtomic,
        editable: false,
      };
    default:
      return null;
  }
};
