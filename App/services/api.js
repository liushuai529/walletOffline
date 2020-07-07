import {DeviceEventEmitter} from "react-native";
import {USER_LOGIN_INVALID_KEY} from "../constants/constant";

let apiType = "";

let API_ROOT = "https://www.gbc.tv";

switch (apiType) {
	case "188":
		{
			API_ROOT = "http://192.168.0.188:8080";
		}
		break;
	case "47":
		{
			API_ROOT = "http://47.56.187.47:8080";
		}
		break;
	case "23":
		{
			API_ROOT = "http://192.168.0.23:8080";
		}
		break;
	default:
		break;
}
let rebatesLink = `${API_ROOT}/signup?invitation=`;

export {API_ROOT, rebatesLink};



function makeGetAPI(endPoint) {
	return params =>
		fetch(endPoint, {
			credentials: "same-origin",
			headers: {}
		})
			.then(response => response.json())
			.then(json => ({
				success: true,
				result: json
			}))
			.catch(e => ({
				success: false,
				error: e
			}));
}

function makeGetAPI_param(endpoint) {
	return params =>
		fetch(`${API_ROOT}${endpoint}${params ? "?" + params : ""}`, {
			credentials: "same-origin",
			headers: {}
		})
			.then(response => response.json())
			.then(json => ({
				success: true,
				result: json
			}))
			.catch(e => ({
				success: false,
				error: e
			}));
}

function makePostAPI(endpoint) {
	return params =>
		fetch(`${API_ROOT}${endpoint}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(params || {}),
			credentials: "same-origin"
		})
			.then(response => response.json().then(json => ({json, response})))
			.then(({json, response}) => {
				if (!response.ok) {
					return Promise.reject(json);
				}
				if (json.code == 401) {
					// token失效
					DeviceEventEmitter.emit(USER_LOGIN_INVALID_KEY);
				}
				return json;
			})
			.then(
				result => ({
					success: true,
					result
				}),
				error => ({
					success: false,
					error
				})
			);
}

function makePostVideoAPI(api) {
  return params =>
    fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params || {}),
      credentials: 'same-origin',
    })
      .then(response => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        result => ({
          success: true,
          result,
        }),
        error => ({
          success: false,
          error,
        })
      );
}

function graphqlAPI(endpoint) {
	return schema =>
		fetch(`${API_ROOT}${endpoint}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/graphql"
			},
			body: schema,
			credentials: "same-origin"
		})
			.then(response => response.json().then(json => ({json, response})))
			.then(({json, response}) => {
				if (!response.ok) {
					return Promise.reject(json);
				}
				return json;
			})
			.then(
				result => ({
					success: true,
					result
				}),
				error => ({
					success: false,
					error
				})
			);
}

export let imgHashApi = `${API_ROOT}/1.0/fileProc/`;

export const getAPI = uri => makeGetAPI(uri);

export const login = makePostAPI("/1.0/app/user/login");
export const logout = makePostAPI("/1.0/app/user/logout");
export const myProducts = makePostAPI("/1.0/app/ustore/query");
export const allProducts = makePostAPI("/1.0/app/product/query");
export const getValuation = makePostAPI("/1.0/app/asset/getAssets");
export const buyProduct = makePostAPI("/1.0/app/ustore/buy");
export const estimate = makePostAPI("/1.0/app/ustore/estimate");
export const journal = makePostAPI("/1.0/app/journal/query");
export const upgrade = makePostAPI("/1.0/app/ustore/upgrade");
export const createAddress = makePostAPI("/1.0/app/asset/createAddress");
export const graphql = graphqlAPI("/1.0/app");
export const verificate_code = makePostAPI("/1.0/app/user/requestVerificateCode");
export const register = makePostAPI("/1.0/app/user/register");
export const user_info = makePostAPI("/1.0/app/urar/one");
export const takeProfit = makePostAPI("/1.0/app/urar/accept")
export const resetCode = makePostAPI("/1.0/app/user/resetPassword");
export const profit = makePostAPI("/1.0/app/usds/query");
export const runIndex = makePostAPI("/1.0/app/settle/runIndex");
export const withdraw = makePostAPI("/1.0/app/payment/withdraw");
export const exchangeRate = makePostAPI("/1.0/app/settle/exchangeRate");
export const exchange = makePostAPI("/1.0/app/payment/exchange");
export const getStructure = makePostAPI("/1.0/app/urar/descend");
export const getOneStructure = makePostAPI("/1.0/app/urar/one");
export const modifyInfo = makePostAPI("/1.0/app/user/updatePassword");
export const announcement = makePostAPI("/1.0/app/announcement/fetch");
export const welfarestat = makePostAPI("/1.0/app/welfarestat/query")
export const getRevenueConfig = makePostAPI("/1.0/app/config/getRevenueConfig")
export const sync = makePostAPI('/1.0/app/user/sync');
export const legalMarket = makePostAPI('/1.0/app/legalMarket/query');
export const userSettings = makePostAPI('/1.0/app/config/userSettings');
export const dealWith = makePostAPI('/1.0/app/legalMarket/dealWith');
export const getFeeRatio = makePostAPI('/1.0/app/legalMarket/query'); 
//节目列表
export const getVideoBanner = makePostVideoAPI('http://mygobatv.com/api/v1/banner/list'); 
//更多节目列表
export const getVideoList = makePostVideoAPI('http://mygobatv.com/api/v1/shows/list'); 




export const requestVerificateCode = makePostAPI('/1.0/app/user/requestVerificateCode');
export const legalDealCancel = makePostAPI('/1.0/app/legalDeal/cancel');
export const confirmPay = makePostAPI('/1.0/app/legalDeal/confirmPay');
export const havedPay = makePostAPI('/1.0/app/legalDeal/havedPay');
export const createAllege = makePostAPI('/1.0/app/alleges/create');

export const getToken = makePostAPI('/1.0/app/tokenmanage/getTokens');

export const query = makePostAPI('/1.0/app/user/query');
export const idCardAuth = makePostAPI('/1.0/app/user/idCardAuth');
export const updateBank = makePostAPI('/1.0/app/user/updateBank');
export const updateAlipay = makePostAPI('/1.0/app/user/updateAlipay');
export const updateEmail = makePostAPI('/1.0/app/user/updateEmail');
export const updateMobile = makePostAPI('/1.0/app/user/updateMobile');


