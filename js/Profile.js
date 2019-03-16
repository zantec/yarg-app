'use strict';

import React, { Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';

export default class Profile extends Component {

  constructor() {
    super();
    this.state = {
      text: "A profile will go here."
    };
  }

  render() {
    return (
      <View>
        <Text style={styles.mapTextStyle}>{this.state.text}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  mapTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

module.exports = Profile;