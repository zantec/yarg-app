import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from lodash;

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
    }
  }

  componentDidMount() {
    const scope = this;
    axios.get('http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/leaderboard/gold').then((rankData) => {
      scope.setState({
        rankings: rankData.data,
      });
    }).catch((err) => {
      console.log(err);
    });
  }
  
  render() {
    return (
      <View>
        <Text>
          Rankings:
      </Text>
        {_.map(this.state.rankings, (rank, index) => {
          return (
            <View>
              <Text>
                {index + 1}
              </Text>
              <Image>
              </Image>
              <View>
                <Text>
                  {rank.username}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
