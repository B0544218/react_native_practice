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
  TouchableOpacity,
  Dimensions,
  Picker,
  Alert
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
const screenHeight = Dimensions.get('window').height;

//const screenWidth = Dimensions.get('window').width;
export default class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      donate_money: 0,
      have_account: false,
      pickerValue: '',
      pickerValue2: '',
      pickerValue3: '',
      padding_queue: true
    }; //
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
      .once('value', snapshot => {
        this.setState({ name: snapshot.val().name });
      });
  }
  handle = () => {
    if (this.state.padding_queue) {
      this.setState({ padding_queue: false });
      if (this.state.pickerValue == '篩檢') {
        console.log('篩檢');
        fetch('http://120.126.19.107:3000/donate', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            points: this.state.donate_money,
            select_type: '篩檢',
            select_region: '',
            uid: firebase.auth().currentUser.uid,
            name: this.state.name
          })
        })
          .then(response => response.json())
          .then(responseData => {
            this.setState({ padding_queue: true });
            Alert.alert('提醒', responseData.ans);
          })
          .catch(err => console.log(err));
      } else if (this.state.pickerValue == '檢查') {
        if (this.state.pickerValue2 != '') {
          console.log('檢查');
          fetch('http://120.126.19.107:3000/donate', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              points: this.state.donate_money,
              select_type: '檢查',
              select_region: this.state.pickerValue2,
              uid: firebase.auth().currentUser.uid,
              name: this.state.name
            })
          })
            .then(response => response.json())
            .then(responseData => {
              this.setState({ padding_queue: true });
              if (responseData.ans != '完成') {
                Alert.alert('提醒', '交易失敗 請確認點數是否足夠');
              } else {
                this.props.navigation.navigate('HandshakesScreen');
                Alert.alert(
                  '提醒',
                  '交易成功\n您兌換了 ' +
                    this.state.pickerValue2 +
                    this.state.pickerValue +
                    '服務'
                );
              }
            })
            .catch(err => console.log(err));
        } else {
          Alert.alert('提醒', '沒填寫區域');
          this.setState({ padding_queue: true });
        }
      } else if (this.state.pickerValue == '商品') {
        //兌換產生6.199999999999999 而且沒有被寫入交易紀錄
        if (this.state.pickerValue3 != '') {
          console.log('商品兌換');
          fetch('http://120.126.19.107:3000/donate', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              points: this.state.donate_money,
              select_type: '商品',
              select_region: this.state.pickerValue3,
              uid: firebase.auth().currentUser.uid,
              name: this.state.name
            })
          })
            .then(response => response.json())
            .then(responseData => {
              this.setState({ padding_queue: true });
              if (responseData.ans != '完成') {
                Alert.alert('提醒', '交易失敗 請確認點數是否足夠');
              } else {
                this.props.navigation.navigate('HandshakesScreen');
                Alert.alert(
                  '提醒',
                  '交易成功\n您兌換了 ' +
                    this.state.pickerValue3 +
                    this.state.pickerValue +
                    '服務'
                );
              }
            })
            .catch(err => console.log(err));
        } else {
          Alert.alert('提醒', '沒填寫商品項目');
          this.setState({ padding_queue: true });
        }
      } else {
        Alert.alert('提醒', '請填寫資料');
        this.setState({ padding_queue: true });
      }
    }
  };

  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', fontSize: 25, color: 'black' }}>
          請輸入您要兌換的項目
        </Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Picker
            style={{ width: 150 }}
            selectedValue={this.state.pickerValue}
            onValueChange={val => {
              if (val == '') {
                this.setState({
                  pickerValue: val,
                  pickerValue2: '',
                  donate_money: 0
                });
              } else {
                this.setState({ pickerValue: val });
                if (val == '篩檢') {
                  this.setState({ donate_money: 1 });
                } else if (val == '檢查') {
                  this.setState({ donate_money: 2 });
                } else if (val == '商品') {
                  this.setState({ donate_money: 0 });
                }
              }
            }}
          >
            <Picker.Item label="請選擇" value="" />
            <Picker.Item label="社區整合式健康篩檢(新北市)" value="篩檢" />
            <Picker.Item label="聯合醫院健康檢查(新北市)" value="檢查" />
            <Picker.Item label="兌換商品" value="商品" />
          </Picker>
          {this.state.pickerValue == '檢查' ? (
            <Picker
              style={{ width: 150 }}
              selectedValue={this.state.pickerValue2}
              onValueChange={val => this.setState({ pickerValue2: val })}
            >
              <Picker.Item label="請選擇" value="" />
              <Picker.Item label="三重區" value="三重區" />
              <Picker.Item label="板橋區" value="板橋區" />
            </Picker>
          ) : null}
          {this.state.pickerValue == '商品' ? (
            <Picker
              style={{ width: 150 }}
              selectedValue={this.state.pickerValue3}
              onValueChange={val => {
                if (val == '飲料') {
                  this.setState({ pickerValue3: val, donate_money: 3 });
                } else if (val == '餅乾') {
                  this.setState({ pickerValue3: val, donate_money: 1 });
                } else if (val == 'SD卡64G') {
                  this.setState({ pickerValue3: val, donate_money: 10 });
                } else if (val == '手機殼') {
                  this.setState({ pickerValue3: val, donate_money: 5 });
                }
              }}
            >
              <Picker.Item label="請選擇" value="" />
              <Picker.Item label="飲料" value="飲料" />
              <Picker.Item label="餅乾" value="餅乾" />
              <Picker.Item label="SD卡64G" value="SD卡64G" />
              <Picker.Item label="手機殼" value="手機殼" />
            </Picker>
          ) : null}
          <TouchableOpacity
            style={{ marginTop: screenHeight / 20 }}
            onPress={this.handle}
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
              確定
            </Text>
          </TouchableOpacity>
          <Text
            style={{ marginTop: screenHeight / 40, color: 'red' }}
          >{`花費點數 : ${this.state.donate_money}`}</Text>
        </View>
      </View>
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
