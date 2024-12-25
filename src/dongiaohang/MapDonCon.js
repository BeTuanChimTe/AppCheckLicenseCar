import React, { useState, useEffect } from 'react';
import { View,TextInput, Text, Button,Platform, PermissionsAndroid,StyleSheet,TouchableOpacity,Image,Modal,Pressable } from 'react-native';
import MapView, { Polyline,Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { KEY_STORAGE } from '../constants';
import axios from 'axios';
import RadioForm from 'react-native-simple-radio-button';
const MapDonCon = ({ navigation,route }) => {
  const [modalVisibleGhiChuDonHang, setModalVisibleGhiChuDonHang] = useState(false);
  const [valueGhiChuDonHang, onChangeTextGhiChuDonHang] = React.useState('Ghi chú đơn hàng vào ô này !');
  const maDonCon= route.params;
  const [dataTest, setDataTest] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState({
    latitude: 0,
    longitude: 0,
  });
  const coordinates = [
    userLocation, // Điểm đầu
    destination, // Điểm cuối
  ];
  const [showButtons, setShowButtons] = useState(false);
  const [userTempLocation, setUserTempLocation] = useState(null);
  const [userTempEndLocation, setUserTempEndLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenOption, setChosenOption] = useState('1'); //will store our current user options
  const options = [
    { label: '1. Hoàn thành', value: '1' },
    { label: '2. Hoàn thành 1 phần', value: '2' },
    { label: '3. Không nhận hàng', value: '3' },
    { label: '4. Khách hàng đóng cửa', value: '4' },
    { label: '5. Khác', value: '5' },
  ]; 
  useEffect(() => {
    console.log(dataTest)
    if(dataTest.length ==0) {
      loadData()
    }
    console.log(dataTest)
    requestPermissions()
    // Lấy vị trí người dùng
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setUserTempLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    if(dataTest.length !=0) {
      const destinationLat = parseFloat(dataTest[0].lat); // Thay bằng Lat của địa điểm đích
      const destinationLong = parseFloat(dataTest[0].long); // Thay bằng Long của địa điểm đích
      setDestination({
        latitude: destinationLat,
        longitude: destinationLong,
      });
      setUserTempEndLocation({
        latitude: destinationLat,
        longitude: destinationLong,
      });
    }
  }, [dataTest]);
  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
       authorizationLevel: 'whenInUse',
     });
    }
  
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }
  const handleGetDirections = () => {
    // Địa chỉ đích của đơn hàng con
    const destinationLat = parseFloat(dataTest[0].lat); // Thay bằng Lat của địa điểm đích
    const destinationLong = parseFloat(dataTest[0].long); // Thay bằng Long của địa điểm đích
    setDestination({
      latitude: destinationLat,
      longitude: destinationLong,
    });
    console.log(destination)
  };
  async function loadData(){
    // let { status, data, token } = await LoadDonHangConByDonHangConCode(maDonCon.MaDonCon);
    // setDataTest(data)
    try{
      const response=await fetch(`http://14.160.26.131:8086/api/LoginRichyLogDelivery/LoadDonHangConByDonHangConCode?maDonHangCon=${maDonCon.MaDonCon}`);
      const data=await response.json();
      setDataTest(data)
    }
    catch(error){
      console.log(error)
    }
  }
  async function handleStartDonHangCon(){
    var today = new Date();
    var date =today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserTempLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    console.log(userTempLocation)
    axios.post(`http://14.160.26.131:8086/api/LoginRichyLogDelivery/Update_Start_DonHangCon?maDonCon=${maDonCon.MaDonCon}&latStart=${userTempLocation.latitude}&longStart=${userTempLocation.longitude}&maNV=${KEY_STORAGE.USERNAME}&timeStart=${date}`)
    .then(function (response) {
      console.log(response.data);
      if(response.data==true){
        setShowButtons(true)
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      setShowButtons(false);
      return;
    });
  }
  async function handleNoteDonHangCon(){
    axios.post(`http://14.160.26.131:8086/api/LoginRichyLogDelivery/Update_Note_DonHangCon?maDonCon=${maDonCon.MaDonCon}&maNV=${KEY_STORAGE.USERNAME}&ghiChu=${valueGhiChuDonHang}`)
    .then(function (response) {
      console.log(response.data);
      if(response.data==true){
        setModalVisibleGhiChuDonHang(!modalVisibleGhiChuDonHang);
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      setModalVisibleGhiChuDonHang(!modalVisibleGhiChuDonHang);
      return;
    });
    
  }
  async function handleEndDonHangCon(){
    var today = new Date();
    var date =today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserTempEndLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    console.log(userTempEndLocation)
    axios.post(`http://14.160.26.131:8086/api/LoginRichyLogDelivery/Update_End_DonHangCon?maDonCon=${maDonCon.MaDonCon}&latEndReal=${userTempEndLocation.latitude}&longEndReal=${userTempEndLocation.longitude}&maNV=${KEY_STORAGE.USERNAME}&timeEnd=${date}&StatusDone=${chosenOption}`)
    .then(function (response) {
      console.log(response.data);
      if(response.data==true){
        setModalVisible(false)
        setShowButtons(false)
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      setShowButtons(true);
      setModalVisible(false)
      return;
    });
  }
  const moModalLyDoKetThuc = () => {
    setModalVisible(true)
    // setShowButtons(false)
  }
  return (
    <View style={{...StyleSheet.absoluteFillObject}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleGhiChuDonHang}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisibleGhiChuDonHang);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                backgroundColor: valueGhiChuDonHang,
                borderBottomColor: '#000000',
                borderBottomWidth: 1,
              }}>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={1000}
                onChangeText={text => onChangeTextGhiChuDonHang(text)}
                value={valueGhiChuDonHang}
                style={{padding: 10}}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonLuu]}
                onPress={handleNoteDonHangCon}>
                <Text style={styles.textStyle}>Lưu</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisibleGhiChuDonHang(!modalVisibleGhiChuDonHang)}>
                <Text style={styles.textStyle}>Đóng</Text>
              </Pressable>
            </View>
            
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Text style={{
                color: 'red',
                fontWeight: 'bold',
                textAlign: 'center',
                margin:10
              }}>Chọn lý do kết thúc</Text>
              <RadioForm
                radio_props={options}
                initial={0} //initial value of this group
                onPress={(value) => {
                  setChosenOption(value);
                }} //if the user changes options, set the new value
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonLuu]}
                onPress={handleEndDonHangCon}>
                <Text style={styles.textStyle}>Lưu</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Đóng</Text>
              </Pressable>
            </View>
            
          </View>
        </View>
      </Modal>
      {userLocation && (
        <MapView
          style={{...StyleSheet.absoluteFillObject}}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Đánh dấu vị trí người dùng */}
          <Marker coordinate={userLocation} title="Vị trí của bạn" pinColor={'#4d88d6'}/>
          {/* Đánh dấu địa điểm đích */}
          <Marker coordinate={destination} title="Địa điểm đích"/>

          {/* Đường dẫn từ vị trí người dùng đến địa điểm đích */}
          <Polyline
          coordinates={coordinates}
          strokeColor="#4d88d6"
          strokeWidth={4}
        />
        </MapView>
      )}
      <Button style={{backgroundColor:'#e41f28'}} title="Chỉ đường" onPress={handleGetDirections} />
      {showButtons && (
        <View style={styles.map}>
        </View>
      )}
      {showButtons && (
        <View style={styles.select}>
          <View style={styles.tienIch}>
                    <View style={styles.haiO}>
                        <View  style={styles.motO}>
                            <TouchableOpacity style={styles.nut}>
                                <Image style={styles.icon} source={require('../../assets/shoes.png')}></Image>
                                <View style={styles.text}>
                                    <Text>Activity</Text>
                                    <Text>Running</Text>
                                </View>
                                
                            </TouchableOpacity>
                        </View>
                        <View style={styles.motO}>
                            <TouchableOpacity style={styles.nut} onPress={() => setModalVisibleGhiChuDonHang(true)}>
                                <Image style={styles.icon} source={require('../../assets/notes.png')}></Image>
                                <View style={styles.text}>
                                    <Text>Ghi chú</Text>
                                    <Text>Đơn hàng</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.haiO}>
                        <View  style={styles.motO}>
                            <TouchableOpacity style={styles.nut}>
                                <Image style={styles.icon} source={require('../../assets/musical-note.png')}></Image>
                                <View style={styles.text}>
                                    <Text>Music</Text>
                                    <Text>None</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.motO}>
                            <TouchableOpacity style={styles.nut}>
                                <Image style={styles.icon} source={require('../../assets/volume.png')}></Image>    
                                <View style={styles.text}>
                                    <Text>Audio Stats</Text>
                                    <Text>5 min</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.start} onPress={moModalLyDoKetThuc}>
                    <Text style={{fontSize:15,letterSpacing:1.5,textAlign:'center',position:'relative',fontFamily:'OpenSans-SemiBold',color:'white'}}>Kết thúc</Text>
                </TouchableOpacity>
        </View>
      )}
      {!showButtons&&(
        <View style={{flex:1}}>
          <View style={{flex:8}}></View>
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity style={styles.start} onPress={handleStartDonHangCon}>
              <Text style={{fontSize:15,letterSpacing:1.5,textAlign:'center',position:'relative',fontFamily:'OpenSans-SemiBold',color:'white'}}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  map:{
      flex:3
  },
  select:{
      flex:2,
      flexDirection:'column',justifyContent:'flex-end',alignItems:'center',
      // width:'90%'
  },
  tienIch:{
      flex:3,
      width:'90%',
  },
  start:{
    flex:1,
    justifyContent:'center',
    width:'90%',
    backgroundColor:'#e41f28',
    height:50,
    marginBottom:12,
    borderRadius:20,
    marginTop:5
  },
  haiO:{
      flex:1,
      flexDirection: 'row',
      // width:'90%'
  },
  motO:{
      width:'100%',
      flex:1,
      backgroundColor:'white',
      margin:3,
      height:'90%'
  },
  icon:{
      flex:2,
      resizeMode: 'contain',
      width: '70%',
      height: '70%',
      
  },
  text:{
      flex:2,
      alignItems:'center',
      fontSize:15,letterSpacing:1.5,textAlign:'center',position:'relative',fontFamily:'OpenSans-SemiBold',
      color:'#e41f28'
  },
  nut:{
      flex:1,
      flexDirection: 'row',
      marginTop:8,
      
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width:350,
    height:290,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex:1,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    margin:10,
    backgroundColor: '#2196F3',
  },
  buttonLuu: {
    margin:10,
    backgroundColor: '#e41f28',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
export default MapDonCon;