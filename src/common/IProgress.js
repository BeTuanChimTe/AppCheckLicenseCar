import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, SafeAreaView, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

class IProgress extends Component {
  render() {
    return (
      <SafeAreaView style={stylesProgress.root}>
        <ActivityIndicator
            size='large'
            color="blue"
            // color='#003F7F'
        />
        <Text style={stylesProgress.indicatorText}>Loading data...</Text>
      </SafeAreaView>
    );
  }
}

const stylesProgress = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
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
  indicatorText:{
    fontSize: 20,
    color: 'blue',
    marginLeft: 'auto',
    marginRight: 'auto',
    
  },
  
});

export default IProgress;