// @flow
import React from 'react';

const Link = (props) => {
  const { contentState, entityKey } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      className="MoEditor__link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >{props.children}</a>
  );
};

export default Link;
