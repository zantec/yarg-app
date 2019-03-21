import React from 'react';
import { MapView } from 'expo';
import { Marker } from 'react-native-maps';
import Axios from 'axios';
import _ from 'lodash';

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
      riddles: [],
    }
    this.onRegionChange = this.onRegionChange.bind(this);
    this.getTreasuresAndRiddles = this.getTreasuresAndRiddles.bind(this);
    this.locate = this.locate.bind(this);
  }

  locate() {
    const scope = this;
    navigator.geolocation.getCurrentPosition(position => {
      Axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=fff0c9fd594a41aa9abeb0a5233ceba9`).then(result => {
        const zipcode = _.slice(result.data.results[0].components.postcode.split(''), 0, 5).join('');
        Axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/treasures/zipcode?zipcode=${zipcode}`).then((treasuresResult) => {
          Axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/riddles/zipcode?zipcode=${zipcode}`).then((riddlesResult) => {
            scope.setState({
              treasures: treasuresResult.data,
              riddles: riddlesResult.data
            });
          }).catch((err) => {
            console.log(err)
          });
        }).catch((err) => {
          console.log(err)
        });
      });
    }, (err) => {
      console.log(err);
    }, { enableHighAccuracy: true, timeout: 20000, });
    setTimeout(this.locate, 30000);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        showsCompass={true}
        initialRegion={this.state.region}
        onRegionChange={this.onRegionChange}
        onMapReady={this.locate}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(some) => { this.getTreasuresAndRiddles(some) }}
      >
        <Marker coordinate={this.state.region} />
      </MapView>
    );
  }
}
