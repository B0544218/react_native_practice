import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import DatePicker from 'react-native-datepicker';
import { BaseComponent, AreaPicker } from 'react-native-pickers';
import { CheckBox, ListItem } from 'native-base';

import Taiwan from './finish.json';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Public extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      customer_array: [],
      user_point: 0,
      user_name: '',
      loading: true,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      service_item: '',
      num: '',
      // num_2: '',
      // num_3: '',
      areapicker_text: '',
      address: '',
      start_date:
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        new Date().getDate(),
      start_time: new Date().getHours() + ':' + new Date().getMinutes(),
      end_date:
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        new Date().getDate(),
      end_time: new Date().getHours() + ':' + new Date().getMinutes(),
      datehash: '',
      start_number: new Date(),
      end_number: new Date(),
      pay_point: 1
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    //除了uid外在增加委託人的姓名
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .once('value', snapshot => {
        this.setState({
          user_name: snapshot.val().user_data.name,
          pay_point: snapshot.val().Volunteer.v
        });
      });
    fetch('http://120.126.19.107:3000/customer_array', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: firebase.auth().currentUser.uid
      })
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        this.setState({ customer_array: responseData.customers_array });
      })
      .catch(err => console.log(err));
    fetch('http://120.126.19.107:3000/get_point', {
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
        console.log(responseData.point);
        this.setState({ user_point: parseFloat(responseData.point) });
      })
      .catch(err => console.log(err));
  }

  handlechecked1 = () => {
    this.setState({ checked1: !this.state.checked1 });
  };
  handlechecked2 = () => {
    this.setState({ checked2: !this.state.checked2 });
  };
  handlechecked3 = () => {
    this.setState({ checked3: !this.state.checked3 });
  };
  handlechecked4 = () => {
    this.setState({ checked4: !this.state.checked4 });
  };
  handlechecked5 = () => {
    this.setState({ checked5: !this.state.checked5 });
  };
  handle = () => {
    this.AreaPicker.show();
  };

  handlerGroups = () => {
    if (this.state.loading != false) {
      fetch('http://120.126.19.107:3000/time_return', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_time: this.state.customer_array,
          start_date: this.state.start_date,
          start_time: this.state.start_time,
          end_date: this.state.end_date,
          end_time: this.state.end_time
        })
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.ans == 1) {
            if (
              (this.state.checked1 ||
                this.state.checked2 ||
                this.state.checked3 ||
                this.state.checked4 ||
                this.state.checked5) &&
              this.state.areapicker_text &&
              this.state.num
            ) {
              if (
                responseData.start_getTime - responseData.current_time <
                120000
              ) {
                Alert.alert('提醒', '須至少提前2分鐘');
              } else {
                if (
                  this.state.pay_point == 2 ||
                  this.state.pay_point == 4 ||
                  ((responseData.end_getTime - responseData.start_getTime) /
                    300000 <
                    this.state.user_point &&
                    (this.state.pay_point == 1 || this.state.pay_point == 3))
                ) {
                  if (
                    responseData.end_getTime - responseData.start_getTime >=
                    300000
                  ) {
                    this.setState({ loading: false });
                    this.setState(
                      {
                        address:
                          this.state.areapicker_text + ',' + this.state.num,
                        datehash:
                          firebase.auth().currentUser.uid + new Date().valueOf()
                      },
                      () => {
                        firebase
                          .database()
                          .ref('public_talk/' + this.state.datehash)
                          .set({
                            address: this.state.address,
                            start_date: this.state.start_date,
                            start_time: this.state.start_time,
                            end_date: this.state.end_date,
                            end_time: this.state.end_time,
                            contract_id: this.state.datehash,
                            user_name: this.state.user_name,
                            is_need_pay_point: this.state.pay_point,
                            service_item: [
                              this.state.checked1,
                              this.state.checked2,
                              this.state.checked3,
                              this.state.checked4,
                              this.state.checked5
                            ],
                            public_client: firebase.auth().currentUser.uid
                          })
                          .then(
                            firebase
                              .database()
                              .ref(
                                'users/' +
                                  firebase.auth().currentUser.uid +
                                  '/contract/public/' +
                                  this.state.datehash
                              )
                              .set({ contract_id: this.state.datehash })
                          );
                      }
                    );
                    this.props.navigation.navigate('GroupsScreen');
                  } else {
                    Alert.alert('提醒', '開始時間~結束時間\n須至少5分鐘');
                  }
                } else {
                  Alert.alert('提醒', '點數不夠');
                }
              }
            } else {
              Alert.alert('提醒', '上方資料都須填寫');
            }
          } else {
            //timeoverlap:0
            Alert.alert('提醒', '這個時段和其他委託有衝突');
            this.setState({ loading: true });
          }
        })
        .catch(err => console.log(err));
    }
  };

  componentWillUnmount() {
    console.log('Public unmount');
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: screenHeight / 12 }}>
            <Text
              style={{
                marginLeft: '2%',
                color: 'rgb(233, 178, 60)',
                fontSize: screenWidth / 25
              }}
            >
              地址
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                margin: 10,
                marginBottom: 0
              }}
            >
              <Text
                style={{
                  fontSize: screenWidth / 25
                }}
              >
                地點 :
              </Text>

              <TouchableOpacity onPress={this.handle}>
                <Text
                  style={{
                    color: '#6495ed',
                    fontSize: 18,
                    justifyContent: 'center'
                  }}
                >
                  選取縣市路段..
                </Text>
              </TouchableOpacity>

              <Text>{this.state.areapicker_text}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                padding: 10
              }}
            >
              <TextInput
                style={styles.TextInputStyle}
                placeholder="27-6號5樓"
                maxLength={15}
                onChangeText={text => {
                  const newText = text.replace(
                    /[ ,_;{}.，。=/:"'!?><|~\\·￡`@#$%^&*()+]+/,
                    ''
                  );
                  this.setState({ num: newText });
                }}
                value={this.state.num}
                textAlign={'center'}
                underlineColorAndroid="transparent"
                keyboardType={'default'}
              />
            </View>

            {/**Start */}

            <Text
              style={{
                marginLeft: '2%',
                color: 'rgb(233, 178, 60)',
                fontSize: screenWidth / 25
              }}
            >
              開始
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderBottomColor: 'rgb(209,224,224)',
                margin: 10,
                borderBottomWidth: 1
              }}
            >
              <View style={{ marginRight: screenWidth / 5 }}>
                <Text
                  style={{
                    fontSize: screenWidth / 25
                  }}
                >
                  日期 :
                </Text>
              </View>

              <DatePicker
                date={this.state.start_date} //initial date from state       //我改的部分
                mode="date"
                format="YYYY-MM-DD"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: -20 //小符號
                  },
                  dateInput: {
                    marginLeft: 20 //放日期的格子
                  }
                }}
                onDateChange={date => {
                  this.setState({ start_date: date }); //我改的部分
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderBottomColor: 'rgb(209,224,224)',
                margin: 10,
                borderBottomWidth: 1
              }}
            >
              <View style={{ marginRight: screenWidth / 5 }}>
                <Text
                  style={{
                    fontSize: screenWidth / 25
                  }}
                >
                  時間 :
                </Text>
              </View>
              <DatePicker
                date={this.state.start_time} //initial date from state         //我改的部分
                mode="time"
                androidMode="default" ///////////////////為什麼mode:spinner不如預期???///////////////////////
                format="HH:mm" //加 HH:mm且 mode 改為datetime可以加時間
                customStyles={{
                  //小符號
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: -20
                  },
                  dateInput: {
                    //放日期的格子
                    marginLeft: 20
                  }
                }}
                onDateChange={date => {
                  this.setState({ start_time: date }); //我改的部分
                }}
              />
            </View>

            {/**End */}

            <Text
              style={{
                marginLeft: '2%',
                color: 'rgb(233, 178, 60)',
                fontSize: screenWidth / 25
              }}
            >
              結束
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderBottomColor: 'rgb(209,224,224)',
                margin: 10,
                borderBottomWidth: 1
              }}
            >
              <View style={{ marginRight: screenWidth / 5 }}>
                <Text
                  style={{
                    fontSize: screenWidth / 25
                  }}
                >
                  日期 :
                </Text>
              </View>
              <DatePicker
                date={this.state.end_date} //initial date from state       //我改的部分
                mode="date"
                format="YYYY-MM-DD"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: -20 //小符號
                  },
                  dateInput: {
                    marginLeft: 20 //放日期的格子
                  }
                }}
                onDateChange={date => {
                  this.setState({ end_date: date }); //我改的部分
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderBottomColor: 'rgb(209,224,224)',
                margin: 10,
                borderBottomWidth: 1
              }}
            >
              <View style={{ marginRight: screenWidth / 5 }}>
                <Text
                  style={{
                    fontSize: screenWidth / 25
                  }}
                >
                  時間 :
                </Text>
              </View>
              <DatePicker
                date={this.state.end_time}
                mode="time"
                androidMode="default"
                format="HH:mm"
                customStyles={{
                  //小符號
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: -20
                  },
                  dateInput: {
                    //放日期的格子
                    marginLeft: 20
                  }
                }}
                onDateChange={date => {
                  this.setState({ end_time: date });
                }}
              />
            </View>
            <Text
              style={{
                marginLeft: '2%',
                color: 'rgb(233, 178, 60)',
                fontSize: screenWidth / 25
              }}
            >
              服務項目
            </Text>
            <ListItem
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexWrap: 'wrap'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 2
                }}
              >
                <CheckBox
                  checked={this.state.checked1}
                  onPress={this.handlechecked1}
                  style={{ borderRadius: 10 }}
                  color="blue"
                />
                <Text>陪伴散步</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 2
                }}
              >
                <CheckBox
                  checked={this.state.checked2}
                  onPress={this.handlechecked2}
                  style={{ borderRadius: 10 }}
                  color="red"
                />
                <Text>陪伴運動</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 2
                }}
              >
                <CheckBox
                  checked={this.state.checked3}
                  onPress={this.handlechecked3}
                  style={{ borderRadius: 10 }}
                  color="green"
                />
                <Text>陪伴購物</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 2
                }}
              >
                <CheckBox
                  checked={this.state.checked4}
                  onPress={this.handlechecked4}
                  style={{ borderRadius: 10 }}
                  color="purple"
                />
                <Text>送餐服務</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 2
                }}
              >
                <CheckBox
                  checked={this.state.checked5}
                  onPress={this.handlechecked5}
                  style={{ borderRadius: 10 }}
                  color="orange"
                />
                <Text>文書服務</Text>
              </View>
            </ListItem>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={this.handlerGroups}
            >
              <Text style={{ color: 'black' }}>確認送出</Text>
            </TouchableOpacity>
          </View>

          <AreaPicker
            areaJson={Taiwan}
            onPickerCancel={() => {}}
            onPickerConfirm={value => {
              this.setState({
                areapicker_text: value[0] + ',' + value[1] + ',' + value[2]
              });
            }}
            ref={ref => (this.AreaPicker = ref)} //////////////////////////////////這裡
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  TextInputStyle: {
    width: screenWidth / 2,
    borderRadius: 10,
    padding: 0, //讓字可以貼齊border框
    marginLeft: 5,
    borderWidth: 0.2,
    fontSize: screenWidth / 25
  }
});
