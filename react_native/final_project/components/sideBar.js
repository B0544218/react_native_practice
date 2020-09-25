/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Body,
  Text
} from 'native-base';

export default class Sidebar extends Component {
  handle = text => {
    this.props.filter(text);
    this.props.closeDrawer();
  };
  allof = () => {
    this.props.allof();
  };
  render() {
    return (
      <Container
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('臺北市')}
        >
          <Text style={{ color: 'green' }}>臺北市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('基隆市')}
        >
          <Text style={{ color: 'green' }}>基隆市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('新北市')}
        >
          <Text style={{ color: 'green' }}>新北市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('連江縣')}
        >
          <Text style={{ color: 'green' }}>連江縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('宜蘭縣')}
        >
          <Text style={{ color: 'green' }}>宜蘭縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('釣魚臺')}
        >
          <Text style={{ color: 'green' }}>釣魚臺</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('新竹市')}
        >
          <Text style={{ color: 'green' }}>新竹市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('新竹縣')}
        >
          <Text style={{ color: 'green' }}>新竹縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('桃園市')}
        >
          <Text style={{ color: 'green' }}>桃園市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('苗栗縣')}
        >
          <Text style={{ color: 'green' }}>苗栗縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('臺中市')}
        >
          <Text style={{ color: 'green' }}>臺中市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('彰化縣')}
        >
          <Text style={{ color: 'green' }}>彰化縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('南投縣')}
        >
          <Text style={{ color: 'green' }}>南投縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('嘉義市')}
        >
          <Text style={{ color: 'green' }}>嘉義市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('嘉義縣')}
        >
          <Text style={{ color: 'green' }}>嘉義縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('雲林縣')}
        >
          <Text style={{ color: 'green' }}>雲林縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('臺南市')}
        >
          <Text style={{ color: 'green' }}>臺南市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('高雄市')}
        >
          <Text style={{ color: 'green' }}>高雄市</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('南海島')}
        >
          <Text style={{ color: 'green' }}>南海島</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('澎湖縣')}
        >
          <Text style={{ color: 'green' }}>澎湖縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('金門縣')}
        >
          <Text style={{ color: 'green' }}>金門縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('屏東縣')}
        >
          <Text style={{ color: 'green' }}>屏東縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('臺東縣')}
        >
          <Text style={{ color: 'green' }}>臺東縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={() => this.handle('花蓮縣')}
        >
          <Text style={{ color: 'green' }}>花蓮縣</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 5, marginVertical: 10 }}
          onPress={this.allof}
        >
          <Text style={{ color: 'green' }}>全部縣市</Text>
        </TouchableOpacity>
      </Container>
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
