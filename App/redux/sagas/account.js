import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestAccountWorker(action) {
    const response = yield call(api.user_info, action.payload);
    if (response.success) {
        yield put({
            type: "user/requeset_account_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "user/requeset_account_failed",
            payload: response.error
        });
    }
}

export function* requestAccount() {
    yield takeEvery("user/requeset_account", requestAccountWorker);
}
