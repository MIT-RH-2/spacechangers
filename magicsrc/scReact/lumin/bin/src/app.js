import { defineProperty as _defineProperty } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from '../node_modules/react/index.js';
import { View, Panel, Text, ScrollView, Button } from '../node_modules/magic-script-components/src/components.js';

const aShape = {
  size: [0.4, 0.4],
  offset: [0, 0, 0],
  roundness: 0.2
};
class MyApp extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "addSurface", points => {
      let stateCopy = this.state.surfaces.concat([]);
      stateCopy.push(points);
      this.setState({
        surfaces: stateCopy
      });
    });

    _defineProperty(this, "renderSurfacesMenu", () => {
      return React.createElement(Panel, {
        localPosition: [-1, 0.4, 0],
        panelShape: aShape,
        cursorTransitionType: "closest-edge",
        cursorVisible: true
      }, React.createElement(Text, null, "Surfaces"), React.createElement(ScrollView, null, this.state.surfaces.map((s, i) => {
        return React.createElement(Text, null, `Surface ${i}`);
      })));
    });

    _defineProperty(this, "beginAddingSurface", () => {
      this.setState({
        addingNewSurface: true,
        newSurfacePoints: {
          topLeft: null,
          topRight: null,
          bottomLeft: null,
          bottomRight: null
        }
      });
    });

    _defineProperty(this, "addSurfacePoint", (hitPosition, cornerName) => {
      this.setState({
        newSurfacePoints: { ...this.state.newSurfacePoints,
          [cornerName]: hitPosition
        }
      });
    });

    _defineProperty(this, "renderGuidedSurfaceExperience", () => {
      return React.createElement(View, null, React.createElement(Text, null, "please?"));
    });

    _defineProperty(this, "renderMenus", () => {
      return React.createElement(View, null, React.createElement(Text, {
        textSize: 0.1,
        localPosition: [-0.3, 0, 0]
      }, "Space Changer"), this.renderSurfacesMenu(), React.createElement(Button, {
        height: 0.1,
        localPosition: [0.4, -0.2, 0],
        onClick: this.beginAddingSurface,
        roundness: 0.7,
        textSize: 0.03,
        width: 0.3
      }, "Add New Surface"));
    });

    this.state = {
      message: props.message,
      surfaces: ['qq'],
      addingNewSurface: false
    };
  }

  render() {
    return React.createElement(View, {
      name: "main-view"
    }, this.state.addingNewSurface ? this.renderGuidedSurfaceExperience() : this.renderMenus(), this.renderSurfacesMenu());
  }

}

export default MyApp;
