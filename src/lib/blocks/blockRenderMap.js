import immutable from 'immutable';
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
  [BlockType.UNSTYLED]: {
    element: 'div',
    aliasedElements: ['p', 'section'],
  },
});

export default blockRenderMap;
