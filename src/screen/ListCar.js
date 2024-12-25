import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image, SafeAreaView,ActivityIndicator, FlatList, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import filter from "lodash.filter";
import moment from 'moment';
import axios from 'axios';
import { KEY_STORAGE } from '../constants';
import IProgress from '../common/IProgress';
const DOMAIN_CONFIG_SELECT = "http://14.160.26.131:8086";

const ListCar = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  

  const [selectedImage, setSelectedImage] = useState(null);
  // useEffect(() =>{
  //   setIsLoading(true);
  //   fetchData(API_ENDPOINT);
  // },[]);
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
    console.log(data)
    setData(JSON.parse(data));
    setFullData(JSON.parse(data));
    setIsLoading(false);
    return { status, data}
  }
  const searchDataByDate = async()=>{
    
    setIsLoading(true);
    const formattedDate = moment(date).format('DD/MM/YYYY');
    let { status, data, token } = await LoadListCarByDate(formattedDate);
     
  }

  const onChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
    console.log(date);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const handleSearch = (query) =>{
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    
    const filteredData = filter(fullData, (user)=>{
      return contains(user, formattedQuery);
    })
    setData(filteredData);
  }
  const contains =  ({CarCode}, query)=>{
    
    const code = CarCode;
    if(code.includes(query)){
      return true;
    }
    return false;
  }
  // if(isLoading){
  //   return(
  //     <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
  //       <ActivityIndicator size={"large"} color="#5500dc"/>
  //     </View>
  //   );
  // }
  if(error){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>
          Kiểm tra kết nối !!!
        </Text>
      </View>
    )
  }

  const renderImageItem = ({ item,index }) => {
   
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Text style={styles.carCode}>{item.CarCode}</Text>
          <Text style={styles.carCode}>Vào: {moment(item.StartDate).format('HH:mm:ss')}</Text>
          {item.TypeTake === "2" && (<Text style={styles.carCode}>Ra: {moment(item.EndDate).format('HH:mm:ss')}</Text>)}
        </View>
        
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustIn1)}>
            <Image  source={{ uri: item.ImageCustIn1 }} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustIn2)}>
            <Image source={{ uri:item.ImageCustIn2}} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustIn3)}>
            <Image source={{ uri: item.ImageCustIn3 }} style={styles.image} />
          </TouchableOpacity>
        </View>
        {item.TypeTake === "2" && (<View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustOut1)}>
            <Image style={styles.image} source={{ uri: item.ImageCustOut1 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustOut2)}>
            <Image style={styles.image} source={{ uri: item.ImageCustOut2 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(item.ImageCustOut3)}>
            <Image style={styles.image} source={{ uri: item.ImageCustOut3 }} />
          </TouchableOpacity>
          {/* Add more TouchableOpacity components for other images */}
        </View>)}
      </View>
    );
  };
  const keyExtractor = (item) => item.ID_KEY;
  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
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
  return (
    <View style={styles.container}>
        <View style={styles.changDate}>
            <View style={styles.textDate}>
                <TouchableOpacity onPress={showDatepicker}>
                    <TextInput
                    style={styles.input}
                    placeholder="Chọn ngày"
                    value={date.toLocaleDateString()}
                    editable={false}
                    />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    />
                )}
            </View>
            <View style={styles.viewData}>
                <TouchableOpacity  onPress={searchDataByDate}>
                    <Image
                        style={{ width: 30, height: 30, margin: 10 }}
                          source={require("../../assets/magnifying-glass.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
        <SafeAreaView style={styles.textSearch}>
          <TextInput 
          placeholder='Tìm biển số xe' 
          clearButtonMode='always'
          autoCapitalize='none'
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(query) => handleSearch(query)}
          style={styles.searchBox}
          />
        </SafeAreaView>
        <View style={styles.dataGrid}>
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
          <Modal visible={selectedImage !== null} transparent={true}>
            <View style={styles.modalContainer}>
              {/* Background overlay */}
              <View style={styles.overlay}></View>

              {/* Content of the modal */}
              <View style={styles.modalContent}>
                <Image style={styles.modalImage} source={{ uri: selectedImage }} />
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        {isLoading ? <IProgress /> : null}
    </View>

  );
};

const styles = StyleSheet.create({
  textLeft:{
    color:'#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textTitleHeader:{
    color:'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewHeader:{
    width: '98%',
    marginLeft: '1%',
    backgroundColor:'blue',
  },
  textTitle:{
    color:'#000',
    fontWeight: 'bold',
    textAlign: 'center',
},
  scrollView:{
    width: '98%',
    marginLeft: '1%'
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
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  changDate:{
    flex: 1,
    flexDirection : 'row',
    margin : '2%'
  },
  textSearch:{
    flex:1,
    marginHorizontal:'4%'
  },
  dataGrid:{
    flex: 10,
  },
  textDate:{
    flex: 1,
  },
  viewData:{
    flex: 1,
  },
  searchBox:{
    paddingHorizontal:20,
    paddingVertical:10,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:8,
    fontWeight: 'bold'
  },
  // itemContainer:{
  //   flexDirection:"row",
  //   alignItems:"center",
  //   marginLeft:10,
  //   marginTop:10
  // },
  // image:{
  //   width:50,
  //   height:50,
  //   borderRadius:25
  // },
  textName:{
    fontSize:17,
    marginLeft:10,
    fontWeight:"600"
  },
  textEmail:{
    fontSize:14,
    marginLeft:10,
    color:"grey"
  },
  itemContainer: {
    marginBottom: 20,borderWidth: 1, marginHorizontal:'5%'
  },
  carCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom:'5%',
    
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Điều này tạo ra một overlay màu đen với độ trong suốt
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'absolute',
    width: '80%',
    height:'90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Nâng cao chất lượng đổ bóng cho Android
    shadowColor: '#000', // Màu đổ bóng
    shadowOffset: { width: 0, height: 2 }, // Độ dịch chuyển đổ bóng
    shadowOpacity: 0.3, // Độ trong suốt của đổ bóng
    shadowRadius: 5, // Độ lớn của đổ bóng
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListCar;
