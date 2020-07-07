import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, ScrollView, Clipboard, CameraRoll, StyleSheet } from 'react-native';
import BigNumber from 'bignumber.js';
import { Overlay } from 'teaset';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import transfer from '../../localization/utils';
import { Toast, ActionSheet } from 'teaset';
import TKButton from '../../components/TKButton';
import * as otcDetail from '../../redux/actions/otcDetail';
import LegalDealConfirmCancelView from './components/LegalDealConfirmCancelView';
import { imgHashApi } from '../../services/api';
import Alert from '../../components/Alert';
import FS from 'rn-fs-d3j';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: common.margin15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginRight: common.margin10,
    width: common.w20,
    height: common.h20,
  },
  contentTip: {
    marginLeft: common.margin10,
    color: common.navTitleColor,
    fontSize: common.font12,
  },
  copy: {
    marginRight: common.margin10,
    width: common.w35,
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

class Payment extends Component {
  static navigationOptions(props) {
    const { navigation } = props;
    return {
      headerTitle:
        navigation.state.params.data.direct === common.buy
          ? transfer(navigation.state.params.lang, 'payment_b')
          : transfer(navigation.state.params.lang, 'payment_s'),
    };
  }

  showConfirmOverlay(id) {
    const { dispatch, navigation } = this.props;
    const lang = navigation.state.params.lang;
    const overlayView = (
      <Overlay.View style={{ justifyContent: 'center' }} modal={false} overlayOpacity={0.8}>
        <LegalDealConfirmCancelView
          language={lang}
          pressCancel={() => {
            Overlay.hide(this.overlayCancelViewKey);
          }}
          pressConfirm={() => {
            dispatch(otcDetail.requestCancel({ id }));
            Overlay.hide(this.overlayCancelViewKey);
          }}
        />
      </Overlay.View>
    );
    this.overlayCancelViewKey = Overlay.show(overlayView);
  }

  componentDidMount() {}

  cancelPress(id) {
    this.showConfirmOverlay(id);
  }

  havedPayPress(id) {
    const { dispatch } = this.props;
    dispatch(otcDetail.requestHavedPay({ id }));
  }

  showAlert() {
    const { language } = this.props;
    Alert.alert(
      transfer(language, 'me_super_savePhotoFailed'),
      transfer(language, 'me_super_savePhotoReminder'),
      [
        {
          text: transfer(language, 'me_super_savePhotoOK'),
          onPress: () => {},
        },
      ]
    );
  }

  _saveImage = uri => {
    const { language } = this.props;
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
        }
      );
    }
  };

  _tapQRImage = uri => {
    const { language } = this.props;
    const items = [
      {
        title: transfer(language, 'me_super_savePhoto'),

        onPress: () => {
          this._saveImage(uri);
        },
      },
    ];
    const cancelItem = { title: transfer(language, 'me_super_savePhotoCancel'), type: 'cancel' };
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
        overlayOpacity={0.8}
      >
        <NextTouchableOpacity
          style={styles.qrContainer}
          onPress={() => {
            this._tapQRImage(qrUri);
          }}
        >
          <Image style={styles.qrImage} source={{ uri: this._getImagePath(qrUri) }} />
        </NextTouchableOpacity>
      </Overlay.View>
    );
    this.overlayViewKey = Overlay.show(overlayView);
  };

  render() {
    const { navigation, user } = this.props;
    const rd = navigation.state.params.data;
    const lang = navigation.state.params.lang;

    let havedPayDisabled = true;
    let cancelBtnDisabled = true;
    for (var i = 0; i < this.props.otcList.length; i++) {
      if (
        this.props.otcList[i].id === rd.id &&
        this.props.otcList[i].status === common.legalDeal.status.waitpay
      ) {
        cancelBtnDisabled = false;
        havedPayDisabled = false;
      }
    }

    let titleName = '';
    let titleBankName = '';
    let titleBankNo = '';
    let name = '';
    let bankName = '';
    let bankNo = '';
    let remark = '';
    let titleTips1 = [];
    let titleTips2 = [];
    let titleTips3 = [];
    // const amount = new BigNumber(rd.dealPrice).multipliedBy(rd.quantity).toFixed(2, 1);
    const amount = BigNumber(rd.payMoney).toFixed(2, 1);
    let havedPayTitle = '';
    let cancelBtnTitle = '';
    let payType = 'card';
    let qrHash;
    let myBankNo;
    let traderContact = {};
    if (rd.traderPayinfo.contactMobile) {
      traderContact = {
        type: transfer(
          lang,
          rd.direct === common.buy ? 'trader_deserver_mobile' : 'trader_payer_mobile'
        ),
        value: rd.traderPayinfo.contactMobile,
      };
    } else if (rd.traderPayinfo.contactWechat) {
      traderContact = {
        type: transfer(
          lang,
          rd.direct === common.buy ? 'trader_deserver_wechat' : 'trader_payer_wechat'
        ),
        value: rd.traderPayinfo.contactWechat,
      };
    }
    if (rd.direct === common.buy) {
      payType = rd.traderPayinfo.payType;
      if (payType === 'alipay') {
        name = rd.traderPayinfo.alipay.name;
        bankNo = rd.traderPayinfo.alipay.account;
        qrHash = rd.traderPayinfo.alipay.qrHash;
        myBankNo = rd.createrPayinfo.alipay.account;
      } else {
        name = rd.traderPayinfo.cardHolderName;
        bankName = rd.traderPayinfo.bankName + rd.traderPayinfo.subbankName;
        bankNo = rd.traderPayinfo.bankNo;
        myBankNo = rd.createrPayinfo.bankNo;
      }
      remark = rd.traderPayinfo.remark;
      titleName = transfer(lang, 'payment_b_account_name');
      titleBankName = transfer(lang, 'payment_b_bank');
      titleBankNo = transfer(lang, 'payment_b_account_No');
      let str = transfer(lang, 'payment_s_please_note_content1');
      for (let i = 0; i < str.length; i++) {
        titleTips1.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: i > 1 ? common.redColor : common.textColor,
            }}
          >
            {str[i]}
          </Text>
        );
      }
      // str = '' + remark;
      // for (let i = 0; i < str.length; i++) {
      //   titleTips1.push(
      //     <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>
      //       {str[i]}
      //     </Text>
      //   );
      // }
      if (payType === 'alipay') {
        str = transfer(lang, 'payment_s_please_note_content2_alipay');
        for (let i = 0; i < str.length; i++) {
          titleTips2.push(
            <Text style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}>
              {str[i]}
            </Text>
          );
        }
      } else {
        str = transfer(lang, 'payment_s_please_note_content2');
        for (let i = 0; i < str.length; i++) {
          titleTips2.push(
            <Text style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}>
              {str[i]}
            </Text>
          );
        }
        str = payType === 'alipay' ? '' : user.bankName || '';
        for (let i = 0; i < str.length; i++) {
          titleTips2.push(
            <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>
              {str[i]}
            </Text>
          );
        }
        str = transfer(lang, 'payment_s_please_note_content3');
        for (let i = 0; i < str.length; i++) {
          titleTips2.push(
            <Text style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}>
              {str[i]}
            </Text>
          );
        }
      }
      str = common.maskAccount(myBankNo, payType === 'alipay' ? 'phone' : 'bank');
      for (let i = 0; i < str.length; i++) {
        titleTips2.push(
          <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>
            {str[i]}
          </Text>
        );
      }
      str = transfer(lang, 'payment_s_please_note_content4');
      if (payType === 'alipay') {
        str = transfer(lang, 'payment_s_please_note_content4_alipay');
      }
      for (let i = 0; i < str.length; i++) {
        titleTips2.push(
          <Text style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}>
            {str[i]}
          </Text>
        );
      }
      str = transfer(lang, 'payment_s_please_note_content5');
      for (let i = 0; i < str.length; i++) {
        titleTips3.push(
          <Text style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}>
            {str[i]}
          </Text>
        );
      }
      str = transfer(lang, 'payment_s_please_note_content6');
      for (let i = 0; i < str.length; i++) {
        titleTips3.push(
          <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>
            {str[i]}
          </Text>
        );
      }
      havedPayTitle = transfer(lang, 'OtcDetail_i_paid');
      cancelBtnTitle = transfer(lang, 'OtcDetail_cancelOrder');
      remark += `（${transfer(lang, 'payment_please_fill_in')}）`;
    } else if (rd.direct === common.sell) {
      payType = rd.traderPayinfo.payType;
      if (payType === 'alipay') {
        name = rd.traderPayinfo.alipay.name;
        bankNo = rd.traderPayinfo.alipay.account;
      } else {
        name = rd.traderPayinfo.cardHolderName;
        bankName = rd.traderPayinfo.bankName + rd.traderPayinfo.subbankName;
        bankNo = rd.traderPayinfo.bankNo;
      }
      remark = rd.traderPayinfo.remark;
      titleName = transfer(lang, 'payment_s_account_name');
      titleBankName = transfer(lang, 'payment_s_bank');
      titleBankNo =
        payType === 'alipay' ? '付款方支付宝账号' : transfer(lang, 'payment_s_account_No');

      titleTips1.push(
        <Text
          style={{ flex: undefined, fontSize: common.font16, color: common.textColor }}
          key={1}
        >{`${transfer(lang, 'payer_s_please_note_content')}\n`}</Text>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: common.bgColor}}>
        <ScrollView style={{ flex: 1, backgroundColor: common.bgColor}}>
          <Text
            style={{
              marginTop: common.margin15,
              fontSize: common.font16,
              color: common.navTitleColor,
              alignSelf: 'center',
            }}
          >
            {transfer(lang, 'payment_transaction_amount')}
          </Text>
          <Text
            style={{
              marginTop: common.margin20,
              fontSize: common.font30,
              color: common.textColor,
              alignSelf: 'center',
            }}
          >{`¥${amount}`}</Text>

          {
            // 姓名
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {titleName}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right"
                >
                  {name}
                </Text>
              </View>
              {rd.direct !== common.buy ? (
                <View style={styles.copy} />
              ) : payType !== 'alipay' ? (
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(name.toString()),
                      Toast.success(transfer(lang, 'recharge_copyed'), 2000);
                  }}
                >
                  <Text style={{ color: common.themeColor, fontSize: common.font12 }}>
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
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {titleBankName}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right"
                >
                  {bankName}
                </Text>
              </View>
              <View style={styles.copy} />
            </View>
          )}

          {
            // 账号
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {titleBankNo}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right"
                >
                  {bankNo}
                </Text>
              </View>
              {rd.direct !== common.buy ? (
                <View style={styles.copy} />
              ) : (
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(bankNo.toString()),
                      Toast.success(transfer(lang, 'recharge_copyed'), 2000);
                  }}
                >
                  <Text style={{ color: common.themeColor, fontSize: common.font12 }}>
                    复制
                  </Text>
                </NextTouchableOpacity>
              )}
            </View>
          }

          {// 二维码
          payType === 'alipay' && rd.direct === common.buy ? (
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {transfer(lang, 'UpdateAlipay_account_qr')}
                </Text>
                <NextTouchableOpacity
                  activeOpacity={common.activeOpacity}
                  onPress={() => this.qrPress(qrHash)}
                >
                  <Image
                    style={{ marginRight: common.margin10, width: common.w20, height: common.h20 }}
										source={require('../../resource/assets/qrcode_white.png')}
                  />
                </NextTouchableOpacity>
              </View>
              <View style={styles.copy} />
            </View>
          ) : null}

          {traderContact.type ? (
            <View style={{ marginTop: common.margin15, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    marginLeft: common.margin10,
                    color: common.navTitleColor,
                    fontSize: common.font12,
                  }}
                >
                  {traderContact.type}
                </Text>
                <Text
                  style={{
                    marginRight: common.margin10,
                    color: common.textColor,
                    fontSize: common.font12,
                  }}
                  textAlign="right"
                >
                  {traderContact.value}
                </Text>
              </View>
              {
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(traderContact.value.toString()),
                      Toast.success(transfer(lang, 'recharge_copyed'), 2000);
                  }}
                >
                  <Text style={{ color: common.themeColor, fontSize: common.font12 }}>
                    复制
                  </Text>
                </NextTouchableOpacity>
              }
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
                  {transfer(lang, 'payment_remark')}
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
              {rd.direct !== common.buy ? (
                <View style={styles.copy} />
              ) : (
                <NextTouchableOpacity
                  style={styles.copy}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    Clipboard.setString(
                      remark
                        .replace(`（${transfer(lang, 'payment_please_fill_in')}）`, '')
                        .toString()
                    ),
                      Toast.success(transfer(lang, 'recharge_copyed'), 2000);
                  }}
                >
                  <Text style={{ color: common.themeColor, fontSize: common.font12 }}>
                    复制
                  </Text>
                </NextTouchableOpacity>
              )}
            </View>
          } */}

          <Text
            style={{
              marginTop: common.margin30,
              marginLeft: common.margin10,
              color: common.textColor,
              fontSize: common.font18,
            }}
          >
            {transfer(lang, 'payment_s_please_note')}
          </Text>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingBottom: common.margin10,
            }}
          >
            {titleTips1}
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingBottom: common.margin10,
            }}
          >
            {titleTips2}
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: common.margin10,
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingBottom: common.margin10,
            }}
          >
            {titleTips3}
          </View>
        </ScrollView>

        <View>
          {rd.direct === common.sell ? null : (
            <TKButton
              style={{
                height: 40,
                margin: common.margin10,
                borderWidth: 1,
                borderColor: common.borderColor,
                backgroundColor: common.navBgColor,
              }}
              titleStyle={{
                color: havedPayDisabled ? common.navTitleColor : common.themeColor,
              }}
              target="global"
              caption={havedPayTitle}
              onPress={() => this.havedPayPress(rd.id)}
              disabled={havedPayDisabled}
            />
          )}
          {rd.direct === common.sell ? null : (
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
                color: cancelBtnDisabled ? common.navTitleColor : common.themeColor,
              }}
              target="global"
              caption={cancelBtnTitle}
              onPress={() => this.cancelPress(rd.id)}
              disabled={cancelBtnDisabled}
            />
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.Payment,
    otcList: state.otcDetail.otcList,
    user: state.user.user,
    language: state.system.language,
  };
}

export default connect(mapStateToProps)(Payment);
