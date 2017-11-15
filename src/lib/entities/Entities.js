import createEntityCreator from './createEntityCreator';
import * as EntityType from './TypeOfEntites';

const entityPropertyList = [
  {
    type: EntityType.LINK,
    mutatble: 'MUTABLE',
  },
];

const entitiyCreators = {};

entityPropertyList.forEach(property => {
  entitiyCreators[property.type] = createEntityCreator(property);
});

export default entitiyCreators;
