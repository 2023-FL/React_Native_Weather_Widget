import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

class MyPosition extends React.Component {
  state = {
    location: null,
    errMsg: null
  }

  findCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status!=='granted') {
      this.setState({
        errMsg: 'Permission to access location was denied'
      })
    } else {
      this.setState({errMsg: 'Ready to locate...'})
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    });
    const { latitude, longitude } = location.coords;
    let text = JSON.stringify({ latitude, longitude});
    this.setState({location: text});
  }

  render() {
    return(
      <View>
        <TouchableOpacity onPress = {this.findCoordinates}>
          <Text style={s.welcome}>My Location</Text>
          <Text> Location: {this.state.location} </Text>
          <Text>{this.state.errMsg}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyPosition;

const s = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
})