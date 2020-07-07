import {
    take, call, put,
} from 'redux-saga/effects'
import * as api from '../../services/api'

/* 获取谷歌验证信息 */
export function* getGoogleAuth() {
    while (true) {
    	const request = yield take('securityCenter/get_google_auth')
        const response = yield call(api.query, { action: "googleStatus" })
        if (response.success && response.result.googleStatus && response.result.googleStatus == "bind") {
            yield put({ type: 'securityCenter/get_google_auth_succeed', })
        } else {
            yield put({ type: 'securityCenter/get_google_auth_failed', })
        }
    }
}


