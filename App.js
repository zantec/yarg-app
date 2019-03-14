/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  Switch
} from 'react-native';

import {
  ViroARSceneNavigator
} from 'react-viro';

var sharedProps = {
  apiKey: "49B2B4B9-11BF-443C-9B41-5322FBEC2C83",
}

// Sets the default scene you want for AR
var InitialARScene = require('./js/yargARScene');

export default class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      sharedProps : sharedProps,
      viewAR : false,
    }
    this._getARNavigator = this._getARNavigator.bind(this);
    this._toggleARView = this._toggleARView.bind(this);
  }

  // Currently, returns a blank screen with a Switch component that toggles
  // the AR view on and off
  render() {
    return (
      <View style={localStyles.outer}>
        <View>
          <Switch
            onValueChange={this._toggleARView()}
            value={this.state.viewAR} />
        </View>
        {this.state.viewAR ? this._getARNavigator() : <Text>WALUIGI</Text>}
      </View>
    )
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    return (
      <View style={localStyles.viroContainer}>
        <ViroARSceneNavigator {...this.state.sharedProps}
          initialScene={{scene: InitialARScene}}/>
      </View>
    );
  }

  // Toggles the boolean value for viewAR property on state
  _toggleARView() {
    return () => {
      this.setState({
        viewAR : !this.state.viewAR
      })
    }
  }

}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

module.exports = ViroSample
