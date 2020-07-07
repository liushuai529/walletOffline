import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Text,
  NativeModules,
  CameraRoll,
  Dimensions,
  DeviceEventEmitter,
  Linking,
  Alert,
} from 'react-native';
import { common } from '../../constants/common';
import PasswordWarn from './PasswordWarn';
import TKButton from '../../components/TKButton';
import TKInputItem from '../../components/TKInputItem'
import WalletSwiper from './WalletSwiper';

import {
  newsImgHashApi,
  defaultRebatesLink,
  rebatesLink,
  addNewsFlashCount,
} from '../../services/api';

import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class SetPassword extends Component {
  static navigationOptions(props) {
    let params = props.navigation.state.params;
    let dispatch = params.dispatch;
    return {
      headerTitle: '创建钱包',
      headerLeft: (
        <NextTouchableOpacity
          style={{
            height: common.w40,
            width: common.w40,
            justifyContent: 'center',
          }}
          activeOpacity={common.activeOpacity}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={{
              marginLeft: common.margin10,
              width: common.w10,
              height: common.h20,
            }}
            source={require('../../resource/assets/arrow_left.png')}
          />
        </NextTouchableOpacity>
      ),
      headerRight: params && params.next ? (
        <NextTouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={common.activeOpacity}
          onPress={() => {
            props.navigation.navigate('SetRePassword', {pwd: params.pwd, dispatch}); 
          }}
        >
          <Text style={{color: common.whiteColor, marginRight: common.margin10 }}>下一步</Text>

        </NextTouchableOpacity>
      ) : <View style={{marginRight: common.margin10}}></View>,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { key: 'lowercase', value: false },
        { key: 'capital', value: false },
        { key: 'number', value: false },
        { key: 'length', value: false }
      ],
      pwd: '',
    };

  }
  componentDidMount() {

  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }

  



  jumpToCreateWallete() {
    this.props.navigation.navigate('CreateWallet')
  }

  handlePwd = pwd => {
    this.setState({ pwd });
    if(this.checkPwd(pwd)) {
      this.props.navigation.setParams({next: true, pwd})
    } else {
      this.props.navigation.setParams({next: false, pwd}) 
    }
  }

  checkPwd = pwd => {
    let lowercaseResult, capitalResult, numberResult, lengthResult;
    let regDic = {
      'lowercase': /[a-z]+/,
      'capital': /[A-Z]+/,
      'number': /\d+/,
    }
    if (regDic['lowercase'].test(pwd)) {
      lowercaseResult = this.updateData('lowercase', true);
    } else {
      lowercaseResult = this.updateData('lowercase'); 
    }
    if (regDic['capital'].test(pwd)) {
      capitalResult = this.updateData('capital', true);
    } else {
      capitalResult = this.updateData('capital');
    }
    if (regDic['number'].test(pwd)) {
      numberResult = this.updateData('number', true);
    } else {
      numberResult = this.updateData('number');
    }
    if (pwd.length > 7) {
      lengthResult = this.updateData('length', true);
    } else {
      lengthResult = this.updateData('length');
    } 
    return lowercaseResult && capitalResult && numberResult && lengthResult;
  }

  updateData = (key, tag) => {
    const { data } = this.state;
    let newData = data.map(item => {
      if (item.key === key) {
        item.value = tag ? true : false;
      }
      return item
    })
    this.setState({ data: newData })
    return tag
  }








  render() {
    const { pwd } = this.state;
    return (
      <View style={styles.container}>

        <View>
          <Text style={styles.tip}>请设置安全密码</Text>
          <View style={{ height: common.margin40, marginTop: common.margin10 }}>
            <TKInputItem
              inputStyle={{
                fontSize: common.font14,
              }}
              value={pwd}
              onChangeText={this.handlePwd}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <PasswordWarn
            type={'password'}
            value={this.state.data}
          />
        </View>

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.newsLetter,

  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingHorizontal: common.margin10,
    paddingTop: common.margin20
  },
  tip: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  }






});

export default connect(mapStateToProps)(SetPassword);
