import React from 'react';
import {View, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../constants/common';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {requesetPhoneCode} from '../redux/actions/code';
import {changeFormData, clearFormData} from '../redux/actions/alert_code';
import BigNumber from 'bignumber.js';
import transfer from '../localization/utils';
import {Toast} from 'teaset';

class AlertCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      type:
        props.data && props.data.mobile && props.data.mobile.length > 0 ? 0 : 1,
    };
  }

  componentDidMount() {
    const {dispatch, formData} = this.props;
    dispatch(
      clearFormData({
        ...formData,
        code: '',
      }),
    );
  }

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
    const {dispatch, data, formData, service} = this.props;
    if (this.state.type == 0) {
      dispatch(
        requesetPhoneCode({
          mobile: data.mobile,
          service: service,
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
          service: service,
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
              backgroundColor: common.navBgColor,
              paddingTop: common.margin20,
              paddingLeft: common.margin20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              {data.mobile ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({
                      type: 0,
                    });
                  }}>
                  <View
                    style={{
                      marginRight: common.margin20,
                    }}>
                    <Text
                      style={{
                        fontSize: common.font17,
                        color:
                          this.state.type == 0
                            ? common.themeColor
                            : common.textColor,
                      }}>
                      {`${transfer(this.props.language, 'local_12')}`}
                    </Text>
                    <View
                      style={{
                        marginTop: common.margin20,
                        width: '100%',
                        height: 2,
                        backgroundColor:
                          this.state.type == 0
                            ? common.themeColor
                            : 'transparent',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
              {data.email ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({
                      type: 1,
                    });
                  }}>
                  <View
                    style={{
                      marginRight: common.margin20,
                    }}>
                    <Text
                      style={{
                        fontSize: common.font17,
                        color:
                          this.state.type == 1
                            ? common.themeColor
                            : common.textColor,
                      }}>
                      {`${transfer(this.props.language, 'local_13')}`}
                    </Text>
                    <View
                      style={{
                        marginTop: common.margin20,
                        width: '100%',
                        height: 2,
                        backgroundColor:
                          this.state.type == 1
                            ? common.themeColor
                            : 'transparent',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: common.textColor,
                height: 0.5,
                width: '100%',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: common.margin15,
              paddingHorizontal: common.margin20,
            }}>
            <Text
              style={{
                fontSize: common.font16,
                color: common.navTitleColor,
                paddingVertical: common.margin8,
              }}>
              {`${
                this.state.type == 0
                  ? transfer(this.props.language, 'account_register_18')
                  : transfer(this.props.language, 'account_register_19')
              }:`}
            </Text>
            <Text
              style={{
                marginLeft: common.margin10,
                fontSize: common.font16,
                color: 'white',
                flex: 1,
              }}>
              {common.maskUserAccount(
                this.state.type == 0 ? data.mobile : data.email,
              )}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: common.textColor,
              height: 0.5,
              width: '100%',
            }}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: common.font16,
                color: common.navTitleColor,
                paddingVertical: common.margin10,
                paddingLeft: common.margin20,
              }}>
              {`${
                this.state.type == 0
                  ? transfer(this.props.language, 'local_12')
                  : transfer(this.props.language, 'local_13')
              }:`}
            </Text>
            <TextInput
              style={{
                flex: 1,
                borderColor: '#E0E0E0',
                borderRadius: common.h5,
                paddingVertical: common.margin5,
                marginVertical: common.margin8,
                color: common.navTitleColor,
                fontSize: common.font16,
                paddingHorizontal: common.margin10,
              }}
              placeholder={transfer(this.props.language, 'local_4')}
              placeholderTextColor={common.textColor}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              onChangeText={e => this.onCodeChanged(e)}
              value={this.props.formData.code}
            />
            <Text
              style={{
                color: common.themeColor,
                paddingRight: common.margin20,
              }}
              onPress={() => {
                this.sendCode();
              }}>
              {this.state.time <= 0
                ? transfer(this.props.language, 'alert_33')
                : this.state.time}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: common.textColor,
              height: 0.5,
              width: '100%',
            }}
          />
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.hide();
              }}>
              <View
                style={{
                  backgroundColor: '#C9CACC',
                  marginVertical: common.margin30,
                  marginLeft: common.margin20,
                  marginRight: common.margin10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: common.margin12,
                  borderRadius: common.h5 / 2,
                  flex: 1,
                }}>
                <Text style={{fontSize: common.font20, color: 'black'}}>
                  {transfer(this.props.language, 'withdrawal_cancel')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                if (
                  !this.props.formData.code ||
                  this.props.formData.code.length == 0
                ) {
                  Toast.fail(transfer(this.props.language, 'alert_25'));
                  return;
                }
                this.props.submit(this.state.type);
              }}>
              <View
                style={{
                  backgroundColor: common.themeColor,
                  marginVertical: common.margin30,
                  marginLeft: common.margin10,
                  marginRight: common.margin20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: common.margin12,
                  borderRadius: common.h5 / 2,
                  flex: 1,
                }}>
                <Text style={{fontSize: common.font20, color: 'black'}}>
                  {transfer(this.props.language, 'alert_36')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {common.IsIOS ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.alert_code,
    data: state.login.data,
  };
}

export default connect(mapStateToProps)(AlertCode);
