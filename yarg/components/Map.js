import React, { Component } from 'react';
import { MapView } from 'expo';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { Button } from 'react-native-elements';
import Axios from 'axios';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import Overlay from 'react-native-modal-overlay';

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
      treasures: [],
      modalVisible: false,
    }
    this.locate = this.locate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    this.setState({ modalVisible: true });
  }

  onClose() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          showsCompass={true}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange}
          onMapReady={this.props.locate}
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
            <Text>Some Modal Content</Text>
          </Overlay>
        </View>
      </View>
    );
  }
  //   return (
  //     <MapView
  //       style={{ flex: 1 }}
  //       showsCompass={true}
  //       initialRegion={this.state.region}
  //       // onRegionChange={this.onRegionChange}
  //       onMapReady={this.props.locate}
  //       showsUserLocation={true}
  //       showsMyLocationButton={true}
  //     >
  //       <Marker coordinate={this.state.region} />
  //     </MapView>
  //   );
  // }
}
