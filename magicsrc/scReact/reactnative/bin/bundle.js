var _ = (function (React) {
  'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function Button(props) {
    // return (<button {...props} />);
    return React.createElement('button', props);
  }
  function Text(props) {
    // return (<text {...props} />);
    return React.createElement('text', props);
  }
  function View(props) {
    // return (<view {...props} />);
    return React.createElement('view', props);
  }
  function ScrollView(props) {
    // return (<scrollView {...props} />);
    return React.createElement('scrollView', props);
  }

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
        return React.createElement(View, {
          localPosition: [-1, -0.2, 0]
        }, React.createElement(Text, null, "Surfaces"), React.createElement(ScrollView, null, this.state.surfaces.map((s, i) => {
          return React.createElement(Text, null, `Surface ${i}`);
        })));
      });

      _defineProperty(this, "beginAddingSurface", () => {
        this.setState({
          addingSurface: true,
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
        surfaces: [],
        addingNewSurface: false
      };
    }

    render() {
      return React.createElement(View, {
        name: "main-view"
      }, this.state.addingNewSurface ? this.renderGuidedSurfaceExperience() : this.renderMenus(), this.renderSurfacesMenu());
    }

  }

  return MyApp;

}(React));
