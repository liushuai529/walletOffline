import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import BigNumber from 'bignumber.js';
import {
  updateForm,
  clearAlertForm,
  initAlertPayType,
} from './redux/action/FiatCurrency';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {imgHashApi} from '../../services/api';
import {Toast, Overlay} from 'teaset';
import FiatCurrencyWarn from './FiatCurrencyWarn';
import {requestDealWith} from './redux/action/FiatCurrency';
import transfer from '../../localization/utils';

class FiatCurrencyAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch, item, currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    const hasCard = item.paytype.indexOf('card') != -1;
    const hasAlipay = item.paytype.indexOf('alipay') != -1;
    const buyAlertPayType = !hasCard && hasAlipay ? 1 : 0;
    dispatch(
      initAlertPayType({
        buyAlertPayType: buyAlertPayType,
        buyAlertType: 0,
      }),
    );
    if (selectCurrency < currencyList.length) {
      let select = currencyList[selectCurrency];
      dispatch(
        updateForm({
          sellFeeRadio: select.user_fee,
        }),
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearAlertForm());
  }

  showOverlay() {
    const {jump, item, loggedInResult, language, user} = this.props;
    const {
      operateType,
      buyAlertMoney,
      buyAlertType,
      buyAlertPayType,
    } = this.props.form;
    // 最低购买额
    const type = buyAlertType == 0 ? '金额' : '数量';
    const min = new BigNumber(this.getMinQuantity());
    const q = operateType ? new BigNumber(buyAlertMoney).multipliedBy(BigNumber(1).minus(BigNumber(this.feeRatio()).div(100))):
      new BigNumber(buyAlertMoney);
    if (q.isNaN()) {
      Toast.fail(`请输入正确${type}`);
      return;
    }
    if (q.isLessThanOrEqualTo(0)) {
      Toast.fail(`${type}必须大于0`);
      return;
    }
    let min_quantity = this.minQuanty();
    if (buyAlertType == 0) {
      // 按金额购买
      min_quantity = BigNumber(min_quantity).multipliedBy(item.price);
    }
    if (q.lt(min_quantity)) {
      if (buyAlertType == 0) {
        Toast.fail('未达到最低限额');
        return;
      }
      Toast.fail(
        `最小交易额为${min_quantity}${buyAlertType == 0 ? '' : 'USDT'}`,
      );
      return;
    }
    if (q.lt(this.getSmallSurcharge())) {
      Toast.fail('交易额小于手续费');
      return;
    }
    if (min.gt(q)) {
      
      Toast.fail('未达到最低限额');
      return;
    }

    const showTotal = this.totalPrice();
    let total = common.removeInvalidZero(BigNumber(showTotal).toFixed(2, 1));
    if (BigNumber(total).lte(0) && operateType == 0) {
      Toast.fail(`实付款必须大于0`);
      return;
    }

    if (loggedInResult.idCardAuthStatus !== common.user.status.pass) {
      Toast.fail(transfer(language, 'Otc_please_perform_authentication_first'));
      setTimeout(() => {
        if (jump) jump('Authentication');
      }, 500);
      return;
    }
    if (buyAlertPayType == 0) {
      // 银行卡
      if (
        !user.bankNo ||
        !user.bankName ||
        user.bankNo.length == 0 ||
        user.bankName.length == 0
      ) {
        setTimeout(() => {
          if (jump) jump('UpdateBank');
        }, 500);
        Toast.fail(transfer(language, 'Otc_please_bind_bank_card_first'));
        return;
      }
    } else {
      // 支付宝
      if (!user.alipay || user.alipay.length == 0) {
        setTimeout(() => {
          if (jump) jump('UpdateAlipay');
        }, 500);
        Toast.fail(transfer(language, 'Otc_please_bind_alipay_first'));
        return;
      }
    }
    const showAmount = BigNumber(this.totalAmount()).toFixed(this.quantityLimit(), 1);
    let overlayView = (
      <Overlay.View
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        modal={false}
        overlayOpacity={0}>
        <TouchableWithoutFeedback
          onPress={() => {
            // this.hideOverlay();
          }}>
          <View style={styles.overlay_cover} />
        </TouchableWithoutFeedback>
        <FiatCurrencyWarn
          buyType={this.props.form.buyAlertPayType}
          showAmount={showAmount}
          showRealityAmount={this.realityAmount()}
          showTotal={buyAlertType == 0 ? this.totalPriceByMoney() : showTotal}
          showRealityTotal={buyAlertType == 0 ? buyAlertMoney : this.totalOriginalPrice()}
          name={item.token.name}
          hide={() => {
            this.hideOverlay();
          }}
          submit={() => {
            this.hideOverlay();
            this.operateAction();
          }}
          change={name => {
            const {jump} = this.props;
            this.hideOverlay();
            if (jump) jump(name);
          }}
        />
      </Overlay.View>
    );
    this.hideOverlay();
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideOverlay() {
    Overlay.hide(this.overlayViewKeyID);
  }

  fixPriceAndAmount(dealPrice, amount, quantityLimit, amountLimit) {
    if (
      new BigNumber(dealPrice).isNaN() ||
      new BigNumber(amount).isNaN() ||
      new BigNumber(amountLimit).isNaN() ||
      new BigNumber(quantityLimit).isNaN() ||
      new BigNumber(dealPrice).isNegative() ||
      new BigNumber(amount).isNegative() ||
      new BigNumber(amountLimit).isNegative() ||
      new BigNumber(quantityLimit).isNegative()
    )
      return;
    var quantity = new BigNumber(amount).dividedBy(dealPrice).toFixed();
    while (true) {
      if (
        new BigNumber(quantity).isEqualTo(
          new BigNumber(quantity).toFixed(quantityLimit, 1),
        )
      ) {
        return {
          amount: amount,
          quantity: quantity,
        };
      }
      quantity = new BigNumber(quantity).toFixed(quantityLimit, 1);
      amount = new BigNumber(dealPrice).multipliedBy(quantity).toFixed();

      if (
        new BigNumber(amount).isEqualTo(
          new BigNumber(amount).toFixed(amountLimit, 1),
        )
      ) {
        return {
          amount: amount,
          quantity: quantity,
        };
      }
      amount = new BigNumber(amount).toFixed(amountLimit, 1);
      quantity = new BigNumber(amount).dividedBy(dealPrice).toFixed();
    }
  }

  operateAction() {
    const {dispatch, item, form} = this.props;
    const {buyAlertType, buyAlertPayType, operateType, buyAlertMoney} = form;
    if (buyAlertType == 0) {
      // 按金额购买
      let parm = {
        token_id: item.token_id,
        action: 'fixed',
        direct: operateType == 0 ? 'buy' : 'sell',
        OID: item.id,
        paytype: buyAlertPayType == 0 ? 'card' : 'alipay',
        price: parseFloat(item.price),
        total_money: parseFloat(buyAlertMoney),
      };
      dispatch(requestDealWith(parm));
    } else {
      const {amount, quantity} = this.fixPriceAndAmount(
        item.price,
        BigNumber(this.totalAmount()).times(item.price),
        this.quantityLimit(),
        2,
      );
      
      let parm = {
        token_id: item.token_id,
        action: 'fixed',
        direct: operateType == 0 ? 'buy' : 'sell',
        OID: item.id,
        paytype: buyAlertPayType == 0 ? 'card' : 'alipay',
        price: parseFloat(item.price),
        total_money: parseFloat(amount),
        quantity: parseFloat(quantity),
      };
      dispatch(requestDealWith(parm));
    }
  }

  onQuantityChange(text) {
    const {dispatch} = this.props;
    const {buyAlertType} = this.props.form;
    const q = new BigNumber(text);
    if (q.isNaN() && text.length) return;
    if (text.indexOf(' ') != -1) return;
    if (!q.isNaN() && q.gt(this.getMaxQuantity())) {
      dispatch(
        updateForm({
          buyAlertMoney: this.getMaxQuantity(),
        }),
      );
      return;
    }
    const qArr = text.split('.');

    if (buyAlertType === 0 && qArr.length === 2 && qArr[1].length > 2) {
      return;
    }
    if (qArr.length === 1 && q.eq(0)) {
      dispatch(
        updateForm({
          buyAlertMoney: '0',
        }),
      );
      return;
    }
    const {pairInfo} = this.props;
    const limit = buyAlertType == 0 ? this.priceLimit() : this.quantityLimit();
    if (limit == 0 && qArr.length > 1) return;
    if (qArr.length > 1 && qArr[1].length > limit) return;
    dispatch(
      updateForm({
        buyAlertMoney: text,
      }),
    );
  }

  getMaxQuantity() {
    const {item, user, loggedInResult} = this.props;
    const {buyAlertType, operateType} = this.props.form;
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let quantityLimit = select ? select.quantityLimit : null;
    if (buyAlertType == 0) quantityLimit = 2;

    const remain =
      buyAlertType == 0
        ? common.removeInvalidZero(
            BigNumber(
              buyAlertType == 0
                ? BigNumber.min(item.remain_v, item.upper_v)
                : BigNumber.min(item.remain, item.upper),
            ).toFixed(quantityLimit, 1),
          )
        : common.removeInvalidZero(
            BigNumber(
              buyAlertType == 0
                ? BigNumber.min(item.remain_v, item.upper_v)
                : BigNumber.min(item.remain, item.upper),
            ).toFixed(quantityLimit, 1),
          );
    if (
      loggedInResult.idCardAuthStatus == common.user.status.pass &&
      operateType !== 0
    ) {
      let maxQuantity = 0;
      maxQuantity = this.getUsdt();
      if (buyAlertType == 0) {
        maxQuantity = BigNumber(maxQuantity).multipliedBy(item.price);
      }
      maxQuantity = common.removeInvalidZero(
        BigNumber(maxQuantity).toFixed(quantityLimit, 1),
      );
      return BigNumber(remain).gt(maxQuantity) ? maxQuantity: 
       BigNumber.min(this.addFee(remain), maxQuantity).toFixed(quantityLimit, 1)
    }
    return remain;
  }

  getUsdt() {
    const {assets, legalDic} = this.props;
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
    const {item} = this.props;
    const {buyAlertType, operateType} = this.props.form;
    const least = common.removeInvalidZero(
      BigNumber(buyAlertType == 0 ? item.least_v : item.least).toFixed(2, 1),
    );
    let min_quantity = this.minQuanty();
    if (buyAlertType == 0) {
      // 按金额购买
      min_quantity = BigNumber(min_quantity).multipliedBy(item.price);
    }
    const min = BigNumber(least).gt(min_quantity) ? least : min_quantity;

    let small_surcharge = this.getSmallSurcharge();
    if (operateType == 1) {
      return BigNumber(small_surcharge).gte(min) ? small_surcharge : min;
    }
    return min;
  }

  getSmallSurcharge() {
    const {currencyList, item} = this.props;
    const {selectCurrency, buyAlertType} = this.props.form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let small_surcharge = select ? select.small_surcharge : '0';
    if (buyAlertType == 0) {
      return BigNumber(small_surcharge);
    } else {
      return BigNumber(small_surcharge).div(item.price);
    }
  }

  minQuanty() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    if (selectCurrency < currencyList.length) {
      const currency = currencyList[selectCurrency];
      return currency ? BigNumber(currency.min_quantity) : '20';
    }
    return '20';
  }

  totalAmount() {
    const {buyAlertMoney, buyAlertType, operateType} = this.props.form;
    const {item} = this.props;
    const input = BigNumber(buyAlertMoney).isNaN() ? 0 : buyAlertMoney;
    const showAmount = common.removeInvalidZero(
      BigNumber(
        buyAlertType == 0 ? BigNumber(input).div(item.price) : BigNumber(input),
      )
    );
    return showAmount;
  }

  totalPrice() {
    const {item} = this.props;
    const {operateType} = this.props.form;
    const showAmount = this.totalAmount();
    let showTotal = common.removeInvalidZero(
      BigNumber(showAmount).times(item.price),
    );
    if(operateType === 1){
      showTotal = BigNumber(showTotal).multipliedBy(BigNumber(1).minus(BigNumber(this.feeRatio()).div(100))).toFixed(2, 1);
        
    }
      
    return showTotal;
  }

  totalOriginalPrice() {
    const {item} = this.props;
    const showAmount = this.totalAmount();
    let showTotal = common.removeInvalidZero(
      BigNumber(showAmount).times(item.price),
    );
      
    return showTotal;
  }

  totalPriceByMoney() {
    const {
      buyAlertMoney,
      operateType
    } = this.props.form;
    
    let totalPrice = operateType === 0 ? buyAlertMoney ? buyAlertMoney: 0  : 
      buyAlertMoney ? BigNumber(buyAlertMoney).multipliedBy(BigNumber(1).minus(BigNumber(this.feeRatio()).div(100))).toFixed(2, 1): 0
    return common.removeInvalidZero(totalPrice);
  }
  
  feeRatio() {
    const {
      sellFeeRadio, selectCurrency
    } = this.props.form;
    const { currencyList } = this.props;
    let select = selectCurrency < currencyList.length ? currencyList[selectCurrency]: undefined;
    let quantityLimit = select ? select.quantityLimit : null;
    let sellFeeRatio = BigNumber(sellFeeRadio).multipliedBy(100).toFixed(quantityLimit, 1);
    //let sellFeeRatio = 50;
    return common.removeInvalidZero(sellFeeRatio);
  }

  totalFee() {
    return common.removeInvalidZero(
      BigNumber(this.totalAmount()).multipliedBy(BigNumber(this.feeRatio()).div(100)).toFixed(this.quantityLimit(), 1)
    )
  }

  realityAmount() {
    return common.removeInvalidZero(
      BigNumber(this.totalAmount()).multipliedBy(BigNumber(1).minus(BigNumber(this.feeRatio()).div(100))).toFixed(this.quantityLimit(), 1)
    )
  }

  addFee(quantity) {
    const {
       selectCurrency,
       buyAlertType
    } = this.props.form;
    const { currencyList } = this.props;
    let select = selectCurrency < currencyList.length ? currencyList[selectCurrency]: undefined;
    let quantityLimit = select ? select.quantityLimit : null;
    return this.feeRatio() === '100' ? BigNumber(quantity).toFixed(buyAlertType ? quantityLimit: 2, 1):
     BigNumber(quantity).div(BigNumber(1).minus(BigNumber(this.feeRatio()).div(100))).toFixed(buyAlertType ? quantityLimit: 2, 1)
  }

 

  priceLimit() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;

    const currency = currencyList[selectCurrency];
    return currency ? currency.priceLimit : 2;
  }

  quantityLimit() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;

    const currency = currencyList[selectCurrency];
    return currency ? currency.quantityLimit : 8;
  }

  render() {
    const {
      buyAlertMoney,
      buyAlertType,
      operateType,
      buyAlertPayType,
      sellFeeRadio,
    } = this.props.form;
    const {hide, dispatch, item, showTokensInfoDic, marketIcons} = this.props;

    const least = common.removeInvalidZero(
      BigNumber(item.least_v).toFixed(2, 1),
    );
    const remain = common.removeInvalidZero(
      BigNumber.min(item.remain_v, item.upper_v).toFixed(2, 1),
    );
    const price = common.removeInvalidZero(BigNumber(item.price).toFixed(8, 1));
    let currentcy = showTokensInfoDic[item.token_id];
    let source = marketIcons[currentcy.name] || marketIcons.ETH;
    if (currentcy && currentcy.appicon && currentcy.appicon[1]) {
      source = {uri: imgHashApi + currentcy.appicon[1] + '.png'};
    }
    const hasCard = item.paytype.indexOf('card') != -1;
    const hasAlipay = item.paytype.indexOf('alipay') != -1;
    const showAmount = common.removeInvalidZero(
      BigNumber(this.totalAmount()).toFixed(this.quantityLimit(), 1)
    );
    const showTotal = this.totalPrice();
    //let showBuyAlertMoney = BigNumber(buyAlertMoney).multipliedBy(BigNumber(1).minus(sellFeeRadio)).toFixed(2,1)
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={styles.container}>
          <View style={styles.style_1}>
            <View style={styles.style_2}>
              <Text style={styles.style_3}>{`${
                operateType == 0 ? '购买' : '出售'
              }${item.token.name}`}</Text>
              <View style={styles.style_4}>
                <Text style={styles.style_5}>单价</Text>
                <Text style={styles.style_6}>{`¥${price}`}</Text>
              </View>
            </View>
            {/* <Image style={styles.style_7} source={source} /> */}
          </View>
          <View
            style={{marginTop: common.margin10, marginLeft: common.margin15}}>
            <Text
              style={{
                fontSize: common.font18,
                color: common.themeColor,
                fontWeight: 'bold',
              }}>
              {`请选择${operateType == 0 ? '付款' : '收款'}方式`}
            </Text>
          </View>
          <View style={styles.style_8}>
            {hasCard ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(
                    updateForm({
                      buyAlertPayType: 0,
                    }),
                  );
                }}>
                <View style={styles.style_9}>
                  <Text
                    style={
                      buyAlertPayType == 0 ? styles.style_11 : styles.style_12
                    }>
                    银行卡
                  </Text>
                  <View
                    style={
                      buyAlertPayType == 0 ? styles.style_13 : styles.style_14
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            {hasAlipay ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(
                    updateForm({
                      buyAlertPayType: 1,
                    }),
                  );
                }}>
                <View style={styles.style_10}>
                  <Text
                    style={
                      buyAlertPayType == 1 ? styles.style_11 : styles.style_12
                    }>
                    支付宝
                  </Text>
                  <View
                    style={
                      buyAlertPayType == 1 ? styles.style_13 : styles.style_14
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
          <View style={styles.style_8}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(
                  updateForm({
                    buyAlertType: 0,
                  }),
                );
              }}>
              <View style={styles.style_9}>
                <Text
                  style={buyAlertType == 0 ? styles.style_11 : styles.style_12}>
                  {`按金额${operateType == 0 ? '购买' : '出售'}`}
                </Text>
                <View
                  style={buyAlertType == 0 ? styles.style_13 : styles.style_14}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(
                  updateForm({
                    buyAlertType: 1,
                  }),
                );
              }}>
              <View style={styles.style_10}>
                <Text
                  style={buyAlertType == 1 ? styles.style_11 : styles.style_12}>
                  {`按数量${operateType == 0 ? '购买' : '出售'}`}
                </Text>
                <View
                  style={buyAlertType == 1 ? styles.style_13 : styles.style_14}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.style_15}>
            <TextInput
              style={styles.style_16}
              placeholder={`请输入${operateType == 0 ? '购买' : '出售'}${
                buyAlertType == 0 ? '金额' : '数量'
              }`}
              placeholderTextColor={common.textColor}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              onChangeText={e => this.onQuantityChange(e)}
              value={buyAlertMoney}
            />
            <Text style={styles.style_17}>
              {buyAlertType === 0 ? 'CNY' : `${item.token.name}`}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(
                  updateForm({
                    buyAlertMoney: this.getMaxQuantity(),
                  }),
                );
              }}>
              <Text style={styles.style_18}>{`全部${
                operateType == 0 ? '买入' : '售出'
              }`}</Text>
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.style_19}>{`限额：¥${least}-¥${remain}`}</Text>
          {
            operateType === 1 ? (
              <View style={[styles.style_20, {flexDirection: 'column'}]}>
                <Text style={([styles.style_21], { color: common.themeColor, fontWeight: 'bold',})} >
                  {`平台将收取${this.feeRatio()}%作为手续费`}
                </Text>
                <Text style={([styles.style_21], { color: common.themeColor, alignSelf: 'flex-end' })} >
                  {`手续费:${this.totalFee()}${item.token.name}`}
                </Text>
              </View>
            ): null
          }
          <View style={styles.style_20}>
            <Text style={{color: 'transparent'}} />
            {
              operateType === 1 ? 
              <Text style={[styles.style_21, {color: common.themeColor, fontWeight: 'bold'}]}>
                {`实际成交数量:${this.realityAmount()}${item.token.name}`}
              </Text>:
              <Text style={[styles.style_21, {color: common.themeColor, fontWeight: 'bold'}]}>
                {`交易数量:${showAmount}${item.token.name}`}
              </Text>
            }
            
          </View>
          <View style={styles.style_20}>
            <Text style={styles.style_21}>
              {operateType == 0 ? '实付款' : '实收款'}
            </Text>
            <Text style={styles.style_23}>
              {buyAlertType === 0
                ? `¥${this.totalPriceByMoney()}` 
                : `¥${common.removeInvalidZero(
                    BigNumber(showTotal).toFixed(2, 1),
                  )}`}{' '}
            </Text>
          </View>
          <View style={styles.style_24}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                if (hide) hide();
              }}>
              <View
                style={[
                  styles.style_25,
                  {
                    marginRight: common.margin8,
                    backgroundColor: '#C9CACC',
                  },
                ]}>
                <Text style={styles.style_26}>取消</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                this.showOverlay();
              }}>
              <View
                style={[
                  styles.style_25,
                  {
                    marginLeft: common.margin8,
                    backgroundColor: common.themeColor,
                  },
                ]}>
                <Text style={styles.style_26}>{`${
                  operateType == 0 ? '下单' : '出售'
                }`}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {common.IsIOS ? <KeyboardSpacer /> : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: common.bgColor,
  },
  style_1: {
    backgroundColor: common.themeColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: common.margin15,
  },
  style_2: {
    justifyContent: 'space-between',
  },
  style_3: {
    fontSize: common.font16,
    color: common.blackColor,
  },
  style_4: {
    flexDirection: 'row',
    marginTop: common.margin10,
  },
  style_5: {
    fontSize: common.font14,
    color: common.blackColor,
  },
  style_6: {
    fontSize: common.font14,
    color: common.blackColor,
    marginLeft: common.margin8,
  },
  style_7: {
    width: common.w35,
    height: common.w35,
  },
  style_8: {
    flexDirection: 'row',
    padding: common.margin15,
  },
  style_9: {
    justifyContent: 'space-between',
    marginRight: common.margin30,
  },
  style_10: {
    justifyContent: 'space-between',
  },
  style_11: {
    fontSize: common.font14,
    color: common.themeColor,
  },
  style_12: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  style_13: {
    height: 1,
    width: '100%',
    backgroundColor: common.themeColor,
    marginTop: common.margin8,
  },
  style_14: {
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: common.margin8,
  },
  style_15: {
    marginHorizontal: common.margin15,
    flexDirection: 'row',
    borderColor: common.placeholderColor,
    borderWidth: 0.5,
    alignItems: 'center',
    paddingVertical: common.margin10,
  },
  style_16: {
    flex: 1,
    padding: common.margin5,
    color: common.navTitleColor,
    fontSize: common.font14,
  },
  style_17: {
    fontSize: common.font14,
    color: common.navTitleColor,
    paddingHorizontal: common.margin10,
  },
  style_18: {
    fontSize: common.font14,
    color: common.themeColor,
    paddingHorizontal: common.margin10,
  },
  style_19: {
    fontSize: common.font14,
    paddingHorizontal: common.margin15,
    color: common.navTitleColor,
    marginTop: common.margin10,
  },
  style_20: {
    paddingHorizontal: common.margin15,
    marginTop: common.margin10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  style_21: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  style_22: {
    marginHorizontal: common.margin15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: common.margin5,
  },
  style_23: {
    fontSize: common.font16,
    color: common.themeColor,
  },
  style_24: {
    flexDirection: 'row',
    margin: common.margin15,
  },
  style_25: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: common.margin2,
    flex: 1,
    paddingVertical: common.margin12,
  },
  style_26: {
    color: common.blackColor,
    fontSize: common.font16,
  },
  overlay_cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.3,
  },
});

function mapStateToProps(state) {
  return {
    ...state.user,
    ...state.FiatCurrency,
    showTokensInfoDic: state.home.showTokensInfoDic,
    marketIcons: {
      TK: require('../../resource/assets/market_TK.png'),
      BTC: require('../../resource/assets/market_BTC.png'),
      ETH: require('../../resource/assets/market_ETH.png'),
      ETC: require('../../resource/assets/market_ETC.png'),
      LTC: require('../../resource/assets/market_LTC.png'),
      EIEC: require('../../resource/assets/market_EIEC.png'),
      MDT: require('../../resource/assets/market_MDT.png'),
      FO: require('../../resource/assets/market_FO.png'),
      ACAR: require('../../resource/assets/market_ACAR.png'),
      ONT: require('../../resource/assets/market_ONT.png'),
    },
    payTypeList: state.user.payTypeList,
    user: state.user.user,
    loggedInResult: state.login.data,
    language: state.system.language,
  };
}

export default connect(mapStateToProps)(FiatCurrencyAlert);
