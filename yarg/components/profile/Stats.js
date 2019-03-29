import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exclude: ['avatar', 'username', 'password', 'salt', 'treasures', 'inventory', 'riddles', 'id']
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <ImageBackground source={{ uri: 'https://imgur.com/O15IDs5.jpg' }} style={style.backgroundImage}>
        <View style={style.holder}>
          <Text>{this.props.screenProps.username}'s Stats:</Text>
          <View>
            <Image source={{ uri: 'https://imgur.com/KfhK2Br.png' }}
              style={{ width: 100, height: 50 }} />
            <Text>
              Username: {this.props.screenProps.username}
            </Text>
          </View>
          {_.map(this.props.screenProps.user, (value, key) => {
            if (!_.includes(this.state.exclude, key)) {
              return (
                <Text>{`${_.startCase(_.replace(key, '_', ' '))}: ${value}`}</Text>
              );
            }
          })}
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  holder: {
    height: '100%',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  }
});
