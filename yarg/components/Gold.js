import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Constants from 'expo';
import axios from 'axios';

export default class Gold extends Component {
  state = {
    amount: 0
  };

  componentDidMount() {
    //         `${Expo.Constants.manifest.extra.SERVER_API}/user`
    //placeholder url so things don't break. need to replace w ^
    axios.get('https://reqres.in/api/users?page=2', {
      params: {
        username: 'acreed1998'
      }
    })
    .then(res => console.log(JSON.stringify(res)))
    .catch(err => console.error(err))
  }

  render() {
    return (
      <View>
        <Text>{this.state.amount}</Text>
      </View>
    );
  }
}