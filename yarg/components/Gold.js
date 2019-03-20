import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Constants from 'expo';
import axios from 'axios';

export default class Gold extends Component {
  state = {
    amount: 0
  };

  componentDidMount() {
    // ``${Expo.Constants.manifest.extra.SERVER_API}/user`
    // process.env.SERVER_API
    //'https://reqres.in/api/users?page=2'
    //placeholder url so things don't break. need to replace w ^
    axios.get(`http://${process.env.SERVER_API}/user`, {
      params: {
        username: 'acreed1998'
      }
    })
    .then((res) => {
      const gold = res.data.gold;
      this.setState({
        amount: gold
      });
    })
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