import '../node_modules/magic-script-polyfills/src/polyfills.js';
import './global-scope.js';
import React from '../node_modules/react/index.js';
import mxs from '../node_modules/magic-script-components-lumin/index.js';
import App from '../../src/app.js';

// Add support for things like setTimeout, setInterval and fetch.
mxs.bootstrap(React.createElement(App, {
  type: "landscape",
  volumeSize: [10, 10, 10]
}));
