import BlockAtomicBreak from './BlockAtomicBreak';
import * as BlockType from './TypeOfBlock';

export const ATOMIC = 'ATOMIC';

export default contentBlock => {
  const data = contentBlock.getData();
  const type = data.get('type');
  switch (type) {
    case BlockType.ATOMIC_BREAK:
      return {
        component: BlockAtomicBreak,
      };
    default:
      return null;
  }
};
