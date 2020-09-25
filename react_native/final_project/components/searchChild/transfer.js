/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import { JSEncrypt } from 'jsencrypt';
let encrypt = new JSEncrypt();
encrypt.setPublicKey(
  '-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHHEc2z5Z47+vVfdOdsbG5yi/D/EyZQFKo5JgitdqUdj8F1S19XoHI7vGrmFd9bYTqeQ+0AYaJqfUFO+Oi1W4Ha1WqF8ALGz4r0IvsKM+eH+mFQ2FxqNjNIPWmso7pjjxf5Q42QIEIumK9cbG5SfYDAjjwOzXv8cnTrICy23vX1rAgMBAAE=-----END PUBLIC KEY-----'
);
const screenHeight = Dimensions.get('window').height;

const screenWidth = Dimensions.get('window').width;
export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      transfer_someone: '',
      transfer_money: 0,
      have_account: false,
      ModalVisibleStatus: false,
      my_email: ''
    }; //
  }
  componentDidMount() {
    fetch('http://120.126.19.107:3000/get_email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: firebase.auth().currentUser.uid
      })
    })
      .then(response => response.json())
      .then(responseData => {
        this.setState({ my_email: responseData.email });
      })
      .catch(err => console.log(err));
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
      .once('value', snapshot => {
        this.setState({ name: snapshot.val().name });
      });
  }
  ShowModalFunction(visible) {
    this.setState({ have_account: visible });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.MainContainer}>
          <Text style={{ textAlign: 'center', fontSize: 25, color: 'black' }}>
            請輸入您要轉讓的帳號
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 5, color: 'black' }}>
              帳號:
            </Text>
            <View
              style={{
                width: 152,
                height: 45,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'black'
              }}
            >
              <TextInput
                style={{
                  fontSize: 15,
                  marginLeft: 15
                }}
                onChangeText={text => {
                  this.setState({
                    transfer_someone: text
                  });
                }}
              />
            </View>
          </View>
          {/** */}

          <Modal
            visible={this.state.have_account}
            onRequestClose={() => {
              this.ShowModalFunction(false);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={styles.ModalInsideView}>
                <View style={{ alignSelf: 'center' }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'black',
                      textAlign: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    轉讓帳號為: {this.state.transfer_someone}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center',
                      color: 'black'
                    }}
                  >
                    請輸入轉讓點數:
                  </Text>
                  <View
                    style={{
                      width: 152,
                      height: 45,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'black',
                      alignSelf: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <TextInput
                      style={{
                        fontSize: 15
                      }}
                      onChangeText={text => {
                        const newText = text.replace(/[^\d]+/, '');
                        this.setState({
                          transfer_money: newText
                        });
                      }}
                      value={this.state.transfer_money}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Button
                    color="#20b2aa"
                    title="完成"
                    onPress={() => {
                      if (
                        !isNaN(this.state.transfer_money) &&
                        parseInt(this.state.transfer_money) > 0
                      ) {
                        let encrypted = encrypt.encrypt(
                          firebase.auth().currentUser.uid +
                            ',' +
                            this.state.transfer_someone +
                            ',' +
                            this.state.transfer_money +
                            ',' +
                            this.state.name
                        );
                        fetch('http://120.126.19.107:3000/transfer', {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            key_data: encrypted
                            // email: this.state.transfer_someone,
                            // points: this.state.transfer_money,
                            // uid: firebase.auth().currentUser.uid
                          })
                        })
                          .then(response => response.json())
                          .then(responseData => {
                            if (responseData.ans != '完成') {
                              Alert.alert('請確認', '您的點數是否足夠'); //沒公用
                            } else {
                              this.props.navigation.navigate(
                                'HandshakesScreen'
                              );

                              Alert.alert(
                                '轉讓已完成',
                                '已成功轉讓點數給帳號:' +
                                  this.state.transfer_someone +
                                  '\n' +
                                  '共' +
                                  this.state.transfer_money +
                                  '點'
                              );
                            }
                            //alert(responseData.ans);
                          })
                          .catch(err => console.log(err));
                      } else {
                        Alert.alert('請確認', '您沒有轉讓任何點數喔');
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/** */}
          <View
            style={{
              flexDirection: 'row',
              top: 30,
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (
                  this.state.transfer_someone != '' &&
                  this.state.transfer_someone != this.state.my_email
                ) {
                  fetch('http://120.126.19.107:3000/find_user', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      email: this.state.transfer_someone
                    })
                  })
                    .then(response => response.json())
                    .then(responseData => {
                      if (responseData.ans == true) {
                        this.setState({ have_account: true });
                      } else {
                        if (responseData.ans == false) {
                          Alert.alert('請注意', '查無此帳戶!');
                        }
                      }
                    })
                    .catch(err => console.log(err));
                } else {
                  Alert.alert('請注意', '您輸入的帳號無效!');
                }
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  borderRadius: 5,
                  color: 'black',
                  backgroundColor: 'pink'
                }}
              >
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff0'
  },

  ModalInsideView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    height: 300,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  }
});
