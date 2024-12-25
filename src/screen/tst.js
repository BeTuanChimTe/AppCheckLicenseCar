import axios from 'axios';
import React, { Component, useContext, useState } from 'react';
import {
  StyleSheet, Platform, Text, View, StatusBar, TouchableOpacity
  , Image, ScrollView, PermissionsAndroid
} from 'react-native'
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Marker, { Position, ImageFormat } from 'react-native-image-marker';
import IProgress from '../common/IProgress';
import { ShowAlert } from '../common/ShowAlert';
import { KEY_STORAGE } from '../../constants/index';
import ContextBase from '../ContextBase';
import { Loadyyyymmdd, hhmmssddmmyyyy } from '../common/Common';
import { SaveImageProgramDisplay, UpdateDataViengTham, InsertDataGPS, LoadNameDisplay } from '../../services/APIServiceRichyIRMS';
import {GetStartPhotoCust} from '../../services/APIServiceAI';
import LocationService from '../../services/LocationService';
import { StackActions } from '@react-navigation/native';


const textBgStretch = ['', 'stretchX', 'stretchY']
export default class TakeAPictureDisplay extends React.Component {
  state = {
    visibleLoading: false,
    response1: null,
    response2: null,
    response3: null,
    image1: true,
    image2: true,
    image3: true,
    localPhotos: [],
    hasCameraPermission: null,
    typeTake: 0,
    textBgStretch: 0,
    strLong: 0,
    strLat: 0,
    strIDDisplay: '',
    strIDShopID: '',
    arrDisplayID: [],
    //strIDDisplay0: '',
    // strIDDisplay1: '',
    // strIDDisplay2: '',
    // strIDDisplay3: '',
    // strIDDisplay4: '',
    // strIDDisplay5: '',
    strNameDisplay: '',
    strNote: '',
    strScreen: ''
  };

  async componentDidMount() {
    // this.setState({strIDDisplay: this.props.route.params.idDisplay});
    this.setState({strIDShopID: this.props.route.params.idShopID});
    this.setState({strScreen: this.props.route.params.strScreen});
    this.permissionCheck();
    this.checkLoction();
    arrDisplayID = this.props.route.params.idDisplay.split(',');
    this.setState({strIDDisplay: arrDisplayID[0]});
    // this.setState({strIDDisplay1: arrDisplayID[1] == undefined ? '0' : arrDisplayID[1]});
    // this.setState({strIDDisplay2: arrDisplayID[2] == undefined ? '0' : arrDisplayID[2]});
    // this.setState({strIDDisplay3: arrDisplayID[3] == undefined ? '0' : arrDisplayID[3]});
    // this.setState({strIDDisplay4: arrDisplayID[4] == undefined ? '0' : arrDisplayID[4]});
    // this.setState({strIDDisplay5: arrDisplayID[5] == undefined ? '0' : arrDisplayID[5]});
    this.setState({typeTake: 1});
    this.LoadNameDisplay(arrDisplayID[0])
  }

  checkLoction = async () => {
    const location = await LocationService.getCurrentPosition();
    this.setState({strLong:location.longitude });
    this.setState({strLat:location.latitude });
    ContextBase.LATITUDE = location.latitude.toString();
    ContextBase.LONGITUDE = location.longitude.toString();

  }
  permissionCheck = async () => {
if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      }
    } else {
    }
  }

  LoadNameDisplay = async (idDisplayCheck) =>{
    this.setState({ visibleLoading: true });
    await LoadNameDisplay(idDisplayCheck)
    .then(response => {
      this.setState({strNameDisplay: JSON.parse(response.data)});
      this.setState({ visibleLoading: false });
    })
    .catch((error) => {
        console.log('error ' + error);
        this.setState({ visibleLoading: false });
    });
  }

  selectFile1 = () => {
    var options = {
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker 1');
      } else if (response.error) {
        console.log('ImagePicker Error 1: ', response.error);
      } else {
        if(response.errorCode == 'camera_unavailable'){
            ShowAlert('Không tìm thấy camera: camera unavailable');
        }
        else {
          this.onCheckImage(response.assets[0], 1)
          // this._ShowImageText(response.assets[0], 1);
        }
      }
    },
    )
  };

  selectFile2 = () => {
    var options = {
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker 2');
      } else if (response.error) {
        console.log('ImagePicker Error 2: ', response.error);
      } else {
        if(response.errorCode == 'camera_unavailable'){
            ShowAlert('Không tìm thấy camera: camera unavailable');
        }
        else {
          this.onCheckImage(response.assets[0], 2)
          // this._ShowImageText(response.assets[0], 2);
        }
      }
    },
    )
  };

  selectFile3 = () => {
    var options = {
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker 3');
      } else if (response.error) {
        console.log('ImagePicker Error 3: ', response.error);
      } else {
        if(response.errorCode == 'camera_unavailable'){
ShowAlert('Không tìm thấy camera: camera unavailable');
        }
        else {
          this.onCheckImage(response.assets[0], 3)
          // this._ShowImageText(response.assets[0], 3);
        }
      }
    },
    )
  };

  onCheckImage = async(strRepName, intNo) => {
    this.setState({ visibleLoading: true });
    var shopID = await AsyncStorage.getItem(KEY_STORAGE.SHOPID)
    const formDataShop = new FormData();
    formDataShop.append("storeId", '99999');
    formDataShop.append("images", { 
        uri: strRepName.uri,
        type: "image/jpeg",
        name: shopID + '_' + strRepName.fileName,
    });
    await GetStartPhotoCust(formDataShop)
    .then((responseImgAI) => responseImgAI.json())
    .then((responseImgAIjson) => {
      // console.log('Data: ' + JSON.stringify(responseImgAIjson));
      if(responseImgAIjson.detail!== undefined ){
        ShowAlert('Cửa hàng ' + shopID +' chưa được đăng ký ảnh. Liên hệ bộ phận DMS để đăng ký.');
        this.setState({ visibleLoading: false });
      }else{
        if(responseImgAIjson.data.results[0].isRealImage == true){
          this._ShowImageText(strRepName, intNo);
          // if(responseImgAIjson.data.results[0].isSharpImage == true){
          //   this._ShowImageText(strRepName, intNo);
          // }else{
          //   ShowAlert('Vui lòng chụp ảnh không nhòe');
          //   this.setState({ visibleLoading: false });
          // }
        }else{
          ShowAlert('Vui lòng chụp đúng hình thực');
          this.setState({ visibleLoading: false });
          
        }
      }

    })
    .catch((error) => {
      // ShowAlert('Erorr: ' + error);
      this._ShowImageText(strRepName, intNo);
      this.setState({ visibleLoading: false });
    });
    
    
    // const responseCheck =await GetStartPhotoCust(formDataShop);
    // const jsonCheckShop = await responseCheck.json();
    // console.log('Data: ' + JSON.stringify(jsonCheckShop));
    // if(jsonCheckShop.detail!== undefined ){
    //   ShowAlert('Cửa hàng ' + shopID +' chưa được đăng ký ảnh. Liên hệ bộ phận DMS để đăng ký.');
    //   this.setState({ visibleLoading: false });
    // }else{
    //   if(jsonCheckShop.data.results[0].isRealImage === false || jsonCheckShop.data.results[0].isSharpImage === false){
    //     ShowAlert('Vui lòng chụp đúng hình thực');
    //     this.setState({ visibleLoading: false });
    //   }else{
    //     this._ShowImageText(strRepName, intNo);
    //   }
    // }

  }
  
  _ShowImageText = async (strImage, intImage) => {
    this.setState({ visibleLoading: true });
      if (intImage === 1) {
        this.setState({ response1: strImage });
        this.setState({ image1: false });
      }
      if (intImage === 2) {
        this.setState({ response2: strImage });
        this.setState({ image2: false });
      }
      if (intImage === 3) {
        this.setState({ response3: strImage });
        this.setState({ image3: false });
      }
let { localPhotos } = this.state;
      localPhotos[intImage] = strImage;
      this.setState({ localPhotos });
      this.setState({ visibleLoading: false });
      if(intImage === 1){
        const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + ContextBase.LATITUDE + ',' + ContextBase.LONGITUDE + '&key=AIzaSyBjnnLP9NpyJa6DNRIobLnuO9Oxjd24lUM';
        await axios.get(baseURL, {
          headers: {
            accept: 'application/json',
          }
        }).then(response => {
          const responseJson = response.data.results[0];
          var strAddress = responseJson.formatted_address;
          this.setState({ strNote: hhmmssddmmyyyy()+ '_'+strAddress + '_' + ContextBase.LATITUDE.toString() + ' - ' + ContextBase.LONGITUDE.toString() });
        //   Marker.markText({
        //     src: strImage.uri,
        //     text: hhmmssddmmyyyy()+ `\n`
        //       + strAddress + `\n`
        //       + ContextBase.LATITUDE.toString() + ' - ' + ContextBase.LONGITUDE.toString(),
        //     position: Position.bottomLeft,
        //     color: '#FF0000AA',
        //     fontName: 'Arial-BoldItalicMT',
        //     fontSize: 14,
        //     scale: 1,
        //     quality: 100,
        //     shadowStyle: {
        //       dx: 10.5,
        //       dy: 20.8,
        //       radius: 30,
        //       color: '#0000FF'
        //     },
        //     textBackgroundStyle: {
        //       type: textBgStretch[this.state.textBgStretch],
        //       paddingX: 10,
        //       paddingY: 10,
        //       color: '#0f0A'
        //     },
        //     saveFormat: ImageFormat.jpeg
        //   })
        //     .then((path) => {

        //       // Platform.OS === 'android' ? strImage.uri = 'file://' + path : strImage.uri = path;
        //       // strImage.fileName = path.substring(path.lastIndexOf("/") + 1);
        //       // if (intImage === 1) {
        //       //   this.setState({ response1: strImage });
        //       //   this.setState({ image1: false });
        //       // }
        //       // if (intImage === 2) {
        //       //   this.setState({ response2: strImage });
        //       //   this.setState({ image2: false });
        //       // }
        //       // if (intImage === 3) {
        //       //   this.setState({ response3: strImage });
        //       //   this.setState({ image3: false });
        //       // }
        //       // let { localPhotos } = this.state;
        //       // localPhotos[intImage] = strImage;
        //       // this.setState({ localPhotos });
    
        //     }).catch((err) => {
        //       console.log('====================================')
        //       console.log(err)
        //       console.log('====================================')
        //     })
         })
      }
    
  }

  OK = async () => {
    this.setState({ visibleLoading: true });
    var shopID = await AsyncStorage.getItem(KEY_STORAGE.SHOPID)
const formData = new FormData();
    formData.append("Files","");
    const { localPhotos, response1, response2, response3, strLat, strLong, strIDDisplay, strNote } = this.state;
    if (localPhotos && localPhotos.length >= 1) {
      formData.append("id", strIDDisplay);
      formData.append("shopID", shopID);
      formData.append("branchCode", await AsyncStorage.getItem(KEY_STORAGE.BRANCHCODE));
      formData.append("routeCode", await AsyncStorage.getItem(KEY_STORAGE.ROUTECODE));
      formData.append("empID", await AsyncStorage.getItem(KEY_STORAGE.USERNAME));
      formData.append("typeTake", '');
      formData.append("invtID", '');
      formData.append("note", strNote);
      formData.append("tranDate", Loadyyyymmdd(new Date()));
      var ArrayFiles = [];
      this.state.localPhotos.forEach((item, i) => {
          formData.append("Files", {
            uri: item.uri,
            type: "image/jpeg",
            name: `${i}_` + shopID + '_' + item.fileName,
          });
      });

      await SaveImageProgramDisplay(formData)
        .then((response) => {
          if (response.ok === true) {
            UpdateDataViengTham(shopID, Loadyyyymmdd(new Date()), 3, 0);
            ContextBase.ISTAKEPHOTO = 2;
            var intCheck = parseInt(this.state.typeTake);
            if( intCheck < arrDisplayID.length){
              this.setState({typeTake: intCheck + 1});
              this.setState({strIDDisplay: arrDisplayID[intCheck]});
              this.LoadNameDisplay(arrDisplayID[intCheck]);
              this.setState({localPhotos: []});
              this.setState({response1: null});
              this.setState({response2: null});
              this.setState({response3: null});
              this.setState({image1: true});
              this.setState({image2: true});
              this.setState({image3: true});
              this.setState({ visibleLoading: false });
            }else{
              if(this.state.strScreen == 'VisitCustComponent') this.props.navigation.navigate(this.state.strScreen);
              else this.props.navigation.navigate(this.state.strScreen, {strShopID: shopID });
              this.setState({ visibleLoading: false });
            }
            
            
          } else {
            ShowAlert('Error: ' + JSON.stringify(response));
            this.setState({ visibleLoading: false });
          }
        })
        .catch((error) => {
          console.log('Error: ' + error);
          this.setState({ visibleLoading: false });
        });

    } else {
      ShowAlert('Vui lòng chụp ảnh, trước khi gửi!');
      this.setState({ visibleLoading: false });
    }

  }

  KipCancel = async () => {
    var intCheck = parseInt(this.state.typeTake);
    if( intCheck < arrDisplayID.length){
      this.setState({typeTake: intCheck + 1});
      this.setState({strIDDisplay: arrDisplayID[intCheck]});
      this.LoadNameDisplay(arrDisplayID[intCheck]);
      this.setState({localPhotos: []});
this.setState({response1: null});
      this.setState({response2: null});
      this.setState({response3: null});
      this.setState({image1: true});
      this.setState({image2: true});
      this.setState({image3: true});
    }else{
      if(this.state.strScreen == 'VisitCustComponent') this.props.navigation.navigate(this.state.strScreen);
      else this.props.navigation.navigate(this.state.strScreen, {strShopID: await AsyncStorage.getItem(KEY_STORAGE.SHOPID) });
    }
            
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.textHead}>{this.state.strNameDisplay}</Text>
          {this.state.response1 && (
            <View style={styles.image}>
              <Image
                resizeMode='contain'
                style={styles.ShowImg}
                source={{ uri: this.state.response1.uri }}
              />
            </View>
          )}

          {this.state.image1 == true ? (<View style={styles.Camera}>
            <TouchableOpacity onPress={this.selectFile1}>
              <Image style={styles.icon} source={require('../../assets/image/camera.png')} />
              <Text style={styles.detail}>Hình 1</Text>
            </TouchableOpacity>
          </View>) : null}

          {this.state.response2 && (
            <View style={styles.image}>
              <Image
                resizeMode='contain'
                style={styles.ShowImg}
                source={{ uri: this.state.response2.uri }}
              />
            </View>
          )}


          {this.state.image2 == true ? (<View style={styles.Camera}>
            <TouchableOpacity onPress={this.selectFile2}>
              <Image style={styles.icon} source={require('../../assets/image/camera.png')} />
              <View  style={styles.viewDetail}>
                <Text style={styles.detail}>Hình 2</Text>
              </View>
            </TouchableOpacity>
          </View>) : null}

          {this.state.response3 && (
            <View style={styles.image}>
              <Image
                resizeMode='contain'
                style={styles.ShowImg}
                source={{ uri: this.state.response3.uri }}
              />
            </View>
          )}

          {this.state.image3 == true ? (<View style={styles.Camera}>
            <TouchableOpacity onPress={this.selectFile3}>
              <Image style={styles.icon} source={require('../../assets/image/camera.png')} />
              <Text style={styles.detail}>Hình 3</Text>
            </TouchableOpacity>
          </View>) : null}
        </ScrollView>
        <View style={styles.viewTextCancel}>
          <TouchableOpacity onPress={this.KipCancel} style={styles.buttonCancel}  >
            <Text style={styles.buttonTextCancel}>{'Bỏ qua >>'} </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.OK} style={styles.buttonStype}  >
<Text style={styles.buttonText}>Gửi hình</Text>
        </TouchableOpacity>
        {this.state.visibleLoading ? <IProgress /> : null}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  textHead:{
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 20,
    fontWeight:'bold',
    paddingTop: 3,
  },
  buttonStype: {
      alignItems: 'center',
      backgroundColor: '#FF0000',
      padding: 12,
      width: '100%',
      borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 10,
  },
  buttonText: {
      textAlign: 'center',
      fontSize: 15,
      color: '#fff',
  },
  image: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      width: 350,
      marginTop: '3%',
  },
  ShowImg: {
      height: 200,
      width: 350,
      width: '100%',
  },
  response: {
      textAlign: 'center',
  },
  Camera: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 200,
    width: 350,
    borderWidth: 1,
    marginTop: '3%',
    paddingTop: '5%',
    borderColor: '#FF0000'
  },
  icon: {
      marginTop: "4%",
      padding: 50,
      marginLeft: '35%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 5,
      width: 5,
  },
  viewDetail:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  detail: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF0000'
  },
  activityIndicatorStyle: {
      flex: 1,
      position: 'absolute',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
  },
  viewTextCancel:{
    marginLeft: '70%',
    marginBottom: '1%',
    marginTop: '1%',
  },
  buttonCancel:{
    backgroundColor: '#FF0000',
    padding: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
  },
  buttonTextCancel:{
    color: '#FFF'
  }



});