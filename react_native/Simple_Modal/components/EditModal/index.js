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
import { updateFlatListData } from '../../services/FlatListDataService';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Button from 'apsl-react-native-button';

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editData: {},
      index: 0
    };
  }
  showEditModal = (item, index) => {
    console.log(item, index);
    this.setState(
      {
        editData: item,
        index
      },
      () => {
        this.refs.editModal.open();
      }
    );
  };
  changeTextHandler = data => {
    var editDataObj = Object.assign({}, this.state.editData, { title: data });
    this.setState({
      editData: editDataObj
    });
  };
  submitFormHandler = () => {
    // console.log(this.state.editData);
    // FlatListData[this.state.index] = this.state.editData;
    // this.props.parentFlatList.refreshFlatList();
    updateFlatListData(this.state.editData).then(data => {
      if (+data.id > 0) {
        this.props.parentFlatList.refreshDataFromServer();
      }
    });

    this.refs.editModal.close();
  };

  render() {
    return (
      <Modal
        ref="editModal"
        position={'center'}
        style={{
          height: 300,
          width: 300,
          borderRadius: 10
        }}
      >
        <Text style={{ fontSize: 20, padding: 20, alignSelf: 'center' }}>
          修改数据
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
          value={this.state.editData.title}
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
