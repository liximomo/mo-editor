import React, { Component } from 'react';

import { INLINE } from '../TypeOfContent';
import IconBold from '../components/icons/IconBold';
import IconItalic from '../components/icons/IconItalic';
import IconUnderline from '../components/icons/IconUnderline';
import Control from '../Control';
import { toggleInlineStyle, getCurrentInlineStyle } from '../operation/InlineStyle';

import Button from '../components/IconButton';
import * as InlineStyle from '../inline-styles/TypeOfInlineStyles';

class InlineComposer extends Component {
  handleClick = () => {
    const { editorState, setEditorState } = this.props;
    const nextState = toggleInlineStyle(editorState, this.props.type);
    setEditorState(nextState);
  };

  render() {
    const { icon, type, editorState } = this.props;
    const inlineStyle = getCurrentInlineStyle(editorState);

    return <Button active={inlineStyle.has(type)} icon={icon} onClick={this.handleClick} />;
  }
}

export default function createBlockComposer(style) {
  let icon;
  let title;
  switch (style) {
    case InlineStyle.BOLD:
      icon = IconBold;
      title = '加粗';
      break;
    case InlineStyle.ITALIC:
      icon = IconItalic;
      title = '斜体';
      break;
    case InlineStyle.UNDERLINE:
      icon = IconUnderline;
      title = '下划线';
      break;
    default:
      break;
  }

  return {
    id: style,
    title,
    type: INLINE,
    render: _ => (
      <Control render={props => <InlineComposer icon={icon} type={style} {...props} />} />
    ),
  };
}
