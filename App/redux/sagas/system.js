import {call, put, takeEvery} from 'redux-saga/effects';
import * as api from '../../services/api';

function* fetchConfigWorker(action) {
  const response = yield call(api.getRevenueConfig, action.payload);
  if (response.success) {
    yield put({
      type: 'system/fetch_config_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'system/fetch_config_failed',
      payload: response.error,
    });
  }
}

export function* fetchConfig() {
  yield takeEvery('system/fetch_config', fetchConfigWorker);
}
