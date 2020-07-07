import {call, put, takeEvery} from 'redux-saga/effects';
import * as api from '../../services/api';
import {common} from '../../constants/common';

function* requestShowPairsWorker() {
  const response = yield call(api.getToken, {pairs_type: 'show'});
  if (response.success) {
    yield put({
      type: 'home/request_show_pair_success',
      payload: {
        requestShowRawPair: response.result,
        requestShowPair: common.parseConfig(response.result),
      },
    });
  } else {
    yield put({
      type: 'home/request_show_pair_failed',
      payload: undefined,
    });
  }
}

function* requestVideoHistoryWorker() {
  const response = yield call(api.getVideoList);
  if (response.success) {
    yield put({
      type: 'home/request_video_history_success',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'home/request_video_history_failed',
      payload: response.error,
    });
  }
}

export function* requestShowPairs() {
  yield takeEvery('home/request_show_pair_request', requestShowPairsWorker);
}

export function* requestVideoHistory() {
  yield takeEvery('home/request_video_history', requestVideoHistoryWorker);
}

