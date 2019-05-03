import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class message extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
message.navigationOptions = {
  title: 'Message',
  headerTitleStyle: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  headerTintColor: '#6666FF'
};
