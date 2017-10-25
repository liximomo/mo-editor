import React from 'react';
import Button from '../components/Button';
import IconLink from '../components/icons/IconLink';

const LinkComposer = props => {
  return <Button icon={IconLink} />;
};

export default {
  id: 'link',
  title: '链接',
  render: () => <LinkComposer />,
};
