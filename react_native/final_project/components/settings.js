import React, { Component } from 'react';
import {
  ScrollView,
  Image,
  Text,
  Dimensions,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Taiwan from './groupchild/finish.json';
import Swiper from 'react-native-swiper';

import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
import '@firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CheckBox, ListItem } from 'native-base';
import Mail from 'react-native-vector-icons/Feather';
import Langue from 'react-native-vector-icons/MaterialIcons';
import Name from 'react-native-vector-icons/Ionicons';
import Phone from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { BaseComponent, AreaPicker } from 'react-native-pickers';

// import { Hoshi } from 'react-native-textinput-effects';
////////////////////////////////////////////  消除討厭setting timer黃字
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
//////////////////////////////////////////////

export default class hello extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      dp: null, //photo在firebase的路徑
      photo: null,
      name: '',
      language: '',
      mail: '',
      phone: '',
      region: '',
      region2: '',
      isVolunteer: 1,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      point: undefined
    };
  }
  componentDidMount() {
    fetch('http://120.126.19.107:3000/get_point', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: firebase.auth().currentUser.uid
      })
    })
      .then(response => response.json())
      .then(responseData => {
        var user_point = parseFloat(responseData.point).toFixed(1); //避免mongodb  bug
        this.setState({ point: user_point });
      });
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .once('value', snapshot => {
        const user = snapshot.val();
        this.setState({
          isVolunteer: user.Volunteer.v,
          name: user.user_data.name,
          language: user.user_data.language,
          mail: user.user_data.mail,
          phone: user.user_data.phone,
          region: user.user_data.region,
          photo: user.user_data.image,
          checked1: user.user_data.service_item[0],
          checked2: user.user_data.service_item[1],
          checked3: user.user_data.service_item[2],
          checked4: user.user_data.service_item[3],
          checked5: user.user_data.service_item[4]
        });
      });
  }
  handle = () => {
    this.AreaPicker.show();
  };
  openPicker = () => {
    // this.setState({
    //   loading: true
    // });
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const uid = 'profile_picture';
    console.log('handle......');
    ImagePicker.openPicker({
      width: 250,
      height: 250,
      cropperCircleOverlay: true,
      cropping: true
    })
      .then(image => {
        // this.setState({
        //   /**先不用管 */
        //   photo: image
        // });

        let uploadBlob = null;
        const imagePath = image.path;
        const imageRef = firebase
          .storage()
          .ref(uid)
          .child(firebase.auth().currentUser.uid + '.jpg'); //這裡要應用成個別用戶的頭像的話 修改成currentUser_id
        let mime = 'image/jpg';
        fs.readFile(imagePath, 'base64')
          .then(data => {
            //console.log(Blob.build);

            return Blob.build(data, { type: `${mime};BASE64` })
              .then(blob => {
                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime });
              })
              .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL();
              })
              .then(url => {
                let userData = {};
                this.setState({
                  // loading: false,
                  dp: url
                });
              })
              .then(() => {
                //11/21
                fetch('http://120.126.19.107:3000/update_image', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    user_id: firebase.auth().currentUser.uid,
                    path: this.state.dp,
                    user_name: this.state.name
                  })
                }).then(responseData => {
                  console.log(responseData);
                });

                firebase
                  .database()
                  .ref(
                    'users/' + firebase.auth().currentUser.uid + '/user_data'
                  )
                  .update({
                    image: this.state.dp
                  });
              })
              .then(() => {
                this.setState({ photo: this.state.dp });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(err => {
        console.log('openCamera not catch' + err.toString());
      });
  };

  rewrite = () => {
    Alert.alert('提醒', '修改完成');
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
      .update({
        language: this.state.language,
        mail: this.state.mail,
        name: this.state.name,
        phone: this.state.phone,
        region: this.state.region2,
        service_item: [
          this.state.checked1,
          this.state.checked2,
          this.state.checked3,
          this.state.checked4,
          this.state.checked5
        ]
      });
  };
  redirect_web = () => {
    Linking.canOpenURL(
      'https://docs.google.com/forms/d/10n_E5b1uRufkYCBSAHywI6hBG3AxK3XulxmGesULdb4/edit'
    ).then(supported => {
      if (supported) {
        Linking.openURL(
          'https://docs.google.com/forms/d/10n_E5b1uRufkYCBSAHywI6hBG3AxK3XulxmGesULdb4/edit'
        );
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };
  redirect_web2 = () => {
    Linking.canOpenURL(
      'https://docs.google.com/forms/d/1ljDRq7BO4F_N7eFlKUF2fLhJA8ersitx1JvK4lWjEPg/edit'
    ).then(supported => {
      if (supported) {
        Linking.openURL(
          'https://docs.google.com/forms/d/1ljDRq7BO4F_N7eFlKUF2fLhJA8ersitx1JvK4lWjEPg/edit'
        );
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };
  render() {
    const m = <Mail name="mail" size={18} />;
    const people = <Name name="ios-people" size={18} />;
    const langue = <Langue name="language" size={18} />;
    const phone = <Phone name="cellphone" size={18} />;
    const { photo } = this.state;
    const member_backcolor =
      this.state.isVolunteer == 3 || this.state.isVolunteer == 4
        ? '#E0E0E0'
        : 'white';
    const member_color =
      this.state.isVolunteer == 3 || this.state.isVolunteer == 4
        ? '#A0A0A0'
        : '#6A6AFF';
    const volunteer_backcolor =
      this.state.isVolunteer == 3 || this.state.isVolunteer == 4
        ? 'white'
        : '#E0E0E0';
    const volunteer_color =
      this.state.isVolunteer == 3 || this.state.isVolunteer == 4
        ? '#6A6AFF'
        : '#A0A0A0';
    return (
      <LinearGradient
        colors={['#c4e1ff', '#c4e1ff']}
        style={{
          flex: 1,
          alignItems: 'center',

          height: Dimensions.get('window').height
        }}
      >
        <ScrollView>
          <Swiper
            autoplay
            autoplayTimeout={4}
            width={Dimensions.get('window').width}
            height={(Dimensions.get('window').width * 371) / 1150}
            showsButtons
          >
            <View>
              <TouchableOpacity onPress={this.redirect_web}>
                <Image
                  style={styles.swiper_image}
                  resizeMethod="resize"
                  source={require('./advertise1.jpg')}
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.redirect_web2}>
                <Image
                  style={styles.swiper_image}
                  resizeMethod="resize"
                  source={require('./advertise2.jpg')}
                />
              </TouchableOpacity>
            </View>
          </Swiper>

          <View style={{ flexDirection: 'row' }}>
            {this.state.point == undefined ? null : (
              <View
                style={{ flex: 1, marginRight: '5%', alignItems: 'flex-end' }}
              >
                <Text style={{ fontSize: 15 }}>
                  累積志工點數 : {this.state.point}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: '5%',
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height * 0.25
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10
              }}
            >
              {photo == null ? (
                <Text>沒有圖片</Text>
              ) : (
                <Image
                  style={{
                    resizeMode: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: 50
                  }}
                  source={{
                    uri: photo
                  }}
                />
              )}
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={this.openPicker}
              >
                <Text>修改大頭貼</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{ textAlign: 'center', marginTop: 10, color: 'black' }}
            >
              {`${this.state.name}\n${this.state.mail}`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: member_backcolor,
                alignItems: 'center',
                marginHorizontal: winwidth.width / 20,
                width: winwidth.width / 2.5,
                height: winwidth.height / 2
              }}
            >
              <Icon
                name="user-tie"
                size={winwidth.width / 8}
                style={{
                  backgroundColor: member_backcolor,
                  borderRadius: 200,
                  paddingHorizontal: 14,
                  padding: 10,
                  marginBottom: 10
                }}
                color={member_color}
              />
              <Text style={{ color: member_color }}>一般會員</Text>
              {this.state.isVolunteer == 3 ||
              this.state.isVolunteer == 4 ? null : (
                <View style={{ marginVertical: 10 }}>
                  <Text>
                    {`新北市為協助家庭應對高齡化社會人口快速老化的大海嘯，並協助減輕龐大照顧壓力，將借助佈老志工的力量幫助需要的老人，並營造出一個友善互助的社會氛圍。`}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: volunteer_backcolor,
                marginHorizontal: winwidth.width / 20,
                alignItems: 'center',
                width: winwidth.width / 2.5,
                height: winwidth.height / 2
              }}
            >
              <Icon
                name="user-nurse"
                size={winwidth.width / 8}
                style={{
                  backgroundColor: volunteer_backcolor,
                  borderRadius: 200,
                  paddingHorizontal: 14,
                  padding: 10,
                  marginBottom: 10
                }}
                color={volunteer_color}
              />
              <Text style={{ color: volunteer_color }}>佈老志工</Text>
              {this.state.isVolunteer == 3 || this.state.isVolunteer == 4 ? (
                <View style={{ marginVertical: 10 }}>
                  <Text>
                    {`願意散佈愛心、關心照顧長輩，且能夠到長輩家中提供5項居家服務：\n1.陪伴散步\n2.陪伴運動\n3.陪伴購物\n4.送餐服務\n5.文書服務\n的志願服務人員。`}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.titlef}>基本資料</Text>

          <Text style={styles.text_style}>姓名* </Text>
          <View style={styles.textinput}>
            <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
              {people}
            </View>

            <TextInput
              placeholder="填寫姓名"
              editable={false}
              placeholderTextColor="gray"
              maxLength={4}
              onChangeText={text => {
                this.setState({ name: text });
              }}
              value={this.state.name}
            ></TextInput>
          </View>
          <Text style={styles.text_style}>語言* </Text>
          <View style={styles.textinput}>
            <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
              {langue}
            </View>
            <TextInput
              style={{ fontSize: 15 }}
              maxLength={9}
              placeholder="輸入您熟悉的語言"
              placeholderTextColor="gray"
              onChangeText={text => {
                this.setState({ language: text });
              }}
              value={this.state.language}
            ></TextInput>
          </View>
          <Text style={styles.titlef}>聯絡資料</Text>
          <Text style={styles.text_style}>信箱* </Text>

          <View style={styles.textinput}>
            <View style={{ alignSelf: 'center', marginLeft: '2%' }}>{m}</View>
            <TextInput
              style={{ fontSize: 15 }}
              placeholder="請輸入信箱帳號*"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onChangeText={text => {
                this.setState({ mail: text });
              }}
              value={this.state.mail}
            ></TextInput>
          </View>

          <Text style={styles.text_style}>手機號碼*</Text>
          {/**不加marginleft icon會太醜 */}
          <View style={styles.textinput}>
            <View style={{ alignSelf: 'center', marginLeft: '2%' }}>
              {phone}
            </View>
            <TextInput
              style={{ fontSize: 15 }}
              maxLength={10}
              keyboardType="numeric"
              placeholder="請輸入您的手機號碼"
              placeholderTextColor="gray"
              onChangeText={text => {
                this.setState({ phone: text });
              }}
              value={this.state.phone}
            ></TextInput>
          </View>
          {this.state.isVolunteer == 3 || this.state.isVolunteer == 4 ? (
            <Text style={styles.titlef}>志工服務資料</Text>
          ) : null}

          {this.state.isVolunteer == 3 || this.state.isVolunteer == 4 ? (
            <View>
              <TouchableOpacity
                style={{ marginLeft: '5%', marginTop: '5%' }}
                onPress={this.handle}
              >
                <Text
                  style={{ color: '#009393', fontWeight: 'bold', fontSize: 15 }}
                >
                  服務區域
                </Text>
              </TouchableOpacity>
              <Text style={{ marginLeft: '5%' }}>{`${this.state.region}`}</Text>

              <Text
                style={{
                  fontSize: 15,
                  marginLeft: '5%',
                  marginTop: '5%',
                  fontWeight: 'bold'
                }}
              >
                提供服務項目
              </Text>
              <View
                style={{
                  paddingTop: '2%',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                <View
                  style={{
                    paddingTop: '2%',
                    flexDirection: 'row'
                  }}
                >
                  <CheckBox
                    checked={this.state.checked1}
                    onPress={() => {
                      this.setState({ checked1: !this.state.checked1 });
                    }}
                    color={'#6A6AFF'}
                  />
                  <Text style={{ marginLeft: '10%' }}>陪伴散步</Text>
                </View>

                <View
                  style={{
                    paddingTop: '2%',

                    flexDirection: 'row'
                  }}
                >
                  <CheckBox
                    color={'#6A6AFF'}
                    checked={this.state.checked3}
                    onPress={() => {
                      this.setState({ checked3: !this.state.checked3 });
                    }}
                  />
                  <Text style={{ marginLeft: '10%' }}>陪伴購物</Text>
                </View>
                <View
                  style={{
                    paddingTop: '2%',

                    flexDirection: 'row'
                  }}
                >
                  <CheckBox
                    color={'#6A6AFF'}
                    checked={this.state.checked4}
                    onPress={() => {
                      this.setState({ checked4: !this.state.checked4 });
                    }}
                  />
                  <Text style={{ marginLeft: '10%' }}>送餐服務</Text>
                </View>
                <View
                  style={{
                    paddingTop: '2%',

                    flexDirection: 'row'
                  }}
                >
                  <CheckBox
                    color={'#6A6AFF'}
                    checked={this.state.checked2}
                    onPress={() => {
                      this.setState({ checked2: !this.state.checked2 });
                    }}
                  />
                  <Text style={{ marginLeft: '10%' }}>陪伴運動</Text>
                </View>
                <View
                  style={{
                    paddingTop: '2%',

                    flexDirection: 'row'
                  }}
                >
                  <CheckBox
                    color={'#6A6AFF'}
                    checked={this.state.checked5}
                    onPress={() => {
                      this.setState({ checked5: !this.state.checked5 });
                    }}
                  />
                  <Text style={{ marginLeft: '10%' }}>文書服務</Text>
                </View>
              </View>
            </View>
          ) : null}
          <TouchableOpacity onPress={this.rewrite} style={styles.button}>
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', color: '#009393' }}
            >
              修改資料
            </Text>
          </TouchableOpacity>
          <AreaPicker
            areaJson={Taiwan}
            onPickerCancel={() => {}}
            onPickerConfirm={value => {
              this.setState({
                region: value[0] + ',' + value[1] + ',' + value[2],
                region2: value[0]
              });
            }}
            ref={ref => (this.AreaPicker = ref)} //////////////////////////////////這裡
          />
        </ScrollView>
      </LinearGradient>
    );
  }
}

const winwidth = Dimensions.get('window');
const styles = StyleSheet.create({
  wrapper: {},
  titlef: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginTop: '5%'
  },
  text_style: { fontSize: 15, marginLeft: '5%', marginTop: '5%' },
  textinput: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: 'white',
    marginLeft: '5%',

    width: Dimensions.get('window').width * 0.7,
    height: 40
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '5%'
  },
  swiper_image: {
    // borderRadius: 10,
    marginHorizontal: '8%',
    width: Dimensions.get('window').width - '8%',
    height: (Dimensions.get('window').width * 371) / 1150
  }
});
