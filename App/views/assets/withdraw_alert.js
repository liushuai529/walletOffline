import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Keyboard,
  StyleSheet,
  DeviceEventEmitter,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import { requesetPhoneCode } from '../../redux/actions/code';
import { requestWithdraw, changeFormData } from '../../redux/actions/assets';
import { Toast, Overlay } from 'teaset';
import BigNumber from 'bignumber.js';
import { USER_BUY_WITHDRAW_SUCCESS_KEY } from '../../constants/constant';
import {
  requesetUserAssets,
  endRefreshingUserAssets,
} from '../../redux/actions/user';
import Alert from '../../components/Alert';
import transfer from '../../localization/utils';
import { clearFormData } from '../../redux/actions/assets';
import CodeAlert from './code_alert';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingBottom: common.margin30,
  },
});

class WithdrawAlert extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerStyle: {
        backgroundColor: common.bgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadData();
    this.uiListener = DeviceEventEmitter.addListener(
      USER_BUY_WITHDRAW_SUCCESS_KEY,
      item => {
        const { navigation } = this.props;
        navigation.goBack();
      },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.quantityInput.blur();
        this.addressInput.blur();
      },
    );
  }

  componentWillUnmount() {
    this.uiListener.remove();
    const { dispatch } = this.props;
    dispatch(clearFormData());
    this.keyboardDidHideListener.remove()
  }

  loadData() {
    this.refreshData();
    const { dispatch } = this.props;
    dispatch(endRefreshingUserAssets());
  }

  refreshData() {
    const { dispatch } = this.props;
    dispatch(requesetUserAssets({ token_ids: ['*'] }));
  }

  showAlertOverlay() {
    this.hideAlert();
    let overlayView = (
      <Overlay.View style={{ flex: 1 }} modal={false} overlayOpacity={0}>
        <CodeAlert
          hide={() => {
            this.hideAlert();
          }}
          submit={() => {
            this.hideAlert();
            setTimeout(() => {
              this.submit(1);
            }, 500);
          }}
        />
      </Overlay.View>
    );
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideAlert() {
    if (this.overlayViewKeyID) {
      Overlay.hide(this.overlayViewKeyID);
      this.overlayViewKeyID = null;
    }
  }

  scan() {
    const { navigation } = this.props;
    navigation.navigate('Scan', {
      didScan: val => {
        this.onToaddrChanged(val);
      },
    });
  }

  submit(type) {
    const { dispatch, formData, data, isRequestWithdraw } = this.props;
    if (isRequestWithdraw) return;
    if (!formData.toaddr || formData.toaddr.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_21'));
      return;
    }
    if (!formData.amount || formData.amount.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_22'));
      return;
    }
    const min = new BigNumber(this.getMinQuantity());
    const q = new BigNumber(formData.amount);
    if (q.isNaN()) {
      Toast.fail(transfer(this.props.language, 'alert_23'));
      return;
    }
    if (min.gt(q)) {
      Toast.fail(transfer(this.props.language, 'alert_24'));
      return;
    }

    let token_id = 2;
    this.showAlert = true;
    let param = {
      amount: formData.amount,
      toaddr: formData.toaddr,
      code: formData.code,
      token_id: token_id,
    };
    if (data.mobile) {
      param['mobile'] = data.mobile;
    } else {
      param['email'] = data.email;
    }

    if (type == 0) {
      this.showAlertOverlay();
      return;
    }

    if (!formData.code || formData.code.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_25'));
      return;
    }

    if (!this.showAlert) return;
    this.showAlert = false;
    dispatch(requestWithdraw(param));
  }

  onQuantityChange(text) {
    const { dispatch, formData } = this.props;
    const q = new BigNumber(text);
    if (q.isNaN() && text.length) return;
    if (!q.isNaN() && q.gt(this.getMaxQuantity())) {
      dispatch(
        changeFormData({
          ...formData,
          amount: this.getMaxQuantity(),
        }),
      );
      return;
    }
    const qArr = text.split('.');
    if (qArr.length === 1 && q.eq(0)) {
      dispatch(
        changeFormData({
          ...formData,
          amount: '0',
        }),
      );
      return;
    }
    if (qArr.length > 1 && qArr[1].length > 8) return;
    dispatch(
      changeFormData({
        ...formData,
        amount: text,
      }),
    );
  }

  getMaxQuantity() {
    const { legalDic, assets } = this.props;
    let atv =
      assets.revenue && assets.revenue.bonus
        ? common.removeInvalidZero(
          BigNumber(assets.revenue.bonus).toFixed(8, 1),
        )
        : '0';
    let usdt =
      legalDic && legalDic['USDT']
        ? common.removeInvalidZero(
          BigNumber(legalDic['USDT'].amount).toFixed(8, 1),
        )
        : '0';
    let new_usdt = common.removeInvalidZero(
      BigNumber(atv)
        .plus(usdt)
        .toFixed(8, 1),
    );
    return new_usdt;
  }

  getMinQuantity() {
    return '20';
  }

  onToaddrChanged(text) {
    const { dispatch, formData } = this.props;
    dispatch(
      changeFormData({
        ...formData,
        toaddr: text,
      }),
    );
  }

  render() {
    let fee = BigNumber(this.props.formData.amount)
      .multipliedBy(0.03)
      .toFixed(8, 1);
    if (BigNumber(fee).isNaN()) fee = 0;
    let bAmount = BigNumber(this.props.formData.amount)
      .multipliedBy(0.97)
      .toFixed(8, 1);
    if (BigNumber(bAmount).isNaN()) bAmount = 0;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: common.margin20,
                  backgroundColor: common.bgColor,
                }}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    marginTop: common.margin10,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: common.font30,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'alert_29')}
                  </Text>
                  <Text
                    style={{
                      color: common.themeColor,
                      fontSize: common.font20,
                      marginLeft: common.margin10,
                    }}>
                    USDT-ERC20
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: common.font16,
                    minWidth: common.w80,
                    color: common.navTitleColor,
                    marginTop: common.margin15,
                    marginBottom: common.margin5,
                  }}>
                  {transfer(this.props.language, 'alert_30')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    ref={(ref) => {
                      this.addressInput = ref
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: common.margin5,
                      marginVertical: common.margin10,
                      color: common.navTitleColor,
                      fontSize: common.font17,
                    }}
                    placeholder={transfer(this.props.language, 'local_2')}
                    placeholderTextColor={common.textColor}
                    underlineColorAndroid="transparent"
                    keyboardType="email-address"
                    onChangeText={e => this.onToaddrChanged(e)}
                    value={this.props.formData.toaddr}
                  />
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.scan();
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: common.w40,
                        height: common.w40,
                      }}>
                      <Image
                        style={{
                          width: common.w20,
                          height: common.w20,
                          tintColor: common.themeColor,
                        }}
                        source={require('../../resource/assets/scan.png')}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View
                  style={{
                    height: common.getH(1),
                    width: '100%',
                    height: 0.5,
                    backgroundColor: common.textColor,
                  }}
                />
                <Text
                  style={{
                    fontSize: common.font16,
                    minWidth: common.w80,
                    color: common.navTitleColor,
                    marginTop: common.margin30,
                    marginBottom: common.margin5,
                  }}>
                  {transfer(this.props.language, 'alert_31')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    ref={(ref) => {
                      this.quantityInput = ref
                    }}
                    style={{
                      borderColor: '#E0E0E0',
                      borderRadius: common.h5,
                      flex: 1,
                      paddingVertical: common.margin5,
                      marginVertical: common.margin10,
                      color: common.navTitleColor,
                      fontSize: common.font17,
                    }}
                    placeholder={transfer(this.props.language, 'local_3')}
                    placeholderTextColor={common.textColor}
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    onChangeText={e => this.onQuantityChange(e)}
                    value={this.props.formData.amount}
                  />
                  <Text
                    style={{
                      fontSize: common.font16,
                      color: common.navTitleColor,
                    }}>
                    USDT
                  </Text>
                  <View
                    style={{
                      width: 0.5,
                      height: common.h15,
                      backgroundColor: common.navTitleColor,
                      marginHorizontal: common.margin10,
                    }}
                  />
                  <Text
                    style={{ fontSize: common.font16, color: common.themeColor }}
                    onPress={() => {
                      this.onQuantityChange(this.getMaxQuantity());
                    }}>
                    {transfer(this.props.language, 'local_9')}
                  </Text>
                </View>
                <View
                  style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: common.textColor,
                  }}
                />
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.textColor,
                    paddingVertical: common.margin8,
                  }}>{`${transfer(
                    this.props.language,
                    'local_8',
                  )}${common.removeInvalidZero(
                    this.getMaxQuantity(),
                  )} USDT`}</Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.navTitleColor,
                    marginTop: common.margin15,
                  }}>{`${transfer(this.props.language, 'local_5')} ${transfer(
                    this.props.language,
                    'local_7',
                  )}*3%`}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: common.margin10,
                  }}>
                  <Text
                    style={{ fontSize: common.font16, color: common.themeColor }}>
                    {common.removeInvalidZero(fee)}
                  </Text>
                  <Text
                    style={{ fontSize: common.font16, color: common.textColor }}>
                    USDT
                  </Text>
                </View>
                <View
                  style={{
                    height: common.getH(1),
                    width: '100%',
                    borderBottomWidth: 1,
                    borderColor: common.cutOffLine,
                  }}
                />
                <View
                  style={{
                    backgroundColor: common.navBgColor,
                    marginTop: common.margin30,
                    padding: common.margin8,
                  }}>
                  <Text
                    style={{
                      fontSize: common.font18,
                      paddingVertical: common.margin5,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'alert_16')}
                  </Text>
                  <Text
                    style={{
                      fontSize: common.font16,
                      paddingVertical: common.margin5,
                      color: common.navTitleColor,
                    }}>{`${transfer(
                      this.props.language,
                      'alert_34',
                    )}${this.getMinQuantity()}USDT`}</Text>
                  <Text
                    style={{
                      fontSize: common.font16,
                      paddingVertical: common.margin5,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'alert_35')}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: common.margin30,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: common.font16,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'local_6')}
                  </Text>
                  <Text
                    style={{
                      fontSize: common.font16,
                      color: common.themeColor,
                    }}>{`${common.removeInvalidZero(bAmount)} USDT`}</Text>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.submit(0);
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderRadius: common.h5 / 2,
                      justifyContent: 'center',
                      backgroundColor: common.themeColor,
                      paddingVertical: common.margin12,
                      marginTop: common.margin20,
                      width: '100%',
                    }}>
                    <Text style={{ fontSize: common.font14, color: '#000' }}>
                      {transfer(this.props.language, 'alert_36')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.assets,
    ...state.user,
    data: state.login.data,
    legalDic: state.user.legalDic,
  };
}

export default connect(mapStateToProps)(WithdrawAlert);
