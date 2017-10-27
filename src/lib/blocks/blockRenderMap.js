import immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import * as BlockType from './TypeOfBlock';

const blockRenderMap = immutable.Map({
  [BlockType.H3]: {
    element: 'h3',
  },
  [BlockType.H4]: {
    element: 'h4',
  },
  [BlockType.IMAGE]: {
    element: 'figure',
  },
  [BlockType.BLOCKQUOTE]: {
    element: 'blockquote',
  },
  // [BlockType.BREAK]: {
  //   element: 'hr',
  // },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default extendedBlockRenderMap;
