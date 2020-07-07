import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestResetCodeWorker(action) {
    const response = yield call(api.resetCode, action.payload);
    if (response.success) {
        yield put({
            type: "user/requeset_reset_code_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "user/requeset_reset_code_failed",
            payload: response.error
        });
    }
}

export function* requestResetCode() {
    yield takeEvery("user/request_reset_code", requestResetCodeWorker);
}
