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
import Execution from './components/execution';
import Likes from './components/like';
import Handshakes from './components/handshake';
import Settings from './components/settings';
import Groups from './components/group';
import Shares from './components/groupchild/share';
import Privates from './components/groupchild/private';
import Publics from './components/groupchild/public';
import Login from './components/LoginTest/Login';
import Register from './components/LoginTest/Register';

import {
  createDrawerNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  DrawerItems,
  NavigationActions,
  StackActions
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

const navigateAction = NavigationActions.navigate({
  routeName: 'Group', //給父router
  params: {},
  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'GroupsScreen' }) //想要路由到的子router
});

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
        PrivatesScreen: { screen: Privates },
        PublicsScreen: { screen: Publics }
      },
      {
        initialRouteName: 'GroupsScreen',
        headerMode: 'none'
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
            title: '購買或轉移'
          }
        }
      },
      {
        navigationOptions: ({ navigation }) => ({
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            /////////////////////////////////////////////////////////////////////////
            if (navigation.state.routeName == 'Group') {
              //路由到Group時
              navigation.dispatch(navigateAction); //用dispatch執行action
            }
            defaultHandler();
          },

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
    const execution = createStackNavigator({ screen: Execution });
    const AppDrawerNavigator = createDrawerNavigator(
      {
        Primary: {
          screen: TabNavigator_convert,
          navigationOptions: { drawerLabel: '主頁面' }
        },
        PersonalFile: {
          screen: Settings,
          navigationOptions: { drawerLabel: '個人檔案' }
        },
        Message: {
          screen: message,
          navigationOptions: { drawerLabel: '系統信息' }
        },
        During: {
          screen: during,
          navigationOptions: { drawerLabel: '委託等待執行' }
        },
        Execution: {
          screen: execution,
          navigationOptions: { drawerLabel: '委託執行中' }
        }
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
