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
import firebase from '@firebase/app';
import '@firebase/database';

import LIKE_FlatListItem from './LIKE/LIKE_FlatListItem';
import LIKE_BasicFlatList from './LIKE/LIKE_BasicFlatList';
export default class Like extends Component {
  state = {
    FlatData: []
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      //成功監聽，但有新錯誤can't perform a React state update on an unmounted component
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
    });
    this.props.navigation.addListener('willBlur', () => {
      this.setState({ FlatData: [] });
    });
  }
  render() {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
