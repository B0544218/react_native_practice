import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  SectionList
} from 'react-native';
import SectionItem from './groupchild/sectionItem';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Group extends Component {
  handlerShares = () => {
    this.props.navigation.navigate('SharesScreen');
  };
  handlerPublics = () => {
    this.props.navigation.navigate('PublicsScreen');
  };
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      console.log('success didmount');
    });
  }

  sectionKey = info => {
    var txt = info.section.key;
    return (
      <Text
        style={{
          height: 50,
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: '#9CEBBC',
          color: 'white',
          fontSize: 30
        }}
      >
        {txt}
      </Text>
    );
  };
  render() {
    var sections = [
      {
        key: 'A',
        data: [{ title: '阿幕幕' }, { title: '畝畝畝' }, { title: '阿乖' }]
      },
      {
        key: 'B',
        data: [{ title: '貝西' }, { title: 'bacon' }, { title: '８嘎' }]
      },
      {
        key: 'C',
        data: [{ title: 'Co No DIO' }, { title: 'Ci SA' }]
      }
    ];
    sections[1].data.push({ title: 'BB' });
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.title_top}>
          <View style={styles.title_text}>
            <TouchableOpacity onPress={this.handlerPublics}>
              <Text>公開</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.title_text}>
            <TouchableOpacity onPress={this.handlerShares}>
              <Text>私密</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SectionList
          renderSectionHeader={this.sectionKey}
          renderItem={({ item, index }) => {
            return <SectionItem item={item} index={index} />;
          }}
          sections={sections}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title_top: {
    height: Dimensions.get('window').height / 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap'
  },
  title_text: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  imagestyle: {
    width: screenWidth / 6,
    height: screenWidth / 6,
    borderRadius: 30
  },
  tick: {}
});
