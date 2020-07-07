import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestRegisterWorker(action) {
    const response = yield call(api.register, action.payload);
    if (response.success) {
        yield put({
            type: "user/requeset_register_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "user/requeset_register_failed",
            payload: response.error
        });
    }
}

export function* requestRegister() {
    yield takeEvery("user/requeset_register", requestRegisterWorker);
}
