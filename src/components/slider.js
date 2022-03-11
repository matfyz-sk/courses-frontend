import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const Handle = Slider.Handle;


export default class CustomSlider extends Component {

  handle(props) {
    const {value, dragging, index, ...restProps} = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={ value }
        visible={ dragging }
        placement="top"
        key={ index }
      >
        <Handle value={ value } { ...restProps } />
      </Tooltip>
    );
  }

  render() {
    return (
      <div className={ this.props.className ? ('custom-slider ' + this.props.className) : 'custom-slider' }>
        <Slider min={ this.props.min } max={ this.props.max } defaultValue={ this.props.value }
                value={ this.props.value } onChange={ this.props.onChange } handle={ this.handle.bind(this) }/>
      </div>
    )
  }
}
