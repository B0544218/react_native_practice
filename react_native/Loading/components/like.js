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
import Spinner from 'react-native-loading-spinner-overlay';

export default class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatData: [],
      spinner: false
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      //成功監聽，但有新錯誤can't perform a React state update on an unmounted component
      this.setState({
        spinner: !this.state.spinner
      });
      setTimeout(() => {
        this.setState({
          spinner: false
        });
      }, 1500);

      this.setState({ FlatData: [] });
      setTimeout(() => {
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
      }, 100);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {
            //必須是flex:1 才可以依照FlatListData的值給出相應的空間
          }
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
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
