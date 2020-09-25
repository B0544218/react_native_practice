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
    return <Searchchild prop_navigation={this.props.navigation} />;
  }
}
