import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Constants from 'expo';
import axios from 'axios';

export default class Gold extends Component {

  render() {
    return (
      <View>
        <Text>{this.props.goldAmount}</Text>
      </View>
    );
  }
}