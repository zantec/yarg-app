import React from 'react';
import axios from 'axios';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, Location, Permissions } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import _ from 'lodash';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoadingComplete: false,
      treasures: [],
      riddles: [],
      id_user: 0,
      username: 'ryan',
      avatar: '',
      goldAmount: 0,
      userTrasures: [],
      userRiddles: [],
      userLocation: null,
      reverseLocated: null,
      user: {},
    };
    this.locate = this.locate.bind(this);
    this._getLocationAsync = this._getLocationAsync.bind(this);
  }
  

  componentDidMount() {
    this._getLocationAsync()
      .then(() => this.locate(this.state.reverseLocated))
      .catch((err) => console.error(err))
  };

  appLogin(userObject) {
    this.setState({
      id_user: 0,
      username: userObject.username,
      avatar: userObject.avatar,
      goldAmount: userObject.gold,
      userTrasures: userObject.treasures,
      userRiddles: userObject.riddles,
      user: userObject,
    });
  };

  updateUser() {
    axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user?username=${this.state.user.username}`).then(res => {
    this.setState({user : res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator 
          screenProps={{
            getGold: this.getGold.bind(this),
            goldAmount: this.state.goldAmount,
            appLogin: this.appLogin.bind(this),
            locate: this.locate.bind(this),
            treasures: this.state.treasures,
            riddles: this.state.riddles,
            getLocation: this._getLocationAsync.bind(this),
            userLocation: this.state.userLocation,
            treasureCoords: this.state.treasureCoords,
            username: this.state.username,
            user: this.state.user,
            updateUser: this.updateUser.bind(this),
          }}
          />
        </View>
      );
    }
  }

  getGold = () => {
    axios.get(`http://${process.env.SERVER_API}/user`, {
      params: {
        username: this.state.username
      }
    })
      .then((res) => {
        const gold = res.data.gold;
        this.setState({
          goldAmount: gold
        });
      })
      .catch(err => console.error(err))
  }

  locate(locationInfo) {
      const zipcode = locationInfo[0].postalCode;
      axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/treasures/zipcode?username=${this.state.username}&zipcode=${zipcode}`).then((treasuresResult) => {
        axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/riddles/zipcode?username=${this.state.username}&zipcode=${zipcode}`).then((riddlesResult) => {
        this.setState({
            treasures: treasuresResult.data,
            riddles: riddlesResult.data,
          });
        }).catch((err) => {
          console.log(err)
        });
      }).catch((err) => {
        console.log(err)
      });
    setTimeout(this.locate, 18000000);
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseLocated = await Location.reverseGeocodeAsync(location.coords);
    this.setState({ userLocation: location, reverseLocated: reverseLocated });
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
