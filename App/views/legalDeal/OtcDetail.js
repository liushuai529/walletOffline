import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Toast, Overlay} from 'teaset';
import {BigNumber} from 'bignumber.js';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view';
import {common} from '../../constants/common';
import {
  requestOtcList,
  requestGetCode,
  requestConfirmPay,
  requestCancel,
  requestHavedPay,
  requestAllege,
  updateForm,
  updateOtcList,
  updateAuthCodeType,
  updateListPage,
} from '../../redux/actions/otcDetail';
import actions from '../../redux/actions/index';
import AllegeView from './AllegeView';
// import WithdrawAuthorizeCode from '../../components/WithdrawAuthorizeCode';
import transfer from '../../localization/utils';
import LegalDealConfirmCancelView from './components/LegalDealConfirmCancelView';
import {requestLegalMarketTokens} from '../FiatCurrency/redux/action/FiatCurrency';
import AlertCode from '../../components/alert_code';

const styles = StyleSheet.create({
  column: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    backgroundColor: common.navBgColor,
  },
  statusView: {
    height: common.h30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: common.placeholderColor,
    borderBottomWidth: 0,
  },
  coin: {
    marginLeft: common.margin5,
    color: common.navTitleColor,
    fontSize: common.font12,
  },
  direct: {
    marginLeft: common.margin20,
    fontSize: common.font12,
  },
  createdAt: {
    marginLeft: common.margin20,
    color: common.navTitleColor,
    fontSize: common.font10,
  },
  status: {
    position: 'absolute',
    right: common.margin5,
    color: common.navTitleColor,
    fontSize: common.font12,
  },
  rowBorderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: common.margin10,
    //paddingHorizontal: common.margin20,
  },
  priceView: {
    //flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: common.placeholderColor,
    justifyContent: 'space-between',
    paddingVertical: common.margin10,
  },
  price: {
    color: common.navTitleColor,
    fontSize: common.font12,
    textAlign: 'center',
  },
  paymentBtn: {
    flex: 1,
    marginTop: common.margin5,
    alignSelf: 'center',
    marginBottom: common.margin5,
  },
  paymentTitle: {
    textAlign: 'center',
    color: common.btnTextColor,
    fontSize: common.font12,
  },
  havedPayBtn: {
    flex: 1,
    marginTop: common.margin5,
    alignSelf: 'center',
    marginBottom: common.margin5,
  },
  allegeView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  footerText: {
    color: common.navTitleColor,
    fontSize: common.font14,
  },
});

class OtcDetail extends Component {
  static navigationOptions(props) {
    const params = props.navigation.state.params || {};
    let title = '';
    if (params.title) {
      title = params.title;
    }
    return {
      headerTitle: title,
    };
  }

  showConfirmOverlay(id) {
    const {dispatch, language} = this.props;
    const overlayView = (
      <Overlay.View
        style={{justifyContent: 'center'}}
        modal={false}
        overlayOpacity={0}>
        <LegalDealConfirmCancelView
          language={language}
          pressCancel={() => {
            Overlay.hide(this.overlayCancelViewKey);
          }}
          pressConfirm={() => {
            dispatch(requestCancel({id}));
            Overlay.hide(this.overlayCancelViewKey);
          }}
        />
      </Overlay.View>
    );
    this.overlayCancelViewKey = Overlay.show(overlayView);
  }

  constructor() {
    super();
    this.state = {
      refreshState: RefreshState.Idle,
      showAllegeView: false,
    };
    this.firstRequest = true;
    this.limit = 10;
    this.skip = 0;
    this.codeTitles = ['短信验证码', '谷歌验证码', '邮箱验证码'];
  }

  componentWillMount() {
    const {language} = this.props;
    this.props.navigation.setParams({
      title: transfer(language, 'OtcDetail'),
    });
  }

  componentDidMount() {
    const {loggedInResult, dispatch, loggedIn} = this.props;
    this.refreshOtcList({
      id: loggedInResult.id,
      skip: 0,
      limit: this.limit,
    });
    if (loggedIn) dispatch(actions.sync());
    dispatch(
      requestLegalMarketTokens({
        action: 'tokens',
        skip: 0,
        limit: 500,
      }),
    );
  }

  componentWillReceiveProps(nextProps) {
    this.handleRequestGetCode(nextProps);
    this.handleRequestCancel(nextProps);
    this.handleRequestConfirmPay(nextProps);
    this.handleRequestHavedPay(nextProps);
    this.handleRequestOtcList(nextProps);
    this.handleRequestAllege(nextProps);
  }

  componentWillUnmount() {
    const {dispatch, formState} = this.props;
    dispatch(updateForm({...formState, smsCode: '', allegeText: ''}));
  }

  onChangeText(text, tag) {
    const {dispatch, formState} = this.props;
    if (tag === 'code') {
      dispatch(updateForm({...formState, smsCode: text}));
    } else if (tag === 'allege') {
      if (text.length > 50) return;
      dispatch(updateForm({...formState, allegeText: text}));
    }
  }

  confirmPayPress(id, type) {
    Keyboard.dismiss();
    const {
      loggedInResult,
      dispatch,
      formState,
      authCodeType,
      language,
      data,
      codeFormData,
    } = this.props;

    if (!codeFormData.code || codeFormData.code.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_25'));
      return;
    }

    let param = {
      id: id,
      code: codeFormData.code,
    };
    if (type == 0) {
      param['mobile'] = data.mobile;
    } else {
      param['email'] = data.email;
    }
    dispatch(requestConfirmPay(param));
    return;

    const {smsCode, googleCode, emailCode} = formState;
    if (authCodeType === '短信验证码') {
      if (!smsCode || smsCode.length === 0) {
        Toast.fail(transfer(language, 'me_enter_mobileVerification'));
        return;
      }
      dispatch(
        requestConfirmPay({
          id: id,
          mobile: loggedInResult.mobile,
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
        requestConfirmPay({
          id: id,
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
        requestConfirmPay({
          id: id,
          email: loggedInResult.email,
          code: emailCode,
        }),
      );
    }
  }

  cancelPress(title, id) {
    const {dispatch, formState, language} = this.props;
    if (title === transfer(language, 'OtcDetail_cancelOrder')) {
      this.showConfirmOverlay(id);
    } else if (title === transfer(language, 'OtcDetail_complaints')) {
      dispatch(updateForm({...formState, allegeText: ''}));
      this.setState({
        showAllegeView: true,
        allegeId: id,
      });
    }
  }

  havedPayPress(title, id) {
    const {dispatch, language} = this.props;
    if (title === transfer(language, 'OtcDetail_i_paid')) {
      dispatch(requestHavedPay({id}));
    } else if (title === transfer(language, 'OtcDetail_received')) {
      this.showAuthCode(id);
    }
  }

  allegeConfirmPress(data) {
    const {dispatch} = this.props;
    dispatch(requestAllege(data));
  }

  refreshOtcList(data) {
    const {dispatch} = this.props;
    this.props.dispatch(updateListPage(this.skip));
    dispatch(
      requestOtcList({
        action: 'deal',
        skip: data.skip * this.limit,
        limit: data.limit,
        orderby: '-createdAt',
      }),
    );
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
    const {loggedInResult, dispatch} = this.props;
    dispatch(
      requestGetCode({mobile: loggedInResult.mobile, service: 'confirm_pay'}),
    );
  };

  showAuthCode = id => {
    const {dispatch, loggedInResult, formState, language} = this.props;
    dispatch(updateAuthCodeType('短信验证码'));
    dispatch(
      updateForm({
        ...formState,
        smsCode: '',
        googleCode: '',
        emailCode: '',
      }),
    );
    const overlayView = (
      <Overlay.View style={{flex: 1}} modal={false} overlayOpacity={0}>
        <AlertCode
          service="confirm_pay"
          hide={() => {
            this.hideAlert();
          }}
          submit={(type) => {
            this.hideAlert();
            this.confirmPayPress(id,type);
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
          mobile={loggedInResult.mobile}
          email={loggedInResult.email}
          emailStatus={loggedInResult.emailStatus}
          onChangeText={this.authCodeChanged}
          segmentValueChanged={this.segmentValueChanged}
          smsCodePress={this.SMSCodePress}
          emsCodePress={count => {
            this.count = count;
            dispatch(
              requestGetCode({
                email: loggedInResult.email,
                service: 'confirm_pay',
              }),
            );
          }}
          confirmPress={link => this.confirmPayPress(id, link)}
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

  errors = {
    4000156: 'login_codeError',
    4000102: 'login_codeError',
    4000103: 'login_codeError',
    4000104: 'login_codeError',
    4000105: 'login_codeError',
    4000106: 'login_codeReacquire',
    4000107: 'AuthCode_cannot_send_verification_code_repeatedly_within_one_minute',
    4001480: 'OtcDetail_order_statusexpired',
    4001421: 'OtcDetail_order_statusexpired',
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

  handleRequestCancel(nextProps) {
    const {
      dispatch,
      cancelResult,
      cancelError,
      language,
      otcList,
      loggedIn,
    } = nextProps;

    if (cancelResult && cancelResult !== this.props.cancelResult) {
      Toast.success(transfer(language, 'OtcDetail_revocation_successful'));
      const nextOtcList = otcList.concat();
      nextOtcList[this.operateIndex].status = 'cancel';
      dispatch(updateOtcList(nextOtcList));
    }
    if (cancelError && cancelError !== this.props.cancelError) {
      if (cancelError.message === common.badNet) {
        Toast.fail(transfer(language, 'OtcDetail_net_error'));
      } else {
        const msg = this.errors[cancelError.code];
        if (msg) Toast.fail(transfer(language, msg));
        else
          Toast.fail(
            transfer(language, 'OtcDetail_failed_to_cancel_the_order'),
          );
      }
      if (loggedIn) dispatch(actions.sync());
    }
  }

  handleRequestConfirmPay(nextProps) {
    const {
      dispatch,
      confirmPayResult,
      confirmPayError,
      otcList,
      language,
      loggedIn,
    } = nextProps;

    if (confirmPayResult && confirmPayResult !== this.props.confirmPayResult) {
      Toast.success(transfer(language, 'OtcDetail_confirm_successful'));
      Overlay.hide(this.overlayViewKeyID);
      const nextOtcList = otcList.concat();
      nextOtcList[this.operateIndex].status = 'complete';
      dispatch(updateOtcList(nextOtcList));
    }
    if (confirmPayError && confirmPayError !== this.props.confirmPayError) {
      if (confirmPayError.message === common.badNet) {
        Toast.fail(transfer(language, 'OtcDetail_net_error'));
      } else {
        const msg = this.errors[confirmPayError.code];
        if (msg) Toast.fail(transfer(language, msg));
        else Toast.fail(transfer(language, 'login_codeError'));
      }
      if (loggedIn) dispatch(actions.sync());
    }
  }

  handleRequestHavedPay(nextProps) {
    const {
      dispatch,
      havedPayResult,
      havedPayError,
      language,
      otcList,
      loggedIn,
    } = nextProps;

    if (havedPayResult && havedPayResult !== this.props.havedPayResult) {
      Toast.success(transfer(language, 'OtcDetail_confirm_successful'));
      const nextOtcList = otcList.concat();
      nextOtcList[this.operateIndex].status = 'waitconfirm';
      dispatch(updateOtcList(nextOtcList));
    }
    if (havedPayError && havedPayError !== this.props.havedPayError) {
      if (havedPayError.message === common.badNet) {
        Toast.fail(transfer(language, 'OtcDetail_net_error'));
      } else {
        const msg = transfer(language, this.errors[havedPayError.code]);
        if (msg) Toast.fail(msg);
        Toast.fail(transfer(language, 'OtcDetail_operation_failed'));
      }
      if (loggedIn) dispatch(actions.sync());
    }
  }

  handleRequestAllege(nextProps) {
    const {
      dispatch,
      allegeResult,
      allegeError,
      otcList,
      language,
      loggedIn,
    } = nextProps;

    if (allegeResult && allegeResult !== this.props.allegeResult) {
      Toast.success(transfer(language, 'OtcDetail_complaint_successful'));
      const nextOtcList = otcList.concat();
      nextOtcList[this.operateIndex].isAllege = 'yes';
      dispatch(updateOtcList(nextOtcList));
      this.setState({showAllegeView: false});
    }
    if (allegeError && allegeError !== this.props.allegeError) {
      if (allegeError.message === common.badNet) {
        Toast.fail(transfer(language, 'OtcDetail_net_error'));
      } else {
        const msg = this.errors[allegeError.code];
        if (msg) Toast.fail(transfer(language, msg));
        Toast.fail(transfer(language, 'OtcDetail_complaint_failed'));
      }
      this.setState({showAllegeView: false});
      if (loggedIn) dispatch(actions.sync());
    }
  }

  handleRequestOtcList(nextProps) {
    if (this.props.otcListLoading && !nextProps.otcListLoading) {
      this.firstRequest = false;
      if (nextProps.otcListError) {
        this.setState({
          refreshState: RefreshState.Idle,
        });
      } else if (nextProps.otcList) {
        const otcListLength =
          nextProps.otcList.length < (this.skip + 1) * this.limit;
        this.setState({
          refreshState: !otcListLength
            ? RefreshState.Idle
            : RefreshState.NoMoreData,
        });
      }
    }
  }

  handleHeaderRefresh = id => {
    if (this.firstRequest) return;
    this.setState({refreshState: RefreshState.HeaderRefreshing});
    this.skip = 0;
    this.refreshOtcList({id, skip: this.skip, limit: this.limit});
    if (this.props.loggedIn) this.props.dispatch(actions.sync());
  };

  handleFooterRefresh = id => {
    if (this.firstRequest) return;
    this.setState({refreshState: RefreshState.FooterRefreshing});

    this.skip += 1;
    // this.props.dispatch(updateListPage(this.skip))
    this.refreshOtcList({id, skip: this.skip, limit: this.limit});
    if (this.props.loggedIn) this.props.dispatch(actions.sync());
  };

  renderRow(rd, rid) {
    const {navigation, language, loggedIn} = this.props;
    const createdAt = common.dfFullDate(rd.createdAt);
    let textColor = 'white';
    let status = '';
    let direct = '';
    let paymentBtnTitle = '';
    let havedPayTitle = '';
    let cancelBtnDisabled = true;
    let confirmPayDisabled = true;
    let havedPayDisabled = true;
    let cancelBtnTitle;
    const dealPrice = common.removeInvalidZero(
      BigNumber(rd.dealPrice).toFixed(8, 1),
    );

    let quantityLimit = 8;
    this.props.currencyList.forEach(item => {
      if (rd.token.token_id === item.token.token_id) {
        quantityLimit = item.quantityLimit;
      }
    });

    const quantity = common.removeInvalidZero(
      BigNumber(rd.quantity).toFixed(quantityLimit, 1),
    );
    const amount = common.removeInvalidZero(
      BigNumber(rd.payMoney).toFixed(2, 1),
    );
    const user_fee = common.removeInvalidZero(
      BigNumber(rd.user_fee).toFixed(quantityLimit, 1), 
    )
    const tokenName = rd ? rd.token.name : null;

    switch (rd.status) {
      case common.legalDeal.status.waitpay:
        status = transfer(
          language,
          rd.direct === common.buy
            ? 'OtcDetail_unpaid'
            : 'OtcDetail_unReceived',
        );
        cancelBtnDisabled = false;
        havedPayDisabled = false;
        break;
      case common.legalDeal.status.waitconfirm:
        status = transfer(language, 'OtcDetail_unconfirmed');
        confirmPayDisabled = false;
        break;
      case common.legalDeal.status.complete:
        status = transfer(language, 'OtcDetail_closed');
        break;
      case common.legalDeal.status.cancel:
        status = transfer(language, 'OtcDetail_cancel');
        break;
      default:
        break;
    }
    if (rd.direct === common.buy) {
      textColor = common.redColor;
      direct = transfer(language, 'OtcDetail_buy');
      paymentBtnTitle = transfer(language, 'OtcDetail_Billing_info');
      havedPayTitle = transfer(language, 'OtcDetail_i_paid');
      cancelBtnTitle = transfer(language, 'OtcDetail_cancelOrder');
    } else if (rd.direct === common.sell) {
      textColor = common.greenColor;
      direct = transfer(language, 'OtcDetail_sell');
      paymentBtnTitle = transfer(language, 'OtcDetail_payment_info');
      havedPayTitle = transfer(language, 'OtcDetail_received');
      cancelBtnTitle = transfer(language, 'OtcDetail_complaints');
      havedPayDisabled = confirmPayDisabled;
    } else {
      return null;
    }
    const coin = common.legalDeal.token;
    let cancelTitleColor = common.nomalColor;
    let havedPayTitleColor = common.nomalColor;

    const priceTip = transfer(language, 'OtcDetail_price');
    //const amountTip = transfer(language, 'OtcDetail_amount');
    const amountTip = rd.direct === common.buy ? '数量': '实际卖出';
    const totalTip = transfer(language, 'OtcDetail_total');

    if (!havedPayDisabled) {
      havedPayTitleColor = common.btnTextColor;
    }
    if (cancelBtnTitle === transfer(language, 'OtcDetail_complaints')) {
      if (!havedPayDisabled && rd.isAllege === 'no') {
        cancelBtnDisabled = false;
      } else {
        cancelBtnDisabled = true;
      }
    }
    if (!cancelBtnDisabled) {
      cancelTitleColor = common.btnTextColor;
    }
    return (
      <View style={styles.column}>
        <View>
          {/* <TouchableWithoutFeedback
            activeOpacity={common.activeOpacity}
            onPress={() => {
              if (loggedIn) {
                this.operateIndex = rid;
                navigation.navigate('Payment', {
                  havedPayDisabled: havedPayDisabled,
                  cancelBtnDisabled: cancelBtnDisabled,
                  cancelPress: this.cancelPress.bind(this),
                  havedPayPress: this.havedPayPress.bind(this),
                  data: rd,
                  lang: language,
                });
              } else {
                navigation.navigate('LoginStack');
              }
            }}> */}
          <View style={styles.statusView}>
            <Text style={[styles.direct, {color: textColor}]}>{direct}</Text>
            <Text style={styles.createdAt}>{createdAt}</Text>
            <Text style={styles.status}>{status}</Text>
          </View>
          <View style={styles.rowBorderView}>
            {/* <View style={styles.priceView}>
                <Text style={styles.price}>{`${priceTip}:¥${dealPrice}`}</Text>
              </View> */}
            <View style={[styles.priceView, {borderLeftWidth: 0, width: common.getH(150)}]}>
              <Text
                style={
                  styles.price
                }>{`${amountTip}:${quantity} ${tokenName}`}</Text>
            </View>
            <View
              style={[
                styles.priceView,
                {borderRightWidth: 0, width: common.getH(80)},
              ]}>
              <Text style={styles.price}>{`${totalTip}:¥${amount}`}</Text>
            </View>
            <View
              style={[
                styles.priceView,
                {borderRightWidth: 0, flex: 1},
              ]}>
              <Text style={styles.price}>{`${transfer(language, 'withdrawal_fee')}:${user_fee}${tokenName}`}</Text> 
            </View>
            
          </View>
          {/* </TouchableWithoutFeedback> */}
        </View>
        <View style={styles.rowBorderView}>
          <TouchableWithoutFeedback
            style={styles.paymentBtn}
            activeOpacity={common.activeOpacity}
            disabled={cancelBtnDisabled}
            onPress={() => {
              if (cancelBtnDisabled) return;
              this.operateIndex = rid;
              this.cancelPress(cancelBtnTitle, rd.id);
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: cancelTitleColor,
                fontSize: common.font12,
              }}>
              {cancelBtnTitle}
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.paymentBtn}
            activeOpacity={common.activeOpacity}
            onPress={() => {
              if (loggedIn) {
                this.operateIndex = rid;
                navigation.navigate('Payment', {
                  havedPayDisabled: havedPayDisabled,
                  cancelBtnDisabled: cancelBtnDisabled,
                  cancelPress: this.cancelPress.bind(this),
                  havedPayPress: this.havedPayPress.bind(this),
                  data: rd,
                  lang: language,
                });
              } else {
                navigation.navigate('LoginStack');
              }
            }}>
            <Text style={styles.paymentTitle}>{paymentBtnTitle}</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            activeOpacity={common.activeOpacity}
            style={styles.havedPayBtn}
            disabled={havedPayDisabled}
            onPress={() => {
              if (havedPayDisabled) return;
              this.operateIndex = rid;
              this.havedPayPress(havedPayTitle, rd.id);
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: havedPayTitleColor,
                fontSize: common.font12,
              }}>
              {havedPayTitle}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderAllegeView() {
    const {formState, language} = this.props;
    const {showAllegeView, allegeId} = this.state;
    const {allegeText} = formState;

    if (showAllegeView) {
      return (
        <AllegeView
          style={styles.allegeView}
          onPress={() => this.setState({showAllegeView: false})}
          inputValue={allegeText}
          onChangeText={e => this.onChangeText(e, 'allege')}
          placeholder={transfer(language, 'OtcDetail_fill_in_50_words')}
          cancelPress={() => this.setState({showAllegeView: false})}
          confirmPress={() => {
            Keyboard.dismiss();
            if (!formState.allegeText || formState.allegeText.length > 50) {
              Toast.fail(transfer(language, 'OtcDetail_fill_in_50_words'));
              return;
            }
            const data = {legaldeal_id: allegeId, reason: formState.allegeText};
            this.allegeConfirmPress(data);
          }}
          language={language}
        />
      );
    }
    return null;
  }

  render() {
    const {loggedInResult, otcList, language} = this.props;
    const {refreshState} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: common.bgColor}}>
        <RefreshListView
          data={otcList}
          renderItem={({item, index}) => this.renderRow(item, index)}
          keyExtractor={(item, index) => index.toString()}
          refreshState={refreshState}
          onHeaderRefresh={() => {
            this.handleHeaderRefresh(loggedInResult.id);
          }}
          onFooterRefresh={() => {
            this.handleFooterRefresh(loggedInResult.id);
          }}
          footerTextStyle={styles.footerText}
          footerRefreshingText={transfer(language, 'exchange_dataInLoading')}
          footerFailureText={transfer(language, 'exchange_dataFailureText')}
          footerNoMoreDataText={transfer(language, 'exchange_dataNoMoreData')}
        />
        {this.renderAllegeView()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.otcDetail,
    loggedInResult: state.login.data,
    language: state.system.language,
    loggedIn: state.login.isLogin,
    currencyList: state.FiatCurrency.currencyList,
    data: state.login.data,
    codeFormData: state.alert_code.formData,
  };
}

export default connect(mapStateToProps)(OtcDetail);
