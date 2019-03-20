import React from 'react'
import axios from 'axios'
import {
  View,
} from 'react-native'
import { NavigationEvents } from 'react-navigation'

import ProfileNavigator from '../navigation/ProfileNavigator'
import Gold from '../components/Gold.js'

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this.props.screenProps.getGold();
          }}
        />
        <Gold goldAmount={this.props.screenProps.goldAmount} />
      </View>
    );
  }
}