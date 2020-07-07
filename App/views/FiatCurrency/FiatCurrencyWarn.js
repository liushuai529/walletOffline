import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import BigNumber from 'bignumber.js';

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.bgColor,
    width: '90%',
    borderRadius: common.margin10,
    paddingVertical: common.margin20,
    paddingHorizontal: common.margin15,
  },
});

class FiatCurrencyWarn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
    };
  }

  componentDidMount() {
    this.init_timer = setInterval(() => {
      if (this.state.time <= 0) {
        clearInterval(this.init_timer);
        this.init_timer = null;
      } else {
        this.setState({
          time: this.state.time - 1,
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.init_timer) {
      clearInterval(this.init_timer);
      this.init_timer = null;
    }
  }

  renderBuy() {
    const {submit, user, form, buyType} = this.props;
    let keyIndex = 0;
    const content1 = '温馨提示';
    const content2 = '1、请务必使用“';
    const name = buyType == 0 ? `${user.name}，${user.bankName}` : user.name;
    const content3 = '”，账号为“';
    const account =
      buyType == 0
        ? common.maskAccount(user.bankNo)
        : common.maskAccount(user.alipay.account || '', 'phone');
    const content4 =
      buyType == 0
        ? '”的银行卡进行汇款，其他任何方式汇款都被退款。(禁止微信和支付宝)'
        : '”的支付宝进行汇款，其他任何方式汇款都被退款。(禁止银行卡)';
    const contentArray1 = [];
    for (let i = 0; i < content2.length; i++) {
      contentArray1.push(
        <Text
          style={{fontSize: common.font16, color: common.navTitleColor}}
          key={keyIndex++}>
          {content2[i]}
        </Text>,
      );
    }
    for (let i = 0; i < name.length; i++) {
      contentArray1.push(
        <Text
          style={{fontSize: common.font16, color: common.redColor}}
          key={keyIndex++}>
          {name[i]}
        </Text>,
      );
    }
    for (let i = 0; i < content3.length; i++) {
      contentArray1.push(
        <Text
          style={{fontSize: common.font16, color: common.navTitleColor}}
          key={keyIndex++}>
          {content3[i]}
        </Text>,
      );
    }
    for (let i = 0; i < account.length; i++) {
      contentArray1.push(
        <Text
          style={{fontSize: common.font16, color: common.redColor}}
          key={keyIndex++}>
          {account[i]}
        </Text>,
      );
    }
    for (let i = 0; i < content4.length; i++) {
      contentArray1.push(
        <Text
          style={{fontSize: common.font16, color: common.navTitleColor}}
          key={keyIndex++}>
          {content4[i]}
        </Text>,
      );
    }
    const content5 = '2、汇款时，请勿填写任何备注信息，否则商家将拒绝成交。';
    let contentArray2 = [];
    for (let i = 0; i < content5.length; i++) {
      contentArray2.push(
        <Text
          style={{
            fontSize: common.font16,
            color: i > 5 && i < 16 ? common.redColor : common.navTitleColor,
          }}
          key={keyIndex++}>
          {content5[i]}
        </Text>,
      );
    }
    const content6 =
      '3、买入成功后，请在20分钟内完成付款并确认“我已付款”，逾期订单将被取消。';
    let contentArray3 = [];
    for (let i = 0; i < content6.length; i++) {
      contentArray3.push(
        <Text
          style={{
            fontSize: common.font16,
            color: i > 22 && i < 27 ? common.redColor : common.navTitleColor,
          }}
          key={keyIndex++}>
          {content6[i]}
        </Text>,
      );
    }
    const content7 =
      '4、工作日17:00后单笔汇款不要超过5万，周末全天单笔汇款不要超过5万，否则到账时间将会延迟。';
    let contentArray4 = [];
    for (let i = 0; i < content7.length; i++) {
      contentArray4.push(
        <Text
          style={{
            fontSize: common.font16,
            color: common.navTitleColor,
          }}
          key={keyIndex++}>
          {content7[i]}
        </Text>,
      );
    }
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: common.font20, color: common.navTitleColor}}>
            {content1}
          </Text>
        </View>
        <View
          style={{
            marginTop: common.margin10,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {contentArray1}
        </View>
        <View
          style={{
            marginTop: common.margin10,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {contentArray2}
        </View>
        <View
          style={{
            marginTop: common.margin10,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {contentArray3}
        </View>
        <View
          style={{
            marginTop: common.margin10,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {contentArray4}
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (submit && this.state.time <= 0) {
              submit();
            }
          }}>
          <View
            style={{
              marginTop: common.margin15,
              backgroundColor: common.themeColor,
              paddingVertical: common.margin8,
              paddingHorizontal: common.margin20,
              alignSelf: 'center',
              borderRadius: common.margin5,
            }}>
            <Text
              style={{
                fontSize: common.font16,
                color: common.blackColor,
              }}>
              {this.state.time > 0 ? `剩余${this.state.time}s` : '确定'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderSell() {
    const {
      submit,
      change,
      showAmount,
      showTotal,
      showRealityAmount,
      showRealityTotal,
      name,
      user,
      currencyList,
      buyType,
      isFast,
      hide,
    } = this.props;
    const {selectCurrency} = this.props.form;

    const currency = currencyList[selectCurrency];
    const otc_surcharge = currency.small_surcharge;
    const otc_amount = currency.small_amount;
    let keyIndex = 0;
    const content1 = '温馨提示';
    let total = BigNumber(showTotal);
    if (BigNumber(showTotal).lt(otc_amount)) {
      total = new BigNumber(showTotal).minus(otc_surcharge);
    }

    const accountName = user.name;
    const account =
      buyType == 0
        ? common.maskAccount(user.bankNo)
        : common.maskAccount(user.alipay.account || '', 'phone');

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            hide();
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: common.getH(44),
              height: common.getH(44),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: common.getH(15), height: common.getH(15)}}
              source={require('../../resource/assets/close_icon.png')}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontSize: common.font20,
            color: common.navTitleColor,
            alignSelf: 'center',
            marginBottom: common.margin10,
          }}>
          {content1}
        </Text>
        {!isFast ? (
          <Text style={{fontSize: common.font16, color: common.navTitleColor}}>
            {`卖出数量：${showAmount}${name}`}
          </Text>
        ) : null}
        {!isFast ? (
          <Text style={{fontSize: common.font16, color: common.navTitleColor, marginTop: common.margin10,}}>
            {`实际成交: ${showRealityAmount}${name}`}
          </Text>
        ) : null}
        {BigNumber(showTotal).lt(otc_amount) ? (
          <Text
            style={{
              marginTop: common.margin10,
              fontSize: common.font16,
              color: common.redColor,
            }}>
            {`卖出金额不足${common.removeInvalidZero(
              otc_amount,
            )}元，将额外收取${common.removeInvalidZero(otc_surcharge)}元服务费`}
          </Text>
        ) : null}
        {isFast ? null : (
          <Text
            style={{
              marginTop: common.margin10,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}>
            {`可得金额：${BigNumber(total).toFixed(2, 1)}`}
          </Text>
        )}
        {buyType == 0 ? (
          <View>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`持卡人：${accountName}`}
            </Text>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`开户银行：${user.bankName}`}
            </Text>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`开户支行：${user.subbankName}`}
            </Text>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`银行卡号：${account}`}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`姓名：${accountName}`}
            </Text>
            <Text
              style={{
                marginTop: common.margin10,
                fontSize: common.font16,
                color: common.navTitleColor,
              }}>
              {`支付宝账号：${account}`}
            </Text>
          </View>
        )}
        <View
          style={{
            marginTop: common.margin10,
            height: 0.5,
            backgroundColor: common.placeholderColor,
          }}
        />
        <Text
          style={{
            marginTop: common.margin10,
            fontSize: common.font16,
            color: common.navTitleColor,
          }}>
          {buyType == 0
            ? '1、请确认卖出数量或金额及到账银行卡账户信息。'
            : '1、请确认卖出数量或金额及到账支付宝账户信息。'}
        </Text>
        <Text
          style={{
            marginTop: common.margin10,
            fontSize: common.font16,
            color: common.navTitleColor,
          }}>
          {buyType == 0
            ? '2、银行卡信息有误可能会导致商家汇款失败，请仔细核对。'
            : '2、支付宝账户信息有误可能会导致商家汇款失败，请仔细核对。'}
        </Text>
        <View
          style={{
            marginTop: common.margin15,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (change) {
                change(buyType == 0 ? 'UpdateBank' : 'UpdateAlipay');
              }
            }}>
            <View
              style={{
                backgroundColor: '#C9CACC',
                paddingVertical: common.margin8,
                flex: 1,
                borderRadius: common.margin5,
                marginRight: common.margin8,
                marginLeft: common.margin10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.blackColor,
                }}>
                {buyType == 0 ? '更换银行卡' : '更换支付宝'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              if (submit) {
                submit();
              }
            }}>
            <View
              style={{
                backgroundColor: common.themeColor,
                paddingVertical: common.margin8,
                flex: 1,
                borderRadius: common.margin5,
                marginLeft: common.margin8,
                marginRight: common.margin10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.blackColor,
                }}>
                确定
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  render() {
    const {operateType} = this.props.form;
    return operateType == 0 ? this.renderBuy() : this.renderSell();
  }
}

function mapStateToProps(state) {
  return {
    ...state.FiatCurrency,
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(FiatCurrencyWarn);
