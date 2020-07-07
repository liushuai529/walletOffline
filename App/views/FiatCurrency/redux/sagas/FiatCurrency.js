import { call, put, takeEvery } from 'redux-saga/effects';
import * as api from '../../../../services/api';

// 获取交易币种
function* requestLegalMarketTokensWorker(action) {
  const response = yield call(api.legalMarket, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_legal_market_tokens_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_legal_market_tokens_failed',
      payload: response.error,
    });
  }
}

export function* requestLegalMarketTokens() {
  yield takeEvery('fiat_currency/request_legal_market_tokens', requestLegalMarketTokensWorker);
}

// 获取交易盘口列表
function* requestLegalMarketHandicapWorker(action) {
  const response = yield call(api.legalMarket, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_legal_market_handicap_succeed',
      payload: response.result,
      requestType: action.requestType,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_legal_market_handicap_failed',
      payload: response.error,
      requestType: action.requestType,
    });
  }
}

export function* requestLegalMarketHandicap() {
  yield takeEvery('fiat_currency/request_legal_market_handicap', requestLegalMarketHandicapWorker);
}

// 获取交易记录
function* requestLegalMarketDealWorker(action) {
  const response = yield call(api.legalMarket, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_legal_market_deal_succeed',
      payload: response.result,
      requestType: action.requestType,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_legal_market_deal_failed',
      payload: response.error,
      requestType: action.requestType,
    });
  }
}

export function* requestLegalMarketDeal() {
  yield takeEvery('fiat_currency/request_legal_market_deal', requestLegalMarketDealWorker);
}

// 下单
function* requestDealWithWorker(action) {
  const response = yield call(api.dealWith, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_deal_with_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_deal_with_failed',
      payload: response.error,
    });
  }
}

export function* requestDealWith() {
  yield takeEvery('fiat_currency/request_deal_with', requestDealWithWorker);
}

// 最后一次成交价
function* requestStatWorker(action) {
  const response = yield call(api.legalMarket, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_stat_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_stat_failed',
      payload: response.error,
    });
  }
}

export function* requestStat() {
  yield takeEvery('fiat_currency/request_stat', requestStatWorker);
}

// 最后一次成交价
function* requestSellStatWorker(action) {
  const response = yield call(api.legalMarket, action.payload);
  if (response.success) {
    yield put({
      type: 'fiat_currency/request_sell_stat_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'fiat_currency/request_sell_stat_failed',
      payload: response.error,
    });
  }
}

export function* requestSellStat() {
  yield takeEvery('fiat_currency/request_sell_stat', requestSellStatWorker);
}
