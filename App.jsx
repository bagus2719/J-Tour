import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/navigation/Router';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();

  console.log('FCM token', token);
}

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
registerAppWithFCM();

export default function App() {
  return (
    <NavigationContainer>
     <Router/>
    </NavigationContainer>
  );
}
