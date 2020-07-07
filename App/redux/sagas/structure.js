import { call, put, takeEvery, } from 'redux-saga/effects'
import * as api from '../../services/api'

const data = {

}

function* requestStructureWorker(action) {
  const response = yield call(api.getStructure, action.payload);
  if (response.success) {
    yield put({
      type: 'user/requeset_structure_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'user/requeset_structure_failed',
      payload: response.result,
    })
  }
}

function* requestOneStructureWorker(action) {
  const response = yield call(api.getOneStructure, action.payload);
  if (response.success) {
    yield put({
      type: 'user/requeset_oneStructure_succeed',
      payload: response.result,
    })
  } else {
    yield put({
      type: 'user/requeset_oneStructure_failed',
      payload: response.result,
    })
  }
}

export function* requestStructure() {
    yield takeEvery('user/requeset_structure', requestStructureWorker)
}

export function* requestOneStructure() {
  yield takeEvery('user/requeset_oneStructure', requestOneStructureWorker)
}