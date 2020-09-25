import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Marker from 'react-native-vector-icons/MaterialCommunityIcons';

import Search from './components/search';
import test from './components/test';
import Signout from './components/sign_out';
import Chat_screen from './components/message';
import During from './components/during';
import Record from './components/record';
import Execution from './components/execution';
import Finger from './components/Execution/finger';
import Likes from './components/like';
import Messages from './components/LIKE/Messages';
import Handshakes from './components/handshake';
import Purchase from './components/searchChild/purchase';
import Transfer from './components/searchChild/transfer';
import Donate from './components/searchChild/donate';
import Point_record from './components/searchChild/point_record';
import Settings from './components/settings';
import Groups from './components/group';
import Shares from './components/groupchild/share';
import Privates from './components/groupchild/private';
import Expandable_ListViews from './components/groupchild/Expandable';
import Publics from './components/groupchild/public';
import Login from './components/LoginTest/Login';
import Register from './components/LoginTest/Register';

import {
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator,
  DrawerItems,
  NavigationActions,
  StackActions //v2
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
const navigateAction2 = NavigationActions.navigate({
  routeName: 'Handshake', //給父router
  params: {},
  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'HandshakesScreen' }) //想要路由到的子router
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
        PublicsScreen: { screen: Publics },
        Expandable_ListView_Screnn: { screen: Expandable_ListViews }
      },
      {
        initialRouteName: 'GroupsScreen',
        headerMode: 'none'
      }
    );
    const LikeChild = createStackNavigator(
      {
        LikeScreen: { screen: Likes },
        Message: { screen: Messages }
      },
      {
        initialRouteName: 'LikeScreen',
        headerMode: 'none'
      }
    );
    const Point_Handshake = createStackNavigator(
      {
        HandshakesScreen: { screen: Handshakes },
        PointScreen: { screen: Point_record },
        PurchaseScreen: { screen: Purchase },
        TransferScreen: { screen: Transfer },
        DonationScreen: { screen: Donate }
      },
      {
        initialRouteName: 'HandshakesScreen',
        headerMode: 'none'
      }
    );
    const TabNavigator = createBottomTabNavigator(
      {
        Home: {
          screen: Homestack,
          navigationOptions: {
            title: '尋找志工'
          }
        },
        Group: {
          screen: GroupChild,
          navigationOptions: {
            title: '委託'
          }
        },
        Like: {
          screen: LikeChild,
          navigationOptions: {
            title: '收藏'
          }
        },
        Handshake: {
          screen: Point_Handshake,
          navigationOptions: {
            title: '點數交易'
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
            } else if (navigation.state.routeName == 'Handshake') {
              //路由到Group時
              navigation.dispatch(navigateAction2); //用dispatch執行action
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
                size={focused ? 35 : 25}
                color={focused ? 'pink' : 'gray'}
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
    const chat_screen = createStackNavigator(
      {
        screen: Chat_screen
      },
      {
        headerMode: 'none'
      }
    );
    const during = createStackNavigator(
      {
        screen: During
      },
      {
        headerMode: 'none'
      }
    );
    const record = createStackNavigator(
      {
        screen: Record
      },
      {
        headerMode: 'none'
      }
    );
    const execution = createStackNavigator(
      { Executionscreen: Execution, Fingerscreen: Finger },
      {
        initialRouteName: 'Executionscreen',
        headerMode: 'none'
      }
    );

    const AppDrawerNavigator = createDrawerNavigator(
      {
        Primary: {
          screen: TabNavigator_convert,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Icon name="home" size={20} style={{ color: tintColor }} />
            ),
            drawerLabel: '主頁面'
          }
        },
        PersonalFile: {
          screen: Settings,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Icon name="user" size={20} style={{ color: tintColor }} />
            ),
            drawerLabel: '個人檔案'
          }
        },
        Chat_screen: {
          screen: chat_screen,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Icon name="comments" size={20} style={{ color: tintColor }} />
            ),
            drawerLabel: '聊天室'
          }
        },
        During: {
          screen: during,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Icon name="clipboard" style={{ color: tintColor }} />
            ),
            drawerLabel: '尚未執行的委託'
          }
        },
        Execution: {
          screen: execution,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Marker
                name="map-marker"
                size={20}
                style={{ color: tintColor }}
              />
            ),
            drawerLabel: '委託執行中'
          }
        },
        Record: {
          screen: record,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Marker
                name="star-outline"
                size={20}
                style={{ color: tintColor }}
              />
            ),
            drawerLabel: '服務紀錄'
          }
        },
        Sign_out: {
          screen: Signout,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Icon name="sign-out" size={20} style={{ color: tintColor }} />
            ),
            drawerLabel: '登出'
          }
        }
      },
      {
        initialRouteName: 'Primary',
        contentComponent: props => <DrawerMenu property={props} />,
        contentOptions: {
          //activeTintColor: 'orange'

          labelStyle: { marginLeft: 0, paddingLeft: 0 }
        },
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
        .ref('users/' + firebase.auth().currentUser.uid + '/user_data/image')
        .on('value', snapshot => {
          console.log(snapshot.val());
          //window.image_path = snapshot.val();
          this.setState({ user_path: snapshot.val() });
        });
    }
  }

  render() {
    //http://t1.hxzdhn.com/uploads/tu/201703/33/111.jpg
    return (
      <Container>
        {/* <ImageBackground
          style={{ height: '100%', width: '100%' }}
          source={{
            uri:
              'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
          }}
        > */}
        <Header style={styles.drawerHeader}>
          {this.state.user_path && (
            <Image
              style={styles.drawerImage}
              source={{
                uri: this.state.user_path
              }}
            />
          )}
        </Header>
        <Content>
          <DrawerItems {...this.props.property} />
        </Content>
        {/* </ImageBackground> */}
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
    height: '100%',
    width: '100%'
  },
  drawerLinkIcons: {
    height: 24,
    width: 24
  },
  drawerHeader: {
    backgroundColor: 'transparent',
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
    height: 170
    //backgroundColor: 'white'
  }
});
