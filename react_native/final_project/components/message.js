import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';
import '@firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
const screen = Dimensions.get('window');
export default class message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      my_name: '',
      my_graph: ''
    };
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .once('value', snapshot => {
        // if (snapshot.val().Volunteer.v == 1) {
        //   Alert.alert(
        //     '提醒',
        //     '必須符合政策規範資格者才可檢視\n請到佈老志工官網查看詳情'
        //   );
        //   this.props.navigation.navigate('SearchScreen');
        // }
        this.setState({
          my_name: snapshot.val().user_data.name,
          my_graph: snapshot.val().user_data.image
        });
      });
    fetch('http://120.126.19.107:3000/get_chat_list', {
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
        var list = responseData.chat_list;
        //console.log(responseData.chat_list);
        for (i in list) {
          this.setState({ array: [...this.state.array, list[i]] });
          console.log(list[i]);
        }
      });
  }
  navigate_message = (uid, name, graph) => {
    this.props.navigation.navigate('Message', {
      his_name: name,
      his_graph: graph,
      my_name: this.state.my_name,
      my_graph: this.state.my_graph,
      id1: uid,
      id2: firebase.auth().currentUser.uid
    });
  };
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: Dimensions.get('window').width,
          backgroundColor: '#6C6C6C'
        }}
      />
    );
  };
  Render_Footer = () => {
    return (
      <View
        style={{
          height: screen.height / 7
        }}
      />
    );
  };
  render() {
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#fed6e3', '#a8edea']}>
        <View style={styles.header_style}>
          <Text style={{ fontSize: 20, color: 'white' }}>Messages</Text>
          <View />
        </View>
        {this.state.array.length > 0 ? (
          <FlatList
            data={this.state.array}
            // ItemSeparatorComponent={this.FlatListItemSeparator}
            ListFooterComponent={this.Render_Footer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  //backgroundColor: "",
                  marginBottom: '1%',
                  elevation: 5, //shadow
                  borderRadius: 10,
                  height: screen.height / 7,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={() =>
                  this.navigate_message(item.uid, item.name, item.graph)
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <Image style={styles.image} source={{ uri: item.graph }} />

                  <Text
                    style={{
                      color: 'rgb(50,65,146)',
                      fontSize: 20,
                      marginBottom: screen.height / 20
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    marginHorizontal: 10
                  }}
                >
                  <View>
                    <Icon
                      name="comments"
                      size={screen.height / 18}
                      color="rgb(50,65,146)"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => item.uid}
          />
        ) : null}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: screen.height / 8,
    height: screen.height / 8,
    borderRadius: screen.height / 8 / 2,
    marginHorizontal: 10,
    overflow: 'hidden'
  },
  header_style: {
    backgroundColor: 'rgb(50,65,146)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height / 15,
    alignItems: 'center',
    paddingLeft: 15
  }
});
message.navigationOptions = {
  title: '信息',
  headerTitleStyle: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  headerTintColor: '#6666FF'
};
