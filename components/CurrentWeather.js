import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
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
          const weatherData = {
            icon: responseJson.weather[0].icon,
            temp: responseJson.main.temp,
            condition: responseJson.weather[0].main,
            wind: responseJson.wind.speed,
            cloudiness: responseJson.clouds.all,
            pressure: responseJson.main.pressure,
            humidity: responseJson.main.humidity,
            rain: responseJson.rain ? responseJson.rain['1h'] : 0,
            sunrise: responseJson.sys.sunrise,
            sunset: responseJson.sys.sunset,
          };

          this.setState({
            weather: weatherData,
            errMsg: 'Ready',
            isLoading: false,
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            errMsg: 'Error fetching weather data',
            isLoading: false,
          });
        });
    });
  }

  u2date = (unixdate) => {
    var d = new Date(unixdate * 1000);
    return d.getHours() + ':' + d.getMinutes();
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <ImageBackground
          source={require('../assets/weather.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={{
                uri: this.imgurl + this.state.weather.icon + '@2x.png',
              }}
            />
            <Text style={styles.temperature}>{this.state.weather.temp} °C</Text>
            <Text style={styles.condition}>{this.state.weather.condition}</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={styles.label}>Wind Speed:</Text>
                <Text style={styles.value}>{this.state.weather.wind} m/s</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cloudiness:</Text>
                <Text style={styles.value}>
                  {this.state.weather.cloudiness} %
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pressure:</Text>
                <Text style={styles.value}>
                  {this.state.weather.pressure} hPa
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Humidity:</Text>
                <Text style={styles.value}>
                  {this.state.weather.humidity} %
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rain:</Text>
                <Text style={styles.value}>{this.state.weather.rain} mm</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sunrise:</Text>
                <Text style={styles.value}>
                  {this.u2date(this.state.weather.sunrise)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sunset:</Text>
                <Text style={styles.value}>
                  {this.u2date(this.state.weather.sunset)}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'black',
  },
  condition: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'black',
  },
  table: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});

export default CurrentWeather;