import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { styleTrans } from '../utils/style';

import './Popover.scss';

export default class Popover extends Component {
  static propTypes = {
    active: PropTypes.bool,
    direction: PropTypes.string,
    offset: PropTypes.number,
    positionNode: PropTypes.object,
    targetRect: PropTypes.object,
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

  isTargetRectValid() {
    const { targetRect } = this.props;
    return targetRect && targetRect.width > 0;
  }

  calPosition() {
    const { targetRect, positionNode, direction, offset } = this.props;
    if (!positionNode) {
      return;
    }

    if (!this.isTargetRectValid()) {
      return;
    }

    const node = this._node;
    const nodeClientRect = node.getBoundingClientRect();
    const positionClientRect = positionNode.getBoundingClientRect();

    // 居中
    const widthDiff = targetRect.width - nodeClientRect.width;

    let left = targetRect.left - positionClientRect.left + widthDiff / 2;
    // if (widthDiff > 0) {
    //   left = selectionRect.left + widthDiff / 2;
    // } else {
    //   console.log(selectionRect.left, positionClientRect.left, widthDiff);
    //   left = selectionRect.left - positionClientRect.left + widthDiff / 2;
    // }

    let classModifer = 'top';
    const offsetAtTop = () => {
      classModifer = 'top';
      return targetRect.top - positionClientRect.top - nodeClientRect.height - offset;
    };
    const offsetAtBottom = () => {
      classModifer = 'bottom';
      return targetRect.bottom - positionClientRect.top + offset;
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

    // const shouldShow = this.isTargetRectValid() && active;
    return (
      <div className={`MoEditorPopover${active ? ' is-active' : ''}`} ref={this.setNode}>
        {active ? this.props.children : null}
      </div>
    );
  }
}
