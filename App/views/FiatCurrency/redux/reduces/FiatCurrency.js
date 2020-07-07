import { Toast } from 'teaset';
import Toast2 from 'antd-mobile/lib/toast';

const initialState = {
  form: {
    // 快捷区/自选区
    selectType: 1,
    // 买/卖
    operateType: 0,
    // 选中币种
    selectCurrency: 0,
    // 快捷操作支付方式
    buyFastPayType: 0,
    // 购买金额
    buyMoney: '',
    // 单价
    univalent: '',
    // 卖出单价
    sell_univalent: '',
    // 按金额/按数量
    operateActionType: 0,
    // 弹框的购买金额
    buyAlertMoney: 0,
    // 购买类型
    buyAlertType: 0,
    // 下单支付类型
    buyAlertPayType: 0,
    // 选中市场币种
    selectMarketCurrency: 0,
    //卖单手续费比例
    sellFeeRadio: 0,
  },
  showBuySuccess1: false,
  showBuySuccess2: false,
  operateOrde: undefined,
  buyOrderId: undefined,
  orderInfo: undefined,
  // 币种列表
  currencyList: [],
  lastData: [],
  requestLimit: 10,
  handicapPage: 0,
  isLoadingHandicap: false,
  isLoadingMoreHandicap: false,
  handicapList: [],
  hasNextHandicap: false,
  reloadHandicapAction: false,
};

const errorMsg = {
  4001461: '您的法币交易已被冻结，如有疑问，请咨询客服',
  4001462: '您的法币交易已被冻结，如有疑问，请咨询客服',
  4001463: 'token不存在',
  4001464: '参数不被允许',
  4001465: 'total_money错误',
  4001466: '系统未提供可交易的商家,请重新输入',
  4001468: '还没有实名认证',
  4001469: '还没有绑定银行卡',
  4001470: '您尚有一笔订单未完成，请先完成后再继续交易',
  4001485: '余额不足',
  4001487: '订单创建失败',
  4001471: '系统未提供可交易的商家,请重新输入',
  4001472: '系统未提供可交易的商家,请重新输入'
};

export default function FiatCurrency(state = initialState, action) {
  const { type, payload, requestType } = action;
  let nextState = state;
  nextState.reloadHandicapAction = false;
  nextState.showBuySuccess1 = false;
  nextState.showBuySuccess2 = false;

  switch (type) {
    case 'fiat_currency/update_form':
      nextState = {
        ...state,
        form: {
          ...state.form,
          buyAlertMoney: payload.buyAlertType != undefined ? 0 : state.form.buyAlertMoney,
          buyMoney:
            payload.operateActionType != undefined ||
              payload.selectCurrency != undefined ||
              payload.operateType != undefined
              ? ''
              : state.form.buyMoney,
          ...payload,
        },
        handicapList:
          payload.operateType != undefined || payload.selectMarketCurrency != undefined
            ? []
            : state.handicapList,
        reloadHandicapAction:
          payload.operateType != undefined || payload.selectMarketCurrency != undefined,
      };
      break;
    case 'fiat_currency/clear_form':
      nextState = {
        ...state,
        form: initialState.form,
      };
      break;
    case 'fiat_currency/init_alert_pay_type':
      nextState = {
        ...state,
        form: {
          ...state.form,
          ...payload,
        },
      };
      break;
    case 'fiat_currency/clear_alert_form':
      nextState = {
        ...state,
        form: {
          ...state.form,
          buyAlertMoney: 0,
          buyAlertType: 0,
          buyAlertPayType: 0,
        },
      };
      break;
    case 'fiat_currency/set_order_info':
      nextState = {
        ...state,
        operateOrde: payload,
      };
      break;
    case 'fiat_currency/request_legal_market_tokens_succeed':
      nextState = {
        ...state,
        currencyList: payload,
      };
      break;
    case 'fiat_currency/request_legal_market_handicap':
      nextState = {
        ...state,
        isLoadingHandicap: requestType == 'reload',
        handicapPage: requestType == 'more' ? nextState.handicapPage : 0,
        isLoadingMoreHandicap: requestType == 'more',
      };
      break;
    case 'fiat_currency/request_legal_market_handicap_succeed':
      let array = [];
      // 防止切换过快，请求返回慢导致的数据不一致问题
      const { currencyList } = state;
      const { operateType, selectMarketCurrency } = state.form;
      if (selectMarketCurrency < currencyList.length) {
        const currency = currencyList[selectMarketCurrency];
        let direct = operateType == 1 ? 'buy' : 'sell';
        let token_id = currency.token_id;
        payload.forEach(item => {
          if (item.direct == direct && item.token_id == token_id) {
            array.push(item);
          }
        });
      }
      if (operateType == 0 && requestType == 'first') {
        if (array.length == 0) Toast2.show('暂无商家', 2);
      }
      nextState = {
        ...state,
        isLoadingHandicap: false,
        isLoadingMoreHandicap: false,
        handicapList: requestType == 'more' ? state.handicapList.concat(array) : array,
        lastData: payload,
        handicapPage: state.handicapPage + 1,
        hasNextHandicap: payload.length >= state.requestLimit,
      };
      break;
    case 'fiat_currency/request_legal_market_handicap_failed':
      nextState = {
        ...state,
        isLoadingHandicap: false,
        isLoadingMoreHandicap: false,
      };
      break;

    case 'fiat_currency/request_legal_market_deal_succeed':
      nextState = {
        ...state,
        orderInfo: payload,
      };
      break;
    case 'fiat_currency/request_legal_market_deal_failed':
      nextState = {
        ...state,
      };
      break;

    case 'fiat_currency/request_deal_with_succeed':
      Toast.success('操作成功');
      nextState = {
        ...state,
        showBuySuccess1: true,
        showBuySuccess2: true,
        buyOrderId: payload,
      };
      break;
    case 'fiat_currency/request_deal_with_failed':
      let msg =
        errorMsg && errorMsg[payload.code]
          ? errorMsg[payload.code]
          : payload.message && payload.message !== 'Network request failed'
            ? payload.message
            : transfer(undefined, 'request_error');
      Toast.fail(msg);
      nextState = {
        ...state,
      };
      break;
    case 'fiat_currency/request_stat_succeed':
      nextState = {
        ...state,
        form: {
          ...state.form,
          univalent: payload.lastprice,
        },
      };
      break;
    case 'fiat_currency/request_stat_failed':
      nextState = {
        ...state,
      };
      break;
    case 'fiat_currency/request_sell_stat_succeed':
      nextState = {
        ...state,
        form: {
          ...state.form,
          sell_univalent: payload.lastprice,
        },
      };
      break;
  }
  return nextState;
}
