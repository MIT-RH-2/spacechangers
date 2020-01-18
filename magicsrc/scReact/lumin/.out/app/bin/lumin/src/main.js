import '../node_modules/magic-script-polyfills/src/polyfills.js';
import './global-scope.js';
import React from '../node_modules/react/index.js';
import mxs from '../node_modules/magic-script-components-lumin/index.js';
import MyApp from '../../src/app.js';

// Add support for things like setTimeout, setInterval and fetch.
mxs.bootstrap(React.createElement(MyApp, {
  type: "landscape",
  volumeSize: [1, 1, 1]
}));
