// DonHangTongScreen.js
import { KEY_STORAGE } from '../constants';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { LoadDonHangTongBySaleCode } from '../services/APIServiceRichyDelivery';
function DonDatHang({ navigation }) {
  // Danh sách các đơn hàng tổng
  const [dataTest, setDataTest] = useState([]);
  useEffect(() => {
    console.log(dataTest)
    if(dataTest.length ==0) {
      loadData()
    }
  }, [dataTest]);
  async function loadData(){
    let { status, data, token } = await LoadDonHangTongBySaleCode(KEY_STORAGE.USERNAME);
    setDataTest(data)
    console.log(dataTest)
  }
  const donHangTongList = [
    {
      "ID_KEY": "428CA3D9-C26D-4A50-BC65-3043E6508BAE",
      "MaDonTong": "DTTANPHU",
      "TenDonTong": "ĐƠN GIAO HÀNG TÂN PHÚ",
      "DriverCode": "NV001",
      "Start": "2023-09-01 00:00:00.000",
      "End": "2023-09-30 00:00:00.000",
      "Status": 0,
      "CarNumber": "59V3-38582"
    },
    {
      "ID_KEY": "428CA3D9-C26D-4A50-BC65-3043E6508",
      "MaDonTong": "DTTANPHU",
      "TenDonTong": "ĐƠN GIAO HÀNG TÂN PHÚ",
      "DriverCode": "NV001",
      "Start": "2023-09-01 00:00:00.000",
      "End": "2023-09-30 00:00:00.000",
      "Status": 0,
      "CarNumber": "59V3-38582"
    },
    {
      "ID_KEY": "428CA3D9-C26D-4A50-BC65-3043E6508B",
      "MaDonTong": "DTTANPHU",
      "TenDonTong": "ĐƠN GIAO HÀNG TÂN PHÚ",
      "DriverCode": "NV001",
      "Start": "2023-09-01 00:00:00.000",
      "End": "2023-09-30 00:00:00.000",
      "Status": 0,
      "CarNumber": "59V3-38582"
    },
    {
      "ID_KEY": "428CA3D9-C26D-4A50-BC65-3043E6508BA",
      "MaDonTong": "DTTANPHU",
      "TenDonTong": "ĐƠN GIAO HÀNG TÂN PHÚ",
      "DriverCode": "NV001",
      "Start": "2023-09-01 00:00:00.000",
      "End": "2023-09-30 00:00:00.000",
      "Status": 0,
      "CarNumber": "59V3-38582"
    },
    // Thêm các đơn hàng tổng khác vào đây
  ];
  
  return (
    <View>
      {dataTest&&dataTest.map((donHangTong) => (
        <TouchableOpacity style={styles.container} 
        key={donHangTong.iD_KEY}
        onPress={() => {
          // Chuyển sang màn hình DonHangConScreen và truyền MaDonTong
          navigation.navigate('DonHangConScreen', { MaDonTong: donHangTong.maDonTong });
        }}>
          <View style={styles.header}>
            <Text style={styles.tenDonTong}>{donHangTong.tenDonTong}</Text>
            <Text style={styles.driverCode}>{donHangTong.driverCode}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.date}>Start: {donHangTong.start}</Text>
            <Text style={styles.date}>End: {donHangTong.end}</Text>
            <Text style={styles.status}>Status: {donHangTong.status === 0 ? 'Chưa hoàn thành' : 'Hoàn thành'}</Text>
            <Text style={styles.carNumber}>Số xe: {donHangTong.carNumber}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tenDonTong: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverCode: {
    fontSize: 16,
    color: '#888',
  },
  details: {
    marginTop: 12,
  },
  date: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    color: '#4CAF50', // Màu xanh lá cây cho trạng thái hoàn thành
  },
  carNumber: {
    fontSize: 14,
    marginTop: 8,
  },
});
export default DonDatHang;
