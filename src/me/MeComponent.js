import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Image, Alert, Platform
  , AppState, SafeAreaView, TextInput, ImageBackground
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import IProgress from '../common/IProgress';
import { currentDay, ddmmyyyy, Loadyyyymmdd } from '../common/Common';
import { ShowAlert } from '../common/ShowAlert';
import { KEY_STORAGE, DOMAIN_CONFIG_REPORT } from '../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { DeleteDataAccount } from '../../services/APIService';
import { checkTokenNew } from '../../services/APIServiceRichyHR';

// import { GetInforPG, SaveImageCMND } from '../../services/APIServiceRichyHR';

export default function MeComponent(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [userCode, setUserCode] = useState('');
  const [routeCode, setRouteCode] = useState('');
  const [createSale, setCreateSale] = useState('');
  const [positionSale, setPositionSale] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passOld, setPassOld] = useState('');
  const [passNew, setPassNew] = useState('');


  const appState = useRef(AppState.currentState);

  useEffect(() => {
    async function GetInfo() {
      setFullName(await AsyncStorage.getItem(KEY_STORAGE.FULLNAME));
      // setCompany(await AsyncStorage.getItem(KEY_STORAGE.COMPANYCODE));
      // setRouteCode(await AsyncStorage.getItem(KEY_STORAGE.ROUTECODE));
      setUserCode(await AsyncStorage.getItem(KEY_STORAGE.USERNAME));
      // setCreateSale(ddmmyyyy());
      // if (await AsyncStorage.getItem(KEY_STORAGE.LEADER) === '1') setPositionSale('Giám sát');
      // else setPositionSale('Nhân viên');
    }

    const unsubscribe = props.navigation.addListener('focus', () => {
      _ckTokenNew();
    });

    GetInfo();

    return () => {
      unsubscribe;
    };

  }, [])

  _ckTokenNew = async () => {
    // let strToken = await AsyncStorage.getItem(KEY_STORAGE.TOKEN);
    // if (strToken !== null) {
    //   let APICheckToken = await checkTokenNew();
    //   let ckCheckToken = JSON.stringify(APICheckToken.data);
    //   if (ckCheckToken === 'false') {
    //     Alert.alert(
    //       'THÔNG BÁO',
    //       'Tài khoản đã đăng nhập trên thiết bị khác!',
    //       [
    //         {
    //           text: 'Thoát',
    //           onPress: () => {
    //             AsyncStorage.clear();
    //             props.navigation.dispatch(
    //               StackActions.replace('LoginComponent')
    //             );
    //           },
    //         },
    //       ],
    //       { cancelable: false },
    //     );
    //   }
    // }
  }



  // _LoadData = async () => {
  //   setIsVisible(true);
  //   await GetInforPG(await AsyncStorage.getItem(KEY_STORAGE.USERNAME))
  //       .then(response => {
  //           const responseJson = response.data;
  //           setDataList(responseJson);
  //           setIsVisible(false);

  //       })
  //       .catch((error) => {
  //           ShowAlert('Chụp và thông báo cho IT: ' + error);
  //           setIsVisible(false);
  //       });
  // }

  const _onLogout = async () => {
    setIsVisible(true);
    Alert.alert(
      'Bạn có chắc chắn!',
      'muốn thoát tài khoản: "' + KEY_STORAGE.USERNAME+ '" ra khỏi ứng dụng.',
      [
        {
          text: 'Huỷ',
          onPress: async () => { setIsVisible(false);},
          style: 'cancel',
        },
        {
          text: 'Thoát',
          onPress: async () => {
            setIsVisible(true);
            AsyncStorage.clear();
            props.navigation.dispatch(
              StackActions.replace('LoginScreen')
            );
            setIsVisible(false);
          }
        },
      ],
      { cancelable: false },
    );
  }

  const _onDeleteAccount = async () => {
    Alert.alert(
      'Bạn có chắc chắn!',
      'muốn xoá tài khoản: "' + await AsyncStorage.getItem(KEY_STORAGE.FULLNAME) + '" ra khỏi ứng dụng, mọi dữ liệu phát sinh sẽ bị xoá, và thời gian xoá có thể kéo dài trong 30 ngày.',
      [
        {
          text: 'Huỷ',
          onPress: async () => { },
          style: 'cancel',
        },
        {
          text: 'Xoá',
          onPress: async () => {
            setIsVisible(true);
            await DeleteDataAccount()
              .then(response => {
                ShowAlert('Tài khoản của bạn sẽ được xoá trong thời gian sớm nhất');
                _onLogout();
                setIsVisible(false);
              })
              .catch((error) => {
                console.log('error ' + error);
                setIsVisible(false);
              });
          }
        },
      ],
      { cancelable: false },
    );
  }

  _showInforFull = () => {
    props.navigation.navigate('ReportWebViewinfor', { strTitle: 'THÔNG TIN CÁ NHÂN', id: 1, strURL: DOMAIN_CONFIG_REPORT + '/Pages/App/HRReportShowInfor.aspx?saleCode=' + userCode });
  }

  _onChangePass = () => {
    setModalVisible(true);
  }

  _onCancel = () => {
    setModalVisible(false);
    setPassOld('');
    setPassNew('');

  }

  _onSave = () => {

  }

  return (
    <ImageBackground source={require('../../assets/pxfuel.jpg')} style={{ flex: 1, resizeMode: 'cover', }}>
      <SafeAreaView style={styles.container}>
        <View style={Platform.OS === 'android' ? styles.containerAndroid : styles.container}>
          <TouchableOpacity style={[styles.colorHead, styles.bodyStart]}>
            <View style={styles.row}>
              <Image style={styles.iconMe} source={require('../../assets/man.png')} />
              <Text style={styles.fullname}>{KEY_STORAGE.FULLNAME}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.bodyContent}>
             {/* <View style={styles.rowContent}>
              <Text style={styles.modalTextDetail}>Mã nhân viên: {userCode}</Text>
              <Text style={styles.modalTextDetail}>CMND/CCCD: {userCode}</Text>
              <Text style={styles.modalTextDetail}>Ngày cấp: {userCode}</Text>
              <Text style={styles.modalTextDetail}>Nơi cấp: {userCode}</Text>

              <Text style={styles.modalTextDetail}>Ngân hàng: {userCode}</Text>
              <Text style={styles.modalTextDetail}>Tài khoản: {userCode}</Text>
              <Text style={styles.modalTextDetail}>Chi nhánh: {userCode}</Text>

              <Text style={styles.modalTextDetail}>Ngày vào làm: {createSale}</Text>
              <Text style={styles.modalTextDetail}>Vị trí: {positionSale}</Text>
              <Text style={styles.modalTextDetail}>Người quản lý: {fullName}</Text>
            </View>
            <View style={[styles.rowContent,styles.row]}>
              <Image style={styles.iconCMND} source={require('../../assets/image/camera.png')} />
              <TouchableOpacity style={[styles.button]} onPress={_onChangePass}>
                <Text style={styles.btnTakePhoto}>chụp</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.rowContent,styles.row]}>
              <Image style={styles.iconCMND} source={require('../../assets/image/camera.png')} />
              <TouchableOpacity style={[styles.button]} onPress={_onChangePass}>
                <Text style={styles.btnTakePhoto}>chụp</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.bodyEnd}>
            {/* <View style={styles.viewBtn}>
              <TouchableOpacity style={styles.loginBtn} onPress={_onChangePass}>
                <Text style={styles.logoutText}>ĐỔI PASS</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.viewBtn}>
              {/* <TouchableOpacity style={styles.loginBtn} onPress={_onDeleteAccount}>
                <Text style={styles.logoutText}>XOÁ TÀI KHOẢN</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.viewBtn}>
              <TouchableOpacity style={styles.loginBtn} onPress={_onLogout}>
                <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.rowRegister}>
                    <Text style={styles.textRegister}>Pass cũ</Text>
                    <View style={styles.inputViewRegister}>
                      <TextInput secureTextEntry
                        style={styles.inputTextRegister}
                        onChangeText={text => setPassOld(text)}
                        value={passOld}
                      />
                    </View>
                  </View>
                  <View style={styles.rowRegister}>
                    <Text style={styles.textRegister}>Pass mới</Text>
                    <View style={styles.inputViewRegister}>
                      <TextInput
                        secureTextEntry
                        style={styles.inputTextRegister}
                        onChangeText={text => setPassNew(text)}
                        value={passNew}
                      />
                    </View>
                  </View>
                  <View style={styles.rowRegister}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => _onCancel()}
                    >
                      <Text style={styles.textStyle}>Hủy</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => _onSave()}
                    >
                      <Text style={styles.textStyle}>Lưu</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

          </View>
        </View>
      </SafeAreaView >
      {isVisible ? <IProgress /> : null}
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: '1%',
    paddingRight: '1%',
    // backgroundColor: '#EBF5FB',
  },
  containerAndroid: {
    flex: 1,
    paddingLeft: '1%',
    paddingRight: '1%',
    marginTop: '10%',
    // backgroundColor: '#EBF5FB',
  },
  bodyStart: {
    height: '11%',
    width: '100%',
    justifyContent: "flex-start",
  },
  bodyContent: {
    height: '85%',
    width: '100%',
    justifyContent: "flex-start",
    // backgroundColor:'#FF0000',
  },
  bodyEnd: {
    height: '4%',
    width: '100%',
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: 'row',
    paddingBottom: '0.5%',
  },
  viewBtn: {
    width: '30%',
    marginLeft: '1%'
  },
  loginBtn: {
    backgroundColor: "blue",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  logoutText: {
    color: "white"
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    // backgroundColor: '#FF0000',
    width: '100%',
  },
  colorHead: {
    // backgroundColor: "#FF0000",
  },
  iconMe: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: 'blue',
    marginLeft: '2%',
    borderRadius: 500,
  },
  iconCMND:{
    width: '80%',
    height: 150,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  btnTakePhoto:{

  },
  fullname: {
    fontSize: 24,
    paddingLeft: '2%',
    color: '#000',
    backgroundColor: '#FFF',
  },
  rowContent: {
    alignItems: "left",
    width: '100%',
    backgroundColor: '#FFF',
    marginTop: '2%',
    
  },
  iconContent: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    marginLeft: '2%',
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    width: 140,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#ffcccb",
    marginTop: '2%',
  },
  textStyle: {
    color: "#b80b11",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    color: '#000',
    fontSize: 20,
  },
  modalTextDetail: {
    marginBottom: 10,
    textAlign: "left",
    color: '#000',
    fontSize: 16,
  },
  rowRegister: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingTop: 2,
  },
  textRegister: {
    width: '20%',
    paddingLeft: '2%',
    paddingTop: '2%',
    height: 30,
    justifyContent: "center",
  },
  inputViewRegister: {
    width: "78%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ffcccb',
    justifyContent: "center",
  },
  inputTextRegister: {
    height: 30,
    paddingLeft: '3%',
    color: "#FF0000",
  },
});