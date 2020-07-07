import {call, put, takeEvery} from 'redux-saga/effects';
import * as api from '../../services/api';

function* requestRecordWorker(action) {
  const response = yield call(api.welfarestat, action.payload);
  if (response.success) {
    yield put({
      type: 'profit_welfarestat/request_record_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'profit_welfarestat/request_record_failed',
      payload: response.error,
    });
  }
}

function* loadMoreRecordWorker(action) {
  const response = yield call(api.welfarestat, action.payload);
  if (response.success) {
    yield put({
      type: 'profit_welfarestat/load_more_record_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'profit_welfarestat/load_more_record_failed',
      payload: response.error,
    });
  }
}

export function* requestRecord() {
  yield takeEvery('profit_welfarestat/request_record', requestRecordWorker);
}

export function* loadMoreRecord() {
  yield takeEvery('profit_welfarestat/load_more_record', loadMoreRecordWorker);
}
