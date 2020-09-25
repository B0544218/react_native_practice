import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
/** */
import Animation from 'lottie-react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class Searchchild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: 'Pending',
      inputValue: '',
      money: 0,
      show_credit: false,
      show_transfer: false,
      show_donation: false
      /** */
    };
  }
  componentDidMount() {}
  handlepass = path => {
    const { prop_navigation } = this.props;
    prop_navigation.navigate(path); //沒用
  };

  onPressButton = () => {
    const { prop_navigation } = this.props;
    prop_navigation.navigate('PointScreen'); //沒用
    // this.props.navigation.navigate('PointScreen');
  };
  handle_credit = () => {
    const { prop_navigation } = this.props;
    prop_navigation.navigate('PurchaseScreen'); //購買
    //this.setState({ show_credit: true });
  };
  handle_transfer = () => {
    //this.setState({ show_transfer: true });
    const { prop_navigation } = this.props;
    prop_navigation.navigate('TransferScreen'); //轉移
  };
  handle_donate = () => {
    // this.setState({ show_donation: true });
    const { prop_navigation } = this.props;
    prop_navigation.navigate('DonationScreen'); //兌換
  };
  render() {
    const deal = require('./1147-deal.json');
    const credit_card = require('./1758-credit-card.json');
    const heartbeat = require('./4565-heartbeat-medical.json');
    const search = require('./2269-search-file.json');
    return (
      <View style={styles.container}>
        <View>
          <View
            style={{
              //screenHeight * 0.3
              height: '30%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ImageBackground
              source={{
                uri:
                  'https://tc.sinaimg.cn/maxwidth.800/tc.service.weibo.com/mmbiz_qpic_cn/fa8aa68db6ba1eb2dcdca7c5e7185de8.jpg'
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <View style={styles.cover}>
                <Text style={styles.header}>不花錢的老後照顧</Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              //screenHeight * 0.7
              width: '100%',
              height: '70%',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}
          >
            <View style={styles.item}>
              <TouchableHighlight //TouchableHighlight要有onpress才能用，下面要用view包
                style={styles.innwh}
                onPress={this.handle_credit}
                underlayColor={'rgba(255, 255, 255, 0.8)'}
              >
                <View>
                  <Animation
                    style={{
                      width: 135,
                      height: 135
                    }}
                    source={credit_card}
                  />
                  <Text style={styles.font}>受保障的交易</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.item}>
              <TouchableHighlight
                onPress={this.handle_transfer}
                underlayColor={'rgba(255, 255, 255, 0.7)'}
                style={styles.innwh}
              >
                <View>
                  <Animation
                    style={{
                      width: 130,
                      height: 130
                    }}
                    source={deal}
                  />

                  <Text style={styles.font}>轉讓功能</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.item}>
              <TouchableHighlight
                style={styles.innwh}
                onPress={this.handle_donate}
                underlayColor={'rgba(255, 255, 255, 0.7)'}
              >
                <View>
                  <Animation
                    style={{
                      width: 130,
                      height: 130
                    }}
                    source={heartbeat}
                  />
                  <Text style={styles.font}>兌換</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.item}>
              <TouchableHighlight
                style={styles.innwh}
                onPress={this.onPressButton}
                underlayColor={'rgba(255, 255, 255, 0.7)'}
              >
                <View>
                  <Animation
                    style={{
                      width: 130,
                      height: 130
                    }}
                    source={search} ////要改其他lottie嗎???
                  />
                  <Text style={styles.font}>交易紀錄</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>

        {/** */}
        {/* <Custom_Modal
          style={{ marginBottom: screenHeight / 3 }}
          backdropColor={'rgba(100, 100, 100, 0.5)'}
          isVisible={this.state.show_donation}
          onBackButtonPress={() => {
            this.setState({ show_donation: false });
          }}
          onBackdropPress={() => this.setState({ show_donation: false })}
        >
          <Donate />
        </Custom_Modal> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(47,163,218,0.4)'
  },
  innwh: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    elevation: 1
  },
  item: {
    width: '50%',
    height: '50%',
    padding: 2
  },
  font: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  header: {
    alignSelf: 'center',
    marginTop: '16%',
    marginRight: '6%',
    fontSize: 20,
    paddingLeft: 30,
    paddingRight: 30,
    borderWidth: 4,
    borderColor: 'white',
    padding: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  cover: {
    flex: 1,
    backgroundColor: 'rgba(47,163,218,0.4)'
  }
});
