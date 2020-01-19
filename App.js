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
  Alert,
} from 'react-native';
import {View, Text} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import _ from 'lodash';
import {ARKit} from 'react-native-arkit';
import SlidingUpPanel from 'rn-sliding-up-panel';
import ADP from 'awesome-debounce-promise';
import {ColorPicker, toHsv, fromHsv} from 'react-native-color-picker';

var THREE = require('three');

const {height, width} = Dimensions.get('window');
const points = ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'];

export default class App extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
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

  changeSurfaceColor = (index, color) => {
    let stateCopy = this.state.surfaces;
    stateCopy[index].color = color;
    this.setState({
      surfaces: stateCopy,
    });
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
      this.setState(
        {
          newSurfacePoints: {
            ...this.state.newSurfacePoints,
            [points[currentPointIndex]]: position,
          },
        },
        () => {
          this.finishAddingSurface();
        },
      );
    }
  }, 1000);

  finishAddingSurface = async () => {
    const {
      newSurfacePoints: {topLeft, bottomLeft, topRight, bottomRight},
    } = this.state;

    // todo take the 4 points and add a surface to state.. this is center point
    const cx = (topLeft.x + bottomLeft.x + topRight.x + bottomRight.x) / 4;
    const cy = (topLeft.y + bottomLeft.y + topRight.y + bottomRight.y) / 4;
    const cz = (topLeft.z + bottomLeft.z + topRight.z + bottomRight.z) / 4;

    // find the euler angles for the surface

    var quat = new THREE.Quaternion();

    threePointsToEuler(
      new THREE.Vector3(topLeft.x, topLeft.y, topLeft.z),
      new THREE.Vector3(bottomLeft.x, bottomLeft.y, bottomLeft.z),
      new THREE.Vector3(topRight.x, topRight.y, topRight.z),
      quat,
    );

    var m = new THREE.Matrix4();
    var eu = new THREE.Euler();
    eu.setFromRotationMatrix(m, 'XYZ');
    m.makeRotationFromQuaternion(quat);

    const euX = toReal(toAngle(eu.toArray()[0]));
    const euY = toReal(toAngle(eu.toArray()[1]));
    const euZ = toReal(toAngle(eu.toArray()[2]));
    console.log(`euX: ${euX}, euY: ${euY}, euZ: ${euZ}`);
    const newSurface = {
      position: {x: cx, y: cy, z: cz},
      size: {
        width: topLeft.x - topRight.x,
        height: topLeft.y - bottomLeft.y,
      },
      eulerAngle: {x: euX, y: euY, z: euZ},
      texture: '',
      color: 'red',
    };
    let stateCopy = this.state.surfaces;
    stateCopy.push(newSurface);
    this.setState(
      {
        surfaces: stateCopy,
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

  renderTestPoint = position => {
    return (
      <ARKit.Sphere
        position={this.state.newSurfacePoints[position]}
        shape={{radius: 0.0075}}
      />
    );
  };

  renderSurfacesList = () => {
    return (
      <FlatList
        data={_.map(this.state.surfaces, ({name, position}, index) => {
          return {
            name,
            position,
            index,
          };
        })}
        renderItem={({item}) => (
          <SurfaceListItem
            title={`Surface ${item.index}`}
            index={item.index}
            parent={this}
          />
        )}
        keyExtractor={item => item.id}
      />
    );
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

  renderQuads = () => {
    return this.state.surfaces.map(s => {
      return (
        <ARKit.Plane
          position={s.position}
          shape={{width: s.size.width, height: s.size.height}}
          eulerAngles={{
            x: s.eulerAngle.x || 0,
            y: s.eulerAngle.y || 0,
            z: s.eulerAngle.z || 0,
          }}
          material={{
            diffuse: {
              color: s.color,
            },
          }}
        />
      );
    });
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
              this.state.newSurfacePoints.bottomLeft &&
              this.renderTestPoint('bottomLeft')}
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.topRight &&
              this.renderTestPoint('topRight')}
            {this.state.addingNewSurface &&
              this.state.newSurfacePoints.bottomRight &&
              this.renderTestPoint('bottomRight')}
            {this.renderQuads()}
          </ARKit>
          <ARKit.Light
            position={{x: 1, y: 3, z: 1}}
            type={ARKit.LightType.Ambient}
            color="white"
          />
          <ARKit.Light
            position={{x: 1, y: -3, z: -3}}
            type={ARKit.LightType.Ambient}
            color="white"
          />
          <ARKit.Light
            position={{x: -2, y: 1, z: 1}}
            type={ARKit.LightType.Ambient}
            color="white"
          />
        </View>
        {this.renderSurfacesListOrCancel()}
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

function SurfaceListItem({title, parent, index}) {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
      <ColorPicker
        color={toHsv(parent.state.surfaces[index].color)}
        onColorChange={color => {
          parent.changeSurfaceColor(index, fromHsv(color))
        }}
        style={{width: 100, height: 100}}
      />
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
  panel: {
    backgroundColor: 'white',
    flex: 1,
  },
  panelHeader: {
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  surfacesHeaderContainer: {
    backgroundColor: 'white',
  },
  surfacesHeader: {
    backgroundColor: 'white',
  },
});

function toReal(x) {
  if (!isNaN(parseFloat(x)) && isFinite(parseFloat(x))) {
    return parseFloat(parseFloat(x).toFixed(7));
  } else {
    return x;
  }
}

function toAngle(x) {
  const wantRadians = true;
  if (wantRadians) {
    return (x * 180) / Math.PI;
  } else {
    return x;
  }
}

const threePointsToEuler = (P, Q, R, quat) => {
  var m = new THREE.Matrix4();
  var x = new THREE.Vector3();
  var y = new THREE.Vector3();
  var z = new THREE.Vector3();
  x.subVectors(Q, P).normalize();
  y.subVectors(R, P);
  z.crossVectors(x, y).normalize();
  y.crossVectors(z, x).normalize();
  m.set(x.x, y.x, z.x, 1, x.y, y.y, z.y, 1, x.z, y.z, z.z, 1, 0, 0, 0, 1);
  quat.setFromRotationMatrix(m);
};
