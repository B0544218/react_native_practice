import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  AppState,
  Alert
} from 'react-native';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './fingerApp/Application.container.styles';
import FingerprintPopup from './fingerApp/FingerprintPopup.component';
// import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Entypo';

import CountDown from 'react-native-countdown-component';
import Modal from 'react-native-modal';
export default class Finger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contract_id: '',
      execution_commission: {},
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
      countdown: 0,
      visible: false,
      punch_in_time: [],
      punch_in_coord: [],
      currentLongitude: 'unknown', //Initial Longitude
      currentLatitude: 'unknown', //Initial Latitude
      map_Longitude: 0,
      map_Latitude: 0
    };
  }

  popup_write_ButtonVisible = () => {
    this.setState({ popupShowed: false, visible: true });
  };

  handleFingerprintShowed = () => {
    this.setState({
      popupShowed: true,
      visible: false
    });
  };

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false, visible: false });
  };
  componentDidMount() {
    var contract = this.props.navigation.getParam('contract_id');
    this.setState({ contract_id: contract.contract_id });
    //下面fetch是為了取得punch_in_time 和 經緯度   genymotion 10.0.3.2
    fetch('http://120.126.19.107:3000/Db_FindContract', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contract_id: contract.contract_id
      })
    })
      .then(response => response.json())
      .then(responseJsonData => {
        //console.log(responseJsonData.contract);
        console.log('剩餘多少毫秒 : ');
        console.log(responseJsonData.timer);
        console.log('經緯度資料 : ');
        console.log(responseJsonData.coordinate);
        console.log('打卡時間資料 : ');
        console.log(responseJsonData.time);

        if (responseJsonData.time.length == 0) {
          console.log('第一次打卡');
          this.setState({ countdown: 0, visible: true });
        } else {
          console.log('之前打卡過');
          if (responseJsonData.timer >= 1) {
            this.setState({
              countdown: responseJsonData.timer,
              punch_in_time: responseJsonData.time,
              punch_in_coord: responseJsonData.coordinate,
              visible: false
            });
          } else {
            this.setState({
              countdown: responseJsonData.timer,
              punch_in_time: responseJsonData.time,
              punch_in_coord: responseJsonData.coordinate,
              visible: true
            });
          }
        }
        return responseJsonData;
      })
      .then(responseJsonData => {
        if (
          responseJsonData.current_time_of_end >=
          parseInt(this.props.navigation.getParam('execution_end_number'))
        ) {
          Alert.alert('提醒', '超過期限');
          this.props.navigation.navigate('During');
        }
      })
      .catch(error => {
        console.log(error);
      });

    AppState.addEventListener('change', this.handleAppStateChange);
    // Get initial fingerprint enrolled
    this.detectFingerprintAvailable();

    //punch_in_time的資料必須透過fetch來找先前打卡資訊
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  detectFingerprintAvailable = () => {
    FingerprintScanner.isSensorAvailable().catch(error =>
      this.setState({ errorMessage: error.message, biometric: error.biometric })
    );
  };

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  };

  findCoordinates = () => {
    console.log('+++++++++++++++++++++++++++++');
    console.log('entry findCoordinates');
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('entry geolocation');
        console.log('**************************************');

        const currentLongitude = JSON.stringify(position.coords.longitude);

        const currentLatitude = JSON.stringify(position.coords.latitude);
        // this.setState({ currentLongitude: currentLongitude });

        // this.setState({ currentLatitude: currentLatitude });
        fetch('http://120.126.19.107:3000/Db_Insert_CoordTime', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contract_id: this.state.contract_id,
            Longitude: currentLongitude,
            Latitude: currentLatitude,
            contractEnd: this.props.navigation.getParam('execution_end_number'),
            time: this.state.punch_in_time,
            coord: this.state.punch_in_coord
          })
        })
          .then(response => response.json())
          .then(responseJsonData => {
            if (responseJsonData.end_execute) {
              console.log('entry fetch');
              this.setState({
                punch_in_time: responseJsonData.time,
                punch_in_coord: responseJsonData.coordinate
              });
              console.log('contract_end');
              Alert.alert('提醒', '時間結束');
              // this.props.navigation.navigate('During');
            } else {
              console.log(responseJsonData.current_wait);
              this.setState({
                countdown: responseJsonData.current_wait,
                punch_in_time: responseJsonData.time,
                punch_in_coord: responseJsonData.coordinate,
                visible: false
              });
              console.log(responseJsonData.time);
              console.log(responseJsonData.coordinate);
            }

            return responseJsonData;
          })
          .catch(error => {
            console.log(error);
          });
      },
      error => {
        this.setState({ visible: true });
        if (error.message == 'No location provider available.') {
          Alert.alert('提醒', '請確認是否開啟定位功能');
        } else {
          console.log(error.message);
          Alert.alert('提醒', error.message);
        }
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    const { errorMessage, biometric, popupShowed } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>計時 指紋辨識打卡</Text>
        {errorMessage && (
          <Text style={styles.errorMessage}>
            {errorMessage} {biometric}
          </Text>
        )}
        <CountDown
          //parseInt(目前時間-結束時間)
          until={this.state.countdown}
          size={30}
          onFinish={() => {
            //alert('開始工作');
            this.setState({
              countdown: 0,
              visible: true
            });
          }}
          digitStyle={{ backgroundColor: '#FFF' }}
          digitTxtStyle={{ color: 'black' }}
          timeToShow={['M', 'S']}
          timeLabels={{ m: 'MM', s: 'SS' }}
        />
        {this.state.visible ? (
          <TouchableOpacity
            style={styles.fingerprint}
            onPress={this.handleFingerprintShowed}
            disabled={!!errorMessage}
          >
            <Icon name="fingerprint" size={90} color="white" />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              點我開始打卡
            </Text>
            {/* <Image
              style={{ width: 100, height: 100 }}
              source={require('./finger_print.png')}
              // source={{
              //   uri:
              //     'https://lh3.googleusercontent.com/-KxyzzKstTLBwrXH7BG5IjVivBSk3W7E1MoxKracYfYL83S77MnHtgtSnM3fnuvbx1dgHHtcXybwf_dPuwnGkpRl620NBnNEsZbNLfWDQCtz5srO0tfcZ5xn_AWWBTAqIzhYVFS-YpJww5FpsX3NqqskVhFELB7fM43mD3padCzX23jAo9nkubD4P5L6tq-VMiQFWwhI5hxEIdmXR92LwZAnddZ0mEH9lU134JCyrpXkqS2UlCoqPP0oG5b5pSAJvo6vNOFldW6x61y3WHhB1miv-UfkYyk2J7PMNA0aV6lK7mt1vWPyHA8tqqAf8C_8fc67v2xNfugsBSlmZBVbJvSaAVMt2u6C_V68WBYNFN_ASXy8ITe4cdHQvwIbyejSe9AbHPKxqIxNGMsvwz_p9Auhgyyl3b3jfWQT9cGWbFMqvHfpEjo4kZxwBf2vS-xI2gYaCSLZYl04ReWFQuGUViG78iCoCAV3JCOxxVfGG6fp1Oi5XoZzBa9B81q3vK6nPjhiGLcVeSDJcODS6RZyK1vPkTEeiRtrwdnx7A4qA5e8XE3AanGp6t2bw2wqYzLjfKRUV_u5qLW9wth1JKhSSrePQg9Da3MEwi479tzMcaCKlE1JmmdmpPntVTBNsOi_lrcFUPJm9Nui6b4R3UvgAk-omfnL_TcxbwTixPo9WOdjOdFJ9nGQVd4=s85-no'
              // }}
            /> */}
          </TouchableOpacity>
        ) : null}
        {this.state.punch_in_time.map(function(item, index) {
          return (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Text>{item.time_string.replace('(GMT+08:00)', '')}</Text>
            </View>
          );
          // return <Text key={index}>{item.time_string}</Text>;
        })}

        {popupShowed && (
          <FingerprintPopup
            style={styles.popup}
            contract_id={
              this.props.navigation.getParam('contract_id').contract_id
            }
            locate={this.findCoordinates}
            backTo={this.popup_write_ButtonVisible}
            handlePopupDismissed={this.handleFingerprintDismissed}
          />
        )}
      </View>
      /*
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Finger</Text>
        <Text>{this.state.execution_commission.start_date}</Text>
        <Text>{this.state.execution_commission.start_time}</Text>
      </View>
      */
    );
  }
}
