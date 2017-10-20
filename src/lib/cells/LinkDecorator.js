import Link from './Link';
import { LINK } from './TypeOfEntites';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === LINK
      );
    },
    callback
  );
}

export default {
  strategy: findLinkEntities,
  component: Link,
};
