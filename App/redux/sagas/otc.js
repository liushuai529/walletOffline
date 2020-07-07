import { call, put, takeEvery } from 'redux-saga/effects';
import * as api from '../../services/api';

export function* submitRequestWorker(action) {
  const { payload } = action;
  try {
    yield call(api.sync);
  } catch (error) {}
  const response = yield call(api.legalDealCreate, {
    direct: payload.type,
    quantity: payload.quantity,
    payType: payload.payType,
  });

  if (response.success) {
    yield put({
      type: 'otc/submit_request_succeed',
      payload: response,
    });
  } else {
    yield put({
      type: 'otc/submit_request_failed',
      payload: response,
    });
  }
}

export function* requestPayTypeListWorker() {
  try {
    yield call(api.sync);
  } catch (error) {}
  const response = yield call(api.queryPayTypeList, {});

  if (response.success) {
    yield put({
      type: 'otc/request_paytypelist_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'otc/request_paytypelist_failed',
      payload: response,
    });
  }
}

export function* submitRequest() {
  yield takeEvery('otc/submit_request', submitRequestWorker);
}

export function* requestPayTypeList() {
  yield takeEvery('otc/request_paytypelist', requestPayTypeListWorker);
}

function* requestLegalConfigWorker(action) {
  const response = yield call(api.getLegalConfig, action.payload);
  if (response.success) {
    yield put({
      type: 'otc/request_legal_config_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'otc/request_legal_config_failed',
      payload: response.error,
    });
  }
}

export function* requestLegalConfig() {
  yield takeEvery('otc/request_legal_config', requestLegalConfigWorker);
}
