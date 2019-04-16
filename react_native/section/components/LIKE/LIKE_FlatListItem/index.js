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

import Icon from 'react-native-vector-icons/FontAwesome';

import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

export default class LIKE_FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like: true
    };
  }
  handlelike = () => {
    const { item } = this.props;
    console.log('item : ' + item.uid);
    this.setState({ like: !this.state.like }, () => {
      //setState會最後才執行 所以要用這種方法讓它先執行
      if (this.state.like == true) {
        console.log(this.state.like);
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid + '/like/' + item.uid)
          .set({ id: item.uid });
      } else if (this.state.like == false) {
        console.log(this.state.like);
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid + '/like/' + item.uid)
          .remove();
      }
    });
    //if else & firebase寫入(true) 刪除(false)

    //this.props.parentFlatList.upload_insert(this.props.index); //連結BasucFlatList的upload函式 並傳遞參數
  };
  handlelist = () => {
    const { item } = this.props;
    console.log(typeof JSON.stringify(item.uid));
  };
  render() {
    const { item, index } = this.props; //接收來自BasicFlatList的 item 和 index
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableOpacity onPress={this.handlelist}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row', //包含這裡的flexDirection (上下) 共3個 是在排區塊的顯示排列
              backgroundColor: 'rgb(220, 220, 220)'
            }}
          >
            <Image
              source={{ uri: item.image.img }}
              style={{ width: 70, height: 70, margin: 5 }}
            />
            <View style={{ flex: 1, height: 70, flexDirection: 'column' }}>
              <Text style={styles.textBox}>item 項目</Text>
              <Text style={styles.textBox}>{item.introduction.intro}</Text>
              <Text style={styles.textBox}>縣市</Text>
            </View>
            <View style={{ paddingTop: 30 }}>
              <TouchableOpacity onPress={this.handlelike}>
                {this.state.like ? (
                  <Icon name="heart" size={25} color="rgb(227, 97, 182)" />
                ) : (
                  <Icon name="heart" size={25} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: 'white' }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textBox: {
    color: 'black'
    //padding: 10
  }
});
