import createEntityCreator from './createEntityCreator';
import { BREAK } from './TypeOfEntites';

export default createEntityCreator({
  type: BREAK,
  mutatble: 'IMMUTABLE',
});
