import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
  UIManager
} from 'react-native';
//import SectionItem from './groupchild/sectionItem';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { Drawer } from 'native-base';
// import Sidebar from './sideBar';
import Expandable_ListView from './groupchild/Expandable';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Group extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      user_name: '',
      customer_array: [],
      isVolunteer: 1,
      origin: [],
      update_Layout_spinner: true,
      array: [
        {
          expanded: false,
          title: '本人不公開委託',
          data: []
        },
        {
          expanded: false,
          title: '本人公開委託',
          data: []
        },
        {
          expanded: false,
          title: '他人不公開委託',
          data: []
        },
        {
          expanded: false,
          title: '他人公開委託',
          data: []
        }
      ],
      spinner: false
    };
  }
  Allof = () => {
    this.setState({ array: this.state.origin });
  };
  // filter = filter_text => {
  //   let copy = JSON.parse(JSON.stringify(this.state.origin));

  //   let sections1 = [];
  //   let sections2 = [];
  //   let sections3 = [];
  //   let sections4 = [];

  //   for (i in this.state.origin) {
  //     //讀4種 委託紀錄(1.私人 2.公開)3.不公開委託.公開委託
  //     for (j in this.state.origin[i].data) {
  //       if (
  //         this.state.origin[i].data[j].content.address.includes(filter_text)
  //       ) {
  //         // console.log(this.state.array[i].data[j].content);
  //         if (i == 0)
  //           sections1.push({ content: this.state.origin[i].data[j].content });
  //         else if (i == 1)
  //           sections2.push({ content: this.state.origin[i].data[j].content });
  //         else if (i == 2)
  //           sections3.push({ content: this.state.origin[i].data[j].content });
  //         else if (i == 3)
  //           sections4.push({ content: this.state.origin[i].data[j].content });
  //       }
  //     }
  //   }
  //   if (this.state.isVolunteer == 3 || this.state.isVolunteer == 4) {
  //     copy[0].data = sections1; //委託紀錄(私人)
  //     copy[1].data = sections2; //委託紀錄(公開)
  //     copy[2].data = sections3; //別人請求
  //     copy[3].data = sections4; //公開委託
  //   } else {
  //     copy[0].data = sections1; //委託紀錄(私人)
  //     copy[1].data = sections2; //委託紀錄(公開)
  //   }

  //   this.setState({ array: copy }, () => {
  //     console.log(this.state.origin);
  //   });
  // };
  handlerShares = () => {
    this.props.navigation.navigate('SharesScreen');
  };
  handlerPublics = () => {
    this.props.navigation.navigate('PublicsScreen');
  };
  handlerDuring = () => {
    this.props.navigation.navigate('During');
  };
  handlerHome = () => {
    this.props.navigation.navigate('SearchScreen');
  };
  closeDrawer = () => {
    this._drawer._root.close();
  };
  openDrawer = () => {
    this._drawer._root.open();
  };
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      var public_copy = [];
      var private_client_contract = [];
      var private_server_contract = [];
      const public_temp = [];
      this.setState({
        spinner: !this.state.spinner
      });

      setTimeout(() => {
        this.setState({
          spinner: false
        });
      }, 2000);

      fetch('http://120.126.19.107:3000/customer_array', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: firebase.auth().currentUser.uid
        })
      })
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
          this.setState({ customer_array: responseData.customers_array });
        })
        .catch(err => console.log(err));

      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/user_data')
        .once('value', snapshot => {
          this.setState({ user_name: snapshot.val().name });
        });
      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/Volunteer/v')
        .once('value', snapshot => {
          this.setState({ isVolunteer: snapshot.val() });
          // if (snapshot.val() == 1) {
          //   alert('必須符合政策規範資格者才可檢視\n請到佈老志工官網查看詳情');
          //   this.props.navigation.navigate('SearchScreen');
          // }
        })
        .then(() => {
          //要過濾請對section修改
          //測試過濾 設一個button 先將原本的array存在變數1 然後對變數1的data做移除 然後再setState array變成變數1
          this.state.isVolunteer == 3 || this.state.isVolunteer == 4
            ? this.setState({
                array: [
                  { expanded: false, title: '本人不公開委託', data: [] },
                  { expanded: false, title: '本人公開委託', data: [] },
                  { expanded: false, title: '他人不公開委託', data: [] },
                  { expanded: false, title: '他人公開委託', data: [] }
                ]
              })
            : this.setState({
                array: [
                  { expanded: false, title: '本人不公開委託', data: [] },
                  { expanded: false, title: '本人公開委託', data: [] }
                ]
              });
        });
      setTimeout(() => {
        //讓初始化先處理
        if (this.state.isVolunteer == 3 || this.state.isVolunteer == 4) {
          //是志工的情況
          //委託紀錄公開
          firebase
            .database()
            .ref('public_talk')
            .once('value', snapshot => {
              const public_object = snapshot.val();
              for (i in public_object) {
                if (
                  public_object[i]['public_client'] ==
                  firebase.auth().currentUser.uid
                ) {
                  public_temp.push({
                    content: public_object[i]
                  });
                  continue;
                } else {
                  public_copy.push({
                    content: public_object[i]
                  }); //取得public_talk的所有對象
                }
              }
            })
            .then(() => {
              let copy = JSON.parse(JSON.stringify(this.state.array));

              copy[1].data = public_temp; //委託紀錄公開
              copy[3].data = public_copy; //將public_talk的對象們 都貼到公開委託
              this.setState({ array: copy });
            })
            //private client的部分
            //委託紀錄私人 ref位址要改變改成private_talk 然後 push前要先用if判斷合約裡的private_uid是否是自己 (這裡一定要是自己才push)
            .then(
              firebase
                .database()
                .ref('private_talk')
                .once('value', snapshot => {
                  const private_object = snapshot.val();
                  for (i in private_object) {
                    if (
                      private_object[i]['private_uid'] ==
                      firebase.auth().currentUser.uid
                    ) {
                      private_client_contract.push({
                        content: private_object[i] //不要有contract_id 他在sectionitem中實現就好(先完成上面)
                      }); //取得contract client的contract id
                    }
                  }
                })
                .then(() => {
                  let copy = JSON.parse(JSON.stringify(this.state.array));
                  copy[0].data = private_client_contract;
                  this.setState({ array: copy });
                })
            )
            //private server 部分
            .then(
              firebase
                .database()
                .ref('private_talk')
                .once('value', snapshot => {
                  const private_object = snapshot.val();
                  for (i in private_object) {
                    if (private_object[i].member != null) {
                      // for (j in private_object[i].member) {
                      //列出所有member
                      // console.log(private_object[i].member[j].id);
                      if (
                        firebase.auth().currentUser.uid ==
                        private_object[i].member
                      ) {
                        private_server_contract.push({
                          content: private_object[i]
                        }); //取得private_talk的只屬於我的對象
                      }
                      // }
                    }
                  }
                })
                .then(() => {
                  let copy = JSON.parse(JSON.stringify(this.state.array));
                  copy[2].data = private_server_contract; //將private_talk的對象們 都貼到私人委託

                  this.setState({ array: copy });
                })
                .then(() => {
                  this.setState({ origin: this.state.array });
                })
            );
        } else {
          //不是志工的情況
          //委託紀錄公開
          firebase
            .database()
            .ref('public_talk')
            .once('value', snapshot => {
              const public_object = snapshot.val();
              for (i in public_object) {
                if (
                  public_object[i]['public_client'] ==
                  firebase.auth().currentUser.uid
                ) {
                  public_temp.push({
                    content: public_object[i]
                  });
                  continue;
                }
              }
            })
            .then(() => {
              let copy = JSON.parse(JSON.stringify(this.state.array));
              copy[1].data = public_temp;
              this.setState({ array: copy });
            })
            //private client的部分
            //委託紀錄私人 ref位址要改變改成private_talk 然後 push前要先用if判斷合約裡的private_uid是否是自己 (這裡一定要是自己才push)
            .then(
              firebase
                .database()
                .ref('private_talk')
                .once('value', snapshot => {
                  const private_object = snapshot.val();
                  for (i in private_object) {
                    if (
                      private_object[i]['private_uid'] ==
                      firebase.auth().currentUser.uid
                    ) {
                      private_client_contract.push({
                        content: private_object[i] //不要有contract_id 他在sectionitem中實現就好(先完成上面)
                      }); //取得contract client的contract id
                    }
                  }
                })
                .then(() => {
                  let copy = JSON.parse(JSON.stringify(this.state.array));
                  copy[0].data = private_client_contract;
                  this.setState({ array: copy });
                })
                .then(() => {
                  this.setState({ origin: this.state.array });
                })
                .catch(function(error) {
                  console.log(error);
                })
            );
        }
      }, 1000);
      //////////////////////////////
    });
  }
  update_Layout = index => {
    if (this.state.update_Layout_spinner == true) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      const array = [...this.state.array];
      array[index]['expanded'] = !array[index]['expanded'];
      // this.setState(() => {
      //   return {
      //     AccordionData: this.state.array
      //   };
      // });
      this.setState({ update_Layout_spinner: false });
      setTimeout(() => {
        this.setState({
          update_Layout_spinner: true
        });
      }, 600);
    }
  };

  // sectionKey = info => {
  //   var txt = info.section.key; //info裡的section為sectionlist自己幫(我們的變數)array取的變數名
  //   return <Text style={styles.sectionSytle}>{txt}</Text>;
  // };
  render() {
    return (
      <LinearGradient colors={['#fed6e3', '#a8edea']} style={styles.container}>
        {/* <Drawer
          ref={ref => {
            this._drawer = ref;
          }}
          openDrawerOffset={0.5}
          panCloseMask={0.5}
          content={
            <Sidebar
              navigator={this._navigator}
              filter={this.filter}
              allof={this.Allof}
              closeDrawer={this.closeDrawer}
            />
          }
          onClose={() => {
            this.closeDrawer();
          }}
        > */}
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <View style={styles.title_top}>
          <TouchableOpacity
            style={{
              width: '20%',
              alignItems: 'flex-start'
            }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name="bars" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.title_text}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={this.handlerPublics}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="plus-square"
                size={20}
                solid
                color="white"
              />
              <Text style={{ color: 'white', fontSize: 20 }}>發佈委託</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
          {this.state.array.map((item, key) => (
            <Expandable_ListView
              key={item.title}
              item={item}
              customer_array={this.state.customer_array}
              user_name={this.state.user_name}
              handlerFin={this.handlerDuring}
              handlerRemove={this.handlerHome}
              onClickFunction={this.update_Layout.bind(this, key)}
            />
          ))}
        </ScrollView>
        {/* </Drawer> */}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  title_top: {
    backgroundColor: 'rgb(50,65,146)',
    height: Dimensions.get('window').height / 15,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },
  title_text: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 5
  },
  imagestyle: {
    width: screenWidth / 6,
    height: screenWidth / 6,
    borderRadius: 30
  },
  sectionSytle: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ff7575'
  },
  container: {
    flex: 1
  }
});
