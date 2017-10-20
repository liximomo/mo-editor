import { LINK } from './TypeOfEntites';

export default function withLinkEntity(contentState, url) {
  const contentStateWithEntity = contentState.createEntity(
    LINK,
    'MUTABLE',
    { url },
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return {
    contentStateWithEntity,
    entityKey,
  };
}