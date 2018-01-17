import * as BlockType from './TypeOfBlock';

export default function getBlockMeta(block) {
  const type = block.getType();
  const defaultMeta = {
    isAtomic: type.indexOf(BlockType.ATOMIC) >= 0,
    inline: false,
    blockInherit: false,
  };
  const meta = block.getData().get('meta') || {};

  switch (type) {
    case BlockType.OL:
    case BlockType.UL:
      defaultMeta.blockInherit = true;
      break;
    default:
      break;
  }

  return {
    ...defaultMeta,
    ...meta,
  };
}
