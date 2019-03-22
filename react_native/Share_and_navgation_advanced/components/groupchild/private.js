import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
const screenWidth = Dimensions.get('window').width;
export default class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      LikeShareUser: [],
      datehash: ''
    };
  }
  writeAddress = text => {
    this.setState(prevState => ({
      address: text
    }));
  };
  writestart_date = text => {
    this.setState(prevState => ({
      start_date: text
    }));
  };
  writestart_time = text => {
    this.setState(prevState => ({
      start_time: text
    }));
  };
  writeend_date = text => {
    this.setState(prevState => ({
      end_date: text
    }));
  };
  writeend_time = text => {
    this.setState(prevState => ({
      end_time: text
    }));
  };
  handlerGroups = () => {
    //將LikeShareUser送出到firebase檢查是否為[]否的話正常送出
    const already_get = this.props.navigation.getParam('paramName', []);

    this.setState(
      {
        datehash: firebase.auth().currentUser.uid + new Date().valueOf(),
        LikeShareUser: already_get
      },
      () => {
        for (i in this.state.LikeShareUser) {
          //這個for loop為發送給希望邀請的人
          firebase
            .database()
            .ref(
              'users/' +
                this.state.LikeShareUser[i].object_id +
                '/contract/server/' +
                this.state.datehash
            )
            .set({ contract_id: this.state.datehash });
          console.log('LOOK:' + this.state.LikeShareUser[i].object_id);
        }
        firebase
          .database()
          .ref('private_talk/' + this.state.datehash)
          .set({
            address: this.state.address,
            start_date: this.state.start_date,
            start_time: this.state.start_time,
            end_date: this.state.end_date,
            end_time: this.state.end_time
          })
          .then(
            firebase
              .database()
              .ref(
                'users/' +
                  firebase.auth().currentUser.uid +
                  '/contract/client/' +
                  this.state.datehash
              )
              .set({ contract_id: this.state.datehash })
          );
      }
    );

    this.props.navigation.navigate('GroupsScreen');
  };
  componentDidMount() {
    /*
    const already_get = this.props.navigation.getParam('paramName', []);
    this.setState({ LikeShareUser: already_get }, () => {
      console.log(this.state.LikeShareUser);
    });
*/
    console.log('Private didmount');
  }

  componentWillUnmount() {
    console.log('Private unmount');
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
        >
          Address
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 5
          }}
        >
          <Text
            style={{
              width: screenWidth / 9,
              fontSize: screenWidth / 25
            }}
          >
            地點 :
          </Text>
          <TextInput
            placeholder="请输入"
            keyboardType="default"
            onChangeText={this.writeAddress}
            style={{
              flex: 1,
              padding: 0, //讓字可以貼齊border框
              margin: 5,
              borderWidth: 0.4,
              fontSize: screenWidth / 20
            }}
          />
        </View>

        {/**Start */}

        <Text
          style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
        >
          Start
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: 'rgb(209,224,224)',
            margin: 10,
            borderBottomWidth: 1
          }}
        >
          <Text
            style={{
              width: screenWidth / 9,
              fontSize: screenWidth / 25
            }}
          >
            日期 :
          </Text>
          <TextInput
            placeholder="请输入"
            keyboardType="default"
            onChangeText={this.writestart_date}
            style={{
              flex: 1,
              padding: 0, //讓字可以貼齊border框
              margin: 5,
              borderWidth: 0.4,
              fontSize: screenWidth / 20
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: 'rgb(209,224,224)',
            margin: 10,
            borderBottomWidth: 1
          }}
        >
          <Text
            style={{
              width: screenWidth / 9,
              fontSize: screenWidth / 25
            }}
          >
            時間 :
          </Text>
          <TextInput
            placeholder="请输入"
            keyboardType="default"
            onChangeText={this.writestart_time}
            style={{
              flex: 1,
              padding: 0, //讓字可以貼齊border框
              margin: 5,
              borderWidth: 0.4,
              fontSize: screenWidth / 20
            }}
          />
        </View>

        {/**End */}

        <Text
          style={{ color: 'rgb(233, 178, 60)', fontSize: screenWidth / 30 }}
        >
          End
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: 'rgb(209,224,224)',
            margin: 10,
            borderBottomWidth: 1
          }}
        >
          <Text
            style={{
              width: screenWidth / 9,
              fontSize: screenWidth / 25
            }}
          >
            日期 :
          </Text>
          <TextInput
            placeholder="请输入"
            keyboardType="default"
            onChangeText={this.writeend_date}
            style={{
              flex: 1,
              padding: 0, //讓字可以貼齊border框
              margin: 5,
              borderWidth: 0.4,
              fontSize: screenWidth / 20
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: 'rgb(209,224,224)',
            margin: 10,
            borderBottomWidth: 1
          }}
        >
          <Text
            style={{
              width: screenWidth / 9,
              fontSize: screenWidth / 25
            }}
          >
            時間 :
          </Text>
          <TextInput
            placeholder="请输入"
            keyboardType="default"
            onChangeText={this.writeend_time}
            style={{
              flex: 1,
              padding: 0, //讓字可以貼齊border框
              margin: 5,
              borderWidth: 0.4,
              fontSize: screenWidth / 20
            }}
          />
        </View>
        <TouchableOpacity onPress={this.handlerGroups}>
          <Text>送出</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
Private.navigationOptions = {
  title: '填寫資料',
  headerTitleStyle: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  headerStyle: {
    backgroundColor: 'rgb(151, 180, 255)'
  },
  headerTintColor: 'black'
};
