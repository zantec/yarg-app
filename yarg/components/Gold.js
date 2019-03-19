import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class Gold extends Component {
  state = {
    amount: 0
  };

  render() {
    return (
      <View>
        <Text>{this.state.amount}</Text>
      </View>
    );
  }
}