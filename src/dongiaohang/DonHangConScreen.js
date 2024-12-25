import React , { useState, useEffect }from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { LoadDonHangConByDonHangTongCode } from '../services/APIServiceRichyDelivery';
const DonHangConScreen = ({ navigation,route }) => {
  const maDonTong= route.params;

  const [dataTest, setDataTest] = useState([]);
  useEffect(() => {
    console.log(dataTest)
    if(dataTest.length ==0) {
      loadData()
    }
  }, [dataTest]);
  async function loadData(){
    let { status, data, token } = await LoadDonHangConByDonHangTongCode(maDonTong.MaDonTong);
    setDataTest(data)
    console.log(dataTest)
  }




  const danhSachDonHangCon= [
    {
      "MaDonHangGiao": "SO260110223001",
      "ID_KEY": "83390267-6E15-48A5-A9ED-F91786E42624",
      "MaDonCon": "DCHOATHANH",
      "TenDonCon": "Đơn giao Hòa Thạnh",
      "Start": "2023-09-19 00:00:00.000",
      "End": "2023-09-25 00:00:00.000",
      "LatStart": null,
      "LongStart": null,
      "StatusDone": 0,
      "GhiChu": null,
      "LatEndReal": null,
      "LongEndReal": null,
      "CustName": "VIỆT HẰNG",
      "CustAddress": "237 Lý Tự Trọng",
      "User_id": 132936,
      "AmountTT1": 1710000,
      "Lat": 10.8263778686523,
      "Long": 106.605662448561
    },
    {
      "MaDonHangGiao": "SO2402202300003",
      "ID_KEY": "FA6E42B1-B737-4BE9-8726-F4A18DCE2161",
      "MaDonCon": "DCTAYTHANH",
      "TenDonCon": "Đơn giao Tây Thạnh",
      "Start": "2023-09-15 00:00:00.000",
      "End": "2023-10-15 00:00:00.000",
      "LatStart": null,
      "LongStart": null,
      "StatusDone": 0,
      "GhiChu": null,
      "LatEndReal": null,
      "LongEndReal": null,
      "CustName": "Hải Yến",
      "CustAddress": "268 Lương Thế Vinh",
      "User_id": 132371,
      "AmountTT1": 468000,
      "Lat": 10.7294308,
      "Long": 106.7233882
    },
    {
      "MaDonHangGiao": "SO260090523001",
      "ID_KEY": "87BDEF55-12D2-44D6-8911-AD84D8BB01EF",
      "MaDonCon": "DCHIEPTAN",
      "TenDonCon": "Đơn giao Hiệp Tân",
      "Start": "2023-09-20 00:00:00.000",
      "End": "2023-09-29 00:00:00.000",
      "LatStart": null,
      "LongStart": null,
      "StatusDone": 0,
      "GhiChu": null,
      "LatEndReal": null,
      "LongEndReal": null,
      "CustName": "Chú Trọng",
      "CustAddress": "212/228 Nguyễn Văn Nguyễn",
      "User_id": 132887,
      "AmountTT1": 81000,
      "Lat": 10.8263626098633,
      "Long": 106.605696659634
    }
  ]; // Nhận danh sách đơn hàng con từ màn hình trước

  // Hàm render mỗi mục trong danh sách đơn hàng con
  const renderDonHangConItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}
    onPress={() => {
      // Chuyển sang màn hình DonHangConScreen và truyền MaDonTong
      navigation.navigate('MapDonCon', { MaDonCon: item.maDonCon });
    }}>
      <Text style={styles.tenDonCon}>{item.tenDonCon}</Text>
      <Text style={styles.startEnd}>
        Bắt đầu: {item.start.split(' ')[0]} - Kết thúc: {item.end.split(' ')[0]}
      </Text>
      <Text style={styles.custAddress}>Địa chỉ: {item.custAddress}</Text>
      <Text style={styles.amount}>Số tiền: {item.amountTT1} Đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách đơn hàng con</Text>
      <FlatList
        data={dataTest}
        renderItem={renderDonHangConItem}
        keyExtractor={(item) => item.maDonHangGiao}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  tenDonCon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  startEnd: {
    fontSize: 14,
  },
  custAddress: {
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
  },
});

export default DonHangConScreen;
