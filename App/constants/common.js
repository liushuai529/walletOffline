// import '../../shim';
import {Dimensions, Platform} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

const sh = Dimensions.get('window').height;
const sw = Dimensions.get('window').width;
const scale = Dimensions.get('window').scale;
const w = 375;
const IsIOS = Platform.OS.toLowerCase() === 'ios';
const Is5Series = IsIOS && sw === 320 && sh === 568;
const isIphoneX = IsIOS && sw === 375 && sh === 812;
let navHeight;
let paddingTop;
let tabbarHeight;
let safeTop = 0;
let safeBottom = 0;
let extraTop = 0;
if (IsIOS) {
  if (isIphoneX) {
    navHeight = 88;
    paddingTop = 44;
    tabbarHeight = 83;
    safeTop = 24;
    safeBottom = 32;
  } else {
    navHeight = 64;
    paddingTop = 20;
    tabbarHeight = 49;
  }
} else {
  extraTop = 20;
  navHeight = 44;
  paddingTop = 0;
  tabbarHeight = 49;
}

const common = {
  navHeight,
  paddingTop,
  tabbarHeight,
  safeTop,
  safeBottom,
  scale,
  IsIOS,
  Is5Series,
  sw,
  sh,
  extraTop,

  getH(value) {
    return (value / w) * sw;
  },
  margin2: (2 / w) * sw,
  margin3: (3 / w) * sw,
  margin5: (5 / w) * sw,
  margin8: (8 / w) * sw,
  margin10: (10 / w) * sw,
  margin12: (12 / w) * sw,
  margin15: (15 / w) * sw,
  margin20: (20 / w) * sw,
  margin22: (22 / w) * sw,
  margin23: (23 / w) * sw,
  margin25: (25 / w) * sw,
  margin28: (28 / w) * sw,
  margin30: (30 / w) * sw,
  margin35: (35 / w) * sw,
  margin36: (36 / w) * sw,
  margin38: (38 / w) * sw,
  margin40: (40 / w) * sw,
  margin48: (48 / w) * sw,
  margin60: (60 / w) * sw,
  margin80: (80 / w) * sw,
  margin90: (100 / w) * sw,
  margin110: (110 / w) * sw,
  margin127: (127 / w) * sw,
  margin210: (210 / w) * sw,

  w10: (10 / w) * sw,
  w12: (12 / w) * sw,
  w15: (15 / w) * sw,
  w20: (20 / w) * sw,
  w25: (25 / w) * sw,
  w30: (30 / w) * sw,
  w35: (35 / w) * sw,
  w40: (40 / w) * sw,
  w50: (50 / w) * sw,
  w60: (60 / w) * sw,
  w80: (80 / w) * sw,
  w90: (90 / w) * sw,
  w100: (100 / w) * sw,
  w120: (120 / w) * sw,
  w150: (150 / w) * sw,

  h5: (5 / w) * sw,
  h8: (8 / w) * sw,
  h10: (10 / w) * sw,
  h13: (13 / w) * sw,
  h14_5: (14.5 / w) * sw,
  h15: (15 / w) * sw,
  h17: (17 / w) * sw,
  h18: (18 / w) * sw,
  h20: (20 / w) * sw,
  h28: (28 / w) * sw,
  h30: (30 / w) * sw,
  h32: (32 / w) * sw,
  h35: (35 / w) * sw,
  h36: (36 / w) * sw,
  h40: (40 / w) * sw,
  h44: (44 / w) * sw,
  h50: (50 / w) * sw,
  h56: (56 / w) * sw,
  h60: (60 / w) * sw,
  h70: (70 / w) * sw,
  h80: (80 / w) * sw,
  h100: (100 / w) * sw,
  h120: (120 / w) * sw,
  h150: (150 / w) * sw,
  h200: (200 / w) * sw,
  h300: (300 / w) * sw,
  font30: (30 / w) * sw,
  font25: (25 / w) * sw,
  font20: (20 / w) * sw,
  font18: (18 / w) * sw,
  font17: (17 / w) * sw,
  font16: (16 / w) * sw,
  font15: (15 / w) * sw,
  font14: (14 / w) * sw,
  font12: (12 / w) * sw,
  font11: (11 / w) * sw,
  font10: (10 / w) * sw,

  activeOpacity: 0.7,

  buy: 'buy',
  sell: 'sell',

  legalDeal: {
    limit: 10,
    token: 'CNYT',
    status: {
      waitpay: 'waitpay',
      waitconfirm: 'waitconfirm',
      complete: 'complete',
      cancel: 'cancel',
    },
  },

  noti: {
    home: 'home',
    updateEmail: 'updateEmail',
    idCardAuth: 'idCardAuth',
    delegateAllCancel: 'delegateAllCancel',
    legalDealConfirmPay: 'legalDealConfirmPay',
    addAddress: 'addAddress',
    withdraw: 'withdraw',
    googleAuth: 'googleAuth',
    userChanged: 'userChanged',
    syncFaildAndLoginOut: 'syncFaildAndLoginOut'
  },

  user: {
    string: 'user',
    status: {
      never: 'never',
      waiting: 'waiting',
      pass: 'pass',
      refuse: 'refuse',
      bind: 'bind',
      unbind: 'unbind',
    },
    level0: 'level0',
    level1: 'level1',
    chatHistory: 'chatHistory',
  },

  whiteColor: 'rgb(255,255,255)',
  redColor: 'rgb(213,69,80)',
  bidColor: 'rgba(0,205,0,1)',
  askColor: 'rgba(205,0,0,1)',
  greenColor: 'rgb(36,199,139)',
  blackColor: 'rgb(24,27,42)',
  blackColor2: 'rgb(24,27,43)',

  navBgColor: 'rgb(38,103,197)', // 导航栏背景色
  tabBarColor: 'rgb(255,255,255)',//底部导航颜色
  borderColor: 'rgb(53,61,92)',
  borderColor05: 'rgba(52,60,92,0.5)',
  textColor: 'rgb(26,26,26)', // 单元格内文字颜色
  btnTextColor: 'rgb(255,213,2)',
  loginBtnTitleColor: '#191B2B', // 登录/注册/下一步标题颜色
  loginBtnBgColor: 'rgb(255,213,1)', // 较宽按钮背景色
  placeholderColor: 'rgb(97,105,137)',
  grayColor: 'rgba(97,105,137,0.5)',
  lineColor: 'rgb(216,216,216)',
  rgb242: 'rgb(242,242,242)',
  rgb223: 'rgb(223,223,223)',

  bgColor: 'rgb(239,243,238)', // 视图背景色


  //聊天室颜色定义
  //chatDarkBgColor: 'rgb(25,27,41)',//聊天室深色背景
  //chatLightBgColor: 'rgb(232,232,232)',//聊天室浅色背景
  chatBgColor: 'rgb(25,27,41)', //聊天室深色背景
  chatNumColor: 'rgb(178,182,204)', //字数限制颜色
  chatMsgHintColor: 'rgb(214,57,17)', //未读消息提示颜色
  chatConfirmColor: 'rgb(254,214,2)', //加好友，加群同意按钮背景色
  chatRefuseColor: 'rgb(197,197,197)', //加好友，加群拒绝按钮背景色
  chatTextColor: 'rgb(223,228,255)', // 聊天主要文字颜色
  chatTextGreyColor: 'rgb(98,105,134)', // 列表项摘要颜色
  chatTextDisableColor: 'rgb(111,111,111)', //禁止点击的文字颜色
  chatInputColor: 'rgb(24,27,42)',

  chatSeparateColor: 'rgb(54,61,90)', //列表分隔线颜色
  chatListItemColor: 'rgb(38,43,65)', //列表项颜色
  chatButtonYellow: 'rgb(255,213,2)', //按钮黄色
  chatButtonGrey: 'rgb(97,105,137)', //按钮灰色
  chatBubbleColor1: 'rgb(53,61,92)', //聊天别人气泡颜色
  chatBubbleColor2: 'rgb(255,214,2)', //聊天自己气泡颜色
  chatContentColor1: 'rgb(223,228,255)', //聊天别人信息颜色
  chatContentColor2: 'rgb(25,27,41)', //聊天自己信息颜色

  chatTipColor: 'rgb(244, 228, 212)',

  linearGradientColor: ['#FA7E12', '#FFA21F', '#FFC63E'],
  linearGradientColor2: ['#FCC937', '#F68214'],

  regMobile: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
  regMobileMsg: '请输入正确的手机号', // 手机号提示
  regPassword: /^(?=.*[0-9].*)(?=.*[A-Z].*).{6,20}$/, // 密码正则
  regSpace: /^[^ ]+$/, // 空格正则
  regPasswordMsg: '密码为6-20位数字和字符, 至少一个大写字母', // 密码提示
  regIdCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
  regBankName: /^[\u4e00-\u9fa5]{4}/,
  regBankNo: /[0-9]{16,19}$/,
  // regEmail: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  regEmail: /^([a-zA-Z0-9_-|.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/,

	textInputMaxLenPwd: 20,
  textInputMaxLenIdNo: 18,
  textInputMaxLenBankNo: 19,
  textInputMaxLenBankName: 15,
  textInputMaxLenLegalDeal: 7,
  maxLenDelegate: 15,

  maxQuantityLegalDeal: 1000000,
  minQuantityLegalDeal: 100,

  messageBarDur: 2000,

  dfSimplifyDateWithSymbol(dateStr, symbol) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10
        ? `0${createdAtDate.getDate()}`
        : createdAtDate.getDate();
    const dfStr = `${getYear}${symbol}${getMonth}${symbol}${getDate}`;
    return dfStr;
  },

  covertDate(date) {
    const getYear = date.getFullYear();
    const getMonthTemp = date.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const dfStr = `${getYear}-${getMonth}-${getDate}`;
    return dfStr;
  },

  removeInvalidZero(numb) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/;
    return `${numb}`.replace(regexp, '$1');
  },

  // 转换币币对配置信息
  parseConfig(data) {
    const {tokens, coinPairs} = data;
    const canWithdrawCoins = [];
    const canRechargeAddress = [];
    const canTransferCoins = [];
    const coinIdDic = {};
    const accuracy = {};
    tokens.forEach(e => {
      if (e.name !== 'CNY') {
        coinIdDic[e.name] = {
          id: e.id,
          fee: e.withdrawFee,
          minAmount: e.withdrawMin,
          name: e.name,
          cnName: e.cnName,
          appIcon: e.appicon,
          contract: e.contract,
          transferFee: e.transferFee,
          transferMin: e.transferMin,
          rechargeMin: e.rechargeMin,
        };
        if (e.allowWithdraw) {
          canWithdrawCoins.push(e.name);
        }
        if (e.allowRecharge) {
          canRechargeAddress.push(e.name);
        }
        if (e.allowTransfer) {
          canTransferCoins.push(e.name);
        }
      }
    });

    // 配置精度
    if (coinPairs) {
      coinPairs.forEach(e => {
        e.pairs.forEach(elem => {
          accuracy[`${elem.name}_${e.name}`] = {
            priceLimit: Number(elem.priceLimit),
            quantityLimit: Number(elem.quantityLimit),
            moneyLimit: Number(elem.moneyLimit),
            istransaction: elem.istransaction,
          };
        });
      });
    }

    return {
      canWithdrawCoins,
      canRechargeAddress,
      canTransferCoins,
      coinIdDic,
      accuracy,
    };
  },

  validatePhone(phoneNumber) {
    return (
      typeof phoneNumber === 'string' &&
      phoneNumber.length === 11 &&
      new RegExp(
        '^(13[0-9]|14[57]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$',
        'i',
      ).test(phoneNumber)
    );
  },

  maskAccount(num, type) {
    if (num && num.indexOf('@') > 0) {
      let check = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]+$/;
      if (!check.test(num)) return num;
      let splitEmail = num.split('@');
      if (splitEmail.length < 2 || splitEmail[0].length <= 3) {
        return num;
      }
      let topChange = splitEmail[0].replace(
        /(\S{3})\S{1,}/,
        '$1' + '*'.repeat(splitEmail[0].length - 3),
      );
      return topChange + '@' + splitEmail[1];
    } else if (num && type === 'phone' && num.length > 7) {
      return num.replace(
        /(\d{3})\d+(\d{4})/,
        '$1' + '*'.repeat(num.length - 7) + '$2',
      );
    } else if (num && type === 'idNum' && num.length > 4) {
      return num.replace(
        /(\d{2})\d+(\d{2})/,
        '$1' + '*'.repeat(num.length - 4) + '$2',
      );
    } else if (num && num.length > 8) {
      return num.replace(
        /(\d{4})\d+(\d{4})/,
        '$1' + '*'.repeat(num.length - 8) + '$2',
      );
    }
    return num;
  },

  validateEmail(email) {
    return (
      typeof email === 'string' &&
      /^([a-zA-Z0-9_-|.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/.test(email)
    );
  },

  maskMobile(value) {
    return String(value).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },

  maskEmail(value = '') {
    if (value) {
      const arr = value.split('@');
      if (arr[0].length > 3) {
        return `${arr[0].substring(0, 3)}****@${arr[1]}`;
      }
      return value;
    }
    return '';
  },

  maskUserAccount(account) {
    if (!account || account.length <= 4) return '****';

    function doMask(msg) {
      if (msg.length > 7) {
        return msg.replace(
          /(\S{3})\S+(\S{4})/,
          '$1' + '*'.repeat(msg.length - 7) + '$2',
        );
      }

      return msg.replace(
        /(\S{3})\S+(\S{1})/,
        '$1' + '*'.repeat(msg.length - 5) + '$2',
      );
    }

    if (account && account.indexOf('@') > 0) {
      let check = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]+$/;
      if (!check.test(account)) return doMask(account);
      let splitEmail = account.split('@');
      if (splitEmail.length == 2 && splitEmail[0].length <= 3) {
        return `${splitEmail[0].charAt(0)}**@${splitEmail[1]}`;
      }
      let topChange = splitEmail[0].replace(
        /(\S{3})\S{1,}/,
        '$1' + '*'.repeat(splitEmail[0].length - 3),
      );
      return topChange + '@' + splitEmail[1];
    }

    return doMask(account);
  },

  dfFullDate(dateStr) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10
        ? `0${createdAtDate.getDate()}`
        : createdAtDate.getDate();
    const getHours =
      createdAtDate.getHours() < 10
        ? `0${createdAtDate.getHours()}`
        : createdAtDate.getHours();
    const getMinutes =
      createdAtDate.getMinutes() < 10
        ? `0${createdAtDate.getMinutes()}`
        : createdAtDate.getMinutes();
    const getSeconds =
      createdAtDate.getSeconds() < 10
        ? `0${createdAtDate.getSeconds()}`
        : createdAtDate.getSeconds();
    const dfStr = `${getYear}/${getMonth}/${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
    return dfStr;
  },

  fetchBeginTime(date) {
    return new Date(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
    );
  },

  fetchEndTime(date) {
    return new Date(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 23:59:59`,
    );
  },

  getSymbols(string) {
    var index = 0;
    var length = string.length;
    var output = [];
    if (length == 0) return output;
    for (; index < length - 1; ++index) {
      var charCode = string.charCodeAt(index);
      if (charCode >= 0xd800 && charCode <= 0xdbff) {
        charCode = string.charCodeAt(index + 1);
        if (charCode >= 0xdc00 && charCode <= 0xdfff) {
          output.push(string.slice(index, index + 2));
          ++index;
          continue;
        }
      }
      output.push(string.charAt(index));
    }
    output.push(string.charAt(index));
    return output;
  },

  isSupportImage(uri) {
    if (!uri) return false;
    const suffix = common.getFileSuffix(uri);
    if (suffix.length == 0) return true;
    const array = ['jpg', 'png', 'jpeg'];
    return array.includes(suffix);
  },

  getFileSuffix(uri) {
    let suffix = '';
    const index = uri.lastIndexOf('.');
    if (index != -1) {
      suffix = uri.substring(index + 1, uri.length);
    }
    return suffix.toLowerCase();
  },
  formatVideoTime(second) {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
      return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":")
  },
};

function storeSave(name, object, block) {
  AsyncStorage.setItem(name, JSON.stringify(object), block);
}

function storeRead(name, block) {
  AsyncStorage.getItem(name, (error, result) => {
    if (!error && result) {
      block(result);
    }
  });
}

function storeDelete(name, block) {
  AsyncStorage.removeItem(name, block);
}

module.exports = {
  common,
  storeSave,
  storeRead,
  storeDelete,
};
