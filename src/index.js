import { View, Text, Alert, SafeAreaView, ActivityIndicator, ScrollView, RefreshControl, StyleSheet, Image, Dimensions, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'

const openWeatherKey ='b4fa7f72de09703f295509b59cf22d35'
let url = `http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`

const Weather = () => {
    const [forecast, setForecast] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing(true)

        const {status} = await Location.requestForegroundPermissionsAsync()

        //ask for permission to access location
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
        }

        //get the current location
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true})

        //fetches the weather data from the openweathermap api
        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
        const data = await response.json()

        if(!response.ok){
            Alert.alert('Error','Something went wrong')
        } else {
            setForecast(data)
        }
        setRefreshing(false)
    }

    useEffect(() => {
      loadForecast()
    }, [])

    if(!forecast){
        return(
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        )
    }

    const current = forecast.current.weather[0]
    
    return (
       <SafeAreaView style={styles.container}>
            <ScrollView
            refreshControl={
                <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => loadForecast()} />
            }
            style={{marginTop:50}}
            >
                <Text style={styles.title}>
                    Current Weather
                </Text>
                <Text style={{alignItems:'center', textAlign:'center'}}>
                    Your Location : {forecast.timezone}
                </Text>
                <View style={styles.current}>
                    <Image 
                    style = {styles.largeIcon}
                    source = {{
                        uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`
                    }}
                    />
                    <Text style={styles.currentTemp}>
                        {Math.round(forecast.current.temp)}°C
                    </Text>
                </View>

                <Text style={styles.currentDescription}>
                    {current.description}
                </Text>

                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                         <Image 
                            source={require('../assets/temp.png')}
                            style={{width:40, height:40, borderRadius:40/2, marginLeft:50 }}
                        />
                        <Text style={styles.text}>
                            {forecast.current.feels_like}°C
                        </Text>
                        <Text style={styles.text}>
                            Feels Like
                        </Text>
                    </View>
                    <View style={styles.info}>
                         <Image 
                            source={require('../assets/humidity.png')}
                            style={{width:40, height:40, borderRadius:40/2, marginLeft:50 }}
                        />
                        <Text style={styles.text}>
                            {forecast.current.humidity}%
                        </Text>
                        <Text style={styles.text}>
                            Humidity
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.subtitle}>Hourly Forecast</Text>
                </View>

                <FlatList 
                    horizontal
                    data={forecast.hourly.slice(0,24)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem ={(hour)=>{
                        const weather = hour.item.weather[0]
                        var dt = new Date(hour.item.dt*1000)
                        return (
                            <View style={styles.hour}>
                                <Text style={{fontWeight:'bold', color:'#346751'}}>
                                    {dt.toLocaleTimeString().replace(/:\d+/,' ')}
                                </Text>
                                <Text style={{fontWeight:'bold', color:'#346751'}}>
                                    {Math.round(forecast.current.temp)}°C
                                </Text>
                                <Image
                                    style={styles.smallIcon}
                                    source={{
                                        uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`
                                    }}
                                />
                                <Text style={{fontWeight:'bold', color: '#346751'}}>
                                    {weather.description}
                                </Text>
                            </View>
                        )
                    }}
                />
            </ScrollView>
       </SafeAreaView>
    )
}

export default Weather

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ECDBBA'
    },
    title: {
        textAlign:'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#C84B31'
    },
    current: {
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center'
    },
    largeIcon: {
        width:250,
        height:200
    },
    currentTemp: {
        fontSize:32,
        fontWeight:'bold',
        textAlign:'center'

    },
    currentDescription:{
        width:'100%',
        textAlign:'center',
        fontWeight:'200',
        fontSize:24,
        marginBottom:5
    },
    info: {
        width: Dimensions.get('screen').width/2.5,
        backgroundColor:'rgba(0,0,0,0.5)',
        padding:10,
        borderRadius:15,
        justifyContent:'center'
    },
    extraInfo: {
        flexDirection:'row',
        marginTop:20,
        justifyContent:'space-between',
        padding:10
    },
    text: {
        fontSize:20,
        color:'#fff',
        textAlign:'center'
    },
    subtitle: {
        fontSize:24,
        marginVertical:12,
        marginLeft:7,
        color: '#C84B31',
        fontWeight:'bold'
    },
    hour: {
        padding:6,
        alignItems:'center'
    },
    smallIcon: {
        width:100,
        height:100
    }
})