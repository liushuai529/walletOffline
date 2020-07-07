import {
  call,
  put,
  takeEvery,
} from 'redux-saga/effects'
import * as api from '../../services/api'

export function* requestUpdateAlipayWorker(action) {
  const response = yield call(api.updateAlipay, action.payload)

  if (response.success) {
    yield put({
      type: 'updateAlipay/request_update_alipay_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'updateAlipay/request_update_alipay_failed',
      payload: response.error,
    })
  }
}

export function* requestGetCodeWorker(action) {
  const response = yield call(api.requestVerificateCode, action.payload)

  if (response.success) {
    yield put({
      type: 'updateAlipay/request_get_code_succeed',
      payload: response,
    })
  } else {
    yield put({
      type: 'updateAlipay/request_get_code_failed',
      payload: response,
    })
  }
}

export function* requestUpdateAlipay() {
  yield takeEvery('updateAlipay/request_update_alipay', requestUpdateAlipayWorker)
}

export function* requestGetCode() {
  yield takeEvery('updateAlipay/request_get_code', requestGetCodeWorker)
}
