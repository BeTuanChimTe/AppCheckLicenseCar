import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View,StatusBar,Image,ImageBackground,TouchableOpacity } from 'react-native'
import Buttons from './Buttons'


const Onboarding = ({navigation}) => {
    return (
        <View style={{flex:1,backgroundColor:'#e41f28'}} >
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {/* handshake image */}
            <View style={{flex:3,flexDirection:"column",backgroundColor:'white'}} >
                <ImageBackground source={require('../../assets/parking-Lot-with-cars.jpeg')} resizeMode='contain'
                style={{flex:1,width:'100%',backgroundColor:'white'}}  imageStyle={{ marginVertical: '20%'}}/>
            </View>

            {/* button and text */}
            <View style={{flex:2,backgroundColor:'#fff'}} >
                {/* Text part */}
                {/* <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff', paddingTop:'10%'}} >
                    <Text style={{color:'#e41f28',fontSize:30}} >Richy - Hoàng Mai</Text>
                    <Text style={{maxWidth:'50%',color:"#999",fontSize:14, textAlign:'center',paddingTop:10}} >Tự hào bánh gạo Việt, xuất khẩu số 1 Việt Nam</Text>
                </View>    */}

                
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end',alignItems:'center'}} >
                    <Buttons btn_text={"Đăng nhập"} on_press={()=>navigation.navigate("LoginScreen")} />
                </View>
            </View>
        </View>
    )
}
export default Onboarding
const styles = StyleSheet.create({})