import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import DatePicker from 'react-native-datepicker';
import { BaseComponent, AreaPicker } from 'react-native-pickers';
import Taiwan from './finish.json';

const screenWidth = Dimensions.get('window').width;
export default class Public extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
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
      end_number: new Date()
    };
  }

  /*convert_time = () => {
    let start_date = this.state.start_date.split('-');
    let start_time = this.state.start_time.split(':');
    let start_date_time = start_date.concat(start_time);
    let end_date = this.state.end_date.split('-');
    let end_time = this.state.end_time.split(':');
    let end_date_time = end_date.concat(end_time);
    this.setState({
      start_s: new Date(
        start_date_time[0],
        start_date_time[1] - 1,
        start_date_time[2],
        start_date_time[3],
        start_date_time[4]
      ),
      start_number: new Date(
        start_date_time[0],
        start_date_time[1] - 1,
        start_date_time[2],
        start_date_time[3],
        start_date_time[4]
      ).getTime(),

      end_e: new Date(
        end_date_time[0],
        end_date_time[1] - 1,
        end_date_time[2],
        end_date_time[3],
        end_date_time[4]
      ),
      end_number: new Date(
        end_date_time[0],
        end_date_time[1] - 1,
        end_date_time[2],
        end_date_time[3],
        end_date_time[4]
      ).getTime()
    });
  };
*/
  handle = () => {
    this.AreaPicker.show();
  };
  writeAddress = text => {
    this.setState(prevState => ({
      address: text
    }));
  };

  handlerGroups = () => {
    let start_date = this.state.start_date.split('-');
    let start_time = this.state.start_time.split(':');
    let start_date_time = start_date.concat(start_time); //將日期和時間變成陣列
    let end_date = this.state.end_date.split('-');
    let end_time = this.state.end_time.split(':');
    let end_date_time = end_date.concat(end_time);
    this.setState(
      {
        datehash: firebase.auth().currentUser.uid + new Date().valueOf()
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
            start_number:
              new Date( //這裡new Date()要注意時區差別 -0400 -> +0800 需要-43200000
                start_date_time[0],
                start_date_time[1] - 1,
                start_date_time[2],
                start_date_time[3],
                start_date_time[4]
              ).getTime() - 43200000,
            end_number:
              new Date(
                end_date_time[0],
                end_date_time[1] - 1,
                end_date_time[2],
                end_date_time[3],
                end_date_time[4]
              ).getTime() - 43200000,
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
  };

  componentWillUnmount() {
    console.log('Public unmount');
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Text
            style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
          >
            Address
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5
            }}
          >
            <Text
              style={{
                width: screenWidth / 9,
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

            <TextInput
              placeholder="请输入"
              keyboardType="default"
              onChangeText={this.writeAddress}
              style={{
                flex: 1,
                padding: 0, //讓字可以貼齊border框
                margin: 5,
                borderWidth: 0.4,
                fontSize: screenWidth / 20
              }}
            />
          </View>

          {/**Start */}

          <Text
            style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
          >
            Start
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
                  width: screenWidth / 9,
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
                  width: screenWidth / 9,
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
            style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
          >
            End
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
                  width: screenWidth / 9,
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
                  width: screenWidth / 9,
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

          <TouchableOpacity onPress={this.handlerGroups}>
            <Text>送出</Text>
          </TouchableOpacity>
        </View>

        <AreaPicker
          areaJson={Taiwan}
          onPickerCancel={() => {}}
          onPickerConfirm={value => {
            alert(value[2]);
            console.log(value); //value形態為array
          }}
          ref={ref => (this.AreaPicker = ref)} //////////////////////////////////這裡
        />
      </View>
    );
  }
}
