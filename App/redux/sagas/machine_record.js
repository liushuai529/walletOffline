import {call, put, takeEvery} from 'redux-saga/effects';
import * as api from '../../services/api';

function* requestRecordWorker(action) {
  const response = yield call(api.journal, action.payload);
  if (response.success) {
    yield put({
      type: 'machine_record/request_record_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine_record/request_record_failed',
      payload: response.error,
    });
  }
}

function* loadMoreRecordWorker(action) {
  const response = yield call(api.journal, action.payload);
  if (response.success) {
    yield put({
      type: 'machine_record/load_more_record_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'machine_record/load_more_record_failed',
      payload: response.error,
    });
  }
}

export function* requestRecord() {
  yield takeEvery('machine_record/request_record', requestRecordWorker);
}

export function* loadMoreRecord() {
  yield takeEvery('machine_record/load_more_record', loadMoreRecordWorker);
}
