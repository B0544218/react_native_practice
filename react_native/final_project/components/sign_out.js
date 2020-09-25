import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default class Signout extends Component {
  componentDidMount() {
    this.props.navigation.navigate('login');
  }

  render() {
    return <View></View>;
  }
}
