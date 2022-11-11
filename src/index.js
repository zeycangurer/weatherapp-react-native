import { View, Text, Alert, SafeAreaView, ActivityIndicator, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'

const openWeatherKey = process.env.WEATHER_KEY
let url = `http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`

const Weather = () => {
    const [forecast, setForecast] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing(true)

        const {status} = await Location.requestForegroundPermissionAsync()

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
                    Your Location
                </Text>
                <View>

                </View>
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
    }
})