/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import {ARKit} from 'react-native-arkit';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />
      <ARKit
        style={{flex: 1}}
        debug
        planeDetection={ARKit.ARPlaneDetection.Horizontal}
        lightEstimationEnabled
        detectionImages={[{resourceGroupName: 'DetectionImages'}]}
        onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
      />
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
