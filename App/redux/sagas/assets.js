import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestRecordWorker(action) {
    const response = yield call(api.graphql, action.payload);
    if (response.success) {
        yield put({
            type: "assets/request_record_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "assets/request_record_failed",
            payload: response.error
        });
    }
}

function* loadMoreRecordWorker(action) {
    const response = yield call(api.graphql, action.payload);
    if (response.success) {
        yield put({
            type: "assets/load_more_record_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "assets/load_more_record_failed",
            payload: response.error
        });
    }
}

function* requestWithdrawWorker(action) {
    const response = yield call(api.withdraw, action.payload);
    if (response.success) {
        yield put({
            type: "assets/request_withdraw_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "assets/request_withdraw_failed",
            payload: response.error
        });
    }
}

function* requestExchangeRateWorker(action) {
    const response = yield call(api.exchangeRate, action.payload);
    if (response.success) {
        yield put({
            type: "assets/request_exchange_rate_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "assets/request_exchange_rate_failed",
            payload: response.error
        });
    }
}

function* requestExchangeWorker(action) {
    const response = yield call(api.exchange, action.payload);
    if (response.success) {
        yield put({
            type: "assets/request_exchange_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "assets/request_exchange_failed",
            payload: response.error
        });
    }
}



export function* requestRecord() {
    yield takeEvery("assets/request_record", requestRecordWorker);
}

export function* loadMoreRecord() {
    yield takeEvery("assets/load_more_record", loadMoreRecordWorker);
}

export function* requestWithdraw() {
    yield takeEvery("assets/request_withdraw", requestWithdrawWorker);
}

export function* requestExchangeRate() {
    yield takeEvery("assets/request_exchange_rate", requestExchangeRateWorker);
}

export function* requestExchange() {
    yield takeEvery("assets/request_exchange", requestExchangeWorker);
}


