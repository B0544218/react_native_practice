import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
export default class Searchchild extends Component {
  handlepass = path => {
    const { prop_navigation } = this.props;
    prop_navigation.navigate(path);
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('Like')}>
            <Image
              source={require('./../../assets/collection.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>我的收藏</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('Group')}>
            <Image
              source={require('./../../assets/weather.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>查看天氣</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity>
            <Image
              source={require('./../../assets/document.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>說明文件</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('PersonalFile')}>
            <Image
              source={require('./../../assets/id_card.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>個人資料</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('Message')}>
            <Image
              source={require('./../../assets/history.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>歷史紀錄</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity>
            <Image
              source={require('./../../assets/user_circle.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>成員查看</Text>
        </View>

        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('Handshake')}>
            <Image
              source={require('./../../assets/contract.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>
          <Text>合約轉移</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => this.handlepass('During')}>
            <Image
              source={require('./../../assets/OK.png')}
              style={{
                width: screenWidth / 10,
                height: screenWidth / 10,
                borderRadius: 30
              }}
            />
          </TouchableOpacity>

          <Text>確定合約</Text>
        </View>
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
