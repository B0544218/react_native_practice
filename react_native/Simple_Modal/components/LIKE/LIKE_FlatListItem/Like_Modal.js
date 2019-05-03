import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Button
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
import { Item } from 'native-base';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
export default class Like_modal extends Component {
  render() {
    const item = this.props.item;
    return (
      <ScrollView style={styles.modalContent}>
        <View style={{ marginTop: 20, marginLeft: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: devicewidth / 4, height: deviceheight / 4 }}
              source={{ uri: item.image.img }}
            />
            <View style={{ marginLeft: 20 }}>
              <View
                style={{
                  marginBottom: 10,
                  width: devicewidth / 2
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 18 }}
                >
                  護理員:
                </Text>
              </View>
              <View style={{ marginBottom: 10, width: devicewidth / 2 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 18 }}
                >
                  服務區:
                </Text>
              </View>
              <View style={{ marginBottom: 10, width: devicewidth / 2 }}>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={{ fontSize: 18 }}
                >
                  聯絡方式: {'\n'}
                  一一一一一一一一二二二二二二二二二三三三三三三三三三
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>Hello!</Text>
        <Text>te!</Text>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  modalContent: {
    width: devicewidth - devicewidth / 10,
    height: deviceheight - deviceheight / 10,
    backgroundColor: 'white',

    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  }
});
