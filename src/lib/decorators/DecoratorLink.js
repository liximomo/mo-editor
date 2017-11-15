import React from 'react';
import { LINK as ENTITY_TYPE_LINK } from '../entities/TypeOfEntites';
import createTypeStrategy from '../utils/createTypeStrategy';

const Link = props => {
  const { contentState, entityKey } = props;
  const { href } = contentState.getEntity(entityKey).getData();
  return (
    <a
      className="MoEditor__link"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={href}
    >
      {props.children}
    </a>
  );
};

export default {
  strategy: createTypeStrategy(ENTITY_TYPE_LINK),
  component: Link,
};
