import React, { Component } from 'react';
import { BLOCK } from '../TypeOfContent';
import Control from '../Control';
import IconQuote from '../components/icons/IconQuote';
import IconTitle from '../components/icons/IconTitle';
import IconTitleS from '../components/icons/IconTitleS';
import { toggleBlockType, getCurrentBlockType } from '../operation/Block';

import Button from '../components/IconButton';
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
      icon = IconTitle;
      title = '标题';
      break;
    case BlockType.H4:
      icon = IconTitleS;
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
    type: BLOCK,
    render: _ => (
      <Control render={props => <BlockComposer icon={icon} type={blockType} {...props} />} />
    ),
  };
}
