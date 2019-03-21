import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import NavigationEvents from 'react-navigation';

import ARView from '../components/ARView.js'
import Gold from '../components/Gold.js'

export default class ARScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <ARView 
        getGold={this.props.screenProps.getGold}
        treasures={this.props.screenProps.treasures}
        riddles={this.props.screenProps.riddles}
        getLocation={this.props.screenProps.getLocation}
        userLocation={this.props.screenProps.userLocation}
        />
        <Gold goldAmount={this.props.screenProps.goldAmount} />
        <Text>{this.props.screenProps.userLocation}</Text>
      </View>
    );
  }
}