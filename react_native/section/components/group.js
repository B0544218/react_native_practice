import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  SectionList
} from 'react-native';
import SectionItem from './groupchild/sectionItem';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {
          key: '私密對象',
          data: []
        },
        {
          key: '別人請求',
          data: []
        },
        {
          key: '公開委託',
          data: []
        }
      ]
    };
  }
  handlerShares = () => {
    this.props.navigation.navigate('SharesScreen');
  };
  handlerPublics = () => {
    this.props.navigation.navigate('PublicsScreen');
  };
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      var public_copy = [];
      var private_client_contract = [];
      var privateC_copy = [];
      var private_server_contract = [];
      var privateS_copy = [];
      this.setState({
        sections: [
          {
            key: '私密對象',
            data: []
          },
          {
            key: '別人請求',
            data: []
          },
          {
            key: '公開委託',
            data: []
          }
        ]
      });
      firebase
        .database()
        .ref('public_talk/')
        .once('value', snapshot => {
          const public_object = snapshot.val();
          for (i in public_object) {
            public_copy.push({ title: public_object[i]['contract_id'] }); //取得public_talk的所有對象
          }
        })
        .then(() => {
          let copy = JSON.parse(JSON.stringify(this.state.sections));
          copy[2].data = public_copy; //將public_talk的對象們 都貼到公開委託
          this.setState({ sections: copy });
        })
        //private client的部分
        .then(
          firebase
            .database()
            .ref(
              'users/' + firebase.auth().currentUser.uid + '/contract/client'
            )
            .once('value', snapshot => {
              for (i in snapshot.val()) {
                private_client_contract.push(snapshot.val()[i]['contract_id']); //取得private_talk的只屬於我的對象
              }
            })
            .then(() => {
              for (x in private_client_contract) {
                firebase
                  .database()
                  .ref('private_talk/' + private_client_contract[x])
                  .once('value', snapshot => {
                    privateC_copy.push({
                      title: snapshot.val()['contract_id']
                    }); //從private_client_contract的各項目加進privagteC_copy
                  })
                  .then(() => {
                    let copy = JSON.parse(JSON.stringify(this.state.sections));
                    copy[0].data = privateC_copy; //將private_talk的對象們 都貼到公開委託
                    this.setState({ sections: copy });
                  });
              }
            })
        )
        //private server 部分
        .then(
          firebase
            .database()
            .ref(
              'users/' + firebase.auth().currentUser.uid + '/contract/server'
            )
            .once('value', snapshot => {
              for (i in snapshot.val()) {
                private_server_contract.push(snapshot.val()[i]['contract_id']); //取得private_talk的只屬於我的對象
              }
            })

            .then(() => {
              for (x in private_server_contract) {
                firebase
                  .database()
                  .ref('private_talk/' + private_server_contract[x])
                  .once('value', snapshot => {
                    privateS_copy.push({
                      title: snapshot.val()['contract_id']
                    }); //從private_server_contract的各項目加進privagteC_copy
                  })

                  .then(() => {
                    let copy = JSON.parse(JSON.stringify(this.state.sections));
                    copy[1].data = privateS_copy; //將private_talk的對象們 都貼到公開委託
                    this.setState({ sections: copy });
                  });
              }
            })
        );
    });
  }

  sectionKey = info => {
    var txt = info.section.key; //info裡的section為sectionlist自己幫(我們的變數)sections取的變數名
    return (
      <Text
        style={{
          height: 50,
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: '#9CEBBC',
          color: 'white',
          fontSize: 30
        }}
      >
        {txt}
      </Text>
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.title_top}>
          <View style={styles.title_text}>
            <TouchableOpacity onPress={this.handlerPublics}>
              <Text>公開</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.title_text}>
            <TouchableOpacity onPress={this.handlerShares}>
              <Text>私密</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SectionList
          renderSectionHeader={this.sectionKey}
          renderItem={({ item, index }) => {
            return <SectionItem item={item} index={index} />;
          }}
          sections={this.state.sections}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title_top: {
    height: Dimensions.get('window').height / 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap'
  },
  title_text: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  imagestyle: {
    width: screenWidth / 6,
    height: screenWidth / 6,
    borderRadius: 30
  },
  tick: {}
});
