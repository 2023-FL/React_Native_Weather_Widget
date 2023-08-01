import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as Location from 'expo-location';

const ForecastWeather = () => {
  const apiurl = 'https://api.openweathermap.org/data/2.5/forecast';
  const imgurl = 'http://openweathermap.org/img/wn/';
  const [forecast, setForecast] = useState([]);
  const [errMsg, setErrMsg] = useState('...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrMsg('Permission to access location was denied');
        } else {
          setErrMsg('Ready to locate...');
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `${apiurl}?lat=${latitude}&lon=${longitude}&appid=14986c24d97b00cb6f239a24f4f42044&units=metric`
        );

        if (!response.ok) {
          setErrMsg('Failed to fetch weather data');
          return;
        }

        const responseJson = await response.json();
        setForecast(responseJson.list);
        setErrMsg('Ready');
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setErrMsg('An error occurred while fetching data');
        setIsLoading(false);
      }
    };

    fetchWeatherForecast();
  }, []);

  const u2date = (unixdate) => {
    const d = new Date(unixdate * 1000);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}hr`;
  };

  const renderWeatherItem = ({ item }) => (
    <View style={s.tableRow}>
      <Text style={s.tableCell}>{u2date(item.dt)}</Text>
      <View style={s.tableCell}>
        <Image style={s.weatherIcon} source={{ uri: `${imgurl}${item.weather[0].icon}@2x.png` }} />
        <Text>{item.weather[0].main}</Text>
      </View>
      <Text style={s.tableCell}>{item.main.temp} °C</Text>
    </View>
  );

  if (!isLoading) {
    return (
      <>
        <View style={s.tableHeader}>
          <Text style={s.tableHeaderText}>Date</Text>
          <Text style={s.tableHeaderText}>Weather</Text>
          <Text style={s.tableHeaderText}>Temperature</Text>
        </View>
        <FlatList
          data={forecast}
          keyExtractor={(item) => item.dt.toString()}
          renderItem={renderWeatherItem}
        />
        <Text>{errMsg}</Text>
      </>
    );
  } else {
    return (
      <View style={s.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
};

export default ForecastWeather;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e5e5e5',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});