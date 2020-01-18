//
import React from 'react';
import { View, Text, Button, ScrollView, Quad } from 'magic-script-components';

export default class MyApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      message: props.message,
      surfaces: ['qq'],
      addingNewSurface: false
    };
  }

  addSurface = (points) => {
    let stateCopy = this.state.surfaces.concat([])
    stateCopy.push(points)
    this.setState({
      surfaces: stateCopy
    })
  
  }

  renderSurfacesMenu = () => {
    return <View localPosition={[-1, -0.2, 0]}>
      <Text>Surfaces</Text>
      <ScrollView>
        {this.state.surfaces.map((s, i) => {
          return <Text>
            {`Surface ${i}`}
          </Text>
        })}
      </ScrollView>
    </View>
  }

  beginAddingSurface = () => {
    this.setState({
      addingNewSurface: true,
      newSurfacePoints: {
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null
      }
    })
  }

  addSurfacePoint = (hitPosition, cornerName) => {
    this.setState({
      newSurfacePoints: {
        ...this.state.newSurfacePoints,
        [cornerName]: hitPosition
      }
    })
  }

  renderGuidedSurfaceExperience = () => {
    return <View>
      <Text>please?</Text>
    </View>
  }

  renderMenus = () => {
    return <View>
      <Text textSize={0.1} localPosition={[-0.3, 0, 0]}>
        Space Changer
      </Text>
      {this.renderSurfacesMenu()}
      <Button
        height={0.1}
        localPosition={[0.4, -0.2, 0]}
        onClick={this.beginAddingSurface}
        roundness={0.7}
        textSize={0.03}
        width={0.3}
      >
        Add New Surface
      </Button>
    </View>
  }

  render () {
    return (
      <View name="main-view">
        {
          this.state.addingNewSurface
          ? this.renderGuidedSurfaceExperience()
          : this.renderMenus()
        }
        {this.renderSurfacesMenu()}
      </View>
    );
  }
}
