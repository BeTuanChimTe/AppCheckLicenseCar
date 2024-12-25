import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView,Modal } from 'react-native';
import FastImage from 'react-native-fast-image';

function ShowAllImages({ navigation, route }) {
  const [dataTest, setDataTest] = useState([]);
  const item = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const xuLyDuLieu = () => {
    console.log(item);
  };
  const handleImagePress = (imageUri) => {
    console.log(imageUri)
    setSelectedImage(imageUri);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  const renderImageRow = (images) => {
    return (
      <View style={styles.imageRow}>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(images[index])}>
            <FastImage
              style={styles.image}
              source={{
                uri: image,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        ))}
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
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        {renderImageRow([item.Car.ImageCustIn1, item.Car.ImageCustIn2, item.Car.ImageCustIn3])}
      </View>
      {item.Car.TypeTake==="2" &&(
        <View style={styles.row}>
            {renderImageRow([item.Car.ImageCustOut1, item.Car.ImageCustOut2, item.Car.ImageCustOut3])}
        </View>
      )}
      
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>Trở lại</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    width: 120,
    height: 280,
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default ShowAllImages;
