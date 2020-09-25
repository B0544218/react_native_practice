import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { GiftedChat, Avatar } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
//import message from '../message';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    _isMounted = false;

    this.state = {
      messages: [],
      roomId: '',
      my_uid: '',
      my_name: '',
      my_graph: ''
    };
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
      .once('value', snapshot => {
        this.setState({
          my_name: snapshot.val().name,
          my_uid: snapshot.val().uid,
          my_graph: snapshot.val().image
        });
      });
    this._isMounted = true;
    this.setState({
      messages: []
    });
    const { navigation } = this.props;
    //console.log(navigations);
    const id1 = navigation.getParam('id1');
    const id2 = navigation.getParam('id2');
    this.socket = io('http://120.126.19.107:3001/');
    if (id1 > id2) {
      this.setState({ roomId: id1 + '_' + id2 });
      this.socket.emit('join-a-room', id1 + '_' + id2);
      fetch('http://120.126.19.107:3000/get_Message', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: id1 + '_' + id2,
          //下面是存在對方聯絡欄裡
          sender: id2,
          receiver: id1,
          my_name: navigation.getParam('my_name'),
          my_graph: navigation.getParam('my_graph'),
          his_name: navigation.getParam('his_name'),
          his_graph: navigation.getParam('his_graph')
        })
      })
        .then(response => response.json())
        .then(responseJsonData => {
          this.setState({ messages: responseJsonData.messages });
        });
      this.socket.on('rt-change', msg => {
        if (this._isMounted) {
          this.setState({
            messages: GiftedChat.append([...this.state.messages], msg)
          });
        }
      });
    } else {
      this.setState({ roomId: id2 + '_' + id1 });
      this.socket.emit('join-a-room', id2 + '_' + id1);
      fetch('http://120.126.19.107:3000/get_Message', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: id2 + '_' + id1,
          //下面是存在對方聯絡欄裡
          sender: id2,
          receiver: id1,
          my_name: navigation.getParam('my_name'),
          my_graph: navigation.getParam('my_graph'),
          his_name: navigation.getParam('his_name'),
          his_graph: navigation.getParam('his_graph')
        })
      })
        .then(response => response.json())
        .then(responseJsonData => {
          this.setState({ messages: responseJsonData.messages });
        });
      this.socket.on('rt-change', msg => {
        //console.log(msg);
        if (this._isMounted) {
          this.setState({
            messages: GiftedChat.append([...this.state.messages], msg)
          });
        }
      });
    }
  }
  componentWillUnmount() {
    console.log('close');
    this._isMounted = false;
  }
  onSend(messages = []) {
    if (this._isMounted) {
      console.log(messages);
      const { navigation } = this.props;
      messages[0].roomId = this.state.roomId;
      messages[0].sender = navigation.getParam('id1');
      messages[0].receiver = navigation.getParam('id2');

      this.socket.emit('message', messages);
    }
    //this.socket.emit('chat message1', messages);
  }
  render() {
    return (
      <GiftedChat
        renderUsernameOnMessage={true}
        textInputProps={{ autoFocus: true }}
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: this.state.my_uid,
          name: this.state.my_name,
          avatar: this.state.my_graph
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
