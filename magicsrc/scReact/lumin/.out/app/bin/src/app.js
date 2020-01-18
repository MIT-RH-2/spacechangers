import { LandscapeApp, PrismController } from 'lumin';
import '../node_modules/react/index.js';

//
// export class MyApp extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       message: props.message,
//       surfaces: ['qq'],
//       addingNewSurface: false
//     };
//     let prismApp = new App()
//     this.prism = prismApp.prism
//     // let prismplease = new LandscapeApp()
//     // this.prism = prismplease.requestNewPrism([10, 10, 10]);
//     // this.prism.setPrismController(new Controller());
//   }
//   componentDidMount () {
//   }
//   addSurface = (points) => {
//     let stateCopy = this.state.surfaces.concat([])
//     stateCopy.push(points)
//     this.setState({
//       surfaces: stateCopy
//     })
//   }
//   renderSurfacesMenu = () => {
//       const aShape = {
//         size: [0.4, 0.4],
//         offset: [0, 0, 0],
//         roundness: 0.2
//       };
//       return <Panel
//         localPosition={[0, 0.25, 0]}
//         panelShape={aShape}
//         // cursorTransitionType="closest-edge"
//         cursorVisible={true}
//         edgeConstraint={{
//           side: 'left',
//           constraintMagnitude: 1
//         }}
//         edgeConstraintLevel={{
//           side: 'left',
//           level: 'light'
//         }}
//         cursorInitialPosition={[0, 0, 0]}
//       > 
//         {/* <Text textSize={0.1}>Surfaces</Text>
//         <ScrollView>
//           {this.state.surfaces.map((s, i) => {
//             return <Text>
//               {`Surface ${i}`}
//             </Text>
//           })}
//         </ScrollView> */}
//     </Panel>
//   }
//   beginAddingSurface = () => {
//     this.setState({
//       addingNewSurface: true,
//       newSurfacePoints: {
//         topLeft: null,
//         topRight: null,
//         bottomLeft: null,
//         bottomRight: null
//       }
//     })
//   }
//   addSurfacePoint = (hitPosition, cornerName) => {
//     this.setState({
//       newSurfacePoints: {
//         ...this.state.newSurfacePoints,
//         [cornerName]: hitPosition
//       }
//     })
//   }
//   renderGuidedSurfaceExperience = () => {
//     return <View>
//       <Text>Select top left corner</Text>
//     </View>
//   }
//   renderMenus = () => {
//     return <View>
//       <Text textSize={0.1} localPosition={[-0.3, 0, 0]}>
//         Space Changer
//       </Text>
//       {this.renderSurfacesMenu()}
//       <Button
//         height={0.1}
//         localPosition={[0.4, -0.2, 0]}
//         onClick={this.beginAddingSurface}
//         roundness={0.7}
//         textSize={0.03}
//         width={0.3}
//       >
//         Add New Surface
//       </Button>
//     </View>
//   }
//   render () {
//     return (
//       <View name="main-view" viewMode={'full-area'}>
//         {
//           this.state.addingNewSurface
//           ? this.renderGuidedSurfaceExperience()
//           : this.renderMenus()
//         }
//       </View>
//     );
//   }
// }

class App extends LandscapeApp {
  onAppStart() {
    // Create a new prism that's half a meter cubed.
    this.prism = this.requestNewPrism([0.5, 0.5, 0.5]); // Set a custom prism controller to handle the rest.

    this.prism.setPrismController(new Controller());
  }

}

class Controller extends PrismController {// onAttachPrism() {
  // let prism = this.getPrism();
  // Load a model file into a node.
  // let id = prism.createModelResourceId("res/Leaper.glb", 0.3);
  // let model = prism.createModelNode(id);
  // Attach the model to the scene graph so it renders.
  // this.getRoot().addChild(model);
  // }
}

export default App;
