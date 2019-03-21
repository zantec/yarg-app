import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthScreen from '../screens/AuthScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ProfileNavigator from './ProfileNavigator'

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    Auth: AuthScreen,
    Profile: ProfileNavigator
  },
  {
    initialRouteName: 'AuthLoading'
  }
));