import React, { Component } from 'react';
import { RichUtils } from 'draft-js';
import { TOGGLE_BLOCK_TYPE } from '../commands/TypeOfCommand';
import { execCommand } from '../commands/CommandHub';

import ActionButton from '../ui/ActionButton';
import * as BlockType from '../blocks/TypeOfBlock';

class BlockComposer extends Component {
  handleClick = () => {
    const { editorState, setEditorState } = this.props;
    const nextState = execCommand(TOGGLE_BLOCK_TYPE, editorState, this.props.type);
    setEditorState(nextState);
  };

  render() {
    const { icon, type, editorState } = this.props;
    const blockType = RichUtils.getCurrentBlockType(editorState);

    return <ActionButton active={blockType === type} icon={icon} onClick={this.handleClick} />;
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
      icon = '引用';
      title = '引用';
      break;
    case BlockType.HORIZEN_BREAK:
      icon = '段落分割符';
      title = '段落分割符';
      break;
    default:
      icon = 'PLAIN';
      title = '';
      break;
  }

  return {
    id: blockType,
    title,
    render: props => {
      return <BlockComposer icon={icon} type={blockType} {...props} />;
    },
  };
}
