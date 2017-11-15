import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import './ColorPicker.scss';

export class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.handlEnter = this.handlEnter.bind(this);
    this.currentColor = '';
  }

  handlEnter(item) {
    if (this.currentColor !== item) {
      this.props.onChange(item);
      this.currentColor = item;
    }
  }

  render() {
    return (
      <div>
        {this.props.colors.map((item, index) => (
          <li
            key={item}
            className="colorPalette"
            style={{ backgroundColor: item }}
            onClick={event => this.handlEnter(item)}
          >
            <div
              className="colorPalette colorPalette__shadow"
              style={{
                backgroundColor: item,
              }}
            />
            <div
              className="colorPalette colorPalette__shadow"
              style={{
                backgroundColor: item,
              }}
            />
          </li>
        ))}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
};
