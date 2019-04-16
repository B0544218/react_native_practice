import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class tests extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>test</Text>
      </View>
    );
  }
}
tests.navigationOptions = {
  title: 'Test',
  headerTitleStyle: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  headerTintColor: '#6666FF'
};
