import PropTypes from 'prop-types';
import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

import Button from './IconButton';
import IconAdd from './icons/IconAdd';

import * as BlockType from '../blocks/TypeOfBlock';
import { styleTrans } from '../utils/style';
import {
  getSelectionRect as getNativeSelectionRect,
  getSelection as getNativeSelection,
} from '../utils/selection';

import './AddBlockButton.scss';

const totalTime = 200;

const ButtonBox = ({ children }) => <div className="MoAddBlockButton__box">{children}</div>;

function isEmptyLine(editorState) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  if (
    !selection.isCollapsed() ||
    selection.anchorKey !== selection.focusKey || // 有范围选择
    contentState
      .getBlockForKey(selection.getAnchorKey())
      .getType()
      .indexOf(BlockType.ATOMIC) >= 0 // 在原子块内
  ) {
    return false;
  }

  const block = contentState.getBlockForKey(selection.anchorKey);

  if (block.getLength() > 0) {
    return false;
  }

  return true;
}

class AddBlockButton extends Component {
  static propTypes = {
    positionNode: PropTypes.object,
  };

  state = {
    expand: false,
  };

  constructor(props) {
    super(props);
    this.active = isEmptyLine(props.editorState);
  }

  componentWillReceiveProps(nextProps) {
    this.active = isEmptyLine(nextProps.editorState);
  }

  componentDidUpdate() {
    if (!this.active) {
      return;
    }

    this.calPosition();
  }

  calPosition() {
    const nativeSelection = getNativeSelection(window);
    const selectionRect = getNativeSelectionRect(nativeSelection);
    if (!selectionRect) {
      return;
    }

    const { positionNode } = this.props;
    if (!positionNode) {
      return;
    }

    const positionClientRect = positionNode.getBoundingClientRect();
    const top = selectionRect.top - positionClientRect.top;

    this._node.style[styleTrans.transformProp] = `translate3d(0, ${top}px, 0)`;
  }

  setNode = node => {
    this._node = node;
  };

  toggleExpand = () => {
    this.setState(preState => {
      return {
        expand: !preState.expand,
      };
    });
  };

  handleClickOutside() {
    if (this.state.expand) {
      this.toggleExpand();
    }
  }

  shouldActive() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    if (
      !selection.isCollapsed() ||
      selection.anchorKey !== selection.focusKey || // 有范围选择
      contentState
        .getBlockForKey(selection.getAnchorKey())
        .getType()
        .indexOf(BlockType.ATOMIC) >= 0 // 在原子块内
    ) {
      return false;
    }

    const block = contentState.getBlockForKey(selection.anchorKey);

    if (block.getLength() > 0) {
      return false;
    }

    return true;
  }

  render() {
    const { expand } = this.state;
    const { buttons } = this.props;
    const active = this.active;

    const timeoutUnit = Math.ceil(totalTime / buttons.length);

    return (
      <div className={`MoAddBlockButton${active ? ' is-active' : ''}`} ref={this.setNode}>
        {active
          ? [
              <Button
                key="1"
                icon={IconAdd}
                modifier={'add'}
                active={expand}
                onClick={this.toggleExpand}
              />,
              <TransitionGroup key="2" component={ButtonBox}>
                {expand
                  ? buttons.map((button, index) => (
                      <Transition key={button.id} timeout={index * timeoutUnit}>
                        {status => (
                          <div
                            title={button.title}
                            className={`MoEditorActionWrapper LeftEnter LeftEnter-${status}`}
                          >
                            {button.element}
                          </div>
                        )}
                      </Transition>
                    ))
                  : null}
              </TransitionGroup>,
            ]
          : null}
      </div>
    );
  }
}

export default enhanceWithClickOutside(AddBlockButton);
