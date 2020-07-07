import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestMyProductsWorker(action) {
    const response = yield call(api.myProducts, action.payload);
    if (response.success) {
        yield put({
            type: "machine/request_my_products_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "machine/request_my_products_failed",
            payload: response.error
        });
    }
}

function* loadMoreMyProductsWorker(action) {
    const response = yield call(api.myProducts, action.payload);
    if (response.success) {
        yield put({
            type: "machine/load_more_my_products_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "machine/load_more_my_products_failed",
            payload: response.error
        });
    }
}

function* requestAnnouncementWorker(action) {
    const response = yield call(api.announcement, action.payload);
    if (response.success) {
        yield put({
            type: "machine/request_announcement_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "machine/request_announcement_failed",
            payload: response.error
        });
    }
}

export function* requestMyProducts() {
    yield takeEvery("machine/request_my_products", requestMyProductsWorker);
}

export function* loadMoreMyProducts() {
    yield takeEvery("machine/load_more_my_products", loadMoreMyProductsWorker);
}

export function* requestAnnouncement() {
    yield takeEvery("machine/request_announcement", requestAnnouncementWorker);
}
