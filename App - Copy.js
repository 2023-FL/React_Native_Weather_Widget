import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
//import MyPosition from './components/MyPosition';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';


const Theme = {
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'white',
    text: 'rgb(28, 28, 30)',
    border: 'rbg(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  }
}

export default function App() {
  return (
    <>
      <NavigationContainer theme={Theme}>
        <Tab.Navigator>
          <Tab.Screen name='Today' component={CurrentWeather} 
            options={{tabBarIcon: ()=>(<MaterialIcons name='location-pin'/>)}}
          />
          <Tab.Screen name='Forecast' component={ForecastWeather} 
            options={{tabBarIcon: ()=>(<MaterialCommunityIcons name='cloud-question'/>)}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
