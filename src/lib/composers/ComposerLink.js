import React from 'react';
import { RichUtils, Entity } from 'draft-js';
import LinkForm from './LinkForm';
import { LINK } from '../entities/TypeOfEntites';
import entitiyCreators from '../entities/Entities';
import Control from '../Control';
import Button from '../components/IconButton';
import IconLink from '../components/icons/IconLink';
import { getSelectionEntityKey } from '../operation/Selection';
import { INLINE } from '../TypeOfContent';

const createLinkEntity = entitiyCreators[LINK];

const LinkComposer = class extends React.Component {
  createUrl = value => {
    const { showExtend, editorState, setEditorState } = this.props;

    if (!value) {
      if (this.isActive) {
        setEditorState(RichUtils.toggleLink(editorState, editorState.getSelection(), null), () =>
          showExtend(null)
        );
      }

      showExtend(null);
      return;
    }

    const { newEditorState, entityKey } = createLinkEntity(editorState, { href: value });
    setEditorState(
      RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey),
      () => showExtend(null)
    );
  };

  handleClick = () => {
    const { showExtend, editorState, setEditorState } = this.props;

    if (this.isActive) {
      setEditorState(RichUtils.toggleLink(editorState, editorState.getSelection(), null));
      return;
    }

    showExtend(<LinkForm onSubmit={this.createUrl} />);
  };

  render() {
    this.isActive = false;
    const { editorState } = this.props;

    const entityKey = getSelectionEntityKey(editorState);
    if (entityKey) {
      const entity = Entity.get(entityKey);
      this.isActive = entity.getType() === LINK;
    }

    return <Button active={this.isActive} icon={IconLink} onClick={this.handleClick} />;
  }
};

export default {
  id: LINK,
  title: '链接',
  type: INLINE,
  render: props => <Control render={injectProps => <LinkComposer {...injectProps} {...props} />} />,
};
