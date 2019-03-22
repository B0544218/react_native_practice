import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Searchchild from './searchChild/searchchild';
const screenWidth = Dimensions.get('window').width;
export default class Handshake extends Component {
  render() {
    console.log(this.props.navigation);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Handshake</Text>
        <Searchchild prop_navigation={this.props.navigation} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'space-around', //換下一行時在最左邊增加
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
