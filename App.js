import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native';
import React, { useState, useEffect }  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './src/login/Splash';
import Onboarding from './src/login/Onboarding';
import LoginScreen from './src/login/LoginScreen';
import ListCar from './src/screen/ListCar';
import AddNew from './src/screen/AddNew';
import TabScreen from './src/screen/TabScreen';
import TabBottom from './src/screen/TabBottom';
import ShowAllImages from './src/screen/ShowAllImages';
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
console.disableYellowBox = true;
export default function App() {
    const StackHome = createStackNavigator();
    return (
      <NavigationContainer>
        <StackHome.Navigator initialRouteName="Splash" 
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FFFFFF",
            
          },
          headerTintColor: "#FFF",
        }}>
            <StackHome.Screen name="Splash" component={Splash} options={{headerShown: false}}/>
            <StackHome.Screen name="Onboarding" component={Onboarding} options={{headerShown: false}}/> 
            <StackHome.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/> 
            
            <StackHome.Screen name="TabBottom" component={TabBottom} 
              options={({ navigation }) => ({
                    title: 'Car',
                    // , headerTitleStyle: { fontWeight: 'bold', fontSize: 16, }
                    // , headerTitleAlign: 'center',
                    headerShown:false,
                    // headerTitle: () => (
                    //   <Image style={{ width: 50, height: 56,margin: 10 }} source={require("./assets/parking.png")} />
                    // ),
                    // headerLeft: () => (
                    //   <TouchableOpacity onPress={() => navigation.goBack()}>
                    //     <Image
                    //       style={{ width: 30, height: 30, margin: 10 }}
                    //       source={require("./assets/back-arrow.png")}
                    //     />
                    //   </TouchableOpacity>
                    // )
                  })}/> 
            <StackHome.Screen name="AddNew" component={AddNew} options={{headerShown: false}}/>
            <StackHome.Screen name="ListCar" component={ListCar} options={{headerShown: false}}/>
            <StackHome.Screen name="ShowAllImages" component={ShowAllImages}
              options={({ navigation }) => ({
                title: 'Car'
                , headerTitleStyle: { fontWeight: 'bold', fontSize: 16, }
                , headerTitleAlign: 'center',
                headerShown:true,
                headerTitle: () => (
                  <Image style={{ width: 50, height: 56,margin: 10 }} source={require("./assets/parking.png")} />
                ),
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                      style={{ width: 30, height: 30, margin: 10 }}
                      source={require("./assets/back.png")}
                    />
                  </TouchableOpacity>
                )
              })}
            />      
        </StackHome.Navigator>
    </NavigationContainer>
    );
}
const styles = StyleSheet.create({});