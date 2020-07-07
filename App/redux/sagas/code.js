import { call, put, takeEvery, } from 'redux-saga/effects'
import * as api from '../../services/api'

function* requesetPhoneCodeWorker(action) {
    const response = yield call(api.verificate_code, action.payload);
    if (response.success) {
        yield put({
            type: 'code/requeset_phone_code_succeed',
            payload: response.result,
        })
    } else {
        yield put({
            type: 'code/requeset_phone_code_failed',
            payload: response.error,
        })
    }
}

export function* requesetPhoneCode() {
    yield takeEvery('code/requeset_phone_code', requesetPhoneCodeWorker)
}