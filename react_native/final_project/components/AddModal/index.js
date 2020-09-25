import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import FlatListData from './../../mockData/FlatListData';
import { insertNewFlatListData } from '../../services/FlatListDataService';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Button from 'apsl-react-native-button';

export default class AddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newData: {}
    };
  }
  showAddModal = () => {
    this.refs.addModal.open();
  };
  changeTextHandler = data => {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    this.setState({
      newData: {
        albumId: 1,
        title: data,
        url: 'http://placehold.it/600/' + color,
        thumbnailUrl: 'http://placehold.it/150/' + color
      }
    });
  };
  submitFormHandler = () => {
    // FlatListData.unshift(this.state.newData);
    // this.props.parentFlatList.refreshFlatList();

    insertNewFlatListData(this.state.newData).then(data => {
      if (+data.id > 0) {
        this.props.parentFlatList.refreshDataFromServer();
      }
    });

    this.refs.addModal.close();
  };

  render() {
    return (
      <Modal
        ref="addModal"
        position={'center'}
        style={{
          height: 300,
          width: 300,
          borderRadius: 10
        }}
      >
        <Text style={{ fontSize: 20, padding: 20, alignSelf: 'center' }}>
          添加数据
        </Text>
        <TextInput
          placeholder="请输入标题"
          style={{
            height: 40,
            borderColor: '#ddd',
            borderWidth: 1,
            margin: 5,
            padding: 5
          }}
          onChangeText={this.changeTextHandler}
        />
        <Button
          style={{ backgroundColor: 'tomato', margin: 5, borderWidth: 0 }}
          textStyle={{ fontSize: 18, color: 'white' }}
          onPress={() => {
            this.submitFormHandler();
          }}
        >
          提交
        </Button>
      </Modal>
    );
  }
}
