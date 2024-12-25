import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('LoginScreen');
        }, 3000);
    }, [navigation]);

    return (
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:"white"}} >
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="blue" />
            <Image source={require('../../assets/parking.png')} style={{width:100,height:100}}  />  
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({})