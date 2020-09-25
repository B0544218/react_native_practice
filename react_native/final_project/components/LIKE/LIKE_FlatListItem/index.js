import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions
} from 'react-native';

import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import Like_modal from './Like_Modal';
import Modal from 'react-native-modal';
import Animation from 'lottie-react-native';
import StarRating from 'react-native-star-rating';

const height_list = Dimensions.get('window').height / 7;
const window_width = Dimensions.get('window').width;
const item_width = window_width / 2.1;
export default class LIKE_FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like: true,
      visibleModal: false,
      progress: new Animated.Value(1)
    };
  }
  handlelike = () => {
    const { item } = this.props;

    /////////////////////////////
    console.log('item : ' + item.uid);
    this.setState({ like: !this.state.like }, () => {
      //setState會最後才執行 所以要用這種方法讓它先執行
      if (this.state.like == true) {
        this.animation.play(); //lottie

        console.log(this.state.like);
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid + '/like/' + item.uid)
          .set({ id: item.uid });
      } else if (this.state.like == false) {
        Animated.timing(this.state.progress, {
          //lottie
          toValue: 0
          // <-- Animate to the beginning of animation
        }).start();
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
    this.setState({ visibleModal: true });
    //console.log(typeof JSON.stringify(this.props.item.uid));
  };
  render() {
    const { item, index } = this.props; //接收來自BasicFlatList的 item 和 index
    const json_require = require('./953-love.json');
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={{
            height: (Dimensions.get('window').width / 2) * 1.2, // approximate a square
            width: item_width
          }}
          onPress={this.handlelist}
        >
          <View style={styles.cimage}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20,
                flex: 1,
                resizeMode: 'cover'
              }}
              source={{ uri: item.image }}
            />
          </View>
          <View style={styles.StarRating_style}>
            <StarRating
              starSize={window_width / 25}
              disabled={true}
              maxStars={5}
              rating={item.grade / item.service_times}
              emptyStarColor={'#26c6da'}
              fullStarColor={'#26c6da'}
            />
          </View>
          <View style={styles.text_item}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <View
                style={{
                  marginTop: '2%',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    marginRight: Dimensions.get('window').width * 0.002
                  }}
                >{`姓名: ${item.name}`}</Text>
              </View>
              {/* {item.service_times != 0 ? (
                <Text>{` ${(item.grade / item.service_times).toFixed(1)} (${
                  item.service_times
                }次)`}</Text>
              ) : (
                <Text>{` 0.0 (0次)`}</Text>
              )} */}
            </View>
            <Text style={{ marginTop: '2%' }}>{`縣市: ${item.region}`}</Text>
            <Text style={{ marginTop: '2%' }}>{`語言: ${item.language}`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{ marginRight: '20%' }}
              >{`服務次數: ${item.service_times} `}</Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  //paddingLeft: '45%',
                  height: 30
                }}
                onPress={this.handlelike}
              >
                <Animation
                  ref={animation => {
                    this.animation = animation;
                  }}
                  style={{
                    marginTop: 2,
                    width: 25,
                    height: 25
                  }}
                  loop={false}
                  source={json_require}
                  progress={this.state.progress}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.visibleModal}
          onBackButtonPress={() => {
            this.setState({ visibleModal: false });
          }}
          onBackdropPress={() => this.setState({ visibleModal: false })}
        >
          <Like_modal
            item={item}
            is_like={true}
            navigation_message={this.props.navigation_message}
            close_Modal={() => this.setState({ visibleModal: false })}
          />
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textBox: {
    color: 'black'
    //padding: 10
  },
  text_item: {
    width: item_width,
    marginLeft: '2%'
  },
  item: {
    backgroundColor: 'white',
    alignItems: 'flex-end', //橫軸
    justifyContent: 'flex-start', //縱軸
    margin: 4,
    marginVertical: '2%',
    // height: (Dimensions.get('window').width / 2) * 1.1, // approximate a square
    elevation: 10, //shadow
    borderRadius: 10
  },
  cimage: {
    // backgroundColor: 'yellow',
    margin: 3,
    width: '50%',
    height: '40%',
    alignSelf: 'center'
  },
  StarRating_style: {
    width: '50%',
    alignSelf: 'center'
  },
  textViewHolder: {
    flex: 1,
    margin: 2
    // justifyContent: 'center',
    // alignItems: 'stretch'
  }
});
