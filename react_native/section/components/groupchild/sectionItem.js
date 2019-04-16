import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class SectionItem extends Component {
  render() {
    const { item, index } = this.props; //item為sections.data內逐一各項

    return (
      <Text
        style={{
          height: 60,
          textAlignVertical: 'center',
          backgroundColor: '#ffffff',
          color: '#5C5C5C',
          fontSize: 15
        }}
      >
        {item.title}
      </Text>
    );
  }
}
