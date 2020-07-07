import {
  call,
  put,
  takeEvery,
} from 'redux-saga/effects'
import * as api from '../../services/api'

export function* requestUpdateBankWorker(action) {
  const response = yield call(api.updateBank, action.payload)

  if (response.success) {
    yield put({
      type: 'updateBank/request_update_bank_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'updateBank/request_update_bank_failed',
      payload: response.error,
    })
  }
}

export function* requestGetCodeWorker(action) {
  const response = yield call(api.requestVerificateCode, action.payload)

  if (response.success) {
    yield put({
      type: 'updateBank/request_get_code_succeed',
      payload: response,
    })
  } else {
    yield put({
      type: 'updateBank/request_get_code_failed',
      payload: response,
    })
  }
}

export function* requestUpdateBank() {
  yield takeEvery('updateBank/request_update_bank', requestUpdateBankWorker)
}

export function* requestGetCode() {
  yield takeEvery('updateBank/request_get_code', requestGetCodeWorker)
}
