import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

//import Button from 'apsl-react-native-button';

import FlatListItem from './FlatListItem';
import firebase from '@firebase/app';

import '@firebase/database';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import PushNotification from 'react-native-push-notification-ce';
import LinearGradient from 'react-native-linear-gradient';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publish_state: false,
      FlatData: [],
      origin_Data: [],
      who_like: [],
      spinner: false,
      text: ''
    };
  }
  componentDidMount() {
    const var_navigation = this.props.navigation;
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('entry notification');
        console.log('NOTIFICATION:', notification);
        console.log('NOTIFICATION Message_key1:', notification['message']);
        setTimeout(() => {
          if (!notification['foreground']) {
            if (firebase.auth().currentUser.uid != notification['confirm_id']) {
              console.log(firebase.auth().currentUser.uid);
              console.log(notification['confirm_id']);
              var_navigation.navigate('login');
              console.log('不是傳給此帳戶');
            } else {
              console.log('是傳給此帳戶');
              console.log(notification['confirm_id']);
            }
          }
        }, 1);
        //process the notification
        PushNotification.localNotification({
          id: notification.id,
          title: '委託消息 ', // (optional)
          playSound: false,
          soundName: 'default',
          message: notification['key1'], // (required)
          confirm_id: notification['receiver_id'],
          date: new Date(Date.now() + 60 * 1000) // in 60 secs
        });
      },
      senderID: '598675977698',
      popInitialNotification: true,
      requestPermissions: true
    });

    console.log('navigation test');
    console.log(this.props.navigation);
    this.props.navigation.addListener('willFocus', () => {
      this.setState({
        spinner: !this.state.spinner,
        origin_Data: [],
        FlatData: [],
        who_like: [],
        publish_state: false
      });
      setTimeout(() => {
        this.setState({
          spinner: false
        });
      }, 1500);

      var temp = [];

      setTimeout(() => {
        var test_array = [];
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid + '/like')
          .once('value', snapshot => {
            //得出先前的like有哪些人 並存在who_like
            for (i in snapshot.val()) {
              temp.push(snapshot.val()[i]['id']);
            }
            console.log('search_1');
          })
          .then(
            this.setState({
              who_like: temp
            })
          )
          .then(
            firebase
              .database()
              .ref('users/')
              .once('value', snapshot => {
                console.log('search_2');
                var obj;
                var user_array = Object.values(snapshot.val());
                //用map取大for loop 並用obj return 最後在一口氣this.setstate
                for (i in user_array) {
                  if (
                    (user_array[i].Volunteer.v == 3 ||
                      user_array[i].Volunteer.v == 4) &&
                    user_array[i].user_data.uid !==
                      firebase.auth().currentUser.uid
                  ) {
                    if (
                      this.state.who_like.includes(user_array[i].user_data.uid)
                    ) {
                      obj = Object.assign(user_array[i].user_data, {
                        animate: true
                      });
                      test_array.push(obj);
                    } else {
                      obj = Object.assign(user_array[i].user_data, {
                        animate: false
                      });
                      test_array.push(obj);
                    }
                  }
                }
              })
              .then(() => {
                this.setState({
                  FlatData: test_array,
                  origin_Data: test_array
                });
                console.log('search_3');
              })
          );
      }, 10);
    });
  }

  search = () => {
    var origin_Data = this.state.origin_Data;
    console.log('this.state.origin_Data : ', this.state.origin_Data);
    var array = [];
    for (i in origin_Data) {
      if (origin_Data[i].name.indexOf(this.state.text) >= 0) {
        array.push(origin_Data[i]);
      } else if (origin_Data[i].region.indexOf(this.state.text) >= 0) {
        array.push(origin_Data[i]);
      }
    }
    console.log('array:', array);
    this.setState({ FlatData: array });
  };
  render_FlatList_footer = () => {
    var footer_View = <View style={{ height: 100 }}></View>;

    return footer_View;
  };
  render() {
    const SearchBar = (
      <View
        style={{
          backgroundColor: 'rgb(50,65,146)',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: Dimensions.get('window').height / 14,
          paddingLeft: 15
        }}
      >
        <TouchableOpacity
          style={{ marginBottom: '1%', width: '20%' }}
          onPress={() => this.props.navigation.openDrawer()}
        >
          <Icon name="bars" size={22} color="white" />
        </TouchableOpacity>
        <View style={{ width: '35%' }}></View>
        <TextInput
          placeholder="Search name"
          placeholderTextColor="white"
          maxLength={8}
          style={{
            //paddingTop: '5%',
            fontSize: 18,
            color: 'white',
            flex: 1
          }}
          onChangeText={text => this.setState({ text })}
        />
        {/**here/////////////////////////////////////////////////////////////////////////////////////////////// */}
        <TouchableOpacity style={{ marginRight: '5%' }} onPress={this.search}>
          <Icon name="search" size={18} color="white" />
        </TouchableOpacity>
      </View>
    );
    //這裡是靜態(會一直在畫面上) 不能用scrollView
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient style={{ flex: 1 }} colors={['#fed6e3', '#a8edea']}>
          <View style={{ flex: 1 }}>
            {
              //必須是flex:1 才可以依照FlatListData的值給出相應的空間
            }
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
            {SearchBar}
            {/* <View
            style={{
              height: 50,
              backgroundColor: 'rgb(220, 220, 220)',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={this.handlepublish}>
              <Text>{this.state.publish_state ? '取消' : '刊登'}</Text>
            </TouchableOpacity>
          </View> */}

            <View style={styles.flatlist}>
              <FlatList
                ref="myFlatList"
                data={this.state.FlatData}
                horizontal={false}
                numColumns={2}
                ListFooterComponent={this.render_FlatList_footer}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  //item和index"參數"都是固定用法
                  //console.log('Look : ' + FlatListData);

                  //console.log('-------------------------------------------------');
                  //console.log(`Item ${JSON.stringify(item)} , index : ${index}`);

                  //這邊的item變數對應上面的props.item  * 這邊的parentFlatList是為了用這邊的function *

                  return (
                    <FlatListItem
                      item={item}
                      index={index}
                      parentFlatList={this}
                    />
                  );
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  flatlist: {
    justifyContent: 'center',
    // backgroundColor: '#ecf0f1',
    // padding: 4,
    alignItems: 'flex-start'
  }
});
