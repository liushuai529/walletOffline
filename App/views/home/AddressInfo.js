import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import Picker from 'react-native-picker';
import FastImage from 'react-native-fast-image';
import { common } from '../../constants/common';
import transfer from '../../localization/utils';
import { updateAddress } from '../../redux/actions/market'



class AddressInfo extends Component {

  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '收货地址',
      headerTintColor: common.navTitleColor,
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: common.font17,
      },
    };
  };

  constructor() {
    super()
    this.state = {
      text: '12',
    }
  }

  selectCity() {
    const { dispatch } = this.props;
    Keyboard.dismiss();
    let json = require('../../resource/json/city.json');
    Picker.init({
      pickerData: json,
      selectedValue: [0],
      pickerCancelBtnText: '取消',
      pickerConfirmBtnText: '确定',
      pickerTitleText: '选择城市',
      pickerConfirmBtnColor: [0, 0, 0, 1],
      pickerCancelBtnColor: [0, 0, 0, 1],
      pickerBg: [255, 255, 255, 1],
      onPickerConfirm: data => {
        let first = data[0];
        //let last = data[1] == first ? '' : data[1];
        let last = data[1];
        // this.setState({
        //   city: first + last,
        // });
        dispatch(updateAddress({ province: first, city: last }))
      },
    });
    Picker.show();
  }

  onChange(event, tag) {
    const { text } = event.nativeEvent;
    console.warn('enent', text)
    const { dispatch } = this.props;

    switch (tag) {
      case 'consignee':
        dispatch(
          updateAddress({
            consignee: text.trim(),
          }),
        );
        break;
      case 'phoneNum':
        dispatch(
          updateAddress({
            phoneNum: text.trim(),
          }),
        );
        break;
      case 'detailedAddress':
        dispatch(
          updateAddress({
            detailedAddress: text.trim(),
          }),
        );
        break;
      default:
        break;
    }
  }




  render() {
    const { addressInfo, language } = this.props
    return (
      // <View style={styles.container}>
      // <ScrollView>
      <View style={styles.container}>
        <View style={styles.addressInfoItemContainer}>
          <Text style={styles.addressInfoItem}>收货人:</Text>
          <TextInput
            style={styles.input}
            value={addressInfo ? addressInfo.consignee : null}
            onChange={e => this.onChange(e, 'consignee')}
          />
        </View>
        <View style={styles.addressLine}></View>
        <View style={styles.addressInfoItemContainer}>
          <Text style={styles.addressInfoItem}>手机号码:</Text>
          <TextInput
            style={styles.input}
            value={addressInfo ? addressInfo.phoneNum : null}
            keyboardType='numeric'
            onChange={e => this.onChange(e, 'phoneNum')}
          />
        </View>
        <View style={styles.addressLine}></View>
        <View style={styles.addressInfoItemContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.selectCity();
            }}>
            <View
              style={{
                height: common.h40,
                flexDirection: 'row',
                width: common.sw - common.margin30,

              }}>
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                  alignSelf: 'center',
                }}>
                省市:
              </Text>
              <Text
                style={[
                  {
                    color: common.navTitleColor,
                    fontSize: common.font16,
                    marginHorizontal: common.margin10,
                    alignSelf: 'center',
                    padding: 0,
                  },
                  {
                    color: addressInfo ? addressInfo.province ? common.navTitleColor : common.textColor : common.textColor
                    //addressInfo.province.length > 0 ? common.navTitleColor : common.textColor,
                  },
                ]}>
                {/* {addressInfo.province.length > 0
                  ? addressInfo.province+addressInfo.city
                  : '请选择省市'} */}
                {addressInfo ? addressInfo.province ? addressInfo.province + addressInfo.city : '请选择省市' : '请选择省市'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.addressLine}></View>
        <View style={{ height: common.margin40, marginTop: common.margin20 }}>
          <Text style={styles.addressInfoItem}>详细地址:如街道、门牌号、小区、楼栋号、单元等</Text>
        </View>
        <View style={{ height: common.margin60, marginTop: common.margin20, justifyContent: 'center', borderBottomColor: common.cutOffLine, borderWidth: 1 }}>
          <TextInput
            style={[styles.input, { width: common.sw - common.margin40 }]}
            value={addressInfo ? addressInfo.detailedAddress : null}
            multiline
            onChange={e => this.onChange(e, 'detailedAddress')}
          />
        </View>

        <ImageBackground
          style={{
            padding: 0,
            marginTop: common.getH(40),
            marginBottom: common.getH(60),
            marginHorizontal: common.margin20,
          }}
          resizeMode="cover"
          source={require('../../resource/assets/login_btn.png')}>
          <TouchableOpacity onPress={() => { navigation.navigate('OrderInfo') }}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>保存地址</Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      // </ScrollView>
      // </View >

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingHorizontal: common.margin10,
  },
  addressInfoItemContainer: {
    flexDirection: 'row',
    marginTop: common.margin20,
    paddingHorizontal: common.margin5,
    height: common.margin30,
    alignItems: 'center',
  },
  addressLine: {
    height: common.getH(1),
    width: common.sw - common.getH(20),
    backgroundColor: common.cutOffLine,
    marginTop: common.margin20,
  },
  addressInfoItem: {
    color: common.navTitleColor,
    fontSize: common.font16,
  },
  input: {
    fontSize: common.font16,
    color: common.navTitleColor,
    padding: common.getH(0),
    width: common.getH(280),
    marginLeft: common.margin10,
  },
  submit: {
    height: common.getH(40),
  },
  submitText: {
    fontSize: common.getH(16),
    color: common.textColor,
    textAlign: 'center',
    lineHeight: common.getH(40),
  },
})
function mapStateToProps(state) {
  return {
    ...state.home,
    ...state.market,
    login: state.login,
    language: state.system.language,
  };
}

export default connect(mapStateToProps)(AddressInfo);