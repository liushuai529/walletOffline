import React from 'react';
import {View, StyleSheet, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {requesetPhoneCode} from '../../redux/actions/code';
import {requestWithdraw, changeFormData} from '../../redux/actions/assets';
import BigNumber from 'bignumber.js';
import transfer from '../../localization/utils';
import {Toast, Overlay} from 'teaset';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class CodeAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.clearTimer();
  }

  componentWillReceiveProps(nextProps) {}

  initTimer() {
    this.countdown();
    this.timer = setInterval(() => {
      this.countdown();
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  countdown() {
    const {time} = this.state;
    if (time <= 0) {
      this.setState({time: 0});
      this.clearTimer();
    }
    this.setState({
      time: time - 1,
    });
  }

  sendCode() {
    this.state.time = 60;
    this.initTimer();
    const {dispatch, data, formData} = this.props;
    if (data.mobile) {
      dispatch(
        requesetPhoneCode({
          mobile: data.mobile,
          service: 'withdraw',
          language: this.props.language,
        }),
      );
      dispatch(
        changeFormData({
          ...formData,
          mobile: data.mobile,
        }),
      );
    } else if (data.email) {
      dispatch(
        requesetPhoneCode({
          email: data.email,
          service: 'withdraw',
          language: this.props.language,
        }),
      );
      dispatch(
        changeFormData({
          ...formData,
          email: data.email,
        }),
      );
    }
  }

  onCodeChanged(text) {
    const {dispatch, formData} = this.props;
    const q = new BigNumber(text);
    if (q.isNaN() && text.length) return;
    if (text.length > 6) return;
    const qArr = text.split('.');
    if (qArr.length === 1 && q.eq(0)) {
      dispatch(
        changeFormData({
          ...formData,
          code: '0',
        }),
      );
      return;
    }
    if (qArr.length > 1 && qArr[1].length > 8) return;
    dispatch(
      changeFormData({
        ...formData,
        code: text,
      }),
    );
  }

  render() {
    const {data} = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.hide();
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: 0.7,
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            backgroundColor: common.navBgColor,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: common.margin15,
              paddingHorizontal: common.margin20,
            }}>
            <Text style={{fontSize: common.font20, color: 'white', flex: 1}}>{common.maskUserAccount(data.mobile ? data.mobile : data.email)}</Text>
            <Text
              style={{
                color: common.themeColor,
              }}
              onPress={() => {
                this.sendCode();
              }}>
              {this.state.time <= 0 ? transfer(this.props.language, 'alert_33') : this.state.time}
            </Text>
          </View>
          <View style={{backgroundColor: common.textColor, height: 0.5, width: '100%'}} />
          <Text
            style={{
              fontSize: common.font16,
              color: common.navTitleColor,
              marginTop: common.margin20,
              paddingVertical: common.margin8,
              paddingHorizontal: common.margin20,
            }}>
            {`${data.mobile ? transfer(this.props.language, 'local_12') : transfer(this.props.language, 'local_13')}`}
          </Text>
          <TextInput
            style={{
              borderColor: '#E0E0E0',
              borderRadius: common.h5,
              paddingVertical: common.margin5,
              marginVertical: common.margin8,
              color: common.navTitleColor,
              fontSize: common.font20,
              paddingHorizontal: common.margin20,
            }}
            placeholder={transfer(this.props.language, 'local_4')}
            placeholderTextColor={common.textColor}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={e => this.onCodeChanged(e)}
            value={this.props.formData.code}
          />
          <View style={{backgroundColor: common.textColor, height: 0.5, width: '100%'}} />
          <TouchableWithoutFeedback
            onPress={() => {
              if (!this.props.formData.code || this.props.formData.code.length == 0) {
                Toast.fail(transfer(this.props.language, 'alert_25'));
                return;
              }
              this.props.submit();
            }}>
            <View
              style={{
                backgroundColor: common.themeColor,
                marginVertical: common.margin30,
                marginHorizontal: common.margin20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: common.margin12,
                borderRadius: common.h5 / 2,
              }}>
              <Text style={{fontSize: common.font20, color: 'black'}}>{transfer(this.props.language, 'alert_36')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {common.IsIOS ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.assets,
    data: state.login.data,
    legalDic: state.user.legalDic,
  };
}

export default connect(mapStateToProps)(CodeAlert);
