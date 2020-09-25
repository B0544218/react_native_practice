import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Icon from 'react-native-vector-icons/Entypo';

import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';

class FingerprintPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      biometric: undefined
    };
  }

  componentDidMount() {
    FingerprintScanner.release();

    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttempted
    })
      .then(() => {
        this.props.locate();
        this.props.handlePopupDismissed();
        console.log('success finger');

        //insert 時間陣列
        //設定40分鐘
        Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
      })
      .catch(error => {
        if (
          error.message ==
          'Authentication was not successful because the user failed to provide valid credentials.'
          //當在要求認證的時候 強制Reload
        ) {
          this.setState({
            errorMessage: '請重啟頁面'
          });
        } else if (
          error.message ==
          'Authentication could not start because Fingerprint Scanner has no enrolled fingers.'
        ) {
          this.setState({
            errorMessage: '未偵測到指紋' + '\n' + '請確認手機是否有註冊指紋'
          });
        } else if (
          error.message ==
          'Authentication was not successful, the device currently in a lockout of 30 seconds'
        ) {
          this.setState({
            errorMessage: '失敗，鎖住功能30秒' + '\n' + '並請重新啟動該頁面'
          });
        } else {
          console.log(error.message);
          this.setState({
            errorMessage: error.message //No match.
          });
        }

        this.description.shake();
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = error => {
    this.setState({ errorMessage: error.message });
    this.description.shake();
  };

  render() {
    const { errorMessage, biometric } = this.state;
    const { style, backTo } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
          {/* <Image
            style={{ width: 100, height: 100 }}
            source={require('./finger_print.png')}
            // source={{
            //   uri:
            //     'https://lh3.googleusercontent.com/-KxyzzKstTLBwrXH7BG5IjVivBSk3W7E1MoxKracYfYL83S77MnHtgtSnM3fnuvbx1dgHHtcXybwf_dPuwnGkpRl620NBnNEsZbNLfWDQCtz5srO0tfcZ5xn_AWWBTAqIzhYVFS-YpJww5FpsX3NqqskVhFELB7fM43mD3padCzX23jAo9nkubD4P5L6tq-VMiQFWwhI5hxEIdmXR92LwZAnddZ0mEH9lU134JCyrpXkqS2UlCoqPP0oG5b5pSAJvo6vNOFldW6x61y3WHhB1miv-UfkYyk2J7PMNA0aV6lK7mt1vWPyHA8tqqAf8C_8fc67v2xNfugsBSlmZBVbJvSaAVMt2u6C_V68WBYNFN_ASXy8ITe4cdHQvwIbyejSe9AbHPKxqIxNGMsvwz_p9Auhgyyl3b3jfWQT9cGWbFMqvHfpEjo4kZxwBf2vS-xI2gYaCSLZYl04ReWFQuGUViG78iCoCAV3JCOxxVfGG6fp1Oi5XoZzBa9B81q3vK6nPjhiGLcVeSDJcODS6RZyK1vPkTEeiRtrwdnx7A4qA5e8XE3AanGp6t2bw2wqYzLjfKRUV_u5qLW9wth1JKhSSrePQg9Da3MEwi479tzMcaCKlE1JmmdmpPntVTBNsOi_lrcFUPJm9Nui6b4R3UvgAk-omfnL_TcxbwTixPo9WOdjOdFJ9nGQVd4=s85-no'
            // }}
          /> */}
          <Icon name="fingerprint" size={100} color="#E6CAFF" />

          <Text style={styles.heading}>指紋認證</Text>
          <ShakingText
            ref={instance => {
              this.description = instance;
            }}
            style={styles.description(!!errorMessage)}
          >
            {errorMessage || `請用指紋進行身分認證`}
          </ShakingText>

          <TouchableOpacity style={styles.buttonContainer} onPress={backTo}>
            <Text style={styles.buttonText}>BACK TO MAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

FingerprintPopup.propTypes = {
  style: ViewPropTypes.style,
  handlePopupDismissed: PropTypes.func.isRequired
};

export default FingerprintPopup;
