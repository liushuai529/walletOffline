import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {Toast} from 'teaset';
import {common} from '../../constants/common';
import TKButton from '../../components/TKButton';
import TKSpinner from '../../components/TKSpinner';
import TKInputItem from '../../components/TKInputItem';
import TKInputItemCheckCode from '../../components/TKInputItemCheckCode';
import actions from '../../redux/actions/index';
import schemas from '../../schemas/index';
import transfer from '../../localization/utils';
import cache from '../../utils/cache';
import {isValidPhoneNumber} from 'react-phone-number-input';

const styles = StyleSheet.create({
  backBtn: {
    height: common.w40,
    width: common.w40,
    justifyContent: 'center',
  },
  backImage: {
    marginLeft: common.margin10,
    width: common.w10,
    height: common.h20,
  },
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  mobile: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    backgroundColor: common.bgColor,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: common.placeholderColor,
  },
  tipsContainer: {
    marginTop: common.margin15,
    color: common.navTitleColor,
    fontSize: common.font17,
  },
  tipsContent: {
    marginTop: common.margin10,
    color: common.navTitleColor,
    fontSize: common.font15,
    lineHeight: 20,
  },
  viewStyle: {
    borderWidth: 0,
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    height: common.h40,
    backgroundColor: common.bgColor,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: common.placeholderColor,
  },
  inputStyle: {
    marginLeft: common.margin10,
    width: '80%',
    fontSize: common.font12,
    color: 'white',
  },
  inputText: {
    width: common.w100,
    color: common.navTitleColor,
    fontSize: common.font12,
  },
});

class UpdateMobile extends Component {
  static navigationOptions(props) {
    let title = '';
    if (props.navigation.state.params) {
      title = props.navigation.state.params.title;
    }
    return {
      headerTitle: title,
    };
  }
  constructor(props) {
    super(props);
    this.showGetVerificateSmtpCodeResponse = false;
    props.navigation.addListener('didFocus', () => {
      cache.setObject('currentComponentVisible', 'UpdateMobile');
      props.dispatch(actions.getGoogleAuth(schemas.findUser(props.user.id)));
    });
  }

  componentDidMount() {
    const {navigation, language, dispatch, loggedIn} = this.props;
    navigation.setParams({
      title: transfer(language, 'me_linkMobile'),
    });
    if (loggedIn) dispatch(actions.sync());
  }

  componentWillReceiveProps(nextProps) {
    this.handleRequestGetCode(nextProps);
    this.handleUpdateMobileRequest(nextProps);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(
      actions.updateEmailMobileUpdate({
        email: '',
        codeEmail: '',
        mobile: '',
        codeMobile: '',
        codeGoogle: '',
      }),
    );
  }

  onChange(event, tag) {
    const {text} = event.nativeEvent;
    const {dispatch, codeEmail, mobile, codeMobile, codeGoogle} = this.props;

    switch (tag) {
      case 'codeEmail':
        dispatch(
          actions.updateEmailMobileUpdate({
            codeEmail: text.trim(),
            mobile,
            codeMobile,
            codeGoogle,
          }),
        );
        break;
      case 'mobile':
        dispatch(
          actions.updateEmailMobileUpdate({
            codeEmail,
            mobile: text.trim(),
            codeMobile,
            codeGoogle,
          }),
        );
        break;
      case 'codeMobile':
        dispatch(
          actions.updateEmailMobileUpdate({
            codeEmail,
            mobile,
            codeMobile: text.trim(),
            codeGoogle,
          }),
        );
        break;
      case 'codeGoogle':
        dispatch(
          actions.updateEmailMobileUpdate({
            codeEmail,
            mobile,
            codeMobile,
            codeGoogle: text.trim(),
          }),
        );
        break;
      default:
        break;
    }
  }

  sendCodeMobile(count) {
    const {dispatch, mobile, language} = this.props;
    let newMobile = mobile;
    let code = this.props.country_data[this.props.country_index].code;
    if (code !== 86) {
      newMobile = `+${code}-${mobile}`;
    }
    if (!mobile.length) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    if (code == 86 && !common.regMobile.test(mobile)) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    if (code !== 86 && !isValidPhoneNumber(newMobile)) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    this.count = count;
    dispatch(
      actions.getVerificateCode({
        mobile: newMobile,
        service: 'update_mobile',
        language,
      }),
    );
  }

  sendCodeEmail(count) {
    const {dispatch, language, user} = this.props;
    if (!user.email.length || !common.regEmail.test(user.email)) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    this.count = count;
    dispatch(
      actions.getVerificateCode({
        email: user.email,
        service: 'update_mobile',
        language,
      }),
    );
  }

  confirmPress() {
    Keyboard.dismiss();

    const {
      dispatch,
      language,
      user,
      codeEmail,
      mobile,
      codeMobile,
      codeGoogle,
      googleAuth,
    } = this.props;
    let newMobile = mobile;
    let code = this.props.country_data[this.props.country_index].code;
    if (code !== 86) {
      newMobile = `+${code}-${mobile}`;
    }
    if (!mobile.length) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    if (code == 86 && !common.regMobile.test(mobile)) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }
    if (code !== 86 && !isValidPhoneNumber(newMobile)) {
      Toast.fail(transfer(language, 'me_Mobile_correctFormat'));
      return;
    }

    if (!codeMobile.length) {
      Toast.fail(transfer(language, 'me_enter_mobileVerification'));
      return;
    }

    if (googleAuth) {
      if (!codeGoogle.length) {
        Toast.fail(transfer(language, 'me_inputGoogleCode'));
        return;
      }
      dispatch(
        actions.updateMobile({
          mobile: newMobile,
          mobileCode: codeMobile,
          googleCode: codeGoogle,
        }),
      );
    } else {
      if (!codeEmail.length) {
        Toast.fail(transfer(language, 'me_enter_EmailVerification'));
        return;
      }
      dispatch(
        actions.updateMobile({
          mobile: newMobile,
          mobileCode: codeMobile,
          email: user.email,
          emailCode: codeEmail,
        }),
      );
    }
  }

  errors = {
    4000107: 'me_Email_repeatMinute',
    4000102: 'auth_smscode_error',
    4000174: 'AuthCode_gv_code_error',
    4031601: 'Otc_please_login_to_operate',
  };

  handleRequestGetCode(nextProps) {
    const {
      requestGetCodeLoading,
      requestGetCodeResponse,
      language,
      dispatch,
      loggedIn,
    } = nextProps;
    if (!this.props.requestGetCodeLoading || requestGetCodeLoading) {
      return;
    }
    if (requestGetCodeResponse.success) {
      Toast.success(transfer(language, 'get_code_succeed'));
    } else {
      const msg = transfer(
        language,
        this.errors[requestGetCodeResponse.error.code],
      );
      if (msg) Toast.fail(msg);
      else
        Toast.fail(
          transfer(language, 'AuthCode_failed_to_get_verification_code'),
        );
      if (loggedIn) dispatch(actions.sync());
    }
  }

  handleUpdateMobileRequest(nextProps) {
    const {
      updateMobileVisible,
      updateMobileError,
      updateMobileResult,
    } = nextProps;
    const {user, language, dispatch, navigation, loggedIn} = this.props;
    if (!updateMobileVisible && this.props.updateMobileVisible) {
      if (updateMobileError) {
        if (updateMobileError.message === common.badNet) {
          Toast.fail(transfer(language, 'OtcDetail_net_error'));
        } else if (updateMobileError.message === 'sms验证码错误') {
          Toast.fail(transfer(language, 'auth_smscode_error'));
        } else if (updateMobileError.message === 'email验证码错误') {
          Toast.fail(transfer(language, 'auth_emailcode_error'));
        } else {
          const msg = this.errors[updateMobileError.code];
          if (msg) Toast.fail(transfer(language, msg));
          else Toast.fail(transfer(language, 'me_Mobile_bind_failed'));
        }
        if (loggedIn) dispatch(actions.sync());
      }
      if (updateMobileResult) {
        Toast.success(transfer(language, 'me_Mobile_binded'));
        user.mobileStatus = common.user.status.bind;
        dispatch(actions.findUserUpdate(JSON.parse(JSON.stringify(user))));
        dispatch(actions.findUser(schemas.findUser(user.id)));
        if (loggedIn) dispatch(actions.sync());
        navigation.goBack();
      }
    }
  }

  handleGetVerificateCodeRequest(nextProps) {
    const {language, dispatch, loggedIn} = this.props;
    const {requestGetCodeLoading, requestGetCodeResponse} = nextProps;
    if (!requestGetCodeLoading && !this.showGetVerificateSmtpCodeResponse)
      return;

    if (requestGetCodeLoading) {
      this.showGetVerificateSmtpCodeResponse = true;
    } else {
      this.showGetVerificateSmtpCodeResponse = false;
      if (requestGetCodeResponse.success) {
        this.count();
        Toast.success(transfer(language, 'get_code_succeed'));
      } else if (requestGetCodeResponse.error.code === 4000107) {
        Toast.fail(transfer(language, 'me_Email_repeatMinute'));
      } else {
        Toast.fail(transfer(language, 'me_Email_getCodeFailed'));
      }
      if (loggedIn) dispatch(actions.sync());
    }
  }

  renderTip = () => (
    <View style={{marginHorizontal: common.margin10}}>
      <Text style={styles.tipsContainer}>
        {transfer(this.props.language, 'me_Email_pleaes_note')}
      </Text>
      <Text style={styles.tipsContent}>
        {transfer(this.props.language, 'me_Mobile_note_content')}
      </Text>
    </View>
  );

  render() {
    const {
      codeEmail,
      mobile,
      codeMobile,
      codeGoogle,
      updateMobileVisible,
      user,
      language,
      googleAuth,
    } = this.props;

    let newMobile = mobile;
    let code = this.props.country_data[this.props.country_index].code;
    if (code !== 86) {
      newMobile = `+${code}-${mobile}`;
    }

    let isValid = false;
    if (code == 86 && common.regMobile.test(mobile)) {
      isValid = true;
    }
    if (code !== 86 && isValidPhoneNumber(newMobile)) {
      isValid = true;
    }

    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <View
            style={[
              styles.mobile,
              {
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: common.h40,
                borderBottomWidth: 0.5,
                borderBottomColor: common.placeholderColor,
              },
            ]}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate('CountryCode');
              }}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    paddingHorizontal: common.margin8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={styles.inputText}>
                  {transfer(language, 'AuthCode_mobile_tip')}
                </Text>
                <Text
                  style={{
                    fontSize: common.font14,
                    color: common.themeColor,
                  }}>
                  {`+${this.props.country_data[this.props.country_index].code}`}
                </Text>
                <Image
                  style={{
                    width: common.getH(8),
                    height: common.getH(5),
                    marginLeft: common.margin5,
                    tintColor: common.themeColor,
                  }}
                  source={require('../../resource/assets/down.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <TextInput
              style={[
                {
                  flex: 1,
                  borderWidth: 0,
                  fontSize: common.font12,
                  color: common.navTitleColor,
                },
              ]}
              placeholderTextColor={common.textColor}
              placeholder={transfer(language, 'me_enter_mobileAddress')}
              value={mobile}
              onChange={e => this.onChange(e, 'mobile')}
              editable={user.mobileStatus !== common.user.status.bind}
            />
          </View>
          {/* <TKInputItem
            viewStyle={styles.mobile}
            titleStyle={styles.inputText}
            title={transfer(language, 'AuthCode_mobile_tip')}
            placeholder={transfer(language, 'me_enter_mobileAddress')}
            value={mobile}
            onChange={e => this.onChange(e, 'mobile')}
            editable={user.mobileStatus !== common.user.status.bind}
          /> */}
          {user.mobileStatus === common.user.status.bind ? null : (
            <TKInputItemCheckCode
              viewStyle={styles.viewStyle}
              inputStyle={styles.inputStyle}
              titleStyle={styles.inputText}
              title={transfer(language, 'AuthCode_sms_tip')}
              language={language}
              placeholder={transfer(language, 'me_enter_mobileVerification')}
              value={codeMobile}
              maxLength={8}
              extraDisable={!mobile || !isValid}
              onPressCheckCodeBtn={() => this.sendCodeMobile()}
              onChange={e => this.onChange(e, 'codeMobile')}
              textInputProps={{
                keyboardType: 'numeric',
              }}
            />
          )}
          {!googleAuth ? null : (
            <TKInputItem
              viewStyle={styles.mobile}
              titleStyle={styles.inputText}
              title={transfer(language, 'me_googleCode')}
              placeholder={transfer(language, 'me_inputGoogleCode')}
              value={codeGoogle}
              maxLength={6}
              onChange={e => this.onChange(e, 'codeGoogle')}
            />
          )}
          {googleAuth ? null : (
            <TKInputItem
              viewStyle={styles.mobile}
              titleStyle={styles.inputText}
              title={transfer(language, 'AuthCode_email_tip')}
              placeholder={transfer(language, 'me_enter_EmailAddress')}
              value={common.maskEmail(user.email || '')}
              onChange={e => this.onChange(e, 'email')}
              editable={false}
            />
          )}
          {googleAuth ? null : (
            <TKInputItemCheckCode
              viewStyle={styles.viewStyle}
              inputStyle={styles.inputStyle}
              titleStyle={styles.inputText}
              title={transfer(language, 'AuthCode_email_code')}
              language={language}
              placeholder={transfer(language, 'me_enter_EmailVerification')}
              value={codeEmail}
              maxLength={6}
              onPressCheckCodeBtn={() => this.sendCodeEmail()}
              onChange={e => this.onChange(e, 'codeEmail')}
              textInputProps={{
                keyboardType: 'numeric',
              }}
            />
          )}

          {this.renderTip()}
          <TKButton
            style={{
              marginTop:
                user.mobileStatus === common.user.status.bind
                  ? common.margin10
                  : common.margin20,
              backgroundColor:
                user.mobileStatus === common.user.status.bind
                  ? 'transparent'
                  : common.themeColor,
            }}
            titleStyle={{color: common.blackColor, fontSize: common.font17}}
            onPress={() => this.confirmPress()}
            disabled={
              user.mobileStatus === common.user.status.bind
                ? true
                : updateMobileVisible
            }
            caption={
              user.mobileStatus === common.user.status.bind
                ? transfer(language, 'me_Mobile_binded')
                : transfer(language, 'me_ID_confirm')
            }
            theme={'gray'}
          />

          <TKSpinner isVisible={updateMobileVisible} />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.login.data,
    codeEmail: state.user.codeEmail,
    mobile: state.user.mobile,
    codeMobile: state.user.codeMobile,
    codeGoogle: state.user.codeGoogle,
    googleAuth: state.user.googleAuth,

    updateMobileVisible: state.user.updateMobileVisible,
    updateMobileResult: state.user.updateMobileResult,
    updateMobileError: state.user.updateMobileError,
    requestGetCodeLoading: state.user.requestGetCodeLoading,
    requestGetCodeResponse: state.user.requestGetCodeResponse,
    language: state.system.language,
    loggedIn: state.login.isLogin,
    ...state.country_code,
  };
}

export default connect(mapStateToProps)(UpdateMobile);
