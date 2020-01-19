/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, StatusBar} from 'react-native';
import {View} from 'react-native';

import {ARKit} from 'react-native-arkit';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      surfaces: [],
      addingNewSurface: false,
    };
  }

  addSurface = points => {
    let stateCopy = this.state.surfaces.concat([]);
    stateCopy.push(points);
    this.setState({
      surfaces: stateCopy,
    });
  };

  beginAddingSurface = () => {
    this.setState({
      addingNewSurface: true,
      newSurfacePoints: {
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null,
      },
    });
  };

  addSurfacePoint = (hitPosition, cornerName) => {
    this.setState({
      newSurfacePoints: {
        ...this.state.newSurfacePoints,
        [cornerName]: hitPosition,
      },
    });
  };

  handleResponderMove(e) {
    this.hitTestPlanes({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
  }

  hitTestPlanes = async location => {
    const hits = await ARKit.hitTestPlanes(location, 1);
    // get corners with hits
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View
          style={styles.container}
          onResponderMove={this.handleResponderMove.bind(this)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => false}>
          <ARKit
            style={{flex: 1}}
            debug
            planeDetection={ARKit.ARPlaneDetection.Horizontal}
            lightEstimationEnabled
            detectionImages={[{resourceGroupName: 'DetectionImages'}]}
            onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
