export function updateForm(payload) {
  return {
    type: 'fiat_currency/update_form',
    payload,
  };
}

export function clearForm() {
  return {
    type: 'fiat_currency/clear_form',
  };
}

export function clearAlertForm() {
  return {
    type: 'fiat_currency/clear_alert_form',
  };
}

export function initAlertPayType(payload) {
  return {
    type: 'fiat_currency/init_alert_pay_type',
    payload,
  };
}

export function setOrderInfo(payload) {
  return {
    type: 'fiat_currency/set_order_info',
    payload,
  };
}

export function requestLegalMarketTokens(payload) {
  return {
    type: 'fiat_currency/request_legal_market_tokens',
    payload,
  };
}

export function requestLegalMarketHandicap(payload, requestType) {
  return {
    type: 'fiat_currency/request_legal_market_handicap',
    payload,
    requestType,
  };
}

export function requestLegalMarketDeal(payload) {
  return {
    type: 'fiat_currency/request_legal_market_deal',
    payload,
  };
}

export function requestDealWith(payload) {
  return {
    type: 'fiat_currency/request_deal_with',
    payload,
  };
}

export function requestStat(payload) {
  return {
    type: 'fiat_currency/request_stat',
    payload,
  };
}

export function requestSellStat(payload) {
  return {
    type: 'fiat_currency/request_sell_stat',
    payload,
  };
}
