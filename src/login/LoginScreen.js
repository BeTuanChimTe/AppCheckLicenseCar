import React, { useState, useEffect } from 'react';
import {
  Platform, StatusBar, Text, View, TextInput, TouchableOpacity
  , TouchableWithoutFeedback, Keyboard, StatusBarIOS, ActivityIndicator
  , Image, ImageBackground, Switch, Linking, Dimensions, AppState, Alert, SafeAreaView
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KEY_STORAGE, HOTLINE } from '../constants';

import { isHttpSuccessfull } from '../utils';
import NetInfo from '@react-native-community/netinfo';
import AndroidOpenSettings from 'react-native-android-open-settings';
// import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IProgress from '../common/IProgress';
import { ShowAlert } from '../common/ShowAlert';
import Geolocation from 'react-native-geolocation-service';
import VersionNumber from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';
import CustomButton from './CustomButton';
import axios from 'axios';
const DOMAIN_CONFIG_SELECT = "http://14.160.26.131:8086";
function LoginScreen(props){
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [version, setVersion] = useState(VersionNumber.appVersion);

  const [dataTemp, setDataTemp] = useState();
  const [aState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    console.log('Init LoginComponent');
    setIsVisible(false)
   
    async function _CheckToken() {
      setUserName(await getRememberedUser());
      setPassword(await getRememberedPASS());
    }

    async function _CheckInternet() {
      try {
        const netw = await NetInfo.fetch();
        if (netw.isConnected === false) {
          setIsVisible(false);
          Alert.alert(
            'THÔNG BÁO',
            'Vui lòng kiểm tra WIFI hoặc 3G trên điện thoại bạn đã được bật',
            [
              {
                text: 'Cài đặt',
                onPress: () => {
                  if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:');
                  }
                  if (Platform.OS == 'android') {
                    try {
                     AndroidOpenSettings.appDetailsSettings();
                    } catch (error) {
                      console.log('error: ' + error);
                    }
                  }
                },
              },
            ],
            { cancelable: false },
          );
        }
        return netw.isConnected;
      } catch (err) {
        console.log(err);
      }
    }

    async function _checkingGps() {
      if (Platform.OS == 'ios') {
        let status = await Geolocation.requestAuthorization("whenInUse");
        if (status === 'denied') {
          alert('RichyPG cần quyền try cập GPS, bạn có muốn không?');
        } else {
          Geolocation.getCurrentPosition(
            (position) => { return position; },
            (error) => { return error.code; },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      }
      if (Platform.OS == 'android') {
        Geolocation.getCurrentPosition(
          (position) => { return position; },
          (error) => { return error.code; },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    }

    async function _CheckALL() {
      if (await _CheckInternet()) {
        const ckGPS = await _checkingGps();
        if (ckGPS !== null) {
          await _CheckToken();
        } else {
          console.log('error: _checkingGps');
        }
      } else {
        console.log('error: _CheckALL');
      }

    };

    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        setAppState(nextAppState);
        if (nextAppState === 'active') {
          _CheckALL();
        }
      },
    );
    return () => {
      appStateListener?.remove();
    };

  }, []);

  rememberUserPass = async (strUserName, strPassword) => {
    try {
      await AsyncStorage.setItem('YOUR-USER', strUserName);
      await AsyncStorage.setItem('YOUR-PASS', strPassword);
    } catch (error) {
     console.log(error);
    }
  };

  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem('YOUR-USER');
      if (username !== null) {
        return username;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  getRememberedPASS = async () => {
    try {
      const passWord = await AsyncStorage.getItem('YOUR-PASS');
      if (passWord !== null) {
        return passWord;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _onLogin = async () => {
    if (userName === '') {
      ShowAlert('Vui lòng nhập Mã Nhân Viên');
      return;
    }

    if (password === '') {
      ShowAlert('Vui lòng nhập Mật Khẩu');
      return;
    }
    setIsVisible(true);
    
    let { status, data} = await LoginCarDelivery(userName, password, Platform.OS + '_' + DeviceInfo.getDeviceId(), version);
    
    if (status===200) {
      if (data.userId !== 0) {
        // await AsyncStorage.multiSet([
        //   [KEY_STORAGE.TOKEN, data.accessToken],
        //   [KEY_STORAGE.ISLOGIN, JSON.stringify(true)],
        //   [KEY_STORAGE.USERNAME, data.userName],
        //   [KEY_STORAGE.PASSWORD, password],
        //   [KEY_STORAGE.FULLNAME, data.userName + ' - '+ data.fullName],
        // ]);
        KEY_STORAGE.ISLOGIN = JSON.stringify(true);
        KEY_STORAGE.USERNAME=data.userName;
        KEY_STORAGE.TOKEN=data.accessToken;
        KEY_STORAGE.PASSWORD = password;
        KEY_STORAGE.FULLNAME = data.userName + ' - '+ data.fullName;
        setIsVisible(false);
        await rememberUserPass(data.userName, password);
        
        props.navigation.dispatch(
          StackActions.replace('TabBottom')
        );
        setIsVisible(false);
        console.log(KEY_STORAGE)
        
      } else {
        setIsVisible(false);
        ShowAlert('Kiểm tra lại thông tin đăng nhập : ' + data.fullName);
      }
    } else {
      setIsVisible(false);
      ShowAlert('Không thể kết nối với dữ liệu, vui lòng kiểm tra lại mạng internet: ' + status);
    }
  }
  async function LoginCarDelivery(strUser, strPass, strDevice, strVersion) {
    let data1 = JSON.stringify({
      "strUser": strUser,
      "strPass": strPass,
      "strDevice": strDevice,
      "strVersion": strVersion,
      "dtDate": new Date()
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://14.160.26.131:8086/api/LoginCarLicensePlates/LoginAll',
      headers: { 
        'accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      data : data1
    };
    
    let { status, data } = await axios.request(config);
    console.log(status)
    return { status, data };
  }
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <Image
            style={{height:50,width:50,transform: [{rotate: '-5deg'}]}}          
            source={require('../../assets/parking.png')}
          />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
            marginTop:30
          }}>
          Đăng nhập
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}>
            
            <TextInput
              placeholder="Mã nhân viên..."
              
              style={{flex: 1, paddingVertical: 0}}
              value={userName}
              keyboardType="email-address"
              onChangeText={text => setUserName(text)}/>
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}>
            <TextInput
              placeholder={'Mật khẩu'}
              secureTextEntry={true}
              style={{flex: 1, paddingVertical: 0}}
              value={password}
              onChangeText={text => setPassword(text)}/>
          
        </View>
        <CustomButton label={"Đăng nhập"} onPress={_onLogin} />
      </View>
      {isVisible ? <IProgress /> : null}
    </SafeAreaView>
  );
};

export default LoginScreen;

