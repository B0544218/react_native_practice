import React from 'react';
import {
  PermissionsAndroid,
  BackHandler,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert
} from 'react-native';
import Mail from 'react-native-vector-icons/Feather';
import Pw from 'react-native-vector-icons/Fontisto';
console.log('in Login');

import firebase from '@firebase/app';
import '@firebase/database';

import '@firebase/auth';
import PushNotification from 'react-native-push-notification-ce';

//import '@firebase/storage';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('firstLogin is false');
    window.firstlogin = false;
    this.state = {
      UserName: '',
      Password: '',
      testText: 0
    };
  }

  componentDidMount() {
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location'
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission enable');
        } else {
          BackHandler.exitApp();
        }
      } catch (err) {
        // alert('err', err);

        console.warn(err.message);
      }
    }
    requestLocationPermission();
  }
  returnUid = uid => {
    console.log(uid);
  };

  handlerChangeUserName = text => {
    this.setState(prevState => ({
      UserName: text
    }));
  };

  handlerChangePassword = text => {
    this.setState(prevState => ({
      Password: text
    }));
  };

  handlerSubmit = () => {
    this.setState({
      testText: this.state.testText + 1
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.UserName, this.state.Password)
      .then(user => {
        //  if (firebase.auth().currentUser.emailVerified)
        //{
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid)
          .once('value', snapshot => {
            window.firstlogin = true;
            console.log('firstlogin : ' + window.firstlogin);
          })
          .then(() => {
            this.returnUid(firebase.auth().currentUser.uid);
          })
          .then(() => {
            PushNotification.configure({
              // (optional) Called when Token is generated (iOS and Android)
              onRegister: function(token) {
                fetch('http://120.126.19.107:3000/update_token', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    uid: firebase.auth().currentUser.uid,
                    token: token.token
                  })
                })
                  .then(response => response.json())
                  .catch(err => console.log(err));
              },
              senderID: '598675977698'
            });
            this.props.navigation.navigate('drawer');
          });
        // }
        /*  else {
          Alert.alert("提醒", "登入失敗\n該帳號尚未驗證");
          console.log("登入失\n該帳號尚未驗證");
        }*/
      })

      .catch(error => {
        console.log('登入失敗  帳號or密碼錯誤');
        if (error.message == 'The email address is badly formatted.') {
          Alert.alert('提醒', '請確認帳號(email)格式是否正確');
          console.log('請確認帳號(email)格式是否正確');
        } else if (
          error.message ==
          'There is no user record corresponding to this identifier. The user may have been deleted.'
        ) {
          Alert.alert('提醒', '無法識別該帳戶\n請確認帳號是否正確');
          console.log('無法識別該帳戶\n請確認帳號是否正確');
        } else if (
          error.message ==
          'The password is invalid or the user does not have a password.'
        ) {
          Alert.alert('提醒', '密碼錯誤 請重新輸入');
          console.log('密碼錯誤 請重新輸入');
        } else if (
          error.message ==
          'A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
        ) {
          //可能因為host的時間不對
          Alert.alert('提醒', '網路異常 無法登入');
          console.log('網路異常 無法登入');
        } else {
          Alert.alert('提醒', '登入錯誤 : \n' + error);
          console.log(error);
        }
      });
  };
  handlerRegister = () => {
    console.log('register');
    this.setState({
      testText: this.state.testText + 1
    });
    this.props.navigation.navigate('register');
  };
  render() {
    const m = <Mail name="mail" size={18} />;
    const pw = <Pw name="locked" size={18} />;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="position">
          <ImageBackground
            source={require('./kid.jpg')}
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width
            }}
            imageStyle={{ opacity: 0.95 }}
          >
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <View style={{ height: '15%' }}></View>
              {/**
                 <View style={{ height: "15%" }}>
               <Text
                  style={{
                    fontSize: 40,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "black"
                  }}
                >
                  LOGIN
                </Text> 
                
                 */}

              <View style={{ height: '5%' }}></View>
              <View style={{ alignItems: 'center', height: '45%' }}>
                <View style={styles.textinput}>
                  <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
                    {m}
                  </View>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholderTextColor="gray"
                    placeholder="Gmail、Yahoo等常用信箱"
                    keyboardType="email-address"
                    onChangeText={this.handlerChangeUserName}
                  />
                </View>
                <View style={styles.textinput}>
                  <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
                    {pw}
                  </View>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholderTextColor="gray"
                    placeholder="填寫密碼"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    onChangeText={this.handlerChangePassword}
                  />
                </View>
                <View style={{ marginTop: '10%' }}></View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handlerSubmit}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    登入
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: '15%' }}></View>

              <View style={{ height: '20%' }}>
                <TouchableOpacity onPress={this.handlerRegister}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: '10%'
                    }}
                  >
                    沒有帳號? 去註冊
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  textinput: {
    opacity: 0.85,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

    height: Dimensions.get('window').height * 0.08,
    borderRadius: 7,
    width: Dimensions.get('window').width * 0.85,
    marginTop: 35
  },
  button: {
    backgroundColor: '#F75000',
    justifyContent: 'center',
    //opacity: 0.895,
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.08,
    borderRadius: 7,
    width: Dimensions.get('window').width * 0.35,
    marginTop: 35
  }
});
