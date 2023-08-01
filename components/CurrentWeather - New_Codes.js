import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

class CurrentWeather extends React.Component {
  apiurl = 'https://api.openweathermap.org/data/2.5/weather';
  imgurl = 'http://openweathermap.org/img/wn/';
  state = {
    weather: {
      icon: 0,
      temp: 0,
      condition: 0,
      wind: 0,
      cloudiness: 0,
      pressure: 0,
      humidity: 0,
      rain: 0,
      sunrise: 0,
      sunset: 0,
    },
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
            weather: {
              icon: responseJson.weather[0].icon,
              temp: responseJson.main.temp,
              condition: responseJson.weather[0].main,
              wind: responseJson.wind.speed,
              cloudiness: responseJson.clouds.all,
              pressure: responseJson.main.pressure,
              humidity: responseJson.main.humidity,
              rain: responseJson.rain['1h'],
              sunrise: responseJson.sys.sunrise,
              sunset: responseJson.sys.sunset,
            },
            errMsg: 'Ready',
            isLoading: false,
          });
        });
    });
  }

  //u2date = (unixdate) => {
   // var d = new Date(unixdate * 1000);
    //return d.getHours() + ':' + d.getMinutes();
  //};
  u2date = (unixdate) => {
    var d = new Date(unixdate * 1000)
    return (d.getHours() + ':' + d.getMinutes())
  }


  render() {
    if (!this.state.isLoading) {
      return (
        <View style={s.container}>
          <Image
            style={s.image}
            source={{
              uri: this.imgurl + this.state.weather.icon + '@2x.png',
            }}
          />
          <Text style={s.paragraph}>{this.state.weather.temp} °C</Text>
          <Text style={s.paragraph}>{this.state.weather.condition}</Text>
          <Text style={s.paragraph}>
            Wind Speed: {this.state.weather.wind} m/s
          </Text>
          <Text style={s.paragraph}>
            Cloudiness: {this.state.weather.cloudiness} %
          </Text>
          <Text style={s.paragraph}>
            Preesure: {this.state.weather.pressure} hPa
          </Text>
          <Text style={s.paragraph}>
            Humidity: {this.state.weather.humidity} %
          </Text>
          <Text style={s.paragraph}>Rain: {this.state.weather.rain} mm</Text>
          <Text style={s.paragraph}>
            Sunrise: {this.u2date(this.state.weather.sunrise)}
          </Text>
          <Text style={s.paragraph}>
            Sunset: {this.u2date(this.state.weather.sunset)}
          </Text>
        </View>
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

export default CurrentWeather;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 8,
  },
  image: {
    width: 150,
    height: 150,
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});