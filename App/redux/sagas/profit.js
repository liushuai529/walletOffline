import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestProfitListWorker(action) {
    const response = yield call(api.profit, action.payload);
    if (response.success) {
        yield put({
            type: "profit/request_profit_list_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "profit/request_profit_list_failed",
            payload: response.error
        });
    }
}

function* requestFiveProfitListWorker(action) {
    const response = yield call(api.profit, action.payload);
    if (response.success) {
        yield put({
            type: "profit/request_five_profit_list_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "profit/request_five_profit_list_failed",
            payload: response.error
        });
    }
}

function* loadMoreProfitListWorker(action) {
    const response = yield call(api.profit, action.payload);
    if (response.success) {
        yield put({
            type: "profit/load_more_profit_list_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "profit/load_more_profit_list_failed",
            payload: response.error
        });
    }
}

function* requestRunIndexWorker(action) {
    const response = yield call(api.runIndex, action.payload);
    if (response.success) {
        yield put({
            type: "profit/request_run_index_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "profit/request_run_index_failed",
            payload: response.error
        });
    }
}

function* requestYesterdayProfitWorker(action) {
    const response = yield call(api.profit, action.payload);
    if (response.success) {
        yield put({
            type: "profit/request_yesterday_profit_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "profit/request_yesterday_profit_failed",
            payload: response.error
        });
    }
}

function* takeYesterdayProfitWorker() {
  const response = yield call(api.takeProfit);
  console.warn('respon', response)
  if (response.success) {
      yield put({
          type: "profit/take_yesterday_profit_succeed",
          payload: response.result
      });
  } else {
      yield put({
          type: "profit/take_yesterday_profit_failed",
          payload: response.error
      });
  }
}

export function* requestProfitList() {
    yield takeEvery("profit/request_profit_list", requestProfitListWorker);
}

export function* requestFiveProfitList() {
    yield takeEvery("profit/request_five_profit_list", requestFiveProfitListWorker);
}

export function* loadMoreProfitList() {
    yield takeEvery("profit/load_more_profit_list", loadMoreProfitListWorker);
}

export function* requestRunIndex() {
    yield takeEvery("profit/request_run_index", requestRunIndexWorker);
}

export function* requestYesterdayProfit() {
    yield takeEvery("profit/request_yesterday_profit", requestYesterdayProfitWorker);
}

export function* takeYesterdayProfit() {
  yield takeEvery("profit/take_yesterday_profit", takeYesterdayProfitWorker);
}
