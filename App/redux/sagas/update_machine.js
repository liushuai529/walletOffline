import { call, put, takeEvery } from "redux-saga/effects";
import * as api from "../../services/api";

function* requestAllMyProductsWorker(action) {
	const response = yield call(api.myProducts, action.payload);
	if (response.success) {
		yield put({
			type: "machine/request_all_my_products_succeed",
			payload: response.result
		});
	} else {
		yield put({
			type: "machine/request_all_my_products_failed",
			payload: response.error
		});
	}
}

function* requestUpdateProductsWorker(action) {
	const response = yield call(api.allProducts, action.payload);
	if (response.success) {
		yield put({
			type: "machine/request_update_products_succeed",
			payload: response.result
		});
	} else {
		yield put({
			type: "machine/request_update_products_failed",
			payload: response.error
		});
	}
}

function* updateProductWorker(action) {
	const response = yield call(api.upgrade, action.payload);
	if (response.success) {
		yield put({
			type: "machine/update_product_succeed",
			payload: response.result
		});
	} else {
		yield put({
			type: "machine/update_product_failed",
			payload: response.error
		});
	}
}

export function* requestAllMyProducts() {
	yield takeEvery("machine/request_all_my_products", requestAllMyProductsWorker);
}

export function* requestUpdateProducts() {
	yield takeEvery("machine/request_update_products", requestUpdateProductsWorker);
}

export function* updateProduct() {
	yield takeEvery("machine/update_product", updateProductWorker);
}
