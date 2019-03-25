import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import ARView from '../components/ARView.js'
import Gold from '../components/Gold.js'

export default class ARScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCoords: null,
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationEvents
          onWillFocus={() => {
            this._interval = setInterval(this.props.screenProps.getLocation, 5000);
          }}
          onWillBlur={() => {
            clearInterval(this._interval);
          }}
        />
        <ARView 
        getGold={this.props.screenProps.getGold}
        treasures={this.props.screenProps.treasures}
        riddles={this.props.screenProps.riddles}
        getLocation={this.props.screenProps.getLocation}
          userCoords={[
              parseFloat(this.props.screenProps.userLocation.coords.longitude.toFixed(4)),
              parseFloat(this.props.screenProps.userLocation.coords.latitude.toFixed(4))
            ]
          }
        />
        <Gold goldAmount={this.props.screenProps.goldAmount} />
      </View>
    );
  }
}