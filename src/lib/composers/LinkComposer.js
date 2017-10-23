import React from 'react';
import ActionButton from '../ui/ActionButton';
import IconLink from '../ui/icons/IconLink';

const LinkComposer = props => {
  return <ActionButton icon={IconLink} />;
};

export default {
  id: 'link',
  title: '链接',
  render: () => <LinkComposer />,
};
