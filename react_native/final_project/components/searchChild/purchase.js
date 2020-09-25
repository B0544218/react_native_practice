/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  WebView,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';

const screenWidth = Dimensions.get('window').width;
export default class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: 'Pending',
      inputValue: '',
      money: 0,
      name: '',
      ModalVisibleStatus: false
    };
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
      .once('value', snapshot => {
        this.setState({ name: snapshot.val().name });
      });
  }
  handleResponse = data => {
    if (data.title === 'success') {
      //對應ejs的success title
      console.log('transaction suceess');
      fetch('http://120.126.19.107:3000/transaction_success', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: firebase.auth().currentUser.uid,
          points: this.state.inputValue,
          money: this.state.money,
          name: this.state.name
        })
      })
        .then(response => response.json())
        .then(responseData => {
          Alert.alert('提醒', '交易成功');
          console.log(responseData.answer);
        })
        .catch(err => console.log(err));
      this.setState({
        showModal: false,
        status: 'Complete',
        ModalVisibleStatus: true
      });
    } else if (data.title === 'cancel') {
      this.setState({ showModal: false, status: 'Cancelled' });
    }
  };
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.MainContainer}>
          <Text style={{ textAlign: 'center', fontSize: 25, color: 'black' }}>
            請輸入購買的點數量
          </Text>
          <Text style={{ textAlign: 'center', color: 'red' }}>1點=100 TWD</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontSize: 24,
                marginRight: 5,
                color: 'black',
                marginTop: 4
              }}
            >
              購買:
            </Text>
            <View
              style={{
                width: 120,
                height: 45,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'black'
              }}
            >
              <TextInput
                style={{
                  fontSize: 20,
                  marginLeft: 15
                }}
                onChangeText={text => {
                  const newText = text.replace(/[^\d]+/, '');
                  this.setState({
                    inputValue: newText,
                    money: parseInt(newText) * 100
                  });
                  console.log(this.state.inputValue);
                }}
                value={this.state.inputValue}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Modal
            visible={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}
          >
            {/**在genymotion10.0.3.2或10.0.2.2連到真實環境localhost
             */}
            {/** 'http://10.0.3.2:3000'
       不用genymotion http://localhost:3000
       實驗室:120.126.19.107:3000*/}
            <WebView
              source={{ uri: 'http://120.126.19.107:3000' }}
              onNavigationStateChange={data => this.handleResponse(data)}
              injectedJavaScript={`document.getElementById('price').value=${this.state.money};document.f1.submit()`}
              //讓form name=f1 自動被submit
            />
          </Modal>

          <View
            style={{
              flexDirection: 'row',
              top: 30,
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity style={{ width: 55 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  borderRadius: 5,
                  color: 'black',
                  backgroundColor: 'pink'
                }}
                onPress={() => {
                  if (isNaN(this.state.money) || this.state.money <= 0) {
                    Alert.alert('提醒', '請確認輸入點數量是否正確');
                  } else {
                    this.setState({ showModal: true });
                  }
                }}
              >
                確定
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View>
          <Text> {this.state.money}</Text>
        </View> */}

          <Modal
            visible={this.state.ModalVisibleStatus}
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
                  <Text style={{ fontSize: 25, color: 'black' }}>
                    已完成付款!!!!
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'black',
                      textAlign: 'center'
                    }}
                  >
                    金額為: {this.state.money}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center',
                      color: 'black'
                    }}
                  >
                    謝謝您
                  </Text>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Button
                    color="#20b2aa"
                    title="返回點數頁面"
                    onPress={() => {
                      this.ShowModalFunction(false);
                      this.props.navigation.navigate('HandshakesScreen');
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
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
