import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import SketchFlag from '../SketchFlag'

export default class Inventory extends Component {
  // Need to replace the props with something
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <SketchFlag/>
      // <View>
      //   {this.props.screenProps.inventory.items.length > 0 ?
      //     <View>
      //       <Text>
      //         Items:
      //     </Text>
      //       {_.map(this.props.screenProps.inventory.items, item => {
      //         return (
      //           <View>
      //             <Text>
      //               {item.name}:
      //           </Text>
      //             <Text>
      //               {item.description}
      //             </Text>
      //           </View>
      //         )
      //       })}
      //     </View>
      //     :
      //     console.log(false)
      //   }
      //   {this.props.screenProps.inventory.riddles.length > 0 ?
      //     <View>
      //       <Text>
      //         Riddles:
      //     </Text>
      //       {_.map(this.props.screenProps.inventory.riddles, riddle => {
      //         return (
      //           <View>
      //             <Text>
      //               Riddle Id: {riddle.id}
      //             </Text>
      //             <Text>
      //               {`Riidle Text:\n${riddle.riddle}`}
      //             </Text>
      //           </View>
      //         );
      //       })}
      //     </View>
      //     :
      //     console.log(false)
      //   }
      // </View>
    );
  }
}
