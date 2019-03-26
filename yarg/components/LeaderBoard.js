import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
      sortParams: {
        gold: 'gold',
      },
      tableHead: ['Rank', 'User', 'Gold', 'Treasures Placed'],
      tableData: [
      ],
      rankIndex: [],
      rankAvatarAndUsername: [],
      rankGold: [],
      rankTreasuresPlaced: [9, 8, 77, 6, 5, 4, 3, 2, 1, 5],
    }
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
  }

  render() {
    console.log(this.state);
    // return (
    //   <ImageBackground style={style.backgroundImage} source={{uri: 'https://imgur.com/O15IDs5.jpg'}}>
    //     <ScrollView style={style.holder} overScrollMode='always'>
    //       <Text>
    //         Rankings:
    //       </Text>
    //       {_.map(this.state.rankings, (rank, index) => {
    //         return (
    //           <View>
    //             <Text>
    //               {index + 1}
    //             </Text>
    //             <Image>
    //             </Image>
    //             <View>
    //               <Text>
    //                 {rank.username}
    //               </Text>
    //             </View>
    //           </View>
    //         );
    //       })}
    //     </ScrollView>
    //   </ImageBackground>
    // );
    return (
      <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
        <ScrollView style={style.holder} overScrollMode='always'>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {_.map(this.state.tableHead, item => {
              return (
                <View style={{ paddingLeft: '8%' }}><Text>{item}</Text></View>
              )
            })}
          </View>
          {_.map(this.state.tableData, (user, index) => {
            return (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View>
                  <Text>{index + 1}</Text>
                </View>
                <View style={{ paddingLeft: '8%', flexDirection: 'row' }}>
                  <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://imgur.com/KfhK2Br.png' }} />
                  <Text>{user.username}</Text>
                </View>
                <View style={{ paddingLeft: '8%' }}>
                  <Text>{user.gold}</Text>
                </View>
                <View style={{ paddingLeft: '8%' }}>
                  <Text>{this.state.rankTreasuresPlaced[index]}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  holder: {
    height: '100%',
    flex: 1,
  },
  // title: { flex: 1, backgroundColor: '#ffffff' },
  // wrapper: { flexDirection: 'row' },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  }
});
