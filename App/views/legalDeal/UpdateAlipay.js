import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import {Toast, Overlay} from 'teaset';
import {common} from '../../constants/common';
import TKButton from '../../components/TKButton';
import TKSpinner from '../../components/TKSpinner';
import TKInputItem from '../../components/TKInputItem';
import {
  updateForm,
  requestUpdateAlipay,
  updateAuthCodeType,
  requestGetCode,
  updateQrImage,
} from '../../redux/actions/updateAlipay';
import {findUserUpdate} from '../../redux/actions/user';
// import WithdrawAuthorizeCode from '../balance/components/WithdrawAuthorizeCode';
import transfer from '../../localization/utils';
import actions from '../../redux/actions/index';
import {imgHashApi} from '../../services/api';
import SelectImage from '../account/SelectImage';
import PutObject from 'rn-put-object';
import AlertCode from '../../components/alert_code';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  container1: {
    flex: 1,
    backgroundColor: common.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 16,
    color: '#DFE4FF',
    marginHorizontal: 30,
    textAlign: 'center',
  },
  tipView: {
    width: '100%',
    marginTop: common.margin5,
    backgroundColor: common.navBgColor,
  },
  tipTitle: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    color: common.textColor,
    fontSize: common.font12,
  },
  tipDetail: {
    width: '100%',
    marginTop: common.margin5,
    paddingHorizontal: common.margin10,
    marginBottom: common.margin10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

class UpdateAlipay extends Component {
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
    this.codeTitles = ['短信验证码', '谷歌验证码', '邮箱验证码'];
  }

  componentDidMount() {
    const {dispatch, user, navigation, language, loggedIn} = this.props;
    navigation.setParams({
      title: transfer(language, 'me_alipay_management'),
    });
    if (!user) return;
    const alipayAccount =
      user.alipay && user.alipay.account ? user.alipay.account : '';
    const editable = !(
      navigation.state.params &&
      navigation.state.params.fromMe === 'fromMe' &&
      alipayAccount.length
    );
    this.editable = editable;
    if (editable) {
      dispatch(
        updateForm({
          name: '',
          account: '',
          qrHash: '',
          smsCode: '',
          googleCode: '',
          emailCode: '',
        }),
      );
      dispatch(updateQrImage({uri: '', hash: ''}));
    } else {
      dispatch(
        updateForm({
          name: user.name,
          account: user.alipay ? user.alipay.account : undefined,
          qrHash: user.alipay ? user.alipay.qrHash : undefined,
          smsCode: '',
          googleCode: '',
          emailCode: '',
        }),
      );
      if (user.alipay && user.alipay.qrHash) {
        var uri = `${imgHashApi}${user.alipay.qrHash}`;
        dispatch(updateQrImage({uri, hash: user.alipay.qrHash}));
      }
    }
    if (loggedIn) dispatch(actions.sync());
  }

  componentWillReceiveProps(nextProps) {
    this.handleRequestGetCode(nextProps);
    this.handleRequestUpdateAlipay(nextProps);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(updateForm({name: '', account: '', qrHash: '', smsCode: ''}));
  }

  onChangeText(text, tag) {
    const {dispatch, formState} = this.props;
    if (tag === 'account') {
      dispatch(updateForm({...formState, account: text.trim()}));
    } else if (tag === 'code') {
      dispatch(updateForm({...formState, smsCode: text.trim()}));
    }
  }

  confirmPress(title) {
    Keyboard.dismiss();

    this.resetAlipay = false;

    const {dispatch, formState, navigation, user, language} = this.props;
    if (title === '解除绑定') {
      this.resetAlipay = true;
      this.showAuthCode();
      return;
    } else if (title === '重新添加') {
      this.editable = true;
      dispatch(updateForm({name: '', account: '', qrHash: '', smsCode: ''}));
      dispatch(updateQrImage({uri: '', hash: ''}));
      return;
    }
    if (formState.name.length === 0) {
      if (user.name.length > 0) {
        dispatch(updateForm({...formState, name: user.name}));
      } else {
        Toast.fail(transfer(language, 'updateAlipay_enter_account'));
        return;
      }
    }
    if (
      !formState.account ||
      formState.account.length < 4 ||
      formState.account.length > 50
    ) {
      Toast.fail(transfer(language, 'updateAlipay_enter_account'));
      return;
    }

    if (
      !common.validatePhone(formState.account) &&
      !common.validateEmail(formState.account)
    ) {
      Toast.fail(transfer(language, 'updateAlipay_enter_account'));
      return;
    }

    if (!formState.qrHash || !formState.qrHash.length) {
      Toast.fail(transfer(language, 'updateAlipay_upload_qr'));
      return;
    }

    this.showAuthCode();
  }

  updateAlipay(type) {
    Keyboard.dismiss();
    const {
      user,
      authCodeType,
      formState,
      dispatch,
      language,
      data,
      codeFormData,
    } = this.props;
    const {smsCode, googleCode, emailCode, account, qrHash} = formState;
    var requestParam = {};
    if (!this.resetAlipay) {
      if (user.name) requestParam.name = user.name;
      if (account && account.length > 0) requestParam.account = account;
      if (qrHash && qrHash.length > 0) requestParam.qrHash = qrHash;
    }

    if (!codeFormData.code || codeFormData.code.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_25'));
      return;
    }

    requestParam['code'] = codeFormData.code;
    if (type == 0) {
      requestParam['mobile'] = data.mobile;
    } else {
      requestParam['email'] = data.email;
    }

    dispatch(requestUpdateAlipay(requestParam));
    return;

    if (authCodeType === '短信验证码') {
      if (!smsCode || smsCode.length === 0) {
        Toast.fail(transfer(language, 'me_enter_mobileVerification'));
        return;
      }
      dispatch(
        requestUpdateAlipay({
          ...requestParam,
          mobile: user.mobile,
          code: smsCode,
        }),
      );
      return;
    }
    if (authCodeType === '谷歌验证码') {
      if (!googleCode || googleCode.length === 0) {
        Toast.fail(transfer(language, 'me_inputGoogleCode'));
        return;
      }
      dispatch(
        requestUpdateAlipay({
          ...requestParam,
          googleCode: googleCode,
        }),
      );
      return;
    }
    if (authCodeType === '邮箱验证码') {
      if (!emailCode || emailCode.length === 0) {
        Toast.fail(transfer(language, 'me_enter_EmailVerification'));
        return;
      }
      dispatch(
        requestUpdateAlipay({
          ...requestParam,
          email: user.email,
          code: emailCode,
        }),
      );
    }
  }

  authCodeChanged = (e, code) => {
    const {dispatch, formState, authCodeType} = this.props;
    if (authCodeType === '短信验证码') {
      dispatch(
        updateForm({
          ...formState,
          smsCode: code,
        }),
      );
    } else if (authCodeType === '谷歌验证码') {
      dispatch(
        updateForm({
          ...formState,
          googleCode: code,
        }),
      );
    } else {
      dispatch(
        updateForm({
          ...formState,
          emailCode: code,
        }),
      );
    }
  };

  segmentValueChanged = e => {
    const {dispatch, formState} = this.props;
    const title = this.codeTitles[e.index];
    dispatch(updateAuthCodeType(title));
    if (title === '谷歌验证码') {
      dispatch(
        updateForm({
          ...formState,
          smsCode: '',
          emailCode: '',
        }),
      );
    } else if (title === '短信验证码') {
      dispatch(
        updateForm({
          ...formState,
          googleCode: '',
          emailCode: '',
        }),
      );
    } else {
      dispatch(
        updateForm({
          ...formState,
          smsCode: '',
          googleCode: '',
        }),
      );
    }
  };

  SMSCodePress = count => {
    this.count = count;
    const {user, dispatch} = this.props;
    dispatch(requestGetCode({mobile: user.mobile, service: 'update_alipay'}));
  };

  showAuthCode = () => {
    const {dispatch, user, formState, language} = this.props;
    dispatch(updateAuthCodeType('短信验证码'));

    var stateParam = {
      ...formState,
      smsCode: '',
      googleCode: '',
      emailCode: '',
    };
    dispatch(updateForm(stateParam));

    const overlayView = (
      <Overlay.View style={{flex: 1}} modal={false} overlayOpacity={0}>
        <AlertCode
          service="update_alipay"
          hide={() => {
            this.hideAlert();
          }}
          submit={(type) => {
            this.hideAlert();
            this.updateAlipay(type);
          }}
        />
        {/* <WithdrawAuthorizeCode
          initialIndexSelected={language === 'zh_hans' ? 0 : 1}
          dispatch={this.props.dispatch}
          titles={[
            transfer(language, 'AuthCode_SMS_code'),
            transfer(language, 'AuthCode_GV_code'),
            transfer(language, 'AuthCode_email_code'),
          ]}
          mobile={user.mobile}
          email={user.email}
          emailStatus={user.emailStatus}
          onChangeText={this.authCodeChanged}
          segmentValueChanged={this.segmentValueChanged}
          smsCodePress={this.SMSCodePress}
          emsCodePress={count => {
            this.count = count;
            dispatch(requestGetCode({ email: user.email, service: 'update_alipay' }));
          }}
          confirmPress={link => this.updateAlipay(link)}
          cancelPress={() => Overlay.hide(this.overlayViewKeyID)}
          language={language}
        /> */}
      </Overlay.View>
    );
    this.overlayViewKeyID = Overlay.show(overlayView);
  };

  hideAlert() {
    if (this.overlayViewKeyID) {
      Overlay.hide(this.overlayViewKeyID);
      this.overlayViewKeyID = null;
    }
  }

  codeTitles = ['短信验证码', '谷歌验证码', '邮箱验证码'];

  errors = {
    4000156: 'login_codeError',
    4000102: 'login_codeError',
    4000103: 'login_codeError',
    4000104: 'login_codeError',
    4000105: 'login_codeError',
    4000106: 'login_codeReacquire',
    4000107: 'AuthCode_cannot_send_verification_code_repeatedly_within_one_minute',
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
    }
    if (loggedIn) dispatch(actions.sync());
  }

  userUpdate(nextProps) {
    const {user, formState, dispatch} = nextProps;
    const newUser = {
      ...user,
    };
    newUser.alipay = {
      ...user.alipay,
      account: formState.account,
      qrHash: formState.qrHash,
    };
    dispatch(findUserUpdate(newUser));
  }

  handleRequestUpdateAlipay(nextProps) {
    const {
      updateBankResult,
      updateBankError,
      navigation,
      language,
      dispatch,
      loggedIn,
    } = nextProps;
    if (updateBankResult && updateBankResult !== this.props.updateBankResult) {
      this.userUpdate(nextProps);
      Toast.success(
        transfer(
          language,
          this.resetAlipay ? 'UpdateAlipay_msg_reset_succeed' : 'bank_linked',
        ),
      );
      Overlay.hide(this.overlayViewKeyID);
      navigation.goBack();
      return;
    }
    if (updateBankError && updateBankError !== this.props.updateBankError) {
      if (updateBankError.message === common.badNet) {
        Toast.fail(transfer(language, 'UpdateBank_net_error'));
        return;
      }
      const msg = this.errors[updateBankError.code];
      if (msg) Toast.fail(transfer(language, msg));
      else Toast.fail(transfer(language, 'UpdateAliapy_blind_card_failed'));
      if (loggedIn) dispatch(actions.sync());
    }
  }

  renderTip() {
    const {user} = this.props;
    let str = `1、请务必添加${
      user.name
    }的支付宝账号和二维码图片进行法币交易买卖转账，若使用其他人的支付宝信息，会导致交易失败，请谨慎添加！`;
    let contents = [];
    for (let i = 0; i < str.length; i++) {
      contents.push(
        <Text
          style={{
            color:
              i > 6 && i <= 6 + user.name.length
                ? common.redColor
                : common.textColor,
            fontSize: common.font14,
          }}>
          {str[i]}
        </Text>,
      );
    }
    return (
      <View style={styles.tipView}>
        <Text style={styles.tipTitle}>
          {transfer(this.props.language, 'UpdateBank_please_note')}
        </Text>
        <View style={styles.tipDetail}>{contents}</View>
      </View>
    );
  }

  renderChineseVisible(language) {
    return (
      <View style={styles.container1}>
        <Text style={styles.txt}>
          {transfer(language, 'otc_visible_chinese')}
        </Text>
      </View>
    );
  }

  isStringContainNumber(event) {
    const newText = event.trim();
    let p = /[0-9]/;
    return p.test(newText);
  }

  codeFormat = code => {
    return common.maskAccount(code, 'phone');
  };

  maskAccount = () => {
    if (this.editable) {
      return this.props.formState.account;
    } else {
      return this.codeFormat(this.props.formState.account);
    }
  };

  imagePicker(err, uri, tag) {
    if (err) {
      Toast.fail(err);
      return;
    }
    const {dispatch, name, account} = this.props;
    let target;

    target = this.image;

    target.setStatus(1);
    PutObject.putObject(
      {
        url: imgHashApi,
        path: uri,
        async: true,
        header: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
        method: 'POST',
      },
      r => {
        let hash;
        if (r.result) {
          target.setStatus(2);
          hash = JSON.parse(r.res).hash;
        } else {
          target.setStatus(3);
        }

        dispatch(updateQrImage({uri, hash}));
      },
    );
  }

  render() {
    const {loading, formState, navigation, user, language, qrHash} = this.props;

    if (language !== 'zh_hans') {
      return this.renderChineseVisible(language);
    }
    let account = '';
    if (user && user.alipay && user.alipay.account) {
      account = user.alipay.account;
    }
    const editable = !(
      navigation.state.params &&
      navigation.state.params.fromMe === 'fromMe' &&
      account.length &&
      !this.editable
    );

    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <TKInputItem
          viewStyle={{
            marginTop: common.margin10,
            borderRadius: 0,
            borderWidth: 0,
          }}
          titleStyle={{
            width: common.h97,
            fontSize: common.font14,
            color: common.navTitleColor,
          }}
          title={transfer(language, 'UpdateAlipay_account_name')}
          value={user.name}
          inputStyle={{color: common.textColor}}
          editable={false}
        />
        <TKInputItem
          viewStyle={{
            marginTop: common.margin10,
            borderRadius: 0,
            borderWidth: 0,
          }}
          titleStyle={{
            width: common.h97,
            fontSize: common.font14,
            color: common.navTitleColor,
          }}
          title={transfer(language, 'UpdateAlipay_account_alipay')}
          value={this.maskAccount()}
          placeholder={transfer(language, 'UpdateAlipay_account_alipay')}
          onChangeText={e => {
            this.onChangeText(e, 'account');
          }}
          editable={editable}
        />

        <SelectImage
          ref={e => {
            this.image = e;
          }}
          title={transfer(language, 'UpdateAlipay_account_qr')}
          onPress={() => Keyboard.dismiss()}
          language={language}
          imagePickerBlock={(err, response) => {
            this.imagePicker(err, response, 'qrHash');
          }}
          avatarSource={qrHash.uri}
          editable={editable}
          highMode={true}
        />

        {this.renderTip(language)}

        {/* <View style={{flexDirection:'row', justifyContent:'center', alignContent:'center'}}>
        {(!editable) && <TKButton
          theme={'gray'}
          style={{ marginTop: common.margin20, width: common.w100 }}
          caption={transfer(language, 'UpdateAlipay_reset')}
          onPress={() => {
            const title = '解除绑定'
            this.confirmPress(title)
          }}
        />}
        <TKButton
          theme={'gray'}
          style={{ marginTop: common.margin20, width: common.w100 }}
          caption={transfer(language, editable ? 'UpdateBank_confirm' : 'UpdateBank_addAgain')}
          onPress={() => {
            const title = editable ? '确认' : '重新添加'
            this.confirmPress(title)
          }}
        />
        </View> */}

        <TKButton
          theme={'gray'}
          style={{
            marginVertical: common.margin20,
            backgroundColor: common.themeColor,
          }}
          titleStyle={{color: common.blackColor}}
          caption={transfer(
            language,
            editable ? 'UpdateBank_confirm' : 'UpdateBank_addAgain',
          )}
          onPress={() => {
            const title = editable ? '确认' : '重新添加';
            this.confirmPress(title);
          }}
        />

        <TKSpinner isVisible={loading} />
      </ScrollView>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.updateAlipay,
    user: store.user.user,
    loggedIn: store.login.isLogin,
    language: store.system.language,
    data: store.login.data,
    codeFormData: store.alert_code.formData,
  };
}

export default connect(mapStateToProps)(UpdateAlipay);
