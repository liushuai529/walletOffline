import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {
  updateForm,
  requestStat,
  requestSellStat,
  initAlertPayType,
  requestDealWith,
  requestLegalMarketDeal,
} from './redux/action/FiatCurrency';
import BigNumber from 'bignumber.js';
import Alert from '../../components/Alert';
import {Toast, Overlay} from 'teaset';
import {withNavigation} from 'react-navigation';
import transfer from '../../localization/utils';
import Toast2 from 'antd-mobile/lib/toast';
import FiatCurrencyWarn from './FiatCurrencyWarn';
import SmallOrderAlert from './SmallOrderAlert';

class FiatCurrencyFast extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch, currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    const buyFastPayType = !this.hasCard() && this.hasAlipay() ? 1 : 0;
    dispatch(
      initAlertPayType({
        buyFastPayType: buyFastPayType,
      }),
    );
    if (selectCurrency < currencyList.length) {
      let select = currencyList[selectCurrency];
      //  获取单价
      dispatch(
        requestStat({
          action: 'lastprice',
          where: {
            token_id: select.token_id,
            direct: 'buy',
          },
        }),
      );
      dispatch(
        requestSellStat({
          action: 'lastprice',
          where: {
            token_id: select.token_id,
            direct: 'sell',
          },
        }),
      );
      dispatch(
        updateForm({
          sellFeeRadio: select.user_fee,
        }),
      );
    }
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const {dispatch} = this.props;
    const {currencyList} = nextProps;
    const {operateType, selectCurrency, selectMarketCurrency} = nextProps.form;
    if (nextProps.showBuySuccess2) {
      const currency = nextProps.currencyList[selectMarketCurrency];
      if (nextProps.buyOrderId) {
        dispatch(
          requestLegalMarketDeal({
            action: 'deal',
            where: {
              token_id: currency.token_id,
              id: nextProps.buyOrderId.id,
            },
          }),
        );
      }
      dispatch(
        updateForm({
          buyMoney: '',
        }),
      );
    }
    if (
      nextProps.currencyList !== this.props.currencyList &&
      nextProps.currencyList.length
    ) {
      let select = currencyList[selectCurrency];
      //  获取单价
      dispatch(
        requestStat({
          action: 'lastprice',
          where: {
            token_id: select.token_id,
            direct: 'buy',
          },
        }),
      );
      dispatch(
        requestSellStat({
          action: 'lastprice',
          where: {
            token_id: select.token_id,
            direct: 'sell',
          },
        }),
      );
    }

    if (nextProps.orderInfo && nextProps.orderInfo !== this.props.orderInfo) {
      if (operateType === 0) {
        const orderInfo = nextProps.orderInfo[0];
        this.props.navigation.navigate('ReceiverInfo', {
          receiverInfoData: orderInfo,
          titleName: transfer(this.props.language, 'payment_b'),
        });
      } else if (operateType === 1) {
        const orderInfo = nextProps.orderInfo[0];
        this.props.navigation.navigate('Payment', {
          havedPayDisabled: true,
          cancelBtnDisabled: true,
          cancelPress: null,
          havedPayPress: null,
          data: orderInfo,
          lang: this.props.language,
        });
      }
    }
  }

  operateAction() {
    const {
      navigation,
      user,
      language,
      loggedInResult,
      currencyList,
    } = this.props;
    const {
      buyMoney,
      operateActionType,
      selectCurrency,
      buyFastPayType,
    } = this.props.form;
    if (loggedInResult.idCardAuthStatus !== common.user.status.pass) {
      navigation.navigate('Authentication');
      Toast.fail(transfer(language, 'Otc_please_perform_authentication_first'));
      return;
    }
    //邮箱用户绑定手机
    if (this.props.user.email && !this.props.user.mobile) {
      navigation.navigate('UpdateMobile');
      Toast.fail('请先绑定手机');
      return;
    }
    if (buyFastPayType == 0) {
      // 银行卡
      if (
        !user.bankNo ||
        !user.bankName ||
        user.bankNo.length == 0 ||
        user.bankName.length == 0
      ) {
        navigation.navigate('UpdateBank');
        Toast.fail(transfer(language, 'Otc_please_bind_bank_card_first'));
        return;
      }
    } else {
      // 支付宝
      if (!user.alipay || user.alipay.length == 0) {
        navigation.navigate('UpdateAlipay');
        Toast.fail(transfer(language, 'Otc_please_bind_alipay_first'));
        return;
      }
    }
    const showAmount = this.totalAmount();
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
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
          isFast={true}
          buyType={this.props.form.buyFastPayType}
          showAmount={showAmount}
          showTotal={
            operateActionType == 0
              ? buyMoney
              : BigNumber(showAmount).multipliedBy(7)
          }
          name={select.token.name}
          hide={() => {
            this.hideOverlay(this.overlayViewKeyID);
          }}
          submit={() => {
            this.hideOverlay(this.overlayViewKeyID);
            this.buyAction();
          }}
          change={name => {
            const {navigation} = this.props;
            this.hideOverlay(this.overlayViewKeyID);
            navigation.navigate(name);
          }}
        />
      </Overlay.View>
    );
    this.hideOverlay();
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideOverlay(tag) {
    Overlay.hide(tag);
  }

  checkEnter() {
    const {buyMoney, operateActionType} = this.props.form;
    // 最低购买额
    const type = operateActionType == 0 ? '金额' : '数量';
    const min = new BigNumber(this.getMinQuantity());
    const q = new BigNumber(buyMoney);
    if (q.isNaN()) {
      Toast.fail(`请输入正确${type}`);
      return false;
    }
    if (q.isLessThanOrEqualTo(0)) {
      Toast.fail(`${type}必须大于0`);
      return false;
    }
    if (operateActionType == 1) {
      let min_quantity = this.minQuanty();
      if (operateActionType == 0) {
        min_quantity = BigNumber(min_quantity).multipliedBy(7);
      }
      if (q.lt(min_quantity)) {
        if (operateActionType == 0) {
          Toast.fail('系统未提供可交易的商家,请重新输入');
          return false;
        }
        Toast.fail(
          `最小交易额为${min_quantity}${operateActionType == 0 ? '' : 'USDT'}`,
        );
        return false;
      }
      if (min.gt(q)) {
        Toast.fail('交易额小于手续费');
        return false;
      }
    }
    return true;
  }

  checkSmallOrder() {
    const {
      operateType,
      buyMoney,
      buyFastPayType,
      operateActionType,
    } = this.props.form;
    if (this.checkEnter()) {
      if (operateType === 1) {
        if (
          this.hasAlipay() &&
          ((operateActionType === 0 &&
            buyFastPayType === 0 &&
            BigNumber(buyMoney).lt(this.getSmallAmount())) ||
            (operateActionType === 1 &&
              buyFastPayType === 0 &&
              BigNumber(buyMoney).multipliedBy(7).lt(this.getSmallAmount())))
        ) {
          this.operateSmallOrderAction();
        } else {
          this.operateAction();
        }
      } else {
        this.operateAction();
      }
    }
  }

  async selectPayType(index) {
    const {dispatch} = this.props;
    await dispatch(
      updateForm({
        buyFastPayType: index,
      }),
    );
    this.operateAction();
  }

  operateSmallOrderAction() {
    const {dispatch} = this.props;
    const {
      buyMoney,
      operateActionType,
      selectCurrency,
      buyFastPayType,
    } = this.props.form;
    let overlayView = (
      <Overlay.View
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        modal={false}
        overlayOpacity={0}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.overlay_cover} />
        </TouchableWithoutFeedback>
        <SmallOrderAlert
          alipay={() => {
            this.selectPayType(1);
          }}
          card={() => {
            this.selectPayType(0);
          }}
          hide={() => {
            this.hideOverlay(this.overlaySmallOrderView);
          }}
        />
      </Overlay.View>
    );
    this.hideOverlay(this.overlaySmallOrderView);
    this.overlaySmallOrderView = Overlay.show(overlayView);
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
    const quantityLimit = this.quantityLimit();
    const {buyMoney, operateActionType} = this.props.form;
    const input = BigNumber(buyMoney).isNaN() ? 0 : buyMoney;
    const showAmount = common.removeInvalidZero(
      BigNumber(
        operateActionType == 0 ? BigNumber(input).div(7) : BigNumber(input),
      ).toFixed(quantityLimit, 1),
    );
    return showAmount;
  }

  quantityLimit() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;

    const currency = currencyList[selectCurrency];
    return currency ? currency.quantityLimit : 8;
  }

  buyAction() {
    const {dispatch, form, currencyList} = this.props;
    const {
      buyFastPayType,
      operateType,
      selectCurrency,
      operateActionType,
      buyMoney,
    } = form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let parm = {
      token_id: select.token_id,
      action: 'auto',
      direct: operateType == 0 ? 'buy' : 'sell',
      paytype: buyFastPayType == 0 ? 'card' : 'alipay',
    };
    if (operateActionType == 0) {
      parm.total_money = parseFloat(buyMoney);
    } else {
      parm.quantity = parseFloat(buyMoney);
    }
    dispatch(requestDealWith(parm));
  }

  onQuantityChange(text) {
    const {dispatch} = this.props;
    const {operateActionType} = this.props.form;
    const q = new BigNumber(text);
    if (q.isNaN() && text.length) return;
    if (text.indexOf(' ') != -1) return;
    if (!q.isNaN() && q.gt(this.getMaxQuantity())) {
      dispatch(
        updateForm({
          buyMoney: this.getMaxQuantity(),
        }),
      );
      return;
    }
    const qArr = text.split('.');
    if (operateActionType === 0 && qArr.length === 2 && qArr[1].length > 2) {
      return;
    }
    if (qArr.length === 1 && q.eq(0)) {
      dispatch(
        updateForm({
          buyMoney: '0',
        }),
      );
      return;
    }
    const {pairInfo} = this.props;
    const limit = this.quantityLimit();
    if (limit == 0 && qArr.length > 1) return;
    if (qArr.length > 1 && qArr[1].length > limit) return;
    dispatch(
      updateForm({
        buyMoney: text,
      }),
    );
  }

  getMaxQuantity() {
    const {currencyList, balanceList, user} = this.props;
    const {operateType, operateActionType} = this.props.form;
    if (
      operateActionType == 1 &&
      operateType !== 0 &&
      user.idCardAuthStatus == 'pass'
    ) {
      const {selectCurrency} = this.props.form;
      let select =
        selectCurrency < currencyList.length
          ? currencyList[selectCurrency]
          : undefined;
      let quantityLimit = select ? select.quantityLimit : null;
      let maxQuantity = 0;
      maxQuantity = this.getUsdt();
      maxQuantity = common.removeInvalidZero(
        BigNumber(maxQuantity).toFixed(quantityLimit, 1),
      );
      return maxQuantity;
    }
    return '99999999999999';
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
    const {operateType, operateActionType} = this.props.form;
    let small_surcharge = this.getSmallSurcharge();
    let quantity = this.minQuanty();
    if (operateActionType == 0) {
      // 按金额购买
      quantity = BigNumber(quantity).multipliedBy(7);
    }
    if (operateType == 1) {
      return BigNumber(small_surcharge).gte(quantity)
        ? small_surcharge
        : quantity;
    }
    return quantity;
  }

  getSmallSurcharge() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let small_surcharge = select ? select.small_surcharge : '0';
    return BigNumber(small_surcharge).div(7);
  }

	getSmallAmount() {
    const {currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let small_amount = select ? select.small_amount : '1000';
    return BigNumber(small_amount);
  }

  hasCard() {
    const {payTypeList} = this.props;
    var cardEnabled = false;
    payTypeList.some(r => {
      if (r.payType === 'card') cardEnabled = r.enabled;
    });
    return cardEnabled;
  }

  hasAlipay() {
    const {payTypeList} = this.props;
    var alipayEnabled = false;
    payTypeList.some(r => {
      if (r.payType === 'alipay') alipayEnabled = r.enabled;
    });
    return alipayEnabled;
  }

  feeRatio() {
    const {
      sellFeeRadio, selectCurrency
    } = this.props.form;
    const { currencyList } = this.props;
    //let sellFeeRatio = BigNumber(sellFeeRadio).multipliedBy(100).toFixed(1,1) === '0.0' ? 3: BigNumber(sellFeeRadio).multipliedBy(100).toFixed(1,1)
    let select = selectCurrency < currencyList.length ? currencyList[selectCurrency]: undefined;
    let quantityLimit = select ? select.quantityLimit : null;
    let sellFeeRatio = BigNumber(sellFeeRadio).multipliedBy(100).toFixed(quantityLimit,1);
    return common.removeInvalidZero(sellFeeRatio);
  }
  

  renderItem = ({item, index}) => {
    const {showTokensInfoDic, currencyList} = this.props;
    const {selectCurrency} = this.props.form;
    let color =
      index == selectCurrency ? common.themeColor : common.navTitleColor;
    let line_color =
      index == selectCurrency ? common.themeColor : 'transparent';
    let currency = showTokensInfoDic[item.token_id];
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          const {dispatch} = this.props;
          dispatch(
            updateForm({
              selectCurrency: index,
            }),
          );
        }}>
        <View style={styles.top_item_container}>
          <Text style={[styles.item_name1, {color: color}]}>
            {currency ? currency.cnName : ''}
          </Text>
          <Text style={[styles.item_name2, {color: color}]}>
            {item.token.name}
          </Text>
          <View style={[styles.item_line, {backgroundColor: line_color}]} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  isPayTypeEnabled = payType => {
    const {payTypeList} = this.props;
    var enabled = false;
    payTypeList.some(r => {
      if (r.payType === payType) {
        enabled = r.enabled;
        return true;
      }
      return false;
    });
    return enabled;
  };

  renderTip = () => {
    const {operateType} = this.props.form;
    let content1 = [];
    let content2 = [];
    let content3 = [];
    let key_index = 0;
    let str = transfer(this.props.language, 'Otc_please_note_content1');
    for (let i = 0; i < str.length; i++) {
      content1.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.navTitleColor,
          }}
          key={key_index++}>
          {str[i]}
        </Text>,
      );
    }
    if (operateType == 0) {
      str = transfer(
        this.props.language,
        this.isPayTypeEnabled('alipay')
          ? 'Otc_please_note_content11'
          : 'Otc_please_note_content2',
      );
      for (let i = 0; i < str.length; i++) {
        content1.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.redColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content3');
      for (let i = 0; i < str.length; i++) {
        content1.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      if (!this.isPayTypeEnabled('alipay')) {
        content1.push(
          <Image
            style={{width: common.w20, height: common.h20}}
            source={require('../../resource/assets/AlipayForbid.png')}
            key={key_index++}
          />,
        );
      }
      content1.push(
        <Image
          style={{width: common.w20, height: common.h20}}
          source={require('../../resource/assets/WechatForbid.png')}
          key={key_index++}
        />,
      );
      content1.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: common.navTitleColor,
          }}
          key={key_index++}>
          )
        </Text>,
      );

      str = transfer(
        this.props.language,
        this.isPayTypeEnabled('alipay') && !this.isPayTypeEnabled('card')
          ? 'Otc_please_note_content1'
          : 'Otc_please_note_content_index2',
      );
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content4');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content5');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.redColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content6');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      // str = transfer(
      //   this.props.language,
      //   this.isPayTypeEnabled('alipay') && !this.isPayTypeEnabled('card')
      //     ? 'Otc_please_note_content_index2'
      //     : 'Otc_please_note_content_index3'
      // );
      str = '1、';
      for (let i = 0; i < str.length; i++) {
        content3.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content10');
      for (let i = 0; i < str.length; i++) {
        content3.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color:
                (i > 5 && i < 18) || (i > 31 && i < 36)
                  ? common.redColor
                  : common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
    } else {
      // 新增卖出数量不足1000时，额外收取20服务费
      // str = transfer(this.props.language, 'Otc_please_note_content13');
      // str = str.replace('1000', this.props.otc_amount);
      // str = str.replace('20', this.props.otc_surcharge);
      // for (let i = 0; i < str.length; i++) {
      //   content1.push(
      //     <Text
      //       style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}
      //       key={key_index++}
      //     >
      //       {str[i]}
      //     </Text>
      //   );
      // }
      // content1.push(
      //   <Text style={{ flex: undefined, fontSize: common.font16, color: common.redColor }}>。</Text>
      // );
      content1 = undefined;
      str = transfer(this.props.language, 'Otc_please_note_content1');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content7');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content8');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.redColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content9');
      for (let i = 0; i < str.length; i++) {
        content2.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      // str = transfer(this.props.language, 'Otc_please_note_content_index2');
      str = '1、';
      for (let i = 0; i < str.length; i++) {
        content3.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color: common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
      str = transfer(this.props.language, 'Otc_please_note_content10');
      for (let i = 0; i < str.length; i++) {
        content3.push(
          <Text
            style={{
              flex: undefined,
              fontSize: common.font16,
              color:
                (i > 5 && i < 18) || (i > 31 && i < 36)
                  ? common.redColor
                  : common.navTitleColor,
            }}
            key={key_index++}>
            {str[i]}
          </Text>,
        );
      }
    }

    let content01 = [];
    str = `2、单笔最小实际成交数量为:${this.minQuanty()}USDT。`;
    for (let i = 0; i < str.length; i++) {
      content01.push(
        <Text
          style={{
            flex: undefined,
            fontSize: common.font16,
            color: i < 2 ? common.navTitleColor : common.redColor,
          }}
          key={key_index++}>
          {str[i]}
        </Text>,
      );
    }

    return (
      <View
        style={{
          paddingHorizontal: common.margin15,
          paddingBottom: common.margin20,
        }}>
        <Text style={styles.tipsContainer}>
          {transfer(this.props.language, 'Otc_pleaes_note')}
        </Text>
        {content3.length > 0 && (
          <View style={{marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
            {content3}
          </View>
        )}
        <View style={{marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
          {content01}
        </View>
        {(this.isPayTypeEnabled('alipay') &&
          !this.isPayTypeEnabled('card') &&
          operateType == 0) ||
        content1 == undefined ? null : (
          <View style={{marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
            {content1}
          </View>
        )}
        <View style={{marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
          {content2}
        </View>
      </View>
    );
  };

  render() {
    const {currencyList, dispatch, showTokensInfoDic} = this.props;
    const {
      buyMoney,
      univalent,
      sell_univalent,
      operateType,
      operateActionType,
      selectCurrency,
      buyFastPayType,
      sellFeeRadio,
    } = this.props.form;
    let select =
      selectCurrency < currencyList.length
        ? currencyList[selectCurrency]
        : undefined;
    let tokeName = select ? select.token.name : null;
    let small_surcharge = select ? select.small_surcharge : '0';
    let small_amount = select ? select.small_amount : '';
    if (BigNumber(buyMoney).gte(small_amount)) small_surcharge = '0';

    const hasCard = this.hasCard();
    const hasAlipay = this.hasAlipay();
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <View style={{height: common.h60}}>
            <FlatList
              data={currencyList}
              extraData={this.props.form}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.top_line} />
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
                      buyFastPayType: 0,
                    }),
                  );
                }}>
                <View style={styles.style_9}>
                  <Text
                    style={
                      buyFastPayType == 0 ? styles.style_11 : styles.style_12
                    }>
                    银行卡
                  </Text>
                  <View
                    style={
                      buyFastPayType == 0 ? styles.style_13 : styles.style_14
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
                      buyFastPayType: 1,
                    }),
                  );
                }}>
                <View style={styles.style_10}>
                  <Text
                    style={
                      buyFastPayType == 1 ? styles.style_11 : styles.style_12
                    }>
                    支付宝
                  </Text>
                  <View
                    style={
                      buyFastPayType == 1 ? styles.style_13 : styles.style_14
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View
              style={{
                paddingVertical: common.margin8,
                paddingHorizontal: common.margin20,
                flexDirection: 'row'
              }}>
              <Text style={styles.title_text}>{`${
                operateType == 0 ? '购买' : '出售'
              }${operateActionType == 0 ? '金额' : '数量'}`}</Text>
              {
                operateType === 0 ? <Text style={{color: 'transparent'}}/> : 
                <Text style={[styles.title_text, { color: common.themeColor, fontWeight: 'bold', marginLeft: common.margin20 }]}>
                  {`平台将收取${this.feeRatio()}%作为手续费`}
                </Text>
              }
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.input_container}>
            <Text style={styles.input_left_text}>
              {operateActionType === 0 ? '¥' : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={common.placeholderColor}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              onChangeText={e => this.onQuantityChange(e)}
              value={buyMoney}
            />
            {operateActionType === 1 ? (
              <Text style={[styles.title_text, {padding: common.margin5}]}>
                {tokeName}
              </Text>
            ) : null}
            {operateType == 0 ? null : operateActionType == 0 ? null : (
              <TouchableWithoutFeedback
                onPress={() => {
                  const {loggedInResult, language, navigation} = this.props;
                  if (
                    loggedInResult.idCardAuthStatus !== common.user.status.pass
                  ) {
                    navigation.navigate('Authentication');
                    Toast.fail(
                      transfer(
                        language,
                        'Otc_please_perform_authentication_first',
                      ),
                    );
                    return;
                  }
                  dispatch(
                    updateForm({
                      buyMoney: this.getMaxQuantity(),
                    }),
                  );
                }}>
                <View style={styles.operate_container}>
                  <Text style={styles.operate_text}>最大</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            <View style={styles.input_line} />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={styles.unit_container}>
              <Text style={styles.title_text}>
                {operateType == 0 && univalent
                  ? `单价约${common.removeInvalidZero(
                      BigNumber(univalent).toFixed(2, 1),
                    )}CNY`
                  : operateType == 1 && sell_univalent
                  ? `单价约${common.removeInvalidZero(
                      BigNumber(sell_univalent).toFixed(2, 1),
                    )}CNY`
                  : ''}
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(
                    updateForm({
                      operateActionType: operateActionType == 0 ? 1 : 0,
                    }),
                  );
                }}>
                <View style={styles.unit_right_container}>
                  <Image
                    style={styles.unit_container_image}
                    source={require('../../resource/assets/transform.png')}
                  />
                  <Text style={styles.unit_container_text}>
                    {`按${operateActionType == 0 ? '数量' : '金额'}`}
                    {operateType === 0 ? '购买' : '出售'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
          <View style={{marginLeft: common.margin20, flexDirection: 'row'}}>
            <Image
              style={{
                width: common.w20,
                height: common.h20,
                tintColor: common.themeColor,
              }}
              source={require('../../resource/assets/order_tip.png')}
            />
            <Text
              style={{
                fontSize: common.font16,
                color: common.themeColor,
                fontWeight: 'bold',
              }}>
              单价仅供参考,非最终成交价
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              //this.operateAction();
              this.checkSmallOrder();
            }}>
            <View
              style={[
                styles.button_container,
                {backgroundColor: operateType == 0 ? '#DF4B43' : '#4DA54A'},
              ]}>
              <Text style={styles.button_text}>
                {operateType == 0 ? '购买' : '出售'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.unit_container}>
            {/* <Text style={styles.title_text}>{`交易${common.removeInvalidZero(
							small_surcharge
						)}手续费`}</Text> */}
          </View>
          {this.renderTip()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_name1: {
    fontSize: common.font14,
    color: common.themeColor,
    marginTop: common.margin12,
    paddingHorizontal: common.margin12,
  },
  item_name2: {
    fontSize: common.font16,
    color: common.themeColor,
  },
  item_line: {
    width: '50%',
    height: 2,
    backgroundColor: common.themeColor,
    borderRadius: 1,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: common.margin20,
    paddingVertical: common.margin2,
  },
  input: {
    flex: 1,
    paddingHorizontal: common.margin5,
    paddingVertical: common.margin5,
    color: common.navTitleColor,
    fontSize: common.font16,
  },
  input_line: {
    position: 'absolute',
    height: 0.5,
    width: '100%',
    backgroundColor: common.placeholderColor,
  },
  input_left_text: {
    fontSize: common.font25,
    color: common.navTitleColor,
    paddingRight: common.margin5,
  },
  title_text: {
    fontSize: common.font14,
    color: common.navTitleColor,
    paddingTop: common.margin8,
  },
  top_line: {
    backgroundColor: common.placeholderColor,
    height: 0.5,
    width: '100%',
  },
  unit_container: {
    flexDirection: 'row',
    paddingHorizontal: common.margin20,
    paddingVertical: common.margin8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unit_right_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  unit_container_image: {
    width: common.w15,
    height: common.w15,
    tintColor: common.themeColor,
    marginHorizontal: common.margin5,
  },
  unit_container_text: {
    fontSize: common.font16,
    color: common.themeColor,
  },
  button_container: {
    marginHorizontal: common.margin20,
    paddingVertical: common.margin15,
    backgroundColor: common.themeColor,
    borderRadius: common.w10,
    marginTop: common.margin15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_text: {
    fontSize: common.font16,
    color: 'white',
  },
  operate_container: {
    height: common.h28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: common.margin15,
    backgroundColor: common.placeholderColor,
    borderRadius: common.h28 / 2,
    alignSelf: 'center',
  },
  operate_text: {
    fontSize: common.font12,
    color: common.themeColor,
  },
  top_item_container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: common.margin8,
  },
  style_8: {
    flexDirection: 'row',
    paddingHorizontal: common.margin20,
    marginTop: common.margin8,
    paddingVertical: common.margin8,
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
  overlay_cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.3,
  },
  tipsContainer: {
    marginTop: common.margin15,
    color: common.navTitleColor,
    fontSize: common.font18,
  },
});

function mapStateToProps(state) {
  return {
    ...state.user,
    ...state.FiatCurrency,
    showTokensInfoDic: state.home.showTokensInfoDic,
    payTypeList: state.user.payTypeList,
    language: state.system.language,
    user: state.user.user,
    loggedInResult: state.login.data,
  };
}

export default connect(mapStateToProps)(withNavigation(FiatCurrencyFast));
