import { take, call, put, takeEvery, select } from 'redux-saga/effects';
import { DeviceEventEmitter, Platform } from 'react-native';
import { common, storeSave } from '../../constants/common';
import * as constants from '../../constants/index';
import * as api from '../../services/api';
import {version} from '../../../app.json';

const VERSION_INFO = Platform.select({
  ios: `app-ios-${version}`,
  android: `app-android-${version}`,
});

function* requesetUserAssetsWorker(action) {
  const response = yield call(api.getValuation, action.payload);
  if (response.success) {
    yield put({
      type: 'user/requeset_user_assets_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'user/requeset_user_assets_failed',
      payload: response.error,
    });
  }
}

function* requesetUserAddressWorker(action) {
  const response = yield call(api.createAddress, action.payload);
  if (response.success) {
    yield put({
      type: 'user/requeset_user_address_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'user/requeset_user_address_failed',
      payload: response.error,
    });
  }
}

export function* requesetUserAssets() {
  yield takeEvery('user/requeset_user_assets', requesetUserAssetsWorker);
}

export function* requesetUserAddress() {
  yield takeEvery('user/requeset_user_address', requesetUserAddressWorker);
}

export function* sync() {
  try {
    const param = {client: VERSION_INFO};
    const response = yield call(api.sync, param);
    if (response.success && response.result.id > 0) {
			DeviceEventEmitter.emit(common.noti.userChanged, response.result);
      yield put({
        type: 'authorize/sync_request_succeed',
        payload: response.result,
      });
    } else if (response.success) {
      yield put({
        type: 'authorize/sync_request_finished',
        payload: response.result,
      });
    } else {
      if(response.error.code === '4000139') DeviceEventEmitter.emit(common.noti.syncFaildAndLoginOut)
      yield put({
        type: 'authorize/sync_request_failed',
        payload: response.error,
      });
    }
  } catch (error) {
    //DeviceEventEmitter.emit(common.noti.syncFaildAndLoginOut)
    yield put({type: 'authorize/sync_request_failed', payload: error});
  }
}

export function* syncWatcher() {
  yield takeEvery('authorize/sync_request', sync);
}

export function* queryConfigUserSettingsWorker(action) {
  const response = yield call(api.userSettings, action.payload);
  if (response.success) {
    yield put({
      type: 'user/request_query_config_user_settings_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'user/request_query_config_user_settings_failed',
      payload: response.error,
    });
  }
}

export function* queryConfigUserSettings() {
  yield takeEvery(
    'user/request_query_config_user_settings',
    queryConfigUserSettingsWorker,
  );
}

export function* queryConfigUserSettings_profitWorker(action) {
  const response = yield call(api.userSettings, action.payload);
  if (response.success) {
    yield put({
      type: 'user/request_query_config_user_settings_profit_succeed',
      payload: response.result,
    });
  } else {
    yield put({
      type: 'user/request_query_config_user_settings_profit_failed',
      payload: response.error,
    });
  }
}

export function* queryConfigUserSettings_profit() {
  yield takeEvery(
    'user/request_query_config_user_settings_profit',
    queryConfigUserSettings_profitWorker,
  );
}

/* 获取谷歌验证信息 */
export function* getGoogleAuth() {
  while (true) {
    const request = yield take(constants.GET_GOOGLE_AUTH_REQUEST);
    const response = yield call(api.query, {action: 'googleStatus'});
    if (
      response.success &&
      response.result.googleStatus &&
      response.result.googleStatus == 'bind'
    ) {
      storeSave(common.noti.googleAuth, true, e => {});
      yield put({type: constants.GET_GOOGLE_AUTH_SUCCEED});
    } else {
      storeSave(common.noti.googleAuth, false, e => {});
      yield put({type: constants.GET_GOOGLE_AUTH_FAILED});
    }
    DeviceEventEmitter.emit(common.noti.googleAuth);
  }
}

/* 获取验证码 */
export function* getVerificateCode() {
  while (true) {
    const request = yield take(constants.GET_VERIFICATE_CODE_REQUEST);
    const response = yield call(api.requestVerificateCode, request.data);
    if (response.success)
      yield put({type: constants.GET_VERIFICATE_CODE_SUCCEED, response});
    else yield put({type: constants.GET_VERIFICATE_CODE_FAILED, response});
  }
}

/* 获取单个用户的信息 */
export function* findUser() {
  while (true) {
    const request = yield take(constants.FIND_USER_REQUEST);
    const response = yield call(api.graphql, request.schema);
    if (response.success && response.result && response.result.data) {
      const user = response.result.data.user;
      storeSave(common.user.string, user);
      yield put({type: constants.FIND_USER_SUCCEED, user});
    }
  }
}
/* 提交身份认证审核 */
export function* idCardAuth() {
  while (true) {
    const request = yield take(constants.ID_CARD_AUTH_REQUEST);
    const response = yield call(api.idCardAuth, request.data);
    if (response.success) {
      yield put({type: constants.ID_CARD_AUTH_SUCCEED, response});
      DeviceEventEmitter.emit('idCardAuth');
    } else {
      yield put({type: constants.ID_CARD_AUTH_FAILED, response});
    }
  }
}

export function* findAuditmanage() {
  while (true) {
    const request = yield take(constants.FIND_AUDIT_MANAGE);
    const response = yield call(api.graphql, request.data);
    if (response.success) {
      yield put({
        type: constants.FIND_AUDIT_MANAGE_SUCCEED,
        data: response.result.data.find_auditmanage,
      });
    } else {
      yield put({type: constants.FIND_AUDIT_MANAGE_FAILED, data: undefined});
    }
  }
}

/* 检测手机号是否已被注册 */
export function* mobileIsExist() {
  while (true) {
    const request = yield take('user/mobile_isExist_requesting');
    const response = yield call(api.isExist, request.data);
    if (response.success) {
      yield put({
        type: 'user/mobile_isExist_result',
        data: response.result === 1,
      });
    } else {
      yield put({
        type: 'user/mobile_isExist_result',
        data: false,
      });
    }
  }
}

/* 用户绑定邮箱 */
export function* updateEmail() {
  while (true) {
    const request = yield take(constants.UPDATE_EMAIL_REQUEST);
    const response = yield call(api.updateEmail, request.data);
    if (response.success) {
      yield put({ type: constants.UPDATE_EMAIL_SUCCEED, payload: response.result });
    } else {
      yield put({ type: constants.UPDATE_EMAIL_FAILED, payload: response.error });
    }
  }
}

export function* updateMobile() {
  while (true) {
    const request = yield take('me/update_mobile_request');
    const response = yield call(api.updateMobile, request.data);
    if (response.success) {
      yield put({ type: 'me/update_mobile_success', payload: response.result });
    } else {
      yield put({ type: 'me/update_mobile_failed', payload: response.error });
    }
  }
}
