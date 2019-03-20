import React from 'react';
import { MapView } from 'expo';
import { Marker } from 'react-native-maps';


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
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker coordinate={this.state.region}/>
        </MapView>
    );
  }
}