import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

import Button from 'apsl-react-native-button';

import FlatListItem from './../FlatListItem/index';

import firebase from '@firebase/app';

import '@firebase/database';

export default class BasicFlatList extends Component {
  state = {
    publish_state: false,
    FlatData: [],
    who_like: []
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/like')
      .once('value', snapshot => {
        //得出先前的like有哪些人 並存在who_like
        for (i in snapshot.val()) {
          this.setState({
            who_like: [...this.state.who_like, snapshot.val()[i]['id']]
          });
        }
      });
    firebase //讀取檢查上一狀態為刊登還是取消 用on 因為監控案的狀態
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/publish/pb')
      .once('value', snapshot => {
        this.setState({ publish_state: snapshot.val() });
      });

    firebase //印出manage_AllPublish_true的所有成員 用once 因為this.setState那樣寫 如果用on 則會重複增加
      .database()
      .ref('manage_AllPublish_true')
      .once('value', snapshot => {
        const ob = snapshot.val();
        for (i in ob) {
          if (this.state.who_like.includes(ob[i]['id'])) {
            //假如ob[i][id]跟who_like中的某一個值一樣則不列入FlatList
            continue;
          } else {
            console.log(ob[i]['id']);
            firebase
              .database()
              .ref('users/' + ob[i]['id'] + '/user_data/')
              .once('value', snapshot => {
                this.setState({
                  FlatData: [...this.state.FlatData, snapshot.val()]
                });
              });
          }
        }
      });
  }
  handlepublish = () => {
    if (this.state.publish_state) {
      //設置刊登或取消的Button
      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/publish')
        .set({ pb: false });
      firebase //設置刊登的使用者ID
        .database()
        .ref('manage_AllPublish_true/' + firebase.auth().currentUser.uid)
        .remove();
    } else if (!this.state.publish_state) {
      //設置刊登或取消的Button
      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/publish')
        .set({ pb: true });
      firebase //設置刊登的使用者ID
        .database()
        .ref('manage_AllPublish_true/' + firebase.auth().currentUser.uid)
        .set({ id: firebase.auth().currentUser.uid });
    }
    //這裡和前面componentDidMount一樣，前面是初始化來到這個介面時的監聽，這裡是按下Button時要改變publish_state的狀態
    //並且要擺在後面先讓前面程式執行
    this.setState({ publish_state: !this.state.publish_state });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          //必須是flex:1 才可以依照FlatListData的值給出相應的空間
        }
        <View
          style={{
            height: 50,
            backgroundColor: 'rgb(238, 190, 108)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button
            style={{
              backgroundColor: '#9b59b6',
              borderColor: '#8e44ad',
              borderRadius: 22
            }}
            onPress={this.handlepublish}
          >
            {this.state.publish_state ? '取消' : '刊登'}
          </Button>
        </View>
        <FlatList
          ref="myFlatList"
          data={this.state.FlatData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            //item和index"參數"都是固定用法
            //console.log('Look : ' + FlatListData);

            //console.log('-------------------------------------------------');
            //console.log(`Item ${JSON.stringify(item)} , index : ${index}`);

            //這邊的item變數對應上面的props.item  * 這邊的parentFlatList是為了用這邊的function *
            return (
              <FlatListItem item={item} index={index} parentFlatList={this} />
            );
          }}
        />
      </View>
    );
  }
}
