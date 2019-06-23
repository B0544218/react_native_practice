import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native';

import styles from './styles';
import TextInput from './components/InputWithIcons/index';
import Button from 'apsl-react-native-button';
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
    this.state = { Email: '', Password: '', testText: '' };
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

  handlerSubmit = () => {
    this.setState({ testText: 'test' });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
      .then(success => {
        console.log(success);
        this.setState({
          testText: 'success'
        });
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
                Volunteer: { v: false }, //之前較publish
                //contract: { client: { c: 'null' }, server: { s: 'null' } }, //push
                user_data: {
                  name: { me: 'Anonymous' }, //set
                  address: { ad: '' }, //set
                  password: this.state.Password, //no change
                  uid: firebase.auth().currentUser.uid,
                  introduction: { intro: '' }, //set
                  image: {
                    //set
                    img:
                      'https://cdn.unwire.hk/wp-content/uploads/2014/10/facebook-user.jpg'
                  }
                }
              })

              .then(() => {
                console.log('Data is saved!');
                this.props.navigation.navigate('login');
              })
              .catch(e => {
                console.log('Failed.', e);
              });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);

        this.setState({
          testText: 'failed'
        });
      });
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
            placeholder="註冊email"
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
            onPress={this.handlerSubmit}
          >
            註冊並返回登入介面
          </Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>2019---{this.state.Email}</Text>
        </View>
      </View>
    );
  }
}
