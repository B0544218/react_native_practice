import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Timeline from 'react-native-timeline-listview';
import firebase from '@firebase/app';
import '@firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const window = Dimensions.get('window');
console.log(window.width);

export default class Like_modal extends Component {
  constructor() {
    super();
    this.state = {
      my_name: '',
      my_graph: '',
      is_Volunteer: 1,
      data: [
        {
          time: '',
          title: '基本資料',
          description: `  姓名 : \n\n  語言 : \n\n`
        },
        {
          time: '',
          title: '服務區域',
          description: `  \n\n\n`
        },

        {
          time: '',
          title: '聯絡資料',
          description: `  信箱 : \n\n\n  電話 : \n\n\n`
        },
        { time: '', title: '擅長服務項目', description: `  \n\n\n` },
        { time: '', title: '', description: `` }
      ]
    };
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .once('value', snapshot => {
        this.setState({
          is_Volunteer: snapshot.val().Volunteer.v,
          my_name: snapshot.val().user_data.name,
          my_graph: snapshot.val().user_data.image
        });
      });
    const { item } = this.props;
    var service_item = '';
    for (i = 0; i < 5; i++) {
      if (item.service_item[i]) {
        if (i == 0) {
          service_item += ' 陪伴散步\n';
        } else if (i == 1) {
          service_item += ' 陪伴購物\n';
        } else if (i == 2) {
          service_item += ' 送餐服務\n';
        } else if (i == 3) {
          service_item += ' 陪伴運動\n';
        } else if (i == 4) {
          service_item += ' 文書服務\n';
        }
      }
    }
    //if() item.service_item[0]
    this.setState({
      data: [
        {
          time: '',
          title: '基本資料',
          description: `姓名 : ${item.name}\n\n語言 : ${item.language}\n\n`
        },
        {
          time: '',
          title: '服務區域',
          description: ` 縣市 : ${item.region}\n`
        },

        {
          time: '',
          title: '聯絡資料',
          description: `信箱 : \n${item.mail}\n\n電話 : ${item.phone}\n\n`
        },
        {
          time: '',
          title: '擅長服務項目',
          description: (
            <Text style={{ fontSize: 15 }}>{`${service_item}\n\n`}</Text>
          )
        },
        { time: '', title: '', description: `` }
      ]
    });
  }
  handle_message = () => {
    this.props.close_Modal();
    this.props.navigation_message.navigate('Message', {
      his_name: this.props.item.name,
      his_graph: this.props.item.image,
      my_name: this.state.my_name,
      my_graph: this.state.my_graph,
      id1: this.props.item.uid,
      id2: firebase.auth().currentUser.uid
    });
    //{item.uid + '_' + firebase.auth().currentUser.uid}
  };
  handle_private = () => {
    this.props.close_Modal();
    this.props.navigation_message.navigate('PrivatesScreen', {
      paramName: [{ object_id: this.props.item.uid }]
    });
  };
  render() {
    const { item, is_like } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ParallaxScrollView
            style={{ flex: 1, backgroundColor: 'hotpink', overflow: 'hidden' }}
            renderBackground={() => (
              <Image
                source={{
                  uri: `https://img.51miz.com/Element/00/74/42/89/43b6b01a_E744289_f091e054.jpg`,
                  width: window.width,
                  height: window.height / 4
                }}
              />
            )}
            renderForeground={() => (
              <View style={styles.parallaxHeader}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: item.image,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                  }}
                />
              </View>
            )}
            parallaxHeaderHeight={window.height / 4}
          >
            {is_like ? (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingLeft: 10,
                  marginBottom: 10
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text>邀請照護 : </Text>
                  <TouchableOpacity onPress={this.handle_private}>
                    <Icon name="user-plus" size={30} color="#4169E1" />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text>聊聊 : </Text>
                  <TouchableOpacity onPress={this.handle_message}>
                    <Icon name="comments" size={30} color="#4169E1" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <Timeline
              innerCircle={'dot'}
              columnFormat="two-column"
              titleStyle={styles.font}
              data={this.state.data}
            />
          </ParallaxScrollView>
        </View>
      </View>
    );
  }
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  parallaxHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column'
    //paddingTop: window.height / 25
  },
  avatar: {
    marginBottom: 10,
    marginLeft: window.width / 5,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'purple',
    fontSize: 24,
    paddingVertical: 5
  },
  font: {
    fontSize: 20,
    color: 'skyblue'
  }
});
