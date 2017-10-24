import PropTypes from 'prop-types';
import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

import { styleTrans } from './utils/style';
import {
  getSelectionRect as getNativeSelectionRect,
  getSelection as getNativeSelection,
} from './utils/selection';
import ActionButton from './ui/ActionButton';
import IconAdd from './ui/icons/IconAdd';

import './AddBlockButton.scss';

const totalTime = 200;

const ButtonBox = ({ children }) => <div className="MoEditorAddBlockButton__box">{children}</div>;

class AddBlockButton extends Component {
  static propTypes = {
    active: PropTypes.bool,
    positionNode: PropTypes.object,
  };

  static defaultProps = {
    active: false,
  };

  state = {
    buttons: [1, 3, 4, 5, 6, 7],
    expand: false,
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

  render() {
    const { expand, buttons } = this.state;
    const { active } = this.props;

    const timeoutUnit = Math.ceil(totalTime / buttons.length);

    return (
      <div className={`MoEditorAddBlockButton${active ? ' is-active' : ''}`} ref={this.setNode}>
        <ActionButton icon={IconAdd} modifier={'add'} active={expand} onClick={this.toggleExpand} />
        <TransitionGroup component={ButtonBox}>
          {expand
            ? buttons.map((button, index) => (
                <Transition key={button} timeout={index * timeoutUnit}>
                  {status => (
                    <ActionButton
                      className={`LeftEnter LeftEnter-${status}`}
                      icon={IconAdd}
                      onClick={this.toggleExpand}
                    />
                  )}
                </Transition>
              ))
            : null}
        </TransitionGroup>
      </div>
    );
  }
}

export default enhanceWithClickOutside(AddBlockButton);
