import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  CameraRoll,
  Clipboard,
  Button,
} from 'react-native';
import BigNumber from 'bignumber.js';
import {Overlay} from 'teaset';
import {common} from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import transfer from '../../localization/utils';
import TKSpinner from '../../components/TKSpinner';
import {Toast, ActionSheet} from 'teaset';
import TKButton from '../../components/TKButton';
import * as otcDetail from '../../redux/actions/otcDetail';
import schemas from '../../schemas/index';
import actions from '../../redux/actions/index';
import LegalDealConfirmCancelView from './components/LegalDealConfirmCancelView';
import {imgHashApi} from '../../services/api';
import Alert from '../../components/Alert';
import FS from 'rn-fs-d3j';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  amountTip: {
    marginTop: common.margin15,
    fontSize: common.font16,
    color: common.navTitleColor,
    alignSelf: 'center',
  },
  amount: {
    marginTop: common.margin20,
    fontSize: common.font30,
    color: common.textColor,
    alignSelf: 'center',
  },
  contentContainer: {
    marginTop: common.margin15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentTip: {
    marginLeft: common.margin10,
    color: common.navTitleColor,
    fontSize: common.font12,
  },
  content: {
    marginRight: common.margin10,
    color: common.textColor,
    fontSize: common.font14,
  },
  copy: {
    marginRight: common.margin10,
    width: common.w35,
  },
  contentImg: {
    marginRight: common.margin10,
    color: common.textColor,
    fontSize: common.font14,
    width: common.w20,
    height: common.h20,
  },
  pleaseNoteTip: {
    marginTop: common.margin30,
    marginLeft: common.margin10,
    color: common.textColor,
    fontSize: common.font18,
  },
  pleaseNote: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    color: common.textColor,
    fontSize: common.font16,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: common.radius6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '80%',
  },
  qrImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});

class ReceiverInfo extends Component {
  static navigationOptions(props) {
    const {navigation} = props;
    return {
      headerTitle: navigation.state.params.titleName,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      havedPayDisabled: false,
      cancelBtnDisabled: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.handleRequestCancel(nextProps);
    this.handleRequestHavedPay(nextProps);
  }

  errors = {
    4000156: 'login_codeError',
    4000107: 'AuthCode_cannot_send_verification_code_repeatedly_within_one_minute',
    4001480: 'OtcDetail_order_statusexpired',
    4001421: 'OtcDetail_order_statusexpired',
    4031601: 'Otc_please_login_to_operate',
  };

  handleRequestCancel(nextProps) {
    const receiverInfoData = this.props.navigation.getParam('receiverInfoData');
    const {dispatch, cancelResult, cancelError, language, loggedIn} = nextProps;
    if (cancelResult && cancelResult !== this.props.cancelResult) {
      Toast.success(transfer(language, 'OtcDetail_revocation_successful'));
      this.setState({havedPayDisabled: true, cancelBtnDisabled: true});
      //todo:下单成功，撤单时此处会覆盖订单列表信息,导致再次进入订单页面报错
      // dispatch(
      //   otcDetail.updateOtcList([
      //     { id: receiverInfoData.id, status: 'cancel', key: receiverInfoData.id },
      //   ])
      // );
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

  handleRequestHavedPay(nextProps) {
    const receiverInfoData = this.props.navigation.getParam('receiverInfoData');
    const {
      dispatch,
      havedPayResult,
      havedPayError,
      language,
      loggedIn,
    } = nextProps;

    if (havedPayResult && havedPayResult !== this.props.havedPayResult) {
      Toast.success(transfer(language, 'OtcDetail_confirm_successful'));
      this.setState({havedPayDisabled: true, cancelBtnDisabled: true});
      //todo:下单成功，确认时时此处会覆盖订单列表信息,导致再次进入订单页面报错
      // dispatch(otcDetail.updateOtcList([{ id: receiverInfoData.id, status: 'waitconfirm' }]));
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

  showConfirmOverlay(id) {
    const {dispatch, language, loggedIn} = this.props;
    const overlayView = (
      <Overlay.View
        style={{justifyContent: 'center'}}
        modal={false}
        overlayOpacity={0.8}>
        <LegalDealConfirmCancelView
          language={language}
          pressCancel={() => {
            Overlay.hide(this.overlayCancelViewKey);
          }}
          pressConfirm={() => {
            dispatch(otcDetail.requestCancel({id}));
            if (loggedIn) dispatch(actions.sync());
            Overlay.hide(this.overlayCancelViewKey);
          }}
        />
      </Overlay.View>
    );
    this.overlayCancelViewKey = Overlay.show(overlayView);
  }
  showAlert() {
    const {language} = this.props;
    Alert.alert(
      transfer(language, 'me_super_savePhotoFailed'),
      transfer(language, 'me_super_savePhotoReminder'),
      [
        {
          text: transfer(language, 'me_super_savePhotoOK'),
          onPress: () => {},
        },
      ],
    );
  }

  _saveImage = uri => {
    const {language} = this.props;
    if (common.IsIOS) {
      CameraRoll.saveToCameraRoll(uri)
        .then(() => {
          Toast.success(transfer(language, 'me_super_saveSuccess'));
        })
        .catch(error => {
          if (error.code === 'E_UNABLE_TO_SAVE') {
            this.showAlert();
          } else {
            // Toast.fail(transfer(language, 'me_super_saveFailed'))
            this.showAlert();
          }
        });
    } else {
      FS.downloadOlineImage(
        {
          uri,
        },
        r => {
          if (r.result) {
            Toast.success(transfer(language, 'me_super_saveSuccess'));
          } else if (r.error === '保存出错') {
            this.showAlert();
          } else {
            // Toast.fail(transfer(language, 'me_super_saveFailed'))
            this.showAlert();
          }
        },
      );
    }
  };

  _tapQRImage = uri => {
    const {language} = this.props;
    const items = [
      {
        title: transfer(language, 'me_super_savePhoto'),

        onPress: () => {
          this._saveImage(uri);
        },
      },
    ];
    const cancelItem = {
      title: transfer(language, 'me_super_savePhotoCancel'),
      type: 'cancel',
    };
    ActionSheet.show(items, cancelItem);
  };

  _getImagePath(imagePath) {
    if (common.IsIOS || imagePath.startsWith('http')) {
      return imagePath;
    }
    return `file://${imagePath}`;
  }

  qrPress = qrHash => {
    var qrUri = `${imgHashApi}${qrHash}`;
    const overlayView = (
      <Overlay.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        modal={false}
        overlayOpacity={0.8}>
        <NextTouchableOpacity
          style={styles.qrContainer}
          onPress={() => {
            this._tapQRImage(qrUri);
          }}>
          <Image
            style={styles.qrImage}
            source={{uri: this._getImagePath(qrUri)}}
          />
        </NextTouchableOpacity>
      </Overlay.View>
    );
    this.overlayViewKey = Overlay.show(overlayView);
  };
  componentDidMount() {
    const {navigation, loggedInResult, dispatch, loggedIn} = this.props;
    const {params} = navigation.state;
  }

  cancelPress(id) {
    this.showConfirmOverlay(id);
  }

  havedPayPress(id) {
    const {dispatch, loggedIn} = this.props;
    dispatch(otcDetail.requestHavedPay({id}));
    if (loggedIn) dispatch(actions.sync());
  }

  refreshOtcList(data) {
    const {dispatch, loggedIn} = this.props;
    dispatch(otcDetail.requestOtcList(schemas.findOtcList(data)));
    if (loggedIn) dispatch(actions.sync());
  }

  render() {
    const {receiverInfoLoading, language, user, navigation} = this.props;

    const receiverInfoData = navigation.getParam('receiverInfoData');
    if (receiverInfoData === null) {
      return (
        <View style={styles.container}>
          <TKSpinner isVisible={receiverInfoLoading} />
        </View>
      );
    }
    const payType = receiverInfoData.traderPayinfo.payType;
    // const amount = new BigNumber(receiverInfoData.dealPrice)
    // .multipliedBy(receiverInfoData.quantity)
    // .toFixed(2, 1);
    const amount = BigNumber(receiverInfoData.payMoney).toFixed(2, 1);
    var name = receiverInfoData.traderPayinfo.cardHolderName;
    const bankName =
      receiverInfoData.traderPayinfo.bankName +
      receiverInfoData.traderPayinfo.subbankName;
    var bankNo = receiverInfoData.traderPayinfo.bankNo;
    var myBankNo = receiverInfoData.createrPayinfo.bankNo;
    var qrHash;
    if (payType === 'alipay') {
      name = receiverInfoData.traderPayinfo.alipay.name;
      bankNo = receiverInfoData.traderPayinfo.alipay.account;
      qrHash = receiverInfoData.traderPayinfo.alipay.qrHash;
      myBankNo = receiverInfoData.createrPayinfo.alipay.account;
    }
    let traderContact = {};
    if (receiverInfoData.traderPayinfo.contactMobile) {
      traderContact = {
        type: transfer(language, 'trader_deserver_mobile'),
        value: receiverInfoData.traderPayinfo.contactMobile,
      };
    } else if (receiverInfoData.traderPayinfo.contactWechat) {
      traderContact = {
        type: transfer(language, 'trader_deserver_wechat'),
        value: receiverInfoData.traderPayinfo.contactWechat,
      };
    }

    const titleName = transfer(language, 'payment_b_account_name');
    const titleBankName = transfer(language, 'payment_b_bank');
    const titleBankNo = transfer(language, 'payment_b_account_No');

    const amountTip = transfer(language, 'payment_transaction_amount');
    const remarkTip = transfer(language, 'payment_remark');
    const remark = `${receiverInfoData.traderPayinfo.remark}（${transfer(
      language,
      'payment_please_fill_in',
    )}）`;
    const pleaseNoteTitle = transfer(language, 'payment_s_please_note');
    const havedPayTitle = transfer(language, 'OtcDetail_i_paid');
    const cancelBtnTitle = transfer(language, 'OtcDetail_cancelOrder');
    const {havedPayDisabled, cancelBtnDisabled} = this.state;
    // for (var i = 0; i < this.props.otcList.length; i++) {
    //   if (
    //     this.props.otcList[i].id === receiverInfoData.id &&
    //     this.props.otcList[i].status === common.legalDeal.status.waitpay
    //   ) {
    //     cancelBtnDisabled = false;
    //     havedPayDisabled = false;
    //   }
    // }

    let pleaseNote1 = [];
    let pleaseNote2 = [];
    let pleaseNote3 = [];
    let str = transfer(language, 'payment_s_please_note_content1');
    for (let i = 0; i < str.length; i++) {
      pleaseNote1.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: i > 1 ? common.redColor : common.textColor,
          }}>
          {str[i]}
        </Text>,
      );
    }
    // str = '' + receiverInfoData.traderPayinfo.remark;
    // for (let i = 0; i < str.length; i++) {
    //   pleaseNote1.push(
    //     <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>
    //       {str[i]}
    //     </Text>
    //   );
    // }
    if (payType === 'alipay') {
      str = transfer(language, 'payment_s_please_note_content2_alipay');
      for (let i = 0; i < str.length; i++) {
        pleaseNote2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.textColor,
            }}>
            {str[i]}
          </Text>,
        );
      }
    } else {
      str = transfer(language, 'payment_s_please_note_content2');
      for (let i = 0; i < str.length; i++) {
        pleaseNote2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.textColor,
            }}>
            {str[i]}
          </Text>,
        );
      }
      str = user.bankName || '';
      for (let i = 0; i < str.length; i++) {
        pleaseNote2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.redColor,
            }}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(language, 'payment_s_please_note_content3');
      for (let i = 0; i < str.length; i++) {
        pleaseNote2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.textColor,
            }}>
            {str[i]}
          </Text>,
        );
      }
    }
    str = common.maskAccount(myBankNo, payType === 'alipay' ? 'phone' : 'bank');
    for (let i = 0; i < str.length; i++) {
      pleaseNote2.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.redColor,
          }}>
          {str[i]}
        </Text>,
      );
    }
    str = transfer(language, 'payment_s_please_note_content4');
    if (payType === 'alipay') {
      str = transfer(language, 'payment_s_please_note_content4_alipay');
    }
    for (let i = 0; i < str.length; i++) {
      pleaseNote2.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.textColor,
          }}>
          {str[i]}
        </Text>,
      );
    }
    str = transfer(language, 'payment_s_please_note_content5');
    for (let i = 0; i < str.length; i++) {
      pleaseNote3.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.textColor,
          }}>
          {str[i]}
        </Text>,
      );
    }
    str = transfer(language, 'payment_s_please_note_content6');
    for (let i = 0; i < str.length; i++) {
      pleaseNote3.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.redColor,
          }}>
          {str[i]}
        </Text>,
      );
    }

    return (
      <View style={{flex: 1, backgroundColor: common.bgColor}}>
        <ScrollView style={styles.container}>
          <Text style={styles.amountTip}> {amountTip}</Text>
          <Text style={styles.amount}>{`¥${amount}`}</Text>

          {
            // 姓名
            <View style={{marginTop: common.margin15, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.contentTip}>{titleName}</Text>
                <Text style={styles.content}>{name}</Text>
              </View>
              {payType !== 'alipay' ? (
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(name.toString()),
                      Toast.success(
                        transfer(language, 'recharge_copyed'),
                        2000,
                      );
                  }}>
                  <Text
                    style={{
                      color: common.themeColor,
                      fontSize: common.font12,
                    }}>
                    复制
                  </Text>
                </NextTouchableOpacity>
              ) : (
                <View style={styles.copy} />
              )}
            </View>
          }

          {// 银行信息
          payType !== 'card' ? null : (
            <View style={{marginTop: common.margin15, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}>
                  {titleBankName}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right">
                  {bankName}
                </Text>
              </View>
              <View style={styles.copy} />
            </View>
          )}

          {
            // 账号
            <View style={{marginTop: common.margin15, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}>
                  {titleBankNo}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right">
                  {bankNo}
                </Text>
              </View>
              {
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(bankNo.toString()),
                      Toast.success(
                        transfer(language, 'recharge_copyed'),
                        2000,
                      );
                  }}>
                  <Text
                    style={{
                      color: common.themeColor,
                      fontSize: common.font12,
                    }}>
                    复制
                  </Text>
                </NextTouchableOpacity>
              }
            </View>
          }

          {// 二维码
          payType === 'alipay' ? (
            <View style={{marginTop: common.margin15, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}>
                  {transfer(language, 'UpdateAlipay_account_qr')}
                </Text>
                <NextTouchableOpacity
                  activeOpacity={common.activeOpacity}
                  onPress={() => this.qrPress(qrHash)}>
                  <Image
                    style={{
                      marginRight: common.margin10,
                      width: common.w20,
                      height: common.h20,
                    }}
										source={require('../../resource/assets/qrcode_white.png')}
                  />
                </NextTouchableOpacity>
              </View>
              <View style={styles.copy} />
            </View>
          ) : null}

          {traderContact.type ? (
            <View style={{marginTop: common.margin15, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}>
                  {traderContact.type}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right">
                  {traderContact.value}
                </Text>
              </View>
              <NextTouchableOpacity
                style={styles.copy}
                activeOpacity={common.activeOpacity}
                onPress={() => {
                  Clipboard.setString(traderContact.value.toString()),
                    Toast.success(transfer(language, 'recharge_copyed'), 2000);
                }}>
                <Text
                  style={{
                    color: common.themeColor,
                    fontSize: common.font12,
                  }}>
                  复制
                </Text>
              </NextTouchableOpacity>
              {/* <View style={styles.copy} /> */}
            </View>
          ) : null}

          {/* {
            // 备注
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {transfer(language, 'payment_remark')}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right"
                >{`${remark}`}</Text>
              </View>
              <NextTouchableOpacity
                style={styles.copy}
                activeOpacity={common.activeOpacity}
                onPress={() => {
                  Clipboard.setString(
                    remark
                      .replace(`（${transfer(language, 'payment_please_fill_in')}）`, '')
                      .toString()
                  ),
                    Toast.success(transfer(language, 'recharge_copyed'), 2000);
                }}
              >
                <Text style={{ color: common.themeColor, fontSize: common.font12 }}>
                  复制
                </Text>
              </NextTouchableOpacity>
            </View>
          } */}

          <Text style={styles.pleaseNoteTip}>{pleaseNoteTitle}</Text>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            {pleaseNote1}
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            {pleaseNote2}
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            {pleaseNote3}
          </View>
        </ScrollView>

        <View>
          {
            <TKButton
              style={{
                height: 40,
                margin: common.margin10,
                borderWidth: 1,
                borderColor: common.borderColor,
                backgroundColor: common.navBgColor,
              }}
              titleStyle={{
                color: havedPayDisabled
                  ? common.navTitleColor
                  : common.themeColor,
              }}
              target="global"
              caption={havedPayTitle}
              onPress={() => this.havedPayPress(receiverInfoData.id)}
              disabled={havedPayDisabled}
            />
          }
          {
            <TKButton
              style={{
                height: 40,
                margin: common.margin10,
                borderWidth: 1,
                marginTop: 0,
                borderColor: common.borderColor,
                backgroundColor: common.navBgColor,
              }}
              titleStyle={{
                color: cancelBtnDisabled
                  ? common.navTitleColor
                  : common.themeColor,
              }}
              target="global"
              caption={cancelBtnTitle}
              onPress={() => this.cancelPress(receiverInfoData.id)}
              disabled={cancelBtnDisabled}
            />
          }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.receiverInfo,
    loggedInResult: state.authorize.loggedInResult,
    loggedIn: state.authorize.loggedIn,
    language: state.system.language,
    otcList: state.otcDetail.otcList,
    cancelResult: state.otcDetail.cancelResult,
    cancelError: state.otcDetail.cancelError,
    havedPayResult: state.otcDetail.havedPayResult,
    havedPayError: state.otcDetail.havedPayError,
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(ReceiverInfo);
