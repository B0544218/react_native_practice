import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
import { database } from 'firebase';

import Modal from 'react-native-modal';
import Group_Modal from './group_Modal';
const screenwidth = Dimensions.get('window').width;

export default class SectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = { visibleModal: false, Have_item: this.props.item.content };
  }
  press = () => {
    this.setState({ visibleModal: true });
    console.log(this.props.item.content);
  };

  CommissionRemove_Private = () => {
    var count = 0;
    firebase //刪除之前邀請的相關人
      .database()
      .ref('private_talk/' + this.props.item.content + '/member')
      .once('value', snapshot => {
        for (i in snapshot.val()) {
          count++; //完成一次就加一
          firebase
            .database()
            .ref(
              'users/' +
                snapshot.val()[i].id +
                '/contract/server/' +
                this.props.item.content
            )
            .remove()
            .then(() => {
              if (count >= snapshot.numChildren())
                //count和snapshot一樣時才執行下面的刪除動作 這是用來取代同步處理
                firebase //刪除private_talk這個委託
                  .database()
                  .ref('private_talk/' + this.props.item.content)
                  .remove();
            });
        }
      });

    firebase
      .database()
      .ref(
        'users/' +
          firebase.auth().currentUser.uid +
          '/contract/client/' +
          this.props.item.content
      )
      .once('value', snapshot => {
        if (snapshot.val()) {
          firebase //刪除委託紀錄(私人)的其中一項委託
            .database()
            .ref(
              'users/' +
                firebase.auth().currentUser.uid +
                '/contract/client/' +
                this.props.item.content
            )
            .remove();
        }
      })

      .then(this.setState({ visibleModal: false, Have_item: null }));
  };
  CommissionRemove_Public = () => {
    firebase
      .database()
      .ref(
        'users/' +
          firebase.auth().currentUser.uid +
          '/contract/public/' +
          this.props.item.content +
          '/contract_id'
      )
      .once('value', snapshot => {
        if (snapshot.val()) {
          firebase
            .database()
            .ref(
              'users/' +
                firebase.auth().currentUser.uid +
                '/contract/public/' +
                this.props.item.content +
                '/contract_id'
            )
            .remove();
          firebase
            .database()
            .ref('public_talk/' + this.props.item.content)
            .remove();
        }
      })
      .then(this.setState({ visibleModal: false, Have_item: null }));
  };
  Remove_Private_Request = () => {
    firebase
      .database()
      .ref(
        'users/' +
          firebase.auth().currentUser.uid +
          '/contract/server/' +
          this.props.item.content
      )
      .remove()
      .then(this.setState({ visibleModal: false, Have_item: null }));
  };
  Accept_Private = () => {
    firebase
      .database()
      .ref('private_talk/' + this.props.item.content)
      .once('value', snapshot => {
        //針對合約之前發給的對象(包含自己) 做刪除紀錄
        for (var i in snapshot.val().member) {
          firebase
            .database()
            .ref(
              'users/' +
                snapshot.val().member[i].id +
                '/contract/server/' +
                this.props.item.content
            )
            .remove();
        }
        //刪除產生者份合約人的client合約(因為已經完成)
        firebase
          .database()
          .ref(
            'users/' +
              snapshot.val().private_uid +
              '/contract/client/' +
              this.props.item.content
          )
          .remove();
        //新增finish到雙方contract
        firebase
          .database()
          .ref(
            'users/' +
              snapshot.val().private_uid +
              '/contract/finished/' +
              this.props.item.content
          )
          .set({ contract_id: this.props.item.content });
        firebase
          .database()
          .ref(
            'users/' +
              firebase.auth().currentUser.uid +
              '/contract/finished/' +
              this.props.item.content
          )
          .set({ contract_id: this.props.item.content });
        //新增合約到during上 再把private_talk上的合約刪除
        firebase
          .database()
          .ref('during/' + this.props.item.content)
          .set({
            address: snapshot.val().address,
            contract_id: snapshot.val().contract_id,
            end_date: snapshot.val().end_date,
            end_time: snapshot.val().end_time,
            end_number: snapshot.val().end_number,
            be_cared: snapshot.val().private_uid,
            server: firebase.auth().currentUser.uid
          })
          .then(() => {
            console.log('刪除private_talk上的合約');
            firebase
              .database()
              .ref('private_talk/' + this.props.item.content)
              .remove();
          });
      })
      .then(this.setState({ visibleModal: false, Have_item: null }));
  };
  Accept_Public = () => {
    firebase
      .database()
      .ref('public_talk/' + this.props.item.content)
      .once('value', snapshot => {
        //刪除對象的public上的這份合約
        firebase
          .database()
          .ref(
            'users/' +
              snapshot.val().public_client +
              '/contract/public/' +
              this.props.item.content
          )
          .remove();
        //新增finish到雙方contract
        firebase
          .database()
          .ref(
            'users/' +
              snapshot.val().public_client +
              '/contract/finished/' +
              this.props.item.content
          )
          .set({ contract_id: this.props.item.content });
        firebase
          .database()
          .ref(
            'users/' +
              firebase.auth().currentUser.uid +
              '/contract/finished/' +
              this.props.item.content
          )
          .set({ contract_id: this.props.item.content });
        //新增合約到during後 再刪除public上的合約
        firebase
          .database()
          .ref('during/' + this.props.item.content)
          .set({
            address: snapshot.val().address,
            contract_id: snapshot.val().contract_id,
            end_date: snapshot.val().end_date,
            end_time: snapshot.val().end_time,
            end_number: snapshot.val().end_number,
            be_cared: snapshot.val().public_client,
            server: firebase.auth().currentUser.uid
          })
          .then(() => {
            console.log('刪除public_talk上的合約');
            firebase
              .database()
              .ref('public_talk/' + this.props.item.content)
              .remove();
          });
      })
      .then(this.setState({ visibleModal: false, Have_item: null }));
  };
  button = () => {
    switch (this.props.section.key) {
      case '委託紀錄(私人)':
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button
              title="返回"
              onPress={() => this.setState({ visibleModal: false })}
            />
            <Button title="刪除" onPress={this.CommissionRemove_Private} />
          </View>
        );
      case '委託紀錄(公開)':
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button
              title="返回"
              onPress={() => this.setState({ visibleModal: false })}
            />
            <Button title="刪除" onPress={this.CommissionRemove_Public} />
          </View>
        );
      case '別人請求':
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button title="刪除" onPress={this.Remove_Private_Request} />
            <Button title="接受" onPress={this.Accept_Private} />
          </View>
        );
      default:
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button
              title="返回"
              onPress={() => this.setState({ visibleModal: false })}
            />
            <Button title="接受" onPress={this.Accept_Public} />
          </View>
        );
    }
  };
  render() {
    const { item, index } = this.props; //item為sections.data內逐一各項
    return this.state.Have_item ? (
      <View>
        <TouchableOpacity onPress={this.press}>
          <Text
            style={{
              height: 60,
              textAlignVertical: 'center',
              backgroundColor: '#ffffff',
              color: '#5C5C5C',
              fontSize: 15
            }}
          >
            {item.content}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.visibleModal}
          onBackButtonPress={() => {
            this.setState({ visibleModal: false });
          }}
          onBackdropPress={() => this.setState({ visibleModal: false })}
        >
          <View style={styles.modalContent}>
            <View style={{ flex: 1 }}>
              <Group_Modal item={item} />
            </View>
            {this.button()}
          </View>
        </Modal>
      </View>
    ) : null;
  }
}
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  modalContent: {
    width: devicewidth - devicewidth / 10,
    height: deviceheight - deviceheight / 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  }
});
