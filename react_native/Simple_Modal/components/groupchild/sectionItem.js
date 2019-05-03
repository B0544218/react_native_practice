import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import Group_Modal from './group_Modal';

export default class SectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = { visibleModal: false };
  }
  press = () => {
    this.setState({ visibleModal: true });
    console.log(this.props.section.key);
    console.log(this.props.item.content);
  };
  button = () => {
    switch (this.props.section.key) {
      case '私密對象':
        return (
          <Button
            title="私密對象取消"
            onPress={() => this.setState({ visibleModal: false })}
          />
        );
      case '別人請求':
        return (
          <Button
            title="別人請求取消"
            onPress={() => this.setState({ visibleModal: false })}
          />
        );
      default:
        return (
          <Button
            title="公開委託取消"
            onPress={() => this.setState({ visibleModal: false })}
          />
        );
    }
  };
  render() {
    const { item, index } = this.props; //item為sections.data內逐一各項
    return (
      <View>
        <TouchableOpacity onPress={this.press}>
          <Text
            style={{
              height: 60,
              textAlignVertical: 'center',
              backgroundColor: '#ffffff',
              color: '#5C5C5C',
              fontSize: 15
            }}
          >
            {item.content}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.visibleModal}
          onBackButtonPress={() => {
            this.setState({ visibleModal: false });
          }}
          onBackdropPress={() => this.setState({ visibleModal: false })}
        >
          <View style={styles.modalContent}>
            <View style={{ flex: 1 }}>
              <Group_Modal item={item} />
            </View>
            {this.button()}
          </View>
        </Modal>
      </View>
    );
  }
}
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  modalContent: {
    width: devicewidth - devicewidth / 10,
    height: deviceheight - deviceheight / 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  }
});
