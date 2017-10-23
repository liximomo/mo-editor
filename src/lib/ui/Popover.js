import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getSelectionRect, getSelection } from '../utils/selection';
// import { styleTrans } from '../utils/style';

import './Popover.scss';

export default class Popover extends Component {
  static propTypes = {
    active: PropTypes.bool,
    direction: PropTypes.string,
    offset: PropTypes.number,
    editorState: PropTypes.object,
    positionNode: PropTypes.object,
  };

  static defaultProps = {
    active: false,
    direction: 'top',
    offset: 6,
  };

  componentDidUpdate() {
    if (!this.props.active) {
      return;
    }

    this.calPosition();
  }

  shuoldComponentUpdate(nextProps, nextState) {
    return nextProps.active;
  }

  calPosition() {
    const { selection, positionNode, direction, offset } = this.props;
    if (!positionNode) {
      return;
    }

    if (selection.isCollapsed()) {
      return;
    }

    const nativeSelection = getSelection(window);
    const selectionRect = getSelectionRect(nativeSelection);
    if (!selectionRect) {
      return;
    }

    const node = this._node;
    const nodeClientRect = node.getBoundingClientRect();
    const positionClientRect = positionNode.getBoundingClientRect();

    // 居中
    const widthDiff = selectionRect.width - nodeClientRect.width;

    let left = selectionRect.left - positionClientRect.left + widthDiff / 2;
    // if (widthDiff > 0) {
    //   left = selectionRect.left + widthDiff / 2;
    // } else {
    //   console.log(selectionRect.left, positionClientRect.left, widthDiff);
    //   left = selectionRect.left - positionClientRect.left + widthDiff / 2;
    // }

    let classModifer = 'top';
    const offsetAtTop = () => {
      classModifer = 'top';
      return selectionRect.top - positionClientRect.top - nodeClientRect.height - offset;
    };
    const offsetAtBottom = () => {
      classModifer = 'bottom';
      return selectionRect.bottom - positionClientRect.top + offset;
    };

    // 定位
    let top;
    if (direction === 'top') {
      top = offsetAtTop();
    } else {
      top = offsetAtBottom();
    }

    // 限定在 positionClientRect 内
    if (top < nodeClientRect.height) {
      top = offsetAtBottom();
    }

    // 没有使用 else 确保在两边都超界的时候选择停靠在顶部
    if (top > positionClientRect.height - nodeClientRect.height) {
      top = offsetAtTop();
    }

    // node.style[styleTrans.transformProp] = `translate3d(${left}px, ${top}px, 0)`;
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
    node.classList.remove('is-top', 'is-bottom');
    node.classList.add(`is-${classModifer}`);
  }

  setNode = node => {
    this._node = node;
  };

  render() {
    const { active } = this.props;

    return (
      <div className={`MoEditorPopover${active ? ' is-active' : ''}`} ref={this.setNode}>
        {this.props.children}
      </div>
    );
  }
}
