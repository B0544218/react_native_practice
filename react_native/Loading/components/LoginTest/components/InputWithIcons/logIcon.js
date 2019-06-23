import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const InputWithIcons = props => {
  return (
    <View>
      <View>
        <Icon name="user" size={30} color="#4F8EF7" />
      </View>

      <Text>children Component</Text>
    </View>
  );
};

export default InputWithIcons;
