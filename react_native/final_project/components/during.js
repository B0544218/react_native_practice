/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import firebase from '@firebase/app';
import '@firebase/auth';
// import Animation from 'lottie-react-native';
import Ban from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/AntDesign';
import People from 'react-native-vector-icons/Ionicons';
import Helper from 'react-native-vector-icons/MaterialCommunityIcons';
import Time from 'react-native-vector-icons/FontAwesome';
import Service from 'react-native-vector-icons/MaterialCommunityIcons';

export default class During extends Component {
  constructor(props) {
    super(props);
    this.state = { flatlist_source: [], spinner: false }; //
  }
  handle_cancel = contract => {
    Alert.alert('警告', '取消委託 帳號可能將遭到封鎖', [
      {
        text: '仍要執行',
        onPress: () => {
          fetch('http://120.126.19.107:3000/delete_customer', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contract_id: contract,
              user_id: firebase.auth().currentUser.uid
            })
          })
            .then(response => response.json())
            .then(responseData1 => {
              console.log(responseData1);
              this.props.navigation.navigate('SearchScreen');
            })
            .catch(err => console.log(err));
        }
      },
      {
        text: '取消',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  };
  componentDidMount() {
    // this.animation.play();
    this.setState({
      spinner: !this.state.spinner
    });
    setTimeout(() => {
      this.setState({
        spinner: false
      });
    }, 1000);
    // firebase
    //   .database()
    //   .ref('users/' + firebase.auth().currentUser.uid + '/Volunteer')
    //   .once('value', snapshot => {
    //     if (snapshot.val().v == 1) {
    //       Alert.alert(
    //         '提醒',
    //         '必須符合政策規範資格者才可檢視\n請到佈老志工官網查看詳情'
    //       );
    //       this.props.navigation.navigate('SearchScreen');
    //     }
    //   });
    fetch('http://120.126.19.107:3000/Db_flat', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: ''
      })
    })
      .then(response => response.json())
      .then(responseData1 => {
        var array = responseData1.flat_data;
        var self_array = [];
        for (i in array) {
          if (
            array[i].server == firebase.auth().currentUser.uid ||
            array[i].be_cared == firebase.auth().currentUser.uid
          ) {
            self_array.push(array[i]);
          }
        }
        return self_array;
      })
      .then(result => {
        console.log(result);
        this.setState({ flatlist_source: result });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const home = <Icon name="home" size={26} color="#ff7f50" />;
    const people = <People name="md-person" size={25} color="#ff7f50" />;
    const helper = (
      <Helper name="account-heart-outline" size={27} color="#ff7f50" />
    );
    const ban = <Ban name="ban" size={18} color="#ff7f50" />;
    const time = <Time name="calendar" size={25} color="#ff7f50" />;
    const service = <Service name="charity" size={27} color="#ff7f50" />;
    return (
      <View>
        {this.state.flatlist_source.length == 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
            {/* <Animation
              ref={animation => {
                this.animation = animation;
              }}
              loop={false}
              style={{
                marginTop: '5%',
                width: 250,
                height: 250
              }}
              source={require('./../assets/1516-duck-och.json')}
            /> */}
            <Image
              style={{
                marginTop: '5%',
                width: Dimensions.get('screen').width,
                height: (Dimensions.get('screen').width * 254) / 659
              }}
              source={require('./404.png')}
            ></Image>
            <Text style={{ marginTop: '10%', fontSize: 20 }}>找不到委託</Text>
          </View>
        ) : (
          <FlatList
            data={this.state.flatlist_source}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#ffe4c4' }}>
                <View style={styles.container1}>
                  {/**把志工跟受照顧人放一起 */}

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginRight: '10%',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                    onPress={() => this.handle_cancel(item.contract_id)}
                  >
                    {ban}
                    <Text style={{ fontSize: 15 }}> 取消</Text>
                  </TouchableOpacity>

                  <View style={styles.item}>
                    <View style={{ flexDirection: 'row', width: '50%' }}>
                      {people}
                      <Text style={styles.font}>
                        委託人:{item.be_cared_name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: '50%' }}>
                      {helper}
                      <Text style={styles.font}>志工:{item.server_name}</Text>
                    </View>
                  </View>

                  <View style={styles.item}>
                    {home}
                    <Text style={styles.font}>地址:{item.address}</Text>
                  </View>

                  <View style={styles.item}>
                    {time}
                    <Text
                      style={styles.font}
                    >{`開始時間:${item.start_date} ${item.start_time}`}</Text>
                  </View>
                  <View style={styles.item}>
                    {time}
                    <Text
                      style={styles.font}
                    >{`結束時間:${item.end_date} ${item.end_time}`}</Text>
                  </View>

                  <View style={styles.service_item_item}>
                    {service}
                    <Text style={styles.font}>{'服務項目:'}</Text>
                  </View>
                  <Text style={styles.service_item_font}>
                    {`${item.service_item[0] ? '陪伴散步 ' : ''}${
                      item.service_item[1] ? '陪伴運動 ' : ''
                    }${item.service_item[2] ? '陪伴購物 ' : ''}${
                      item.service_item[3] ? '送餐服務 ' : ''
                    }${item.service_item[4] ? '文書服務' : ''}`}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.contract_id}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ff7f50',
    margin: 8,
    paddingLeft: 5,
    paddingBottom: 12 //下面的border線會卡到服務項目的字
  },
  item: {
    flexDirection: 'row',
    marginBottom: 10
  },
  service_item_item: {
    flexDirection: 'row'
  },
  font: {
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap'
  },

  service_item_font: {
    fontSize: 14,
    marginLeft: 20
  }
});
