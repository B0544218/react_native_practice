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
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import QRCode from 'react-native-qrcode';
import Modal from 'react-native-modal';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Point_record extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [], showModal: false, qrtext: '', spinner: false };
  }

  QRgenerate = (care_type, region, time, uid, name) => {
    this.setState({
      showModal: true,
      qrtext: care_type + ',' + region + ',' + time + ',' + uid + ',' + name
    });
  };

  componentDidMount() {
    this.setState({
      spinner: !this.state.spinner
    });
    setTimeout(() => {
      this.setState({
        spinner: false
      });
    }, 2000);

    fetch('http://120.126.19.107:3000/find_point', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: firebase.auth().currentUser.uid
      })
    })
      .then(response => response.json())
      .then(responsedata => {
        console.log(responsedata);
        responsedata.sort((a, b) => (a.time_num > b.time_num ? -1 : 1)); //sort reverse
        //not reverse
        // responsedata.sort(
        //   (a, b) => parseFloat(a.time_num) - parseFloat(b.time_num)
        // );
        this.setState({ users: responsedata });
      });
  }
  render() {
    return (
      <View
        style={{ backgroundColor: '#f5f5dc', width: '100%', height: '100%' }}
      >
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        {this.state.showModal ? (
          <Modal
            isVisible={this.state.showModal}
            style={{ backgroundColor: 'white' }}
            onBackButtonPress={() => {
              this.setState({ showModal: false });
            }}
            onBackdropPress={() => this.setState({ showModal: false })}
          >
            <View
              style={{
                // backgroundColor: 'white',

                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <QRCode
                value={this.state.qrtext}
                size={200}
                bgColor="purple"
                fgColor="white"
              />
            </View>
          </Modal>
        ) : null}
        <FlatList
          data={this.state.users}
          renderItem={({ item }) => (
            <View style={styles.container1}>
              {item.type == 1 ? (
                <View>
                  <Text style={styles.font}>
                    {`於 ${Moment(new Date(item.time_num)).format(
                      'YYYY-MM-DD'
                    )} 購買功能得到點數`}
                  </Text>
                  {/* <Text style={styles.font}>{item.receiver}</Text> */}
                  <Text
                    style={styles.font}
                  >{`您的帳戶獲得了 ${item.points} 點`}</Text>
                </View>
              ) : null}
              {item.type == 3 ? (
                <View>
                  <Text style={styles.font}>
                    {`於 ${Moment(new Date(item.time_num)).format(
                      'YYYY-MM-DD'
                    )} 兌換服務使用點數`}
                  </Text>

                  {/* <Text style={styles.font}>{item.giver}</Text> */}
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={styles.font}
                    >{`您的帳戶減少了 ${item.points}點`}</Text>
                    {item.validity ? (
                      <TouchableOpacity
                        style={{ marginLeft: 8 }}
                        onPress={() =>
                          this.QRgenerate(
                            item.care_type,
                            item.region,
                            item.time_num,
                            item.giver,
                            item.name
                          )
                        }
                      >
                        <Icon name="qrcode" size={30} color="#4169E1" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ) : null}
              {item.type == 2 ? (
                <View>
                  {item.giver == firebase.auth().currentUser.uid ? (
                    <View>
                      <Text style={styles.font}>
                        {`於 ${Moment(new Date(item.time_num)).format(
                          'YYYY-MM-DD'
                        )} 轉移點數給其他用戶`}
                      </Text>
                      {/* <Text style={styles.font}>{item.giver}</Text>
                      <Text style={styles.font}>{item.receiver}</Text> */}
                      <Text
                        style={styles.font}
                      >{`您的帳戶減少了 ${item.points}點`}</Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.font}>
                        {`於 ${Moment(new Date(item.time_num)).format(
                          'YYYY-MM-DD'
                        )} 從其他用戶得到點數`}
                      </Text>
                      {/* <Text style={styles.font}>{item.giver}</Text>
                      <Text style={styles.font}>{item.receiver}</Text> */}
                      <Text
                        style={styles.font}
                      >{`您的帳戶獲得了 ${item.points}點`}</Text>
                    </View>
                  )}
                </View>
              ) : null}
              {item.type == 4 ? (
                <View>
                  {item.server == firebase.auth().currentUser.uid ? (
                    <View>
                      <Text style={styles.font}>
                        {`於 ${Moment(new Date(parseInt(item.time_num))).format(
                          'YYYY-MM-DD'
                        )} 志工服務得到點數`}
                      </Text>
                      {/* <Text style={styles.font}>{item.server}</Text> */}
                      <Text
                        style={styles.font}
                      >{`您的帳戶獲得了 ${item.points}點`}</Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.font}>
                        {`於 ${Moment(new Date(parseInt(item.time_num))).format(
                          'YYYY-MM-DD'
                        )} 志工服務花費點數`}
                      </Text>
                      {/* <Text style={styles.font}>{item.server}</Text> */}
                      <Text
                        style={styles.font}
                      >{`您的帳戶減少了 ${item.points}點`}</Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          )}
          keyExtractor={item => item.time_num + ''}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container1: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff7f50',
    margin: 8
  },
  item: {
    flexDirection: 'row',
    margin: 10
  },
  font: {
    marginLeft: 15,
    fontSize: 20
  }
});
