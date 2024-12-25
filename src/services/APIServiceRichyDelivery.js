import axios from 'axios';
import { KEY_STORAGE, DOMAIN_CONFIG_SELECT, DOMAIN_CONFIG_INSERT } from '../constants/index';
// import { ShowAlert } from '../components/common/ShowAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.timeout = 100000;
let base64 = require("base-64");
const usernameAPI = 'Logistic';
const passwordAPI = '30ad4fe6b2a6aeed';
const token = "Basic " + base64.encode(usernameAPI + ":" + passwordAPI);
//-------------------- Login
export async function LoginRichyDelivery(strUser, strPass, strDevice, strVersion) {
  try {
    const baseURL = DOMAIN_CONFIG_SELECT + '/api/LoginRichyLogDelivery/LoginRichyLogDelivery';
    let { status, data } = await axios.get(`${baseURL}?strUser=${strUser}&strPass=${strPass}`);
    return { status, data, token }
    } catch (error) {
      return {
        status: error
      }
    }
}
export async function LoadDonHangTongBySaleCode(strUser) {
  try {
    const baseURL = DOMAIN_CONFIG_SELECT + '/api/LoginRichyLogDelivery/LoadDonHangTongBySaleCode';
    let { status, data } = await axios.get(`${baseURL}?strUser=${strUser}`);
    return { status, data, token }
    } catch (error) {
      return {
        status: error
      }
    }
}
export async function LoadDonHangConByDonHangTongCode(strMaDonTong) {
  try {
    const baseURL = DOMAIN_CONFIG_SELECT + '/api/LoginRichyLogDelivery/LoadDonHangConByDonHangTongCode';
    let { status, data } = await axios.get(`${baseURL}?maDonHangTong=${strMaDonTong}`);
    return { status, data, token }
    } catch (error) {
      return {
        status: error
      }
    }
}
export async function LoadDonHangConByDonHangConCode(strMaDonCon) {
  try {
    const baseURL = DOMAIN_CONFIG_SELECT + '/api/LoginRichyLogDelivery/LoadDonHangConByDonHangConCode';
    let { status, data } = await axios.get(`${baseURL}?maDonHangCon=${strMaDonCon}`);
    return { status, data, token }
    } catch (error) {
      return {
        status: error
      }
    }
}