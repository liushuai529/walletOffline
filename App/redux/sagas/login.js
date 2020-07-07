import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import { USER_LOGIN_INFO_KEY } from "../../constants/constant";

getData = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {}
};

function* requestCheckLoginWorker(action) {
    const response = yield call(api.login, action.payload);
    if (response.success) {
        yield put({
            type: "login/request_check_login_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "login/request_check_login_failed",
            payload: response.error
        });
    }
}

function* requesetAutoLoginWorker(action) {
    const response = yield call(getData, USER_LOGIN_INFO_KEY);
    if (response) {
        yield put({
            type: "login/requeset_autologin_succeed",
            payload: JSON.parse(response)
        });
    } else {
        yield put({
            type: "login/requeset_autologin_failed",
            payload: null
        });
    }
}

function* requesetLoginOutWorker(action) {
    const response = yield call(api.logout, action.payload);
    if (response.success) {
        yield put({
            type: "login/requeset_logout_succeed",
            payload: response.result
        });
    } else {
        yield put({
            type: "login/requeset_logout_failed",
            payload: response.error
        });
    }
}

export function* requestCheckLogin() {
    yield takeEvery("login/request_check_login", requestCheckLoginWorker);
}

export function* requesetAutoLogin() {
    yield takeEvery("login/requeset_autologin", requesetAutoLoginWorker);
}

export function* requesetLoginOut() {
    yield takeEvery("login/requeset_logout", requesetLoginOutWorker);
}
