import React, { Component } from 'react';
import Control from '../Control';
import IconQuote from '../components/icons/IconQuote';
import { toggleBlockType, getCurrentBlockType } from '../operation/Block';

import Button from '../components/Button';
import * as BlockType from '../blocks/TypeOfBlock';

class BlockComposer extends Component {
  handleClick = () => {
    const { editorState, setEditorState } = this.props;
    const nextState = toggleBlockType(editorState, this.props.type);
    setEditorState(nextState);
  };

  render() {
    const { icon, type, editorState } = this.props;
    const blockType = getCurrentBlockType(editorState);

    return <Button active={blockType === type} icon={icon} onClick={this.handleClick} />;
  }
}

export default function createBlockComposer(blockType) {
  let icon;
  let title;
  switch (blockType) {
    case BlockType.H3:
      icon = 'H';
      title = '标题';
      break;
    case BlockType.H4:
      icon = <span style={{ fontSize: '0.8em' }}>H</span>;
      title = '子标题';
      break;
    case BlockType.BLOCKQUOTE:
      icon = IconQuote;
      title = '引用';
      break;
    default:
      break;
  }

  return {
    id: blockType,
    title,
    element: (
      <Control render={props => <BlockComposer icon={icon} type={blockType} {...props} />} />
    ),
  };
}
