import React, { Component } from 'react';
import { Alert } from "react-native";

export function ShowAlert(strMsg){
    Alert.alert( 'THÔNG BÁO!', strMsg,
      [
        {
          text:  'Đóng',
          style: "cancel",
        },
      ],
    );
}

export function ShowAlertTitle(strTitle, strMsg){
    Alert.alert(strTitle, strMsg,
      [
        {
          text: 'Đóng',
          style: "cancel",
        },
      ],
    );
}