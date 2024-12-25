import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image,Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component,useState,useEffect } from 'react';
import AddNew from './AddNew';
import ListCar from './ListCar';
import MeComponent from '../me/MeComponent';
const Tab = createBottomTabNavigator();
const StackVisit = createNativeStackNavigator();
const StackHome = createNativeStackNavigator();
const StackMain = createNativeStackNavigator();

const TabBottom =() => {
    const [tabBarVisible, setTabBarVisible] = useState(true);
    const [imagesVisible, setImagesVisible] = useState(true);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setTabBarVisible(false);
            setImagesVisible(false);
        }
        );

        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setTabBarVisible(true);
            setImagesVisible(true);
        }
        );

        return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
        };
    }, []);
    return(
        <Tab.Navigator screenOptions={({ route }) => ({
            
            keyboardHidesTabBar: true,
            tabBarInactiveTintColor: 'black',
            tabBarActiveTintColor: 'blue',
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 14,
              textAlign: 'center',
            },
            tabBarStyle: {
              height: tabBarVisible ? '8%' : 0,
              paddingHorizontal: 1,
              paddingTop: 1,
              backgroundColor: '#ffffff',
              borderTopWidth: 2,
              borderColor: 'white',
              paddingBottom: '0.5%',
            },
          })}
        >
            <Tab.Screen name="Tab1"
                options={{
                title: 'Ghi nhận'
                , tabBarIcon: ({ size, focused, color }) => {
                    return (
                    <Image
                        style={imagesVisible ? { width: 30, height: 30 } : { width: 0, height: 0 }}
                        source={require('../../assets/add.png')}
                    />
                    );
                },

                }}
                initialRouteName='AddNew'
            >
                {() => (
                <StackVisit.Navigator screenOptions={{
                    headerStyle: {
                    backgroundColor: "blue",
                    barStyle: "dark-content"

                    },
                    headerTintColor: "#FFF",
                }}
                >
                    <StackVisit.Screen name="AddNew" component={AddNew}
                    options={({ navigation }) => ({
                        headerShown: false
                        , title: 'GHI NHẬN'
                        , headerTitleStyle: { fontWeight: 'bold', fontSize: 16 }
                        , headerTitleAlign: 'center',
                        keyboardHidesTabBar: true,
                    })}

                    />
                </StackVisit.Navigator>
                )}
            </Tab.Screen>
            <Tab.Screen name="Tab2" options={{
                title: 'Danh sách'
                , tabBarIcon: ({ size, focused, color }) => {
                return (
                    <Image
                    style={imagesVisible ? { width: 40, height: 40 } : { width: 0, height: 0 }}
                    source={require('../../assets/home-button.png')}
                    />
                );
                },
            }}
            >
                {() => (
                <StackHome.Navigator screenOptions={{
                    headerStyle: {
                    backgroundColor: "blue",
                    barStyle: "dark-content"
                    },
                    headerTintColor: "blue",
                    headerShown:false
                }}>
                    <StackVisit.Screen name="ListCar" component={ListCar}
                    options={({ navigation }) => ({
                        title: 'DANH SÁCH'
                        , headerTitleStyle: { fontWeight: 'bold', fontSize: 16 }
                        , headerTitleAlign: 'center'
                    })}
                    />

                </StackHome.Navigator>
                )}
            </Tab.Screen>
            <Tab.Screen name="Tab3" options={{
                title: 'Tài khoản'
                , tabBarIcon: ({ size, focused, color }) => {
                return (
                    <Image
                    style={imagesVisible ? { width: 40, height: 40 } : { width: 0, height: 0 }}
                    source={require('../../assets/man.png')}
                    />
                );
                },
            }}
            >
                {() => (
                <StackHome.Navigator screenOptions={{
                    headerStyle: {
                    height: 20,
                    backgroundColor: "#FF0000",
                    },
                    headerTintColor: "#FFF",
                }}>
                    <StackHome.Screen name="MeComponent" component={MeComponent}
                    options={({ navigation }) => ({
                        title: '',
                        headerShown: false,
                    })}
                    />
                </StackHome.Navigator>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
export default TabBottom;