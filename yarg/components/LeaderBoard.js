import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { Constants, Font } from 'expo';
import axios from 'axios';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { Button, Overlay } from 'react-native-elements';

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
      sortParams: {
        gold: 'gold',
        'Treasures Placed': 'treasures_placed'
      },
      exclude: ['avatar', 'username', 'id'],
      tableHead: ['Rank', 'User', 'Gold', 'Treasures Claimed'],
      tableData: [
      ],
      rankIndex: [],
      rankAvatarAndUsername: [],
      rankGold: [],
      rankTreasuresPlaced: [],
      modalVisible: false,
      viewedUser: {},
      viewedUserIndex: 0,
      fontLoaded: false,
    }
    this.resort = this.resort.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  resort(value) {
    const scope = this;
    axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/leaderboard/${value}`).then(rankData => {
      let rankIndex, rankAvatarAndUsername, rankGold, rankTreasuresPlaced;
      rankIndex = _.map(rankData.data, (user, index) => index + 1);
      rankGold = _.map(rankData.data, (user, index) => user.gold);
      rankAvatarAndUsername = _.map(rankData.data, (user, index) => <View><Image style={{ height: 25, width: 25 }} source={{ uri: 'https://imgur.com/KfhK2Br.png' }}></Image><Text>{user.username}</Text></View>);
      rankTreasuresPlaced = _.map(rankData.data, (user, index) => user.treasures_placed);
      scope.setState({
        tableData: rankData.data,
      });
    }).catch(err => console.log(err));
  }

  componentDidMount() {
    const scope = this;
    console.log(this);
    axios.get('http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/leaderboard/gold').then((rankData) => {
      scope.setState({
        tableData: rankData.data,
      })
    }).catch((err) => {
      console.log(err);
    });
    Font.loadAsync({
      'treamd': require('../assets/fonts/Treamd.ttf'),
    }).then(res => {
      this.setState({ fontLoaded: true });
    });
  }

  onOpen() {
    this.setState({ modalVisible: true });
  }

  onClose() {
    this.setState({ modalVisible: false });
  }

  render() {
    console.log(this.state);
    return (
      <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
        <ScrollView style={style.holder} overScrollMode='always'>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {_.map(this.state.tableHead, item => {
              return (
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: '10%' }}><Text onPress={() => { this.resort(_.replace(item.toLowerCase(), ' ', '_')) }}>{item}</Text></View>
              )
            })}
          </View>
          {_.map(this.state.tableData, (user, index) => {
            return (
              <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
                <View style={{ flex: 0, alignSelf: 'stretch', flexDirection: 'row', paddingLeft: 5, paddingRight: 5, height: 33, width: 50 }}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', height: 33, width: 50 }}>
                  <View style={{ flexWrap: 'wrap' }}><Text onPress={() => {
                    this.setState({ viewedUser: user, viewedUserIndex: index + 1 });
                    this.onOpen();
                  }}>{user.username}</Text></View>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'row', height: 33, width: 50 }}>
                  <Text>{user.gold}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'row', height: 33, width: 50 }}>
                  <Text>{user.treasures_claimed}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
        <View
          style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top: '90%', //for center align
            left: '53%',
            alignSelf: 'flex-end' //for align to right
          }}
        >
          <Overlay isVisible={this.state.modalVisible} closeOnTouchOutside onBackdropPress={this.onClose} overlayBackgroundColor={'rgba(52, 52, 52, 0.0)'}>
            <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)', alignContent: 'center' }}>
              <ImageBackground style={style.otherBackground} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
                <ScrollView contentContainertyle={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={style.biggerPirateText}>WANTED</Text>
                    <Image style={{ width: 250, height: 150 }} source={{ uri: 'https://imgur.com/KfhK2Br.png' }} />
                  </View>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={style.pirateText}>{`${this.state.viewedUser.username}`}</Text>
                    <Text style={style.pirateText}>{`BOUNTY: ${Math.floor(4 * .25 / this.state.viewedUserIndex * 1000000)}`}</Text>
                    {_.map(this.state.viewedUser, (value, key) => {
                      if (!_.includes(this.state.exclude, key)) {
                        return (
                          <Text style={style.pirateText}>{`${_.startCase(_.replace(key, '_', ' '))}: ${value}`}</Text>
                        );
                      }
                    })}
                  </View>
                </ScrollView>
              </ImageBackground>
            </View>
          </Overlay>
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  holder: {
    height: '100%',
    alignContent: 'center',
    flex: 1,
  },
  // title: { flex: 1, backgroundColor: '#ffffff' },
  // wrapper: { flexDirection: 'row' },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  otherBackground: {
    flex: 2
  },
  pirateText: {
    fontSize: 26,
    fontFamily: 'treamd',
  },
  biggerPirateText: {
    fontSize: 50,
    fontFamily: 'treamd',
  }
});
