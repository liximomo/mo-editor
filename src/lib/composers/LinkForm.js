import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import './LinkForm.scss';

class LinkForm extends Component {
  state = {
    value: '',
  };

  onChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  onKeyPress = event => {
    if (event.charCode === 13) {
      this.submit();
    }
  };

  handleClickOutside() {
    this.submit();
  }

  submit() {
    this.props.onSubmit(this.state.value);
  }

  render() {
    const value = this.state.value;

    return (
      <input
        className="LinkForm__Input"
        value={value}
        autoFocus
        onBlur={this.onBlur}
        onChange={this.onChange}
        placeholder="请输入链接"
        onKeyPress={this.onKeyPress}
      />
    );
  }
}

export default enhanceWithClickOutside(LinkForm);
