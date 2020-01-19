/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// TODO:
// user prompted for the 4 points.
// vibrate each time they do a hit test success with a quick toast and
// have a back button. Back moves back to last corner unless it is topLeft
// then no back button. When all four are done, add the surface.

// make state for surfaces and their texture url

// render a cube for each surface
// give it a default url texture.

// in the surface list, have a button that brings up a modal with
// a scrollview. The scrillview has image of the material on the left
// and name on the right. Tap the material and replace the texture url
// for the surfsce in question in state.

// ?????

import React, {Component} from 'react';
import {StyleSheet, Dimensions, StatusBar, Button} from 'react-native';
import {View, Text} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import _ from 'lodash';
import {ARKit} from 'react-native-arkit';

export default class App extends Component {
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
    let {addingNewSurface} = this.state;
    const hits = await ARKit.hitTestPlanes(location, 1);
    if (addingNewSurface) {
      this.setState({
        newSurfacePoints: {
          topLeft: hits.results[0].position,
        },
      });
    }
  };

  renderTestPoint = () => {
    return (
      <ARKit.Sphere
        position={this.state.newSurfacePoints.topLeft}
        shape={{radius: 0.0075}}
      />
    );
  };

  renderSurfacesListOrCancel = () => {
    const {addingNewSurface} = this.state;

    if (!addingNewSurface) {
      return (
        <>
          <Button onPress={this.beginAddingSurface} title="Add Surface" />
          <Text>Surfaces List</Text>
        </>
      );
    } else {
      return (
        <Button
          title="cancel adding surface"
          onPress={() => {
            this.setState({
              addingNewSurface: false,
              newSurfacePoints: {
                topLeft: null,
                topRight: null,
                bottomLeft: null,
                bottomRight: null,
              },
            });
          }}
        />
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
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
          >
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.topLeft &&
              this.renderTestPoint()}
          </ARKit>
        </View>
        {this.renderSurfacesListOrCancel()}
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
