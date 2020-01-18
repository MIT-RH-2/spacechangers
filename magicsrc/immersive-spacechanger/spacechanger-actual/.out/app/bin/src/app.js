import { ImmersiveApp, ui } from 'lumin';
import { makeButton } from './makeButton.js';

const { UiText, EclipseLabelType, Alignment, HorizontalTextAlignment } = ui;

class App extends ImmersiveApp {
  onAppStart () {
    // Create a new prism that's half a meter cubed.
    this.prism = this.requestNewPrism([1, 1, 1]);

    // Create a nice text label using UIKit.
    this.menuText = UiText.CreateEclipseLabel(
      this.prism,
      'Space\nChanger!',
      EclipseLabelType.kT7
    );
    this.menuText.setAlignment(Alignment.CENTER_CENTER);
    this.menuText.setTextAlignment(HorizontalTextAlignment.kCenter);

    this.addWallButton = makeButton(this.prism, 'Add Wall', this.removeMenuMode);
    this.addWallButton.setLocalPosition([0, -0.2, 0]);

    // Attach the label to the root of the prism's scene graph.
    this.prism.getRootNode().addChild(this.menuText);
    this.prism.getRootNode().addChild(this.addWallButton);
  }
  
  removeMenuMode () {
    this.prism().getRootNode().removeChild(this.menuText);
    this.prism().getRootNode().removeChild(this.addWallButton);
  }

  // Known Issue
  // Web Inspector does not work unless the updateLoop function is present in source.
  // It can be removed for production code.
  updateLoop (delta) {
    return true;
  }

  init () {
    return 0;
  }
}

export { App };
