import React, { useState,useEffect } from 'react';
import {ActivityIndicator, View, Text, TouchableOpacity, Image, StyleSheet, PermissionsAndroid,TextInput,LogBox,SafeAreaView, ScrollView,FlatList } from 'react-native';
import {ImagePicker,launchCamera} from 'react-native-image-picker';
import moment from 'moment';
import axios from 'axios';
import Buttons from '../login/Buttons';
import { KEY_STORAGE } from '../constants';
import { ShowAlert } from '../common/ShowAlert';
import IProgress from '../common/IProgress';
const DOMAIN_CONFIG_SELECT = "http://14.160.26.131:8086";
LogBox.ignoreLogs(['VirtualizedLists','Warning:...','ReactImageView: Image source "null" doesn\'t exist']);
const AddNew = ({navigation}) => {
  const [capture1, setCapture1] = useState();
  const [capture2, setCapture2] = useState();
  const [capture3, setCapture3] = useState();
  const [capture1FileName, setCapture1FileName] = useState();
  const [capture2FileName, setCapture2FileName] = useState();
  const [capture3FileName, setCapture3FileName] = useState();
  const [text, onChangeText] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [typeTake, setTypeTake] = useState(0);
  async function LoadListCarByDate(strDate) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://14.160.26.131:8086/api/CarLicensePlates/LoadCarLicenseOnOutHistory?userID=${KEY_STORAGE.USERNAME}&tranDate=${strDate}`,
      headers: { 
        'accept': 'application/json', 
        'Authorization': `Bearer ${KEY_STORAGE.TOKEN}`,
      }
    };
    let { status, data } = await axios.request(config);
    
    setData(JSON.parse(data));
    setFullData(JSON.parse(data));
    setIsLoading(false);
    
    return { status, data, token }
  }
  const searchDataByDate = async () => {
    setIsLoading(true);
    const currentDate = new Date();
    const formattedDate = moment(currentDate).format('DD/MM/YYYY');
    try {
      const { status, data, token } = await LoadListCarByDate(formattedDate);
      
      // Xử lý kết quả tùy thuộc vào yêu cầu
    } catch (error) {
      // Xử lý lỗi
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    searchDataByDate();    
  }, []);
  const handleInputChange = (text) => {
    onChangeText(text);
    // const tempData = JSON.parse(fullData);
    // // Thực hiện các xử lý khác ở đây nếu cần
    // const carInfo = tempData.find(item => item.CarCode === text);
    // if (carInfo) {
    //   console.log('Car Information:', carInfo);
    //   if(carInfo.TypeTake==="1"){
    //     console.log(carInfo.ImageCustIn1)
    //     setCapture1(carInfo.ImageCustIn1);
    //     setCapture2(carInfo.ImageCustIn2);
    //     setCapture3(carInfo.ImageCustIn3);
    //   }
    //   else{
    //     setCapture1(carInfo.ImageCustOut1);
    //     setCapture2(carInfo.ImageCustOut2);
    //     setCapture3(carInfo.ImageCustOut3);
    //   }
    // } else {
    //   console.log('Car not found!');
    //   setCapture1(null);
    //   setCapture2(null);
    //   setCapture3(null);
    // }
    console.log(data)
    console.log(fullData)
  };
  let options = {
    saveToPhotos : true,
    mediaType : 'photo'
  }
  const openCamera = async (temp) =>{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if(text){
      if(granted === PermissionsAndroid.RESULTS.GRANTED ){
        await launchCamera(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker '+temp);
          } else if (response.error) {
            console.log('ImagePicker Error '+temp+': ', response.error);
          } else {
            if(response.errorCode == 'camera_unavailable'){
              ShowAlert('Không tìm thấy camera: camera unavailable');
            }
            else {
              if(temp === 1){
                setCapture1(response.assets[0].uri)
                setCapture1FileName(response.assets[0].fileName)
                console.log(response)
              }
              if(temp === 2){
                setCapture2(response.assets[0].uri)
                setCapture2FileName(response.assets[0].fileName)
                console.log(response)
              }
              if(temp === 3){
                setCapture3(response.assets[0].uri)
                setCapture3FileName(response.assets[0].fileName)
                console.log(response)
              }
              console.log('ok ');
              // this._ShowImageText(response.assets[0], 3);
            }
          }
        },
        )
        //const result = await launchCamera(options);
        //console.log(result)
        // if(result.didCancel!==true){
          
        // }
        // console.log(result)
      }
    }
    else{
      ShowAlert('Vui lòng nhập biển số xe !!');
      return;
    }
  }
  const saveImage= async()=>{
    setIsLoading(true);
    //console.log(capture1)
    //console.log(capture2)
    //console.log(capture3)
    if(text){
      if(capture1||capture2||capture3){
        const formData = new FormData();
        //formData.append("Files","");
        formData.append("CarCode", text);
        formData.append("UserID", KEY_STORAGE.USERNAME);
        formData.append("TypeTake", "");
        
          if (capture1) {
            formData.append("Files", {
              uri: capture1,
              type: "image/jpeg",
              name: '1_' + text + '_' + capture1FileName,
            });
          }
          if (capture2) {
            formData.append("Files", {
              uri: capture2,
              type: "image/jpeg",
              name: '2_' + text + '_' + capture2FileName,
            });
          }
          if (capture3) {
            formData.append("Files", {
              uri: capture3,
              type: "image/jpeg",
              name: '3_' + text + '_' + capture3FileName,
            });
          }
        
        
        console.log(JSON.stringify(formData));
        const baseURL = 'http://14.160.26.131:8086/api/CarLicensePlates/SaveCarLicenseOnOut';
        let headerConfig = {
          method: 'post',
          headers: { 
            'accept': 'application/json', 
            'Authorization': `Bearer ${KEY_STORAGE.TOKEN}`,
            'Content-Type': 'multipart/form-data', 
          },
          body:formData
        };
        await fetch(baseURL, headerConfig)
        .then((response) => response.json())
        .then((data) => {
          var test = JSON.parse(data)
          console.log(test[0].code)
          if(test[0].code==="1"){
            onChangeText('');
            setCapture1(null);
            setCapture2(null);
            setCapture3(null);
            ShowAlert(test[0].mess);
            setIsLoading(false);
          }
            
        })
        .catch(console.error);
        await searchDataByDate();
        // if(status===200){
        //   await searchDataByDate();
        //   onChangeText('');
        //   setCapture1(null);
        //   setCapture2(null);
        //   setCapture3(null);

        // }
        
        // return {status, data};
      }
      else{
        ShowAlert('Vui lòng chụp hình !');
        setIsLoading(false);
      }
    }
    else{
      ShowAlert('Vui lòng nhập biển số xe !!');
      setIsLoading(false);
    }
  }
  const showAllImage = (item)=>{
    navigation.navigate('ShowAllImages', { Car: item });
  }
  itemReportSellCust = ({ item, index }) => {
    return (
        <TouchableOpacity onPress={() => showAllImage(item)}>
            <View style={styles.scrollView}>
                <View style={styles.viewRow}>
                    <View style={styles.viewCol1}><Text style={styles.textTitle}>{item.STT}</Text></View>
                    <View style={styles.viewCol2}><Text style={styles.textLeft}>{item.CarCode}</Text></View>
                    <View style={styles.viewCol3}><Text style={styles.textTitle}>{item.TimeIn}</Text></View>
                    <View style={styles.viewCol3}><Text style={styles.textTitle}>{item.TimeOut}</Text></View>
                </View>
            </View>
        </TouchableOpacity>
        
    )
  } 
  // if(isLoading){
  //   return(
  //     // <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
  //     //   <ActivityIndicator size={"large"} color="#5500dc"/>
  //     // </View>
  //     <IProgress/>
  //   );
  // }
  return(
    <SafeAreaView style= {styles.container}>
      <ScrollView contentContainerStyle={{flexGrow:1,
        alignItems:'left'
        
        }}
        stickyHeaderIndices={[0]}>
        <View style={styles.scrollViewHeader}>
          <View style={styles.viewRow}>
            <View style={styles.viewCol1}><Text style={styles.textTitleHeader}>STT</Text></View>
            <View style={styles.viewCol2}><Text style={styles.textTitleHeader}>Biển số xe</Text></View>
            <View style={styles.viewCol3}><Text style={styles.textTitleHeader}>Vào</Text></View>
            <View style={styles.viewCol3}><Text style={styles.textTitleHeader}>Ra</Text></View>
          </View>
        </View>
        
          <View style={{flex: 1}}>
                    <FlatList horizontal={false}
                        data={data}
                        renderItem={itemReportSellCust}
                        keyExtractor={item => item.ID_KEY}
                    />
                </View>
      </ScrollView>
      <ScrollView contentContainerStyle={{flexGrow:2,
        alignItems:'center',maxHeight: 1000
        }}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Nhập biển số xe"
            onChangeText={handleInputChange}
            value={text}
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => openCamera(1)} disabled={typeTake === 1} style={styles.touchImage}>
            <Image source={capture1? {uri: capture1} : require('../../assets/cameraPhoto_128.png')} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openCamera(2)} disabled={typeTake === 1} style={styles.touchImage}>
            <Image source={capture2? {uri: capture2} : require('../../assets/cameraPhoto_128.png')} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openCamera(3)} disabled={typeTake === 1} style={styles.touchImage}>
            <Image source={capture3? {uri: capture3} : require('../../assets/cameraPhoto_128.png')} style={styles.image}/>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Buttons btn_text={"Gửi"} on_press={()=>saveImage()}/>
        </View>
        {isLoading ? <IProgress /> : null}
      </ScrollView>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  dataGrid:{
    flex: 10,
  },
  container:{
    flex:1,
    alignItems:'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    height: '70%',
    margin: '3%',
    borderWidth: 1,
    width:'80%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
  },
  image: {
    width: '98%',
    height: 100,
  },
  touchImage:{
    width: '30%',
    height: 200,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  textLeft:{
    color:'#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textTitle:{
    color:'#000',
    fontWeight: 'bold',
    textAlign: 'center',
},
textLeftHeader:{
  color:'white',
  fontWeight: 'bold',
  textAlign: 'left',
},
textTitleHeader:{
  color:'white',
  fontWeight: 'bold',
  textAlign: 'center',
},
  scrollView:{
    width: '98%',
    marginLeft: '1%'
},
scrollViewHeader:{
  width: '98%',
  marginLeft: '1%',
  backgroundColor:'blue',
},
viewRow: {
    flexDirection: 'row',
    width: '100%',
},
  viewCol1:{
    width: '10%',
    textAlign:'center',
    borderWidth: 0.5,
  },
  viewCol2:{
      width: '50%',
      borderWidth: 0.5,
  },
  viewCol3:{
      width: '20%',
      borderWidth: 0.5,
  },
});
export default AddNew;