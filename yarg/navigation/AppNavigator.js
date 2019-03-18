import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default createAppContainer(createSwitchNavigator(
  {
  Auth: AuthLoadingScreen,
  Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Auth'
  }
));