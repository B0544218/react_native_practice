/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import C from 'react-native-vector-icons/Ionicons';

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flatlist_source: [],
      starCount: 0,
      visibleModal: false,
      contract: undefined,
      score_lock: true,
      disable_score: false,
      spinner: false
    };
  }
  componentDidMount() {
    fetch('http://120.126.19.107:3000/Db_record', {
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
      .then(responseData1 => {
        var array = responseData1.flat_data;
        var self_array = [];
        for (i in array) {
          self_array.push(array[i]);
        }
        return self_array;
      })
      .then(result => {
        console.log(result);
        this.setState({ flatlist_source: result });
      })
      .catch(error => {
        console.log(error);
      });
  }
  onStarRatingPress = rating => {
    this.setState({
      starCount: rating
    });
  };

  star_visible = item => {
    this.setState({
      spinner: !this.state.spinner
    });
    fetch('http://120.126.19.107:3000/read_grade', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contract_id: item.contract_id
      })
    })
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          spinner: false
        });
        if (
          responseData.have_grade == 0 &&
          firebase.auth().currentUser.uid == item.be_cared
        ) {
          this.setState({
            visibleModal: true,
            contract: item,
            score_lock: true,
            starCount: responseData.have_grade,
            disable_score: false
          });
        } else {
          this.setState({
            visibleModal: true,
            contract: item,
            score_lock: false,
            starCount: responseData.have_grade,
            disable_score: true
          });
        }
      });
  };

  confirm_grade = () => {
    this.setState({ visibleModal: false });
    //firebase在fetch.then裡 無反應
    firebase
      .database()
      .ref('users/' + this.state.contract.server + '/user_data')
      .once('value', snapshot => {
        firebase
          .database()
          .ref('users/' + this.state.contract.server + '/user_data')
          .update({
            grade: snapshot.val().grade + this.state.starCount,
            service_times: snapshot.val().service_times + 1
          });
      });
    fetch('http://120.126.19.107:3000/update_grade', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contract_id: this.state.contract.contract_id,
        grade: this.state.starCount
      })
    })
      .then(response => response.json())

      .then(() => {
        this.setState({ contract: undefined, starCount: 0 });
      })
      .catch(err => console.log(err));
    // console.log(this.state.contract_id);
    // console.log(this.state.starCount);
  };

  Render_Footer = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#ff7575'
        }}
      />
    );
  };

  Render_FlatList_Sticky_header = () => {
    const clock = <C name="ios-time" size={25} color="white"></C>;
    var Sticky_header_View = (
      <View style={styles.header_style}>
        {clock}
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 22,
            fontWeight: 'bold',
            margin: '5%'
          }}
        >
          服務紀錄
        </Text>
        {clock}
      </View>
    );

    return Sticky_header_View;
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#ff7575'
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.MainContainer}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <FlatList
          data={this.state.flatlist_source}
          ListHeaderComponent={this.Render_FlatList_Sticky_header}
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          ListFooterComponent={this.Render_Footer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.flatview}
              onPress={() => this.star_visible(item)}
            >
              <Text style={styles.text}>地址:{item.address}</Text>
              <Text style={styles.text}>日期:{item.start_date}</Text>
              <Text style={styles.text}>時間:{item.start_time}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.contract_id}
        />
        {this.state.contract == undefined ? null : (
          <Modal
            isVisible={this.state.visibleModal}
            onBackButtonPress={() => {
              this.setState({ visibleModal: false });
            }}
            onBackdropPress={() => this.setState({ visibleModal: false })}
          >
            <Text style={{ color: '#ffe66f' }}>
              {`地點 :${this.state.contract.address}`}
            </Text>
            <Text style={{ color: '#ffe66f' }}>
              {`開始時間 :${this.state.contract.start_date} ${this.state.contract.start_time}`}
            </Text>
            <Text style={{ color: '#ffe66f' }}>
              {`結束時間 :${this.state.contract.end_date} ${this.state.contract.end_time}`}
            </Text>
            <Text style={{ color: '#ffe66f' }}>
              {`點數 :${this.state.contract.points}`}
            </Text>
            <Text style={{ color: '#ffe66f' }}>
              {`委託人 :${this.state.contract.be_cared_name}`}
            </Text>
            <Text style={{ color: '#ffe66f' }}>
              {`服務員 :${this.state.contract.server_name}`}
            </Text>
            <StarRating
              disabled={this.state.disable_score}
              maxStars={5}
              rating={this.state.starCount}
              emptyStarColor={'#ffe66f'}
              fullStarColor={'#ffe66f'}
              selectedStar={rating => this.onStarRatingPress(rating)}
            />
            {this.state.starCount == 0 ? (
              <Text style={{ fontSize: 20, color: '#ffe66f' }}>(未評價)</Text>
            ) : null}
            {this.state.score_lock ? (
              <Button title="評價" onPress={this.confirm_grade} />
            ) : null}
          </Modal>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  flatview: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    paddingVertical: '2%' // 11/23加上
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,

    backgroundColor: 'white'
  },

  text: {
    marginLeft: '5%',
    fontSize: 20,
    color: '#5b5b5b'
  },

  header_style: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    backgroundColor: '#ff7575',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
