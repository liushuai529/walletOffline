import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects'
import * as api from '../../services/api'

export function* requestOtcListWorker(action) {
  const { payload } = action
  const response = yield call(api.legalMarket, payload)

  if (response.success) {
    const page = yield select(state => state.otcDetail.otcListPage)
    if (page === 0) {
      yield put({
        type: 'otcDetail/request_otc_list_succeed',
        payload: response.result,
      })
    } else {
      const otcList = yield select(state => state.otcDetail.otcList)
      const newOtcList = otcList.concat(response.result)
      yield put({
        type: 'otcDetail/request_otc_list_succeed',
        payload: newOtcList,
      })
    }
  } else {
    yield put({
      type: 'otcDetail/request_otc_list_failed',
      payload: response.error,
    })
  }
}

export function* requestGetCodeWorker(action) {
  const { payload } = action
  const response = yield call(api.requestVerificateCode, payload)

  if (response.success) {
    yield put({
      type: 'otcDetail/request_get_code_succeed',
      payload: response,
    })
  } else {
    yield put({
      type: 'otcDetail/request_get_code_failed',
      payload: response,
    })
  }
}

export function* requestConfirmPayWorker(action) {
  const { payload } = action
  try {
    yield call(api.sync)
  } catch (error) {}
  const response = yield call(api.confirmPay, payload)

  if (response.success) {
    yield put({
      type: 'otcDetail/request_confirm_pay_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'otcDetail/request_confirm_pay_failed',
      payload: response.error,
    })
  }
}

export function* requestHavedPayWorker(action) {
  const { payload } = action
  try {
    yield call(api.sync)
  } catch (error) {}
  const response = yield call(api.havedPay, payload)

  if (response.success) {
    yield put({
      type: 'otcDetail/request_haved_pay_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'otcDetail/request_haved_pay_failed',
      payload: response.error,
    })
  }
}

export function* requestCancelWorker(action) {
  const { payload } = action
  try {
    yield call(api.sync)
  } catch (error) {}
  const response = yield call(api.legalDealCancel, payload)

  if (response.success) {
    yield put({
      type: 'otcDetail/request_cancel_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'otcDetail/request_cancel_failed',
      payload: response.error,
    })
  }
}

export function* requestAllegeWorker(action) {
  const { payload } = action
  try {
    yield call(api.sync)
  } catch (error) {}
  const response = yield call(api.createAllege, payload)

  if (response.success) {
    yield put({
      type: 'otcDetail/request_allege_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'otcDetail/request_allege_failed',
      payload: response.error,
    })
  }
}

export function* requestOtcList() {
  yield takeEvery('otcDetail/request_otc_list', requestOtcListWorker)
}

export function* requestGetCode() {
  yield takeEvery('otcDetail/request_get_code', requestGetCodeWorker)
}

export function* requestConfirmPay() {
  yield takeLatest('otcDetail/request_confirm_pay', requestConfirmPayWorker)
}

export function* requestHavedPay() {
  yield takeEvery('otcDetail/request_haved_pay', requestHavedPayWorker)
}

export function* requestCancel() {
  yield takeEvery('otcDetail/request_cancel', requestCancelWorker)
}

export function* requestAllege() {
  yield takeEvery('otcDetail/request_allege', requestAllegeWorker)
}
