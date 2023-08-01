import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as Location from 'expo-location';


class ForecastWeather extends React.Component {
  apiurl = 'https://api.openweathermap.org/data/2.5/forecast';
  imgurl = 'http://openweathermap.org/img/wn/';
  state = {
    forecast: [],
    errMsg: '...',
    isLoading: true,
  };

  findCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        errMsg: 'Permission to access location was denied',
      });
    } else {
      this.setState({ errMsg: 'Ready to locate...' });
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
    // let text = JSON.stringify({ latitude, longitude});
    // this.setState({location: text});
  };

  u2date = (unixdate) => {
    var d = new Date(unixdate * 1000)
    return (d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate() + ' ' + d.getHours() + 'hr (' + this.week)
  }

  componentDidMount() {
    // Get Location then update Weather
    this.findCoordinates().then((location) => {
      fetch(
        this.apiurl +
          '?lat=' +
          location.latitude +
          '&lon=' +
          location.longitude +
          '&appid=14986c24d97b00cb6f239a24f4f42044&units=metric'
      )
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((responseJson) => {
          this.setState({
            forecast: responseJson.list,
            errMsg: 'Ready',
            isLoading: false,
          });
        })
        {/*//.catch((err) => {

       // }*/}
    });
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <>
          <FlatList data={this.state.forecast} renderItem = {({item})=>
          <View style={s.container}>
            <View style={s.box}>
              <Text style={s.paragraph}>{this.u2date(item.dt)}</Text>
              <Image style={s.image} source={{
                uri: this.imgurl + item.weather[0].icon + '@2x.png', 
              }} />
              <Text style={s.paragraph}>{item.weather[0].main}</Text>
            </View>
            <View>
              <Text>{item.main.temp} °C</Text>
            </View>
          </View>
          } />
          <Text>{this.state.errMsg}</Text>
        </>
      );
    } else {
      return (
        <View style={s.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
  }
}

export default ForecastWeather;

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 8,
  },
  box: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
