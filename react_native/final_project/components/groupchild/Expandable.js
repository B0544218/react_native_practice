import People from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from 'react-native-vector-icons/FontAwesome';
import C from 'react-native-vector-icons/FontAwesome';
import Up_Down from 'react-native-vector-icons/FontAwesome5';

import LinearGradient from 'react-native-linear-gradient';

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
export default class Expandable_ListView extends Component {
  constructor() {
    super();

    this.state = {
      // customer_array: [],
      name: ' ',
      add: ' ',
      start: ' ',
      end: ' ',
      layout_Height: 0
    };
  }
  // componentDidMount() {
  //   fetch('http://120.126.19.107:3000/customer_array', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       user_id: firebase.auth().currentUser.uid
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(responseData => {
  //       console.log(responseData);
  //       this.setState({ customer_array: responseData.customers_array });
  //     })
  //     .catch(err => console.log(err));
  // }
  CommissionRemove_Private = ContractId => {
    var members = [];
    var check_value = 0;

    firebase
      .database()
      .ref('private_talk/' + ContractId)
      .once('value', snapshot => {
        if (snapshot.val() == undefined) {
          check_value = 0;
        } else {
          check_value = 1;
          for (i in snapshot.val()) {
            //找出所有memeberID
            members.push(snapshot.val().member);
          }
        }
      })
      // .then(() => {
      //   console.log(members);
      // })
      .then(() => {
        if (check_value == 0) {
        } else {
          for (i in members) {
            firebase
              .database()
              .ref('users/' + members[i] + '/contract/server/' + ContractId)
              .remove(); //到這裡刪除之前邀請的member
          }
        }
      })
      .then(() => {
        if (check_value == 0) {
        } else {
          firebase //刪除private_talk這個委託
            .database()
            .ref('private_talk/' + ContractId)
            .remove();
        }
      })
      .then(() => {
        if (check_value == 0) {
        } else {
          firebase //刪除委託紀錄(私人)的自己發布的這項委託
            .database()
            .ref(
              'users/' +
                firebase.auth().currentUser.uid +
                '/contract/client/' +
                ContractId
            )
            .remove();
        }
      })

      .then(() => {
        if (check_value == 0) {
          Alert.alert('提醒', '沒資料');
          console.log('check_value2:', check_value);

          this.props.handlerRemove();
        } else if (check_value == 1) {
          console.log('check_value:', check_value);
          this.props.handlerRemove();
        }
      });
  };
  CommissionRemove_Public = ContractId => {
    var check_value = 0;
    firebase
      .database()
      .ref(
        'users/' +
          firebase.auth().currentUser.uid +
          '/contract/public/' +
          ContractId +
          '/contract_id'
      )
      .once('value', snapshot => {
        if (snapshot.val() == undefined) {
          check_value = 0;
        } else if (snapshot.val()) {
          check_value = 1;
          firebase
            .database()
            .ref(
              'users/' +
                firebase.auth().currentUser.uid +
                '/contract/public/' +
                ContractId +
                '/contract_id'
            )
            .remove();
          firebase
            .database()
            .ref('public_talk/' + ContractId)
            .remove();
        }
      })
      .then(() => {
        if (check_value == 0) {
          Alert.alert('提醒', '沒資料');
          console.log('check_value2:', check_value);

          this.props.handlerRemove();
        } else {
          console.log('check_value:', check_value);
          this.props.handlerRemove();
        }
      });
  };
  Remove_Private_Request = ContractId => {
    //移除別人請求
    firebase
      .database()
      .ref(
        'users/' +
          firebase.auth().currentUser.uid +
          '/contract/server/' +
          ContractId
      )
      .remove()
      .then(() => {
        firebase
          .database()
          .ref('private_talk/' + ContractId + '/member')
          .remove();
      })
      .then(() => {
        this.props.handlerRemove();
      });
  };
  Accept_Private = ContractId => {
    var check_value = 0;

    firebase
      .database()
      .ref('private_talk/' + ContractId)
      .once('value', snapshot => {
        if (snapshot.val() == undefined) {
          check_value = 0;
        } else {
          check_value = 1;
          firebase
            .database()
            .ref(
              'users/' +
                snapshot.val().member +
                '/contract/server/' +
                ContractId
            )
            .remove();
          //針對合約之前發給的對象(包含自己) 做刪除紀錄
          // for (var i in snapshot.val().member) {
          //   firebase
          //     .database()
          //     .ref(
          //       'users/' +
          //         snapshot.val().member[i].id +
          //         '/contract/server/' +
          //         ContractId
          //     )
          //     .remove();
          // }
          //刪除產生者份合約人的client合約(因為已經完成)
          firebase
            .database()
            .ref(
              'users/' +
                snapshot.val().private_uid +
                '/contract/client/' +
                ContractId
            )
            .remove();
          //新增finish到雙方contract
          // firebase
          //   .database()
          //   .ref(
          //     'users/' +
          //       snapshot.val().private_uid +
          //       '/contract/finished/' +
          //       ContractId
          //   )
          //   .set({ contract_id: ContractId });
          // firebase
          //   .database()
          //   .ref(
          //     'users/' +
          //       firebase.auth().currentUser.uid +
          //       '/contract/finished/' +
          //       ContractId
          //   )
          //   .set({ contract_id: ContractId });
          //新增合約到during上 再把private_talk上的合約刪除
          fetch('http://120.126.19.107:3000/Db_accept', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer_time: this.props.customer_array,
              //
              address: snapshot.val().address,
              contract_id: snapshot.val().contract_id,
              start_date: snapshot.val().start_date,
              start_time: snapshot.val().start_time,
              start_number: snapshot.val().start_number,
              end_date: snapshot.val().end_date,
              end_time: snapshot.val().end_time,
              end_number: snapshot.val().end_number,
              be_cared: snapshot.val().private_uid,
              be_cared_name: snapshot.val().user_name,
              server: firebase.auth().currentUser.uid,
              server_name: this.props.user_name, //做到這裡
              service_item: snapshot.val().service_item,
              is_need_pay_point: snapshot.val().is_need_pay_point
            })
          })
            .then(response => response.json())
            .then(responseJsonData => {
              console.log(responseJsonData.answer);
              return responseJsonData.answer;
            })

            .then(result => {
              if (result == 1) {
                console.log('刪除private_talk上的合約');
                firebase
                  .database()
                  .ref('private_talk/' + ContractId)
                  .remove();
                return 1;
              } else {
                Alert.alert('提醒', '這個時段和其他委託有衝突');
                return 0;
              }
            })
            .then(value => {
              if (value == 1) {
                return fetch('http://120.126.19.107:3000/send_AcceptContract', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    uid: snapshot.val().private_uid //跟private_accept不同參數
                  })
                });
              } else {
                console.log('時間overlap');
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .then(() => {
        if (check_value == 0) {
          Alert.alert('提醒', '沒資料');
          console.log('check_value2:', check_value);

          this.props.handlerRemove();
        } else {
          console.log('check_value:', check_value);
          this.props.handlerRemove();
        }
      });
  };
  Accept_Public = ContractId => {
    var check_value = 0;

    firebase
      .database()
      .ref('public_talk/' + ContractId)
      .once('value', snapshot => {
        if (snapshot.val() == undefined) {
          check_value = 0;
        } else {
          check_value = 1;
          //刪除對象的public上的這份合約
          firebase
            .database()
            .ref(
              'users/' +
                snapshot.val().public_client +
                '/contract/public/' +
                ContractId
            )
            .remove();
          //新增finish到雙方contract
          // firebase
          //   .database()
          //   .ref(
          //     'users/' +
          //       snapshot.val().public_client +
          //       '/contract/finished/' +
          //       ContractId
          //   )
          //   .set({ contract_id: ContractId });
          // firebase
          //   .database()
          //   .ref(
          //     'users/' +
          //       firebase.auth().currentUser.uid +
          //       '/contract/finished/' +
          //       ContractId
          //   )
          //   .set({ contract_id: ContractId });
          //新增合約到mongodb後 再刪除public上的合約
          //以下mongodb public的部分
          fetch('http://120.126.19.107:3000/Db_accept', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer_time: this.props.customer_array,
              //
              address: snapshot.val().address,
              contract_id: snapshot.val().contract_id,
              start_date: snapshot.val().start_date,
              start_time: snapshot.val().start_time,
              start_number: snapshot.val().start_number,
              end_date: snapshot.val().end_date,
              end_time: snapshot.val().end_time,
              end_number: snapshot.val().end_number,
              be_cared: snapshot.val().public_client,
              be_cared_name: snapshot.val().user_name,
              server: firebase.auth().currentUser.uid,
              server_name: this.props.user_name, //做到這裡
              service_item: snapshot.val().service_item,
              is_need_pay_point: snapshot.val().is_need_pay_point
            })
          })
            .then(response => response.json())
            .then(responseJsonData => {
              console.log(responseJsonData.answer);
              return responseJsonData.answer;
            })

            //上面during由mongodb取代
            .then(result => {
              if (result == 1) {
                console.log('刪除public_talk上的合約');
                firebase
                  .database()
                  .ref('public_talk/' + ContractId)
                  .remove();
                return 1;
              } else {
                Alert.alert('提醒', '這個時段和其他委託有衝突');
                return 0;
              }
            })
            .then(value => {
              if (value == 1) {
                return fetch('http://120.126.19.107:3000/send_AcceptContract', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    uid: snapshot.val().public_client //跟private_accept不同參數
                  })
                });
              } else {
                console.log('時間overlap');
              }
            })
            .catch(error => {
              console.log(error);
            });
          return 1;
        }
      })
      .then(value => {
        if (check_value == 0) {
          Alert.alert('提醒', '沒資料');
          console.log('check_value2:', check_value);

          this.props.handlerRemove();
        } else {
          console.log('check_value:', check_value);
          this.props.handlerRemove();
        }
      });
  };

  show_Selected_Category = (
    name,
    add,
    start_date,
    start_time,
    end_date,
    end_time,
    title,
    contractId,
    service_item
  ) => {
    //  this.props.item.title 先用switch case 找試當的Alert buuton再 確認 刪除 取消連接對應的 function
    let service_item_detal = '服務項目 : ';
    if (service_item[0]) {
      service_item_detal += '陪伴散步 ';
    }
    if (service_item[1]) {
      service_item_detal += '陪伴運動 ';
    }
    if (service_item[2]) {
      service_item_detal += '陪伴購物 ';
    }
    if (service_item[3]) {
      service_item_detal += '送餐服務 ';
    }
    if (service_item[4]) {
      service_item_detal += '文書服務 ';
    }
    if (title == '本人不公開委託') {
      Alert.alert(
        '詳細資料',
        '姓名: ' +
          name +
          '\n' +
          '地址: ' +
          add +
          '\n' +
          '服務時間: ' +
          '\n' +
          start_date +
          ' ' +
          start_time +
          '~' +
          end_date +
          ' ' +
          end_time +
          ' \n' +
          service_item_detal,
        [
          { text: '返回' },
          {
            text: '刪除',
            onPress: () => this.CommissionRemove_Private(contractId)
          }
        ]
      );
    } else if (title == '本人公開委託') {
      Alert.alert(
        '詳細資料',
        '姓名: ' +
          name +
          '\n' +
          '地址: ' +
          add +
          '\n' +
          '服務時間: ' +
          '\n' +
          start_date +
          ' ' +
          start_time +
          '~' +
          end_date +
          ' ' +
          end_time +
          ' \n' +
          service_item_detal,
        [
          { text: '返回' },
          {
            text: '刪除',
            onPress: () => this.CommissionRemove_Public(contractId)
          }
        ]
      );
    } else if (title == '他人不公開委託') {
      Alert.alert(
        '詳細資料',
        '姓名: ' +
          name +
          '\n' +
          '地址: ' +
          add +
          '\n' +
          '服務時間: ' +
          '\n' +
          start_date +
          ' ' +
          start_time +
          '~' +
          end_date +
          ' ' +
          end_time +
          ' \n' +
          service_item_detal,
        [
          {
            text: '刪除',
            onPress: () => this.Remove_Private_Request(contractId)
          },
          {
            text: '接受',
            onPress: () => this.Accept_Private(contractId)
          }
        ]
      );
    } else if (title == '他人公開委託') {
      Alert.alert(
        '詳細資料',
        '姓名: ' +
          name +
          '\n' +
          '地址: ' +
          add +
          '\n' +
          '服務時間: ' +
          '\n' +
          start_date +
          ' ' +
          start_time +
          '~' +
          end_date +
          ' ' +
          end_time +
          ' \n' +
          service_item_detal,
        [
          { text: '返回' },
          {
            text: '接受',
            onPress: () => this.Accept_Public(contractId)
          }
        ]
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.expanded) {
      this.setState(() => {
        return {
          layout_Height: null
        };
      });
    } else {
      this.setState(() => {
        return {
          layout_Height: 0
        };
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layout_Height !== nextState.layout_Height) {
      return true;
    }
    return false;
  }

  render() {
    const h = <Home name="home" size={20} color={'#ff7575'}></Home>;
    const c = <C name="calendar" size={20} color={'#ff7575'}></C>;
    const down = (
      <Up_Down name="chevron-down" size={18} color={'white'}></Up_Down>
    );
    const up = <Up_Down name="chevron-up" size={18} color={'white'}></Up_Down>;
    const p = (
      <People name="account-heart" size={20} color={'#ff7575'}></People>
    );
    return (
      <View>
        <TouchableOpacity onPress={this.props.onClickFunction}>
          <View style={styles.category_View}>
            <View style={{ width: '95%' }}>
              <Text
                style={{
                  fontSize: 25,
                  //fontWeight: 'bold',
                  marginLeft: '30%',
                  color: 'white',
                  textAlign: 'left'
                }}
              >
                {`${this.props.item.title}`}
              </Text>
            </View>
            <View style={{ width: '5%' }}>
              {this.props.item.expanded ? (
                <Text>{down}</Text>
              ) : (
                <Text>{up}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: this.state.layout_Height, overflow: 'hidden' }}>
          {this.props.item.data.length != 0 ? (
            this.props.item.data.map((item, key) => (
              <View key={key}>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      width: Dimensions.get('window').width * 0.25
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        height: Dimensions.get('window').height * 0.05
                      }}
                    >
                      <Text style={{ margin: '1%' }}> {p} </Text>
                      <Text style={styles.textSytle}>委託人</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: Dimensions.get('window').height * 0.05
                      }}
                    >
                      <Text style={{ margin: '1%' }}> {h} </Text>
                      <Text style={styles.textSytle}>地點</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: Dimensions.get('window').height * 0.05
                      }}
                    >
                      <Text style={{ margin: '1%' }}> {c} </Text>
                      <Text style={styles.textSytle}>時間</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    key={key}
                    style={{ justifyContent: 'flex-start' }}
                    onPress={this.show_Selected_Category.bind(
                      this,
                      item.content.user_name,
                      item.content.address,
                      item.content.start_date,
                      item.content.start_time,
                      item.content.end_date,
                      item.content.end_time,
                      this.props.item.title,
                      item.content.contract_id,
                      item.content.service_item
                    )}
                  >
                    <Text style={styles.textSytle}>
                      {item.content.user_name}
                    </Text>
                    <Text style={styles.textSytle}>
                      {item.content.address}{' '}
                    </Text>
                    <Text style={styles.textSytle2}>
                      {`${item.content.start_date} ${item.content.start_time} ~ ${item.content.end_date} ${item.content.end_time}`}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: Dimensions.get('window').width,
                    height: 2,
                    backgroundColor: '#adadad'
                  }}
                />
              </View>
            ))
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 25 }}>沒有資料</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textSytle: {
    height: 60,
    color: '#4f4f4f',
    fontSize: 18,
    marginLeft: '2%',
    height: Dimensions.get('window').height * 0.05
  },
  textSytle2: {
    height: 60,
    color: '#4f4f4f',
    fontSize: 14,
    marginLeft: '2%',
    height: Dimensions.get('window').height * 0.05
  },

  category_View: {
    //'#fa8072', '#FF7F50'
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5 //shadow
    // borderWidth: 0.8,
    // borderColor: 'white'
    // backgroundColor: '#00CACA'
  }
});
