import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert
} from 'react-native';
import People from 'react-native-vector-icons/Ionicons';
import Mail from 'react-native-vector-icons/Feather';
import Animation from 'lottie-react-native';
import Pw from 'react-native-vector-icons/Fontisto';

// import TextInputt from './components/InputWithIcons/index';
// import Button from 'apsl-react-native-button';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
import '@firebase/storage';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      name: '',
      loading: true
      //phone: ''
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
  }
  handlerChangeUserName = text => {
    this.setState(prevState => ({
      Email: text
    }));
  };

  handlerChangePassword = text => {
    this.setState(prevState => ({
      Password: text
    }));
  };

  handlerChangeName = text => {
    this.setState({ name: text });
  };

  handlerSubmit = () => {
    if (this.state.loading != false) {
      if (
        this.state.name == '' ||
        this.state.Password == '' ||
        this.state.Email == ''
      ) {
        Alert.alert('提醒', '請輸入全部資料');
      } else {
        this.setState({ loading: false });

        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
          .then(success => {
            console.log(success);

            firebase
              .auth()
              .currentUser.sendEmailVerification()
              .then(success => {
                console.log(success);
              })
              .then(() => {
                firebase
                  .database()
                  .ref('users/' + firebase.auth().currentUser.uid)
                  .set({
                    //be_appointed: { demand: 'null' }, //push
                    //user_like: null, //push,
                    Volunteer: { v: 1 }, //之前較publish
                    //contract: { client: { c: 'null' }, server: { s: 'null' } }, //push
                    user_data: {
                      name: this.state.name, //set
                      grade: 0,
                      service_times: 0,
                      // address: { ad: '' }, //set
                      password: this.state.Password, //no change
                      uid: firebase.auth().currentUser.uid,
                      mail: this.state.Email,
                      language: '中文',
                      phone: '',
                      region: '', // 用fetch之後如果mongo有volunteer的話
                      service_item: [false, false, false, false, false],
                      introduction: '', //set
                      image:
                        'https://cdn.unwire.hk/wp-content/uploads/2014/10/facebook-user.jpg'
                    }
                  })

                  .then(() => {
                    console.log('Data is saved!');
                    this.props.navigation.navigate('login');
                  })
                  .then(() => {
                    console.log('register fetch');
                    fetch('http://120.126.19.107:3000/register', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        uid: firebase.auth().currentUser.uid,
                        // name: this.state.name,
                        image:
                          'https://cdn.unwire.hk/wp-content/uploads/2014/10/facebook-user.jpg',
                        email: this.state.Email,
                        points: 0
                      })
                    })
                      .then(response => response.json())
                      .then(responseData => {
                        console.log(responseData.answer);
                      })
                      .catch(err => {
                        this.setState({ loading: true });
                        //alert('伺服器異常 請稍後確認');
                        console.log('伺服器異常 請稍後確認');
                        console.log(err);
                      });
                  })
                  .catch(e => {
                    this.setState({ loading: true });
                    console.log('錯誤1');
                    console.log('Failed.', e);
                  });
              })
              .catch(error => {
                this.setState({ loading: true });
                console.log('錯誤2');
                Alert.alert('提醒', '寄發email失敗');
                console.log('寄發email失敗');
                console.log(error);
              });
          })
          .catch(error => {
            this.setState({ loading: true });
            console.log('錯誤3');
            if (error.message == 'The email address is badly formatted.') {
              Alert.alert('提醒', '帳號(email)不符合格式');
              console.log('帳號(email)不符合格式');
            } else if (
              error.message == 'The password must be 6 characters long or more.'
            ) {
              Alert.alert('提醒', '密碼需至少6個字');
              console.log('密碼需至少6個字');
            } else if (
              error.message ==
              'A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
            ) {
              Alert.alert('提醒', '網路異常 無法註冊');
              console.log('網路異常 無法註冊');
            } else if (
              error.message ==
              'The email address is already in use by another account.'
            ) {
              Alert.alert('提醒', '此帳號已經被註冊過');
              console.log('此帳號已經被註冊過');
            } else {
              Alert.alert('提醒', '註冊錯誤 :\n' + error);
              console.log(error);
            }
          });
      }
    }
  };

  render() {
    const m = <Mail name="mail" size={18} />;
    const pw = <Pw name="locked" size={18} />;
    const people = <People name="md-person" size={18} />;

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
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ height: '10%' }}>
                {/**   <Text
                  style={{
                    fontSize: 30,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "black"
                  }}
                >
                  註冊一個新帳號
                </Text>*/}
              </View>
              <View style={{ height: '45%' }}>
                <View style={styles.textinput}>
                  <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
                    {people}
                  </View>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholderTextColor="gray"
                    maxLength={4}
                    placeholder="真實姓名"
                    keyboardType="default"
                    onChangeText={this.handlerChangeName}
                  />
                </View>
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
                    secureTextEntry={true}
                    placeholder="填寫密碼"
                    onChangeText={this.handlerChangePassword}
                  />
                </View>
              </View>
              <View style={{ height: '25%' }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handlerSubmit}
                >
                  <Text
                    style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}
                  >
                    立即註冊
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: '10%' }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                >
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
                    返回登入介面
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: '10%' }}></View>
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
