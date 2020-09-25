import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import LIKE_FlatListItem from './LIKE/LIKE_FlatListItem';
//import LIKE_BasicFlatList from './LIKE/LIKE_BasicFlatList';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';

export default class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatData: [],
      spinner: false,
      who_like: []
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      //成功監聽，但有新錯誤can't perform a React state update on an unmounted component
      this.setState({
        spinner: !this.state.spinner
      });
      setTimeout(() => {
        this.setState({
          spinner: false
        });
      }, 1500);
      var temp = [];

      this.setState({ FlatData: [] });
      setTimeout(() => {
        var test_array = [];
        firebase
          .database()
          .ref('users/' + firebase.auth().currentUser.uid + '/like')
          .once('value', snapshot => {
            const lk = snapshot.val();
            for (i in snapshot.val()) {
              temp.push(snapshot.val()[i]['id']);
            }
            // for (i in lk) {
            //   firebase
            //     .database()
            //     .ref('users/' + lk[i]['id'] + '/user_data/')
            //     .once('value', snapshot => {
            //       this.setState({
            //         FlatData: [...this.state.FlatData, snapshot.val()]
            //       });
            //     });
            // }
          })
          .then(
            this.setState({
              who_like: temp
            })
          )
          .then(
            firebase
              .database()
              .ref('users/')
              .once('value', snapshot => {
                var user_array = Object.values(snapshot.val());
                for (i in user_array) {
                  if (
                    this.state.who_like.includes(user_array[i].user_data.uid)
                  ) {
                    test_array.push(user_array[i].user_data);
                  }
                }
              })
              .then(() => {
                this.setState({
                  FlatData: test_array
                });
              })
          );
      }, 100);
    });
  }
  render_FlatList_footer = () => {
    var footer_View = <View style={{ height: 100 }}></View>;

    return footer_View;
  };
  render() {
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#fed6e3', '#a8edea']}>
        <View style={{ flex: 1 }}>
          {
            //必須是flex:1 才可以依照FlatListData的值給出相應的空間
          }
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <View
            style={{
              backgroundColor: 'rgb(50,65,146)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: Dimensions.get('window').height / 15,
              alignItems: 'center',
              paddingLeft: 15
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="bars" size={22} color="white" />
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 20, color: 'white' }}>我的收藏</Text>
            </View>
            <View />
          </View>
          <FlatList
            ref="myFlatList"
            data={this.state.FlatData}
            horizontal={false}
            numColumns={2}
            ListFooterComponent={this.render_FlatList_footer}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              //item和index"參數"都是固定用法
              //console.log('Look : ' + FlatListData);

              //console.log('-------------------------------------------------');
              //console.log(`Item ${JSON.stringify(item)} , index : ${index}`);

              //這邊的item變數對應上面的props.item  * 這邊的parentFlatList是為了用這邊的function *
              return (
                <LIKE_FlatListItem
                  item={item}
                  index={index}
                  parentFlatList={this}
                  navigation_message={this.props.navigation}
                />
              );
            }}
          />
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
