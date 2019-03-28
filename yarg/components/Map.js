import React, { Component } from 'react';
import { MapView, AppLoading, Asset, Font, Icon, Location, Permissions } from 'expo';
import { StyleSheet, View, Text, Picker, TextInput, Switch } from "react-native";
import { Marker } from 'react-native-maps';
import { Button } from 'react-native-elements';
import Axios from 'axios';
import _ from 'lodash';
import Overlay from 'react-native-modal-overlay';
import Slider from "react-native-slider";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 29.9774654,
        longitude: -90.0758853,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      boardLocation: {
        latitude: 0,
        longitude: 0,
        address: null,
        city: null,
        state: null,
        zipcode: 0,
      },
      treasures: [],
      modalVisible: false,
      value: 500,
      toggle: 'Treasure',
      text: 'ENTER RIDDLE HERE',
      riddleTitle: 'A Title',
      userLocation: '',
      userTreasure: 0,
      switchValue: false,
    }
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.store = this.store.bind(this);
    this._getLocationAsync = this._getLocationAsync.bind(this);
  }

  onOpen() {
    this.setState({ modalVisible: true });
  }

  onClose() {
    this.setState({ modalVisible: false });
  }

  store = () => {
    const scope = this.state;
    this._getLocationAsync().then((coords) => {
      if (scope.toggle === 'Treasure') {
        Axios({
          method: 'get',
          url: `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${coords.latitude},${coords.longitude},1000&mode=retrieveAddresses&maxresults=1&&app_id=toBDeKPAwo1W6Ckdz4Ek&app_code=7X8XAzjC6dMafzV_dW_TLA`,
        }).then(locationData => {
          const address = locationData.data.Response.View[0].Result[0].Location.Address
          console.log(address);
          Axios({
            method: 'post',
            url: 'http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/treasures',
            data: {
              gold_value: scope.value,
              longitude: coords.longitude,
              latitude: coords.latitude,
              address: `${address.HouseNumber} ${address.Street}`,
              city: address.City,
              state: address.State,
              zipcode: address.PostalCode,
              id_user: '2',
            }
          }).then(result => {
            console.log(result.data);
          }).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      } else if (scope.toggle === 'Riddle' && scope.switchValue === true) {
        Axios({
          method: 'get',
          url: `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${coords.latitude},${coords.longitude},1000&mode=retrieveAddresses&maxresults=1&&app_id=toBDeKPAwo1W6Ckdz4Ek&app_code=7X8XAzjC6dMafzV_dW_TLA`,
        }).then(locationData => {
          const address = locationData.data.Response.View[0].Result[0].Location.Address
          console.log(address);
          Axios({
            method: 'post',
            url: 'http://ec2-18-191-183-109.us-east-2.compute.amazonaws.com/api/user/riddles',
            data: {
              longitude: coords.longitude,
              latitude: coords.latitude,
              address: `${address.HouseNumber} ${address.Street}`,
              city: address.City,
              state: address.State,
              zipcode: address.PostalCode,
              id_user: '2',
              riddle: scope.text,
              title: scope.riddleTitle,
              id_treasure: scope.userTreasure,
            }
          }).then(result => {
            console.log(result.data);
          }).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      } else if (scope.toggle === 'Riddle') {
        Axios({
          method: 'get',
          url: `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${coords.latitude},${coords.longitude},1000&mode=retrieveAddresses&maxresults=1&&app_id=toBDeKPAwo1W6Ckdz4Ek&app_code=7X8XAzjC6dMafzV_dW_TLA`,
        }).then(locationData => {
          const address = locationData.data.Response.View[0].Result[0].Location.Address
          console.log(address);
          Axios({
            method: 'post',
            url: 'http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/riddles',
            data: {
              longitude: coords.longitude,
              latitude: coords.latitude,
              address: `${address.HouseNumber} ${address.Street}`,
              city: address.City,
              state: address.State,
              zipcode: address.PostalCode,
              id_user: '2',
              riddle: scope.text,
              title: scope.riddleTitle,
              id_treasure: scope.userTreasure,
            }
          }).then(result => {
            console.log(result.data);
          }).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          showsCompass={true}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{ flex: 1 }}
        />
        <View
          style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top: '90%', //for center align
            left: '53%',
            alignSelf: 'flex-end' //for align to right
          }}
        >
          <Button
            title={'Add Treasure/Riddle'}
            onPress={() => { this.onOpen() }}
          >
          </Button>
          <Overlay visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>
            <View style={styles.container}>
              {this.state.toggle === 'Riddle' ?
                <View>
                  <Text>
                    Choose Treasure Id:
                </Text>
                  <Picker
                    selectedValue={this.state.userTreasure}
                    mode={'dropdown'}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ userTreasure: itemValue })
                    }>
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                  </Picker>
                  <View>
                    <Text>
                      Procedural Generate:
                  </Text>
                    <Switch
                      onValueChange={() => { this.setState({ switchValue: !this.state.switchValue }) }}
                      value={this.state.switchValue} />
                  </View>
                </View>
                : <Text />}
              <Text>
                Add {this.state.toggle}:
              </Text>
              {this.state.toggle === 'Treasure' ?
                <View>
                  <Slider
                    minimumValue={500}
                    maximumValue={5000}
                    value={this.state.value}
                    onValueChange={value => this.setState({ value })}
                  />
                  <Text>
                    Value: {Math.floor(this.state.value)}
                  </Text>
                </View>
                :
                <TextInput
                  editable={true}
                  maxLength={1000}
                  value={this.state.text}
                  onFocus={() => {
                    if (this.state.text === 'ENTER RIDDLE HERE') {
                      this.setState({ text: '' });
                    }
                  }}
                  onChangeText={(text) => { this.setState({ text }) }}
                />
              }
              <View style={styles.flex}>
                <Button buttonStyle={styles.button} title={`Add ${this.state.toggle}`} onPress={() => { this.store() }} />
                <Button buttonStyle={styles.button} title={`${this.state.toggle === 'Treasure' ? 'Riddle' : 'Treasure'}`} onPress={() => { this.setState({ toggle: this.state.toggle === 'Treasure' ? 'Riddle' : 'Treasure' }) }} />
              </View>
            </View>
          </Overlay>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '50%',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    height: '50%',
    borderTopWidth: 4,
    borderTopColor: '#E44262',
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
    color: 'green',
    width: '40%'
  },
  container: {
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
    alignItems: "stretch",
    justifyContent: "center"
  },
  flex: {
    flexDirection: 'column',
    flex: 0,
    justifyContent: "center"
  },
});
