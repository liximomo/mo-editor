import * as BlockType from './TypeOfBlock';

export default function getDefaultBlockMeta(type) {
  const meta = {
    inline: false,
    blockInherit: false,
  };
  switch (type) {
    case BlockType.OL:
    case BlockType.UL:
      meta.blockInherit = true;
      break;
    default:
      break;
  }

  return meta;
}
