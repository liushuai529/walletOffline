import {call, put, takeEvery} from 'redux-saga/effects';
import * as api from '../../services/api';

function* requestAllProductsWorker(action) {
  const response = yield call(api.allProducts, action.payload);
  if (response.success) {
    yield put({
      type: 'machine/request_all_products_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine/request_all_products_failed',
      payload: response.error,
    });
  }
}

function* requestTotalProductsWorker(action) {
  const response = yield call(api.allProducts, action.payload);
  if (response.success) {
    yield put({
      type: 'machine/request_total_products_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine/request_total_products_failed',
      payload: response.error,
    });
  }
}

function* requestBuyProductWorker(action) {
  const response = yield call(api.buyProduct, action.payload);
  if (response.success) {
    yield put({
      type: 'machine/request_buy_product_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine/request_buy_product_failed',
      payload: response.error,
    });
  }
}

function* requestEstimateWorker(action) {
  const response = yield call(api.estimate, action.payload);
  if (response.success) {
    yield put({
      type: 'machine/request_estimate_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine/request_estimate_failed',
      payload: response.error,
    });
  }
}

export function* requestAllProducts() {
  yield takeEvery('machine/request_all_products', requestAllProductsWorker);
}

export function* requestTotalProducts() {
  yield takeEvery('machine/request_total_products', requestTotalProductsWorker);
}

export function* requestBuyProduct() {
  yield takeEvery('machine/request_buy_product', requestBuyProductWorker);
}

export function* requestEstimate() {
  yield takeEvery('machine/request_estimate', requestEstimateWorker);
}
