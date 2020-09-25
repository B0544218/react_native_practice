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

import LIKE_FlatListItem from './../LIKE_FlatListItem';

import firebase from '@firebase/app';

import '@firebase/database';

export default class LIKE_BasicFlatList extends Component {
  state = {
    FlatData: []
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/like')
      .once('value', snapshot => {
        const lk = snapshot.val();
        for (i in lk) {
          firebase
            .database()
            .ref('users/' + lk[i]['id'] + '/user_data/')
            .once('value', snapshot => {
              this.setState({
                FlatData: [...this.state.FlatData, snapshot.val()]
              });
            });
        }
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          //必須是flex:1 才可以依照FlatListData的值給出相應的空間
        }

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
              <LIKE_FlatListItem
                item={item}
                index={index}
                parentFlatList={this}
              />
            );
          }}
        />
      </View>
    );
  }
}
