import React, { Component } from 'react';
import { View, ColorPicker } from 'magic-script-components';

export default class OurColorPicker extends Component {
  render () {
    return (
      <View name="main-view">
        <ColorPicker color={[1, 0.5, 1, 0.8]} />
      </View>
    );
  }
}
