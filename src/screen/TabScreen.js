import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddNew from './AddNew';
import ListCar from './ListCar';
const Tab = createMaterialTopTabNavigator();
export default class TabScreen extends Component {
    render(){
        return(
            <Tab.Navigator  screenOptions={({ route }) => ({
                tabBarInactiveTintColor: '#000',
                tabBarActiveTintColor: '#FF0000',
               
                headerShown: false,
                tabBarLabelStyle: {
                  fontSize: 14,
                  textAlign: 'center',
                  fontFamily:'OpenSans-SemiBold'
                },
                tabBarStyle: {
                //   height: '7%',
                  paddingHorizontal: 1,
                  paddingTop: 1,
                  backgroundColor: '#FFF',
                  borderTopWidth: 2,
                  borderColor: '#e41f28',
                  paddingBottom: '0.5%',
                },
                })}>
                <Tab.Screen name="GHI NHẬN" component={AddNew} />
                <Tab.Screen name="DANH SÁCH" component={ListCar} />
            </Tab.Navigator>
        )
    }
}