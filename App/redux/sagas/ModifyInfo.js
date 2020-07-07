import { call, put, takeEvery, } from 'redux-saga/effects'
import * as api from '../../services/api'

function* requestModifyInfoWorker(action) {
    const response = yield call(api.modifyInfo, action.payload);
    if (response.success) {
        
        yield put({
            type: 'user/requeset_modify_info_succeed',
            payload: response.result,
        })
    } else {
        yield put({
            type: 'user/requeset_modify_info_failed',
            payload: response.error,
        })
    }
}
export function* requestModifyInfo() {
    yield takeEvery('user/requeset_modify_info', requestModifyInfoWorker)
}