import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import { Ionicons } from '@expo/vector-icons'
import Inventory from "../components/profile/Inventory.js";
import Stats from "../components/profile/Stats.js";
import RiddlesTreasures from "../components/profile/RiddlesTreasures.js";
import Rankings from "../components/LeaderBoard.js";


const StatsStack = createStackNavigator({
  Stats: Stats,
});

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const InventoryStack = createStackNavigator({
  Inventory: Inventory,
});

InventoryStack.navigationOptions = {
  tabBarLabel: 'Inventory',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const RiddlesTreasuresStack = createStackNavigator({
  RiddlesTreasures: RiddlesTreasures,
});

RiddlesTreasuresStack.navigationOptions = {
  tabBarLabel: 'Riddles/Treasures',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const RankingStack = createStackNavigator({
  Rankings: Rankings,
});

RankingStack.navigationOptions = {
  tabBarLabel: 'Rankings',
  tabBarIcon: ({ focused }) => (
    <Ionicons name="md-trophy" size={32} color="green" />
  ),
};

export default createMaterialTopTabNavigator(
  {
    RiddlesTreasuresStack,
    StatsStack,
    InventoryStack,
    RankingStack,
  },
  {
    initialRouteName: 'StatsStack',
    tabBarOptions: {
      showIcon: true,
    }
  }
);