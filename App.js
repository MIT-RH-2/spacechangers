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
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  Button,
  FlatList,
  Vibration,
} from 'react-native';
import {View, Text} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import _ from 'lodash';
import {ARKit} from 'react-native-arkit';
import SlidingUpPanel from 'rn-sliding-up-panel';
import ADP from 'awesome-debounce-promise';

const {height} = Dimensions.get('window');
const points = ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'];

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
    this.setState(
      {
        addingNewSurface: true,
        newSurfacePoints: {
          topLeft: null,
          topRight: null,
          bottomLeft: null,
          bottomRight: null,
        },
        currentPointIndex: 0,
      },
      () => {
        this.dropDownAlertRef.alertWithType(
          'info',
          'Add Corner Point',
          'Tap the top left corner of the surface',
          {},
          1300,
        );
        Vibration.vibrate(700);
      },
    );
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
    let {addingNewSurface, currentPointIndex} = this.state;
    const hits = await ARKit.hitTestPlanes(location, 1);
    if (hits.results && hits.results.length) {
      if (addingNewSurface) {
        this.addNewPoint(hits.results[0].position);
      }
    }
  };

  addNewPoint = ADP(position => {
    let {currentPointIndex} = this.state;

    if (currentPointIndex < 3) {
      this.setState(
        {
          newSurfacePoints: {
            ...this.state.newSurfacePoints,
            [points[currentPointIndex]]: position,
          },
          currentPointIndex: currentPointIndex + 1,
        },
        () => {
          this.dropDownAlertRef.alertWithType(
            'info',
            'Add Corner Point',
            `Tap the ${
              points[this.state.currentPointIndex]
            } corner of the surface`,
            {},
            1300,
          );
          Vibration.vibrate(700);
        },
      );
    } else {
      this.finishAddingSurface();
    }
  }, 1000);

  finishAddingSurface = () => {
    // todo take the 4 points and add a surface to state
    this.setState(
      {
        addingNewSurface: false,
        newSurfacePoints: {
          topLeft: null,
          topRight: null,
          bottomLeft: null,
          bottomRight: null,
        },
      },
      () => {
        this.dropDownAlertRef.alertWithType(
          'success',
          'Surface Added',
          'New surface added',
          {},
          1300,
        );
        Vibration.vibrate(1100);
      },
    );
  };

  renderTestPoint = (position) => {
    return (
      <ARKit.Sphere
        position={this.state.newSurfacePoints[position]}
        shape={{radius: 0.0075}}
      />
    );
  };

  renderSurfacesList = () => {
    <FlatList
      data={_.map(this.state.surfaces, ({name, position}, surfaceName) => {
        return {
          name,
          position,
        };
      })}
      renderItem={({item}) => (
        <SurfaceListItem title={item.name} found={item.position} />
      )}
      keyExtractor={item => item.name}
    />;
  };

  renderSurfacesList = () => {
    <FlatList
      data={_.map(this.state.surfaces, ({name, position}, surfaceName) => {
        return {
          name,
          position,
        };
      })}
      renderItem={({item}) => (
        <SurfaceListItem title={item.name} found={item.position} />
      )}
      keyExtractor={item => item.name}
    />;
  };

  renderSurfacesListOrCancel = () => {
    const {addingNewSurface} = this.state;

    if (!addingNewSurface) {
      return (
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.75, bottom: 90}}
          animatedValue={this._draggedValue}
          showBackdrop={false}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Button onPress={this.beginAddingSurface} title="Add Surface" />
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.surfacesHeaderContainer}>
                <Text style={styles.surfacesHeader}>Surfaces</Text>
              </View>
              <View style={styles.surfacesListArea}>
                {this.renderSurfacesList()}
              </View>
            </View>
          </View>
        </SlidingUpPanel>
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
              this.renderTestPoint('topLeft')}
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.bottomLEft &&
              this.renderTestPoint('bottomLeft')}
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.topRight &&
              this.renderTestPoint('topRight')}
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.bottomRight &&
              this.renderTestPoint('bottomRight')}
          </ARKit>
        </View>
        {this.renderSurfacesListOrCancel()}
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

function SurfaceListItem({title, found}) {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
      {/* render a button that when pressed brings up a modal to change the surfaces texture */}
    </View>
  );
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
  panel: {},
  panelHeader: {},
  contentContainer: {},
  surfacesHeaderContainer: {},
  surfacesHeader: {},
});
