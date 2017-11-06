import createEntityCreator from './createEntityCreator';
import * as EntityType from './TypeOfEntites';

const entityPropertyList = [
  {
    type: EntityType.BREAK,
    mutatble: 'IMMUTABLE',
  },
  {
    type: EntityType.LINK,
    mutatble: 'MUTABLE',
  },
];

const entitiyCreators = {};

entityPropertyList.reduce(property => {
  entitiyCreators[property.type] = createEntityCreator(property);
  return entitiyCreators;
}, entitiyCreators);

export default entitiyCreators;
