import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import styles from './styles';
import TextInput from './components/InputWithIcons/index';
import Button from 'apsl-react-native-button';
console.log('in Login');

import firebase from '@firebase/app';

import '@firebase/database';

import '@firebase/auth';

import '@firebase/storage';
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
        if (firebase.auth().currentUser.emailVerified) {
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
              this.props.navigation.navigate('drawer');
            });
        } else {
          console.log('登入失敗  沒有驗證');
        }
      })

      .catch(error => {
        console.log('登入失敗  帳號or密碼錯誤');
        console.log(error);
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
    return (
      <View style={styles.container}>
        <View style={styles.logoAndTitle}>
          <Image
            source={require('./img.png')}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 3
            }}
          />
          <Text style={styles.logoAndTitleText}>React Native</Text>
        </View>
        <View style={styles.login}>
          <TextInput
            placeholder="請輸入用戶名"
            icon={{ name: 'user' }}
            keyboardType="email-address"
            onChangeText={this.handlerChangeUserName}
          />
          <TextInput
            placeholder="請輸入密碼"
            icon={{ name: 'lock' }}
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={this.handlerChangePassword}
          />

          <Button
            style={{ backgroundColor: '#e74c3c', borderWidth: 0, margin: 10 }}
            textStyle={{ fontSize: 18, color: 'white' }}
            onPress={
              this.handlerSubmit
              //this.props.navigation.navigate('drawer');
            } //轉到Drawer
          >
            登录
          </Button>
          <Button
            style={{ backgroundColor: '#e74c3c', borderWidth: 0, margin: 10 }}
            textStyle={{ fontSize: 18, color: 'white' }}
            onPress={this.handlerRegister}
          >
            註冊
          </Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{this.state.testText}</Text>
        </View>
      </View>
    );
  }
}
