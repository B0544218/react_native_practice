import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  Modal,
  WebView,
  TextInput
} from 'react-native';
/** */
import Spinner from 'react-native-loading-spinner-overlay';

const screenWidth = Dimensions.get('window').width;
export default class Searchchild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: 'Pending',
      inputValue: '',
      /** */
      spinner: false
    };
  }
  componentDidMount() {
    /** */
    this.setState({
      spinner: !this.state.spinner
    });
    setTimeout(() => {
      this.setState({
        spinner: false
      });
    }, 1500);
  }
  handlepass = path => {
    const { prop_navigation } = this.props;
    prop_navigation.navigate(path);
  };
  handleResponse = data => {
    if (data.title === 'success') {
      //對應ejs的success title
      console.log('entry');
      this.setState({ showModal: false, status: 'Complete' }, () => {
        console.log(this.state.status);
      });
    } else if (data.title === 'cancel') {
      this.setState({ showModal: false, status: 'Cancelled' });
    } else {
      return;
    }
  };
  render() {
    return (
      <View>
        <View style={styles.container}>
          {/** */}
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
          <View
            style={{
              alignItems: 'center',
              margin: screenWidth / 22
            }}
          >
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
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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

          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
          <View style={{ alignItems: 'center', margin: screenWidth / 22 }}>
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
        <View style={{ marginTop: 10 }}>
          <Modal
            visible={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}
          >
            {/**在genymotion10.0.3.2或10.0.2.2連到真實環境localhost
             */}
            {/** 'http://10.0.3.2:3000'
             不用genymotion http://localhost:3000*/}
            <WebView
              source={{ uri: 'http://localhost:3000' }}
              onNavigationStateChange={data => this.handleResponse(data)}
              injectedJavaScript={`document.getElementById('price').value=${
                this.state.inputValue
              };document.f1.submit()`}
              //讓form name=f1 自動被submit
            />
          </Modal>
          <TouchableOpacity
            style={{ width: 300, height: 50 }}
            onPress={() => {
              this.setState({ showModal: true });
            }}
          >
            <Text>Pay Paypal</Text>
          </TouchableOpacity>
          <TextInput
            style={{
              height: 40,
              width: 100,
              borderColor: 'gray',
              borderWidth: 1
            }}
            onChangeText={text => {
              const newText = text.replace(/[^\d]+/, '');
              this.setState({ inputValue: newText });
            }}
            value={this.state.inputValue}
            keyboardType="numeric"
          />
          <Text>payment status: {this.state.status}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    width: screenWidth,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center', //換下一行時在最左邊增加用flex-start //這邊用center是指換下一行時以中間為基準
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
