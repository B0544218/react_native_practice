import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
// import Animation from 'lottie-react-native';

import firebase from '@firebase/app';
import '@firebase/auth';

export default class Execution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      execution_commission: undefined,
      currentLongitude: 'unknown', //Initial Longitude
      currentLatitude: 'unknown', //Initial Latitude
      permission: null,
      spinner: false
    };
  }
  //這頁面功能是要求定位的權限
  componentDidMount = () => {
    // this.animation.play();

    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/Volunteer')
      .once('value', snapshot => {
        if (snapshot.val().v == 1 || snapshot.val().v == 2) {
          Alert.alert('提醒', '此頁面必須有志工權限');
          this.props.navigation.navigate('SearchScreen');
        }
      });

    fetch('http://120.126.19.107:3000/Db_execution', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        var array = responseData.execution_data;
        var self_array = [];
        for (i in array) {
          if (array[i].server == firebase.auth().currentUser.uid) {
            self_array.push(array[i]);
          }
        }
        console.log('self_array');
        console.log(self_array);
        return self_array;
      })
      .then(self_commission => {
        if (self_commission.length) {
          var temp = self_commission[0].start_number;
          var commission = {};
          for (i in self_commission) {
            if (self_commission[i].start_number <= temp) {
              commission = self_commission[i];
              temp = self_commission[i].start_number;
            }
          }
          return commission;
        } else {
          return 0;
        }
      })
      .then(result => {
        //console.log(result);
        if (result) {
          this.setState({ execution_commission: result });
          console.log(this.state.execution_commission);
        }
      })
      .catch(err => console.log(err));
  };

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  };

  findCoordinates = () => {
    this.setState({ spinner: true });
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     console.log('entry');

    // const currentLongitude = JSON.stringify(position.coords.longitude);

    // const currentLatitude = JSON.stringify(position.coords.latitude);
    // //為了setState而已
    // this.setState({ currentLongitude: 1 });

    // this.setState({ currentLatitude: 1 });
    setTimeout(() => {
      if (this.state.execution_commission != undefined) {
        this.props.navigation.navigate('Fingerscreen', {
          contract_id: this.state.execution_commission,
          execution_end_number: this.state.execution_commission.end_number,
          execution_time: this.state.execution_commission.punch_time,
          execution_cooord: this.state.execution_commission.coordinate
        }); //成功得到權限才可以導向下一頁
      }
      this.setState({
        spinner: false
      });
    }, 1000);
    // }
    //   error => {
    //     this.setState({ spinner: false });
    //     if (error.message == 'No location provider available.') {
    //       alert('請確認是否開啟定位功能');
    //     } else {
    //       console.log(error.message);
    //       alert(error.message);
    //     }
    //   },
    //   { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
    // );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        {this.state.execution_commission ? (
          <Text>打卡結束時間 : {this.state.execution_commission.end_time}</Text>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white'
            }}
          >
            {/* <Animation
              ref={animation => {
                this.animation = animation;
              }}
              loop={false}
              style={{
                marginTop: '5%',
                width: 250,
                height: 250
              }}
              source={require('./../assets/1516-duck-och.json')}
            /> */}
            <Image
              style={{
                marginTop: '5%',
                width: Dimensions.get('screen').width,
                height: (Dimensions.get('screen').width * 254) / 659
              }}
              source={require('./404.png')}
            ></Image>
            <Text
              style={{
                marginTop: '10%',
                fontSize: 25,
                color: 'gray',
                fontWeight: 'bold'
              }}
            >
              找不到委託
            </Text>
          </View>
        )}
        {this.state.execution_commission ? (
          <TouchableOpacity onPress={this.findCoordinates}>
            <Text style={{ fontSize: 30, color: 'blue', fontWeight: 'bold' }}>
              開始打卡
            </Text>
          </TouchableOpacity>
        ) : null}

        {/** <Icon name="location" size={30} />*/}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16,
    backgroundColor: 'white'
  }
});
