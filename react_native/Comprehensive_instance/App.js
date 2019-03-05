import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Search from './components/search';
import test from './components/test';
import Profile from './components/profile';
import Message from './components/message';
import During from './components/during';
import Likes from './components/like';
import Handshakes from './components/handshake';
import Settings from './components/settings';
import Groups from './components/group';
import Shares from './components/groupchild/share';
import Privates from './components/groupchild/private';
import Login from './components/LoginTest/Login';
import Register from './components/LoginTest/Register';

import {
  createDrawerNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  DrawerItems
} from 'react-navigation';

import { Container, Content, Header, Body } from 'native-base';

import firebase from '@firebase/app';

import '@firebase/database';

import '@firebase/auth';

import '@firebase/storage';
import { database } from 'firebase';
var config = {
  apiKey: 'AIzaSyDYdB2RzFWMYsalGIz57ECEka1Oc1WYaN8',
  authDomain: 'projectname2.firebaseapp.com',
  databaseURL: 'https://projectname2.firebaseio.com',
  projectId: 'projectname2',
  storageBucket: 'projectname2.appspot.com',
  messagingSenderId: '62256666226'
};
firebase.initializeApp(config);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  render() {
    const devicewidth = Dimensions.get('window').width;

    const Homestack = createStackNavigator(
      {
        SearchScreen: Search
      },
      {
        headerMode: 'none', //讓navigationOptions失效
        initialRouteName: 'SearchScreen',
        navigationOptions: {
          headerStyle: {
            backgroundColor: 'pink'
          }
        }
      }
    );
    const GroupChild = createStackNavigator(
      {
        GroupsScreen: { screen: Groups },
        SharesScreen: { screen: Shares },
        PrivatesScreen: { screen: Privates }
      },
      {
        initialRouteName: 'GroupsScreen'
        //headerMode: 'none'
      }
    );
    const TabNavigator = createBottomTabNavigator(
      {
        Home: {
          screen: Homestack,
          navigationOptions: {
            title: '服務員'
          }
        },
        Group: {
          screen: GroupChild,
          navigationOptions: {
            title: '團體招募'
          }
        },
        Like: {
          screen: Likes,
          navigationOptions: {
            title: '收藏'
          }
        },
        Handshake: {
          screen: Handshakes,
          navigationOptions: {
            title: '轉移'
          }
        }
      },
      {
        navigationOptions: ({ navigation }) => ({
          /*tabBarOnPress: ({ navigation, defaultHandler }) => {
            console.log('onPress:', navigation.state.routeName);
            defaultHandler();
          },*/
          tabBarIcon: ({ focused, tintColor }) => {
            let iconName;
            const { routeName } = navigation.state;
            if (routeName === 'Home') {
              iconName = 'user';
            } else if (routeName === 'Group') {
              iconName = `users`;
            } else if (routeName === 'Like') {
              iconName = `heart`;
            } else if (routeName === 'Handshake') {
              iconName = `edit`;
            }
            return (
              <Icon
                name={iconName}
                size={25}
                color={focused ? '#48a87c' : 'gray'}
              />
            );
          }
        })
      }
    );

    const TabNavigator_convert = createStackNavigator(
      {
        TabNavigator: TabNavigator
      },
      {
        headerMode: 'none'
      }
    );
    const message = createStackNavigator({
      screen: Message
    });
    const during = createStackNavigator({
      screen: During
    });
    const AppDrawerNavigator = createDrawerNavigator(
      {
        Primary: TabNavigator_convert,
        PersonalFile: {
          screen: Settings
        },
        Message: message,
        During: during
      },
      {
        initialRouteName: 'Primary',
        contentComponent: props => <DrawerMenu property={props} />,
        drawerWidth: devicewidth / 2
      }
    );

    const LoginToDrawer = createStackNavigator(
      {
        login: {
          screen: Login
        },
        drawer: {
          screen: AppDrawerNavigator
        },
        register: {
          screen: Register
        }
      },
      {
        initialRouteName: 'login',
        headerMode: 'none'
      }
    );

    return <LoginToDrawer />;
  }
}
console.log('in test5');
/////////////////////////////////
class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user_path: null };
  }

  componentDidMount() {
    if (window.firstlogin) {
      firebase
        .database()
        .ref(
          'users/' + firebase.auth().currentUser.uid + '/user_data/image/img'
        )
        .on('value', snapshot => {
          console.log(snapshot.val());
          //window.image_path = snapshot.val();
          this.setState({ user_path: snapshot.val() });
        });
    }
  }

  render() {
    return (
      <Container>
        <Header style={styles.drawerHeader}>
          <Body>
            {this.state.user_path && (
              <Image
                style={styles.drawerImage}
                source={{
                  uri: this.state.user_path
                }}
              />
            )}
          </Body>
        </Header>
        <Content>
          <DrawerItems {...this.props.property} />
        </Content>
      </Container>
    );
  }
}

/////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawerImage: {
    height: 160,
    width: 160
  },
  drawerLinkIcons: {
    height: 24,
    width: 24
  },
  drawerHeader: {
    height: 170,
    backgroundColor: 'white'
  }
});
