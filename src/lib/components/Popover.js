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
    getTargetRect: PropTypes.func,
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

  isTargetRectValid(targetRect) {
    return targetRect && targetRect.width > 0;
  }

  calPosition() {
    const { getTargetRect, positionNode, direction, offset } = this.props;
    if (!positionNode) {
      return;
    }

    const targetRect = getTargetRect();
    if (!this.isTargetRectValid(targetRect)) {
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

    // // 限定在 positionClientRect 内
    // console.log(top, positionClientRect.top);
    // if (top < positionClientRect.top) {
    //   top = offsetAtBottom();
    // }

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
        {active ? this.props.children : null}
      </div>
    );
  }
}
