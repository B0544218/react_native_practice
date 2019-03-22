import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import firebase from '@firebase/app';

import '@firebase/database';

import '@firebase/auth';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like_object: [],
      test: []
    };
  }
  handlerPrivates = () => {
    let pass_arr = [];
    for (i in this.state.like_object) {
      this.state.like_object[i].likeState
        ? pass_arr.push(this.state.like_object[i])
        : null;
    }
    this.props.navigation.navigate('PrivatesScreen', { paramName: pass_arr });
  };
  handle = (introduction, thisID) => {
    let newState = Object.assign({}, this.state); //複製this.state
    newState.like_object[thisID].likeState = !newState.like_object[thisID]
      .likeState;
    this.setState({
      like_object: newState.like_object
      //在this.state.like_object.map function中不能使用setState like_object
    });
  };
  submitTest = () => {
    let pass_arr = [];
    for (i in this.state.like_object) {
      this.state.like_object[i].likeState
        ? pass_arr.push(this.state.like_object[i])
        : null;
    }
  };

  componentDidMount() {
    firebase //for loop 一個個找出like的對象
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/like')
      .once('value', snapshot => {
        for (i in snapshot.val()) {
          firebase //從某一個對象 去查詢該對象的資料
            .database()
            .ref('users/' + snapshot.val()[i].id + '/user_data')
            .once('value', snapshot => {
              this.setState({
                like_object: [
                  ...this.state.like_object,
                  {
                    ImagePath: snapshot.val().image.img,
                    name: snapshot.val().name.me,
                    likeState: false,
                    object_id: snapshot.val().uid
                  }
                ]
              });
            });
        }
      });
  }
  componentWillUnmount() {
    console.log('share unmount');
  }
  render() {
    return (
      <View>
        <View>
          <View style={styles.container}>
            {this.state.like_object.map((val, key) => {
              return (
                <View key={key} style={styles.box}>
                  <TouchableOpacity onPress={() => this.handle(val.name, key)}>
                    <Image
                      source={{ uri: val.ImagePath }}
                      style={styles.imagestyle}
                    />
                  </TouchableOpacity>

                  <View>
                    <Text numberOfLines={1} ellipsizeMode="tail">
                      {val.likeState ? (
                        <Icon
                          name="check-circle"
                          size={screenWidth / 25}
                          //字長度超過4個 就會被遮蓋
                          color="rgb(90, 253, 88)"
                        />
                      ) : null}
                      {this.state.like_object[key].name}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <TouchableOpacity onPress={this.handlerPrivates}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: (screenHeight / 5) * 3,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'flex-start', //換下一行時在最左邊增加
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  box: {
    width: screenWidth / 5,
    margin: screenWidth / 40,
    alignItems: 'center' //讓字居中
  },
  imagestyle: {
    width: screenWidth / 6,
    height: screenWidth / 6,
    borderRadius: 30
  }
});
