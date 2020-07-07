import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Keyboard,
  Image,
  StyleSheet,
  DeviceEventEmitter,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Overlay, PopoverPicker} from 'teaset';
import {common} from '../../constants/common';
import {connect} from 'react-redux';
import {changeFormData, requestExchangeRate, requestExchange} from '../../redux/actions/assets';
import {Toast} from 'teaset';
import BigNumber from 'bignumber.js';
import {USER_BUY_WITHDRAW_SUCCESS_KEY} from '../../constants/constant';
import {requesetUserAssets, endRefreshingUserAssets} from '../../redux/actions/user';
import Alert from '../../components/Alert';
import transfer from '../../localization/utils';
import {clearFormData} from '../../redux/actions/assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingBottom: common.margin30,
  },
  select: {
    flex: 1,
    borderRadius: common.h5 / 2,
    flexDirection: 'row',
    height: common.h50,
    justifyContent: 'space-between',
    backgroundColor: common.navBgColor,
    alignItems: 'center',
  },
  select_text: {
    color: common.themeColor,
    fontSize: common.font17,
    marginVertical: common.margin8,
    marginRight: common.margin15,
    marginHorizontal: common.margin10,
    flex: 1,
  },
  select_image: {
    width: common.h15,
    height: common.h15,
    alignSelf: 'center',
    marginRight: common.margin10,
  },
});

class ExchangeAlert extends React.Component {
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
    const {dispatch, navigation} = this.props;
    dispatch(requestExchangeRate());
    this.uiListener = DeviceEventEmitter.addListener(USER_BUY_WITHDRAW_SUCCESS_KEY, item => {
      navigation.goBack();
    });
  }

  componentWillUnmount() {
    this.uiListener.remove();
    const {dispatch} = this.props;
    dispatch(clearFormData());
  }

  loadData() {
    this.refreshData();
    const {dispatch} = this.props;
    dispatch(endRefreshingUserAssets());
  }

  refreshData() {
    const {dispatch} = this.props;
    dispatch(requesetUserAssets({token_ids: ['*']}));
  }

  showView(view) {
    const {dispatch, formData} = this.props;
    view.measure((x, y, width, height, pageX, pageY) => {
      PopoverPicker.show(
        {x: pageX, y: pageY, width, height},
        this.props.formData.data,
        this.props.formData.selectIndex,
        (item, index) =>
          setTimeout(() => {
            dispatch(
              changeFormData({
                ...formData,
                selectIndex: index,
                amount: '',
              }),
            );
          }, 300),
        {
          modal: false,
        },
      );
    });
  }

  onQuantityChange(text) {
    const {dispatch, formData} = this.props;
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
    const {assets, formData} = this.props;
    if (formData.selectIndex == 0 && assets.revenue && assets.revenue.profit) {
      return BigNumber(assets.revenue.profit).toFixed(8, 1);
    } else if (formData.selectIndex == 1 && assets.revenue && assets.revenue.bonus) {
      return BigNumber(assets.revenue.bonus).toFixed(8, 1);
    }
    return '0';
  }

  getMinQuantity() {
    return '0';
  }

  submit() {
    const {dispatch, legalDic, formData, isRequestExchange} = this.props;
    if (isRequestExchange) return;
    if (!formData.amount || formData.amount.length == 0) {
      Toast.fail(transfer(this.props.language, 'alert_1'));
      return;
    }
    const min = new BigNumber(this.getMinQuantity());
    const q = new BigNumber(formData.amount);
    if (q.isNaN()) {
      Toast.fail(transfer(this.props.language, 'alert_2'));
      return;
    }
    if (min.isGreaterThanOrEqualTo(q)) {
      Toast.fail(transfer(this.props.language, 'alert_3'));
      return;
    }
    let token_id = 2;
    this.showAlert = true;
    Alert.alert(
      transfer(this.props.language, 'alert_4'),
      '',
      [
        {
          text: transfer(this.props.language, 'alert_5'),
          onPress: () => {
            this.showAlert = false;
          },
          style: 'cancel',
        },
        {
          text: transfer(this.props.language, 'alert_6'),
          onPress: () => {
            if (!this.showAlert) return;
            this.showAlert = false;
            dispatch(
              requestExchange({
                amount: formData.amount,
                token_id: token_id,
                action: formData.selectIndex == 0 ? 'profit_to_legal' : 'bonus_to_legal',
              }),
            );
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    const {exchangeRate, formData} = this.props;
    const P = exchangeRate && exchangeRate['USDTETH'] && exchangeRate['USDTETH'].P ? exchangeRate['USDTETH'].P : 0;
    const B = exchangeRate && exchangeRate['USDTETH'] && exchangeRate['USDTETH'].B ? exchangeRate['USDTETH'].B : 0;
    const rate = formData.selectIndex == 0 ? P : B;
    let amount = common.removeInvalidZero(
      BigNumber(rate)
        .multipliedBy(formData.amount)
        .toFixed(8, 1),
    );
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: common.bgColor,
                  paddingHorizontal: common.margin20,
                  width: '100%',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingVertical: common.margin10,
                  }}>
                  <Text
                    style={{
                      fontSize: common.font30,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'alert_8')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: common.font16,
                    minWidth: common.w60,
                    color: common.navTitleColor,
                    paddingTop: common.margin20,
                    paddingBottom: common.margin10,
                  }}>
                  {transfer(this.props.language, 'alert_9')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: common.margin5,
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // this.showView(this.fromView);
                    }}>
                    <View
                      ref={view => {
                        this.fromView = view;
                      }}
                      style={styles.select}>
                      <Text style={styles.select_text}>{this.props.formData.data[this.props.formData.selectIndex]}</Text>
                      {/* <Image style={styles.select_image} source={require('../../resource/assets/down.png')} resizeMode="contain" /> */}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Text
                  style={{
                    fontSize: common.font16,
                    minWidth: common.w60,
                    color: common.navTitleColor,
                    marginTop: common.margin40,
                  }}>
                  {transfer(this.props.language, 'alert_10')}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', borderColor: common.textColor, borderBottomWidth: 0.5}}>
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: common.margin10,
                      marginTop: common.margin10,
                      color: common.navTitleColor,
                      fontSize: common.font17,
                    }}
                    placeholder={transfer(this.props.language,'local_10')}
                    placeholderTextColor={common.textColor}
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    onChangeText={e => this.onQuantityChange(e)}
                    value={this.props.formData.amount}
                  />
                  <Text style={{fontSize: common.font16, color: common.navTitleColor}}>USDT</Text>
                  <View style={{width: 0.5, height: common.h15, backgroundColor: common.navTitleColor, marginHorizontal: common.margin10}} />
                  <Text
                    style={{fontSize: common.font16, color: common.themeColor}}
                    onPress={() => {
                      this.onQuantityChange(this.getMaxQuantity());
                    }}>
										{transfer(this.props.language,'local_9')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.textColor,
                    paddingVertical: common.margin8,
                  }}>{`${transfer(this.props.language,'local_8')}${this.props.formData.selectIndex == 0 ? 'TV' : 'ATV'}：${common.removeInvalidZero(this.getMaxQuantity())}`}</Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    paddingVertical: common.margin10,
                    color: common.navTitleColor,
                    marginTop: common.margin30,
                  }}>{`${transfer(this.props.language, 'alert_11')}${this.props.formData.selectIndex == 0 ? 'TV' : 'ATV'}:USDT`}</Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    paddingVertical: common.margin10,
                    color: common.navTitleColor,
                  }}>{`${rate}`}</Text>
                <View style={{backgroundColor: common.textColor, height: 0.5, width: '100%'}} />
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.navTitleColor,
                    paddingVertical: common.margin5,
                    marginTop: common.margin30,
                  }}>{`${transfer(this.props.language, 'alert_12')}`}</Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.themeColor,
                    paddingVertical: common.margin5,
                  }}>{`${BigNumber(amount).isNaN() ? 0 : amount}`}</Text>
                <View style={{backgroundColor: common.textColor, height: 0.5, width: '100%'}} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.submit();
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderRadius: common.h5 / 2,
                      justifyContent: 'center',
                      backgroundColor: common.themeColor,
                      paddingVertical: common.margin12,
                      marginTop: common.margin40,
                      width: '100%',
                    }}>
                    <Text style={{fontSize: common.font20, color: '#000'}}>{transfer(this.props.language, 'alert_13')}</Text>
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
    assets: state.user.assets,
    legalDic: state.user.legalDic,
  };
}

export default connect(mapStateToProps)(ExchangeAlert);
