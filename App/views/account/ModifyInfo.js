import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Image,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import { Overlay, Toast } from 'teaset';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestModifyInfo } from '../../redux/actions/ModifyInfo';
import { requesetPhoneCode } from '../../redux/actions/code';
import transfer from '../../localization/utils';

class ModifyInfo extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'account_modifyInfo'),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      oldPwd: '',
      loginPwd: '',
      loginRePwd: '',
      code: '',
      codeTime: 60,
      pwdTips: '',
    };
  }
  submit() {
    const { oldPwd, loginPwd, loginRePwd, code } = this.state;
    const { dispatch, userInfo } = this.props;
    if (!oldPwd) {
      Toast.fail(transfer(this.props.language, 'account_modify_password1'));
      return;
    }
    if (!/^(?=^.{6,20}$)(?=.*[A-Z]).*$/.test(oldPwd)) {
      Toast.fail(
        transfer(this.props.language, 'account_modify_password1_wrong'),
      );
      return;
    }
    if (!loginPwd || !loginRePwd) {
      Toast.fail(transfer(this.props.language, 'account_modify_password2'));
      return;
    }

    if (
      !/^(?=^.{6,20}$)(?=.*[A-Z]).*$/.test(loginPwd) ||
      !/^(?=^.{6,20}$)(?=.*[A-Z]).*$/.test(loginRePwd)
    ) {
      Toast.fail(
        transfer(this.props.language, 'account_modify_password2_wrong'),
      );
      return;
    }
    if (loginPwd !== loginRePwd) {
      Toast.fail(
        transfer(this.props.language, 'account_modify_password2_wrong2'),
      );
      return;
    }
    if (!/^.{4,6}$/.test(code)) {
      Toast.fail(transfer(this.props.language, 'account_modify_code_wrong'));
      return;
    }
    userInfo.mobile
      ? dispatch(
        requestModifyInfo({
          oldpassword: oldPwd,
          newpassword: loginPwd,
          mobile: userInfo.mobile,
          code,
        }),
      )
      : dispatch(
        requestModifyInfo({
          oldpassword: oldPwd,
          newpassword: loginPwd,
          email: userInfo.email,
          code,
        }),
      );
  }

  componentWillReceiveProps(nextPros) {
    const { navigation } = nextPros;
    if (
      nextPros.requestStatus !== this.props.requestStatus &&
      nextPros.requestStatus === 'success'
    ) {
      navigation.goBack();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getCode = () => {
    const { dispatch, userInfo } = this.props;

    const { codeTime } = this.state;
    if (codeTime !== 60) return;
    userInfo.mobile
      ? dispatch(
        requesetPhoneCode({
          mobile: userInfo.mobile,
          service: 'update_pass',
          language: this.props.language,
        }),
      )
      : dispatch(
        requesetPhoneCode({
          email: userInfo.email,
          service: 'update_pass',
          language: this.props.language,
        }),
      );
    this.timer = setInterval(() => {
      let timeNum = this.state.codeTime;
      if (timeNum > 0) {
        timeNum = timeNum - 1;
        this.setState({ codeTime: timeNum });
      } else {
        this.setState({ codeTime: 60 });
        clearInterval(this.timer);
      }
    }, 1000);
  };
  maskPhoneOrEmail(value) {
    if (value.mobile) {
      return String(value.mobile).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    if (value.email) {
      const arr = value.email.split('@');
      if (arr[0].length > 3) {
        return `${arr[0].substring(0, 3)}****@${arr[1]}`;
      }
      return value.email;
    }
    return null;
  }

  render() {
    const { userInfo, accountInfo } = this.props;
    let loginName = userInfo.mobile ? common.maskMobile(userInfo.mobile) : common.maskEmail(userInfo.email);
    let nickName = userInfo.nickName ? userInfo.nickName : null;
    let parentId = accountInfo.parent_id;
    let mobile = accountInfo.parent ? this.maskPhoneOrEmail(accountInfo.parent) : null
    const { codeTime } = this.state;
    let showContent1 = [];
    {
      this.props.language === 'en'
        ? userInfo.mobile
          ? ['M', 'o', 'b', 'i', 'l', 'e'].forEach(str => {
            showContent1.push(
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                }}>
                {str}
              </Text>,
            );
          })
          : ['E', 'm', 'a', 'i', 'l'].forEach(str => {
            showContent1.push(
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                }}>
                {str}
              </Text>,
            );
          })
        : common
          .getSymbols(transfer(this.props.language, 'account_modify_numb'))
          .forEach(str => {
            showContent1.push(
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                }}>
                {str}
              </Text>,
            );
          });
    }
    let showContent2 = [];
    common
      .getSymbols(transfer(this.props.language, 'account_modify_name'))
      .forEach(str => {
        showContent2.push(
          <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
            {str}
          </Text>,
        );
      });
    let showContent3 = [];
    common
      .getSymbols(transfer(this.props.language, 'account_modify_recomand'))
      .forEach(str => {
        showContent3.push(
          <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
            {str}
          </Text>,
        );
      });
    let showContent4 = [];
    common
      .getSymbols(transfer(this.props.language, 'account_modify_pwd1'))
      .forEach(str => {
        showContent4.push(
          <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
            {str}
          </Text>,
        );
      });
    let showContent5 = [];
    common
      .getSymbols(transfer(this.props.language, 'account_modify_pwd2'))
      .forEach(str => {
        showContent5.push(
          <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
            {str}
          </Text>,
        );
      });
    let showContent6 = [];
    common
      .getSymbols(transfer(this.props.language, 'account_modify_code'))
      .forEach(str => {
        showContent6.push(
          <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
            {str}
          </Text>,
        );
      });
    return (
      <ImageBackground
        style={{
          paddingVertical: common.getH(20),
          flex: 1,
          paddingHorizontal: common.margin20,
          backgroundColor: common.bgColor,
        }}
        source={require('../../resource/assets/nomal_bg.png')}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(39,39,41)" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <Image
                resizeMode="contain"
                style={{ height: common.margin20, width: common.margin20 }}
                source={require('../../resource/assets/login_user.png')}
              />
            </View>
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {showContent1}
            </View>
            <Text
              style={{
                fontSize: common.font16,
                paddingHorizontal: common.margin5,
                marginRight: common.margin10,
                flex: 10,
                marginLeft: common.margin5,
                color: common.navTitleColor,
              }}>
              {loginName}
            </Text>
          </View>

          {nickName ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: common.margin20,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="contain"
                  style={{ height: common.margin20, width: common.margin20 }}
                  source={require('../../resource/assets/login_user.png')}
                />
              </View>
              <View
                style={{
                  flex: 4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {showContent2}
              </View>
              <Text
                style={{
                  fontSize: common.font16,
                  paddingHorizontal: common.margin5,
                  marginRight: common.margin10,
                  flex: 10,
                  marginLeft: common.margin5,
                  color: common.navTitleColor,
                }}>
                {nickName}
              </Text>
            </View>
          ) : null}

          {parentId ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: common.margin20,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="contain"
                  style={{ height: common.margin20, width: common.margin20 }}
                  source={require('../../resource/assets/login_user.png')}
                />
              </View>
              <View
                style={{
                  flex: 4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {showContent3}
              </View>
              <Text
                style={{
                  fontSize: common.font16,
                  paddingHorizontal: common.margin5,
                  marginRight: common.margin10,
                  flex: 10,
                  marginLeft: common.margin5,
                  color: common.navTitleColor,
                }}>
                {mobile}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flex: 1,
              marginTop: common.margin40,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <Image
                resizeMode="contain"
                style={{ height: common.margin20, width: common.margin20 }}
                source={require('../../resource/assets/login_user.png')}
              />
            </View>
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {showContent4}
            </View>
            <TextInput
              style={styles.input}
              placeholder={transfer(
                this.props.language,
                'account_modify_pwd_placeholder1',
              )}
              placeholderTextColor={common.textColor}
              secureTextEntry={true}
              maxLength={20}
              onChangeText={text => {
                this.setState({ oldPwd: text });
              }}
              value={this.state.oldPwd}
            />
          </View>

          <View
            style={{
              marginTop: common.margin20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <Image
                resizeMode="contain"
                style={{ height: common.margin20, width: common.margin20 }}
                source={require('../../resource/assets/login_user.png')}
              />
            </View>
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {showContent5}
            </View>
            <TextInput
              style={[styles.pwd, { flex: 10, marginRight: common.margin10 }]}
              placeholder={transfer(
                this.props.language,
                'account_modify_pwd_placeholder2',
              )}
              placeholderTextColor={common.textColor}
              value={this.state.loginPwd}
              secureTextEntry={true}
              maxLength={20}
              onChangeText={text => {
                if (!/^(?=.*[0-9].*)(?=.*[A-Z].*).{6,18}$/.test(text))
                  this.setState({
                    pwdTips: transfer(
                      this.props.language,
                      'account_register_24',
                    ),
                  });
                else this.setState({ pwdTips: '' });
                this.setState({ loginPwd: text });
              }}
            />
          </View>

          {this.state.pwdTips ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}
              />
              <View
                style={{
                  flex: 4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              />
              <Text style={{ flex: 10, fontSize: common.font12, color: 'red' }}>
                {this.state.pwdTips}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: this.state.pwdTips ? common.margin5 : common.margin20,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}
            />
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
            <TextInput
              style={[styles.pwd, { flex: 10, marginRight: common.margin10 }]}
              placeholder={transfer(
                this.props.language,
                'account_modify_pwd_placeholder3',
              )}
              placeholderTextColor={common.textColor}
              value={this.state.loginRePwd}
              secureTextEntry={true}
              maxLength={18}
              onChangeText={text => {
                this.setState({ loginRePwd: text });
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              marginTop: common.margin20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <Image
                resizeMode="contain"
                style={{ height: common.margin20, width: common.margin20 }}
                source={require('../../resource/assets/login_user.png')}
              />
            </View>
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {showContent6}
            </View>
            <TextInput
              style={styles.input}
              placeholder={transfer(
                this.props.language,
                'account_modify_pwd_placeholder4',
              )}
              placeholderTextColor={common.textColor}
              maxLength={6}
              onChangeText={text => {
                this.setState({ code: text });
              }}
              value={this.state.code}
            />
            <Text style={styles.codeBtn} onPress={this.getCode}>
              {codeTime === 60
                ? transfer(this.props.language, 'account_modify_code_btn')
                : `${transfer(
                  this.props.language,
                  'account_modify_code_send',
                )}(${codeTime})`}
            </Text>
          </View>
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: common.margin20 }}
            onPress={this.submit.bind(this)}>
            <Text style={styles.btn}>
              {transfer(this.props.language, 'account_modify_submit')}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  codeBtn: {
    position: 'absolute',
    right: common.getH(20),
    lineHeight: common.getH(36),
    color: common.themeColor,
    fontSize: common.getH(16),
  },
  input: {
    borderWidth: common.getH(1),
    borderColor: common.placeholderColor,
    fontSize: common.getH(16),
    padding: common.margin5,
    marginRight: common.margin10,
    flex: 10,
    marginLeft: common.margin5,
    color: common.textColor,
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: common.getH(25),
    paddingVertical: common.getH(10),
    width: '80%',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: common.getH(16),
    color: '#959595',
    width: '40%',
    lineHeight: common.getH(22),
  },
  pwdLabel: {
    alignSelf: 'flex-start',
  },
  info: {
    fontSize: common.getH(16),
    color: '#959595',
  },
  pwd: {
    borderWidth: common.getH(1),
    borderColor: common.placeholderColor,
    padding: common.margin5,
    fontSize: common.getH(16),
    marginLeft: common.margin5,
    color: common.textColor,
  },
  repwd: {
    borderWidth: common.getH(1),
    marginTop: common.getH(10),
    borderColor: common.placeholderColor,
    padding: common.margin5,
    fontSize: common.getH(16),
    color: common.textColor,
  },
  btn: {
    width: '90%',
    textAlign: 'center',
    height: common.getH(40),
    backgroundColor: common.themeColor,
    fontSize: common.getH(16),
    lineHeight: common.getH(40),
    color: common.textColor,
    borderRadius: common.getH(4),
    marginTop: common.getH(20),
  },
  submitText: {
    fontSize: common.getH(16),
    color: '#FFF',
    textAlign: 'center',
    lineHeight: common.getH(40),
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.modifyInfo,
    userInfo: state.login.data,
    accountInfo: state.account.info,
  };
}

export default connect(mapStateToProps)(ModifyInfo);
