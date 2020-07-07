import { Dimensions, Platform } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import '../../shim.js';
// import deviceInfo from 'react-native-device-info';
// import transfer from '../localization/utils';
// import { getDefaultLanguage } from '../utils/languageHelper';
// import { imgHashApi } from '../services/api';
// import BigNumber from 'bignumber.js';

// const crypto = require('crypto');

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
  navHeight = 44;
  paddingTop = 0;
  tabbarHeight = 49;
}

// let defaultPair = require('./defaultPair.json');

const common = {
  setDefaultPair(p) {
    defaultPair = p;
  },
  getDefaultPair() {
    return defaultPair;
  },

  getTokenNames() {
    const coinIdDic = this.getDefaultPair().coinIdDic;
    const keys = Object.keys(coinIdDic).sort();
    const indexs = {};
    keys.map((e, idx) => {
      indexs[coinIdDic[e].id] = coinIdDic[e].name;
    });
    return indexs;
  },

  crowdItemState(item, start) {
    const time = common.fetchCountDownTime(item.beginTime);
    const endTime = common.fetchCountDownTime(item.endTime);
    var state = 0;
    var showState = time;
    var buyState = '即将开放';
    var canClick = false;
    if (time === '0') {
      // 已开始
      state = 1;
      showState = '抢购中';
      buyState = '立即购买';
      canClick = true;
      if (!start) showState = endTime;
    }
    if (endTime === '0') {
      // 已结束
      state = 2;
      showState = '已结束';
      buyState = '已结束';
      canClick = false;
    }
    if (item.status === 'pause') {
      // 暂停中
      state = 3;
      showState = '暂停中';
      buyState = '立即购买';
      canClick = false;
    }
    if (item.status === 'abandon') {
      // 已终止
      state = 4;
      showState = '已终止';
      buyState = '已终止';
      canClick = false;
    }
    if (item.status === 'complete') {
      // 已完成
      state = 5;
      showState = '已结束';
      buyState = '已结束';
      canClick = false;
    }
    return { state, showState, buyState, canClick };
  },

  crowdSchedule(quota) {
    var total = 0;
    var occupied = 0;
    var scale = '0%';
    var extraTotal = '';
    var extraOccupied = '';
    if (quota) {
      total = BigNumber(quota.total);
      occupied = BigNumber(quota.occupied);
      if (total > 0)
        scale = `${parseFloat(
          BigNumber(quota.occupied)
            .dividedBy(quota.total)
            .multipliedBy(100)
            .toFixed(2)
        )}%`;

      if (total > 1000000) {
        total = parseFloat(
          BigNumber(quota.total)
            .dividedBy(10000)
            .toFixed(2, 1)
        );
        extraTotal = '万';
      } else {
        total = common.removeInvalidZero(BigNumber(quota.total).toFormat(2, 1));
      }

      if (occupied > 1000000) {
        occupied = parseFloat(
          BigNumber(quota.occupied)
            .dividedBy(10000)
            .toFixed(2, 1)
        );
        extraOccupied = '万';
      } else {
        occupied = common.removeInvalidZero(BigNumber(quota.occupied).toFormat(2, 1));
      }
    }
    return { total, occupied, scale, extraTotal, extraOccupied };
  },

  removeInvalidZero(numb) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/;
    return `${numb}`.replace(regexp, '$1');
  },

  crowdPriceUnit(item) {
    const currency = item.currency;
    const keys = Object.keys(currency);
    var unit = '';
    var price = 0;
    if (keys && keys.length > 0) {
      unit = keys[0];
      price = currency[unit];
      if (BigNumber(price).isNaN()) {
        unit = price;
        price = currency[unit];
      }
    }
    return { price, unit };
  },

  crowdCurrencyAllKeys(item) {
    const { unit } = common.crowdPriceUnit(item);
    var keys = Object.keys(item.currency);
    if (keys && keys.length > 1) {
      keys.forEach((el, index) => {
        if (el === unit && index != 0) {
          keys.unshift(keys.splice(index, 1)[0]);
        }
      });
    }
    return keys;
  },

  crowdCommentSource(item) {
    const comment = item.comment['zh-CN'];
    const source = { uri: imgHashApi + item.image['zh-CN'] + '.png' };
    const descriptionKey = item.description ? item.description['zh-CN'] : '';
    const buyRulesKey = item.buyRules ? item.buyRules['zh-CN'] : '';
    return { comment, source, descriptionKey, buyRulesKey };
  },

  badNet: 'Network request failed',
  navHeight,
  paddingTop,
  tabbarHeight,
  safeTop,
  safeBottom,
  selectedTokenDefault: '选择币种',
  scale,
  refreshIntervalTime: 2000,

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
  },

  chatNoti: {
    runJs: 'runJs',
    chatMenu: 'chatMenu',
    chatGroupClearNum: 'chatGroupClearNum',
    chatDataUpdate: 'chatDataUpdate',
    chatConfig: 'chatConfig',
    chatGroupConfig: 'chatGroupConfig',
    newsFlash: 'newsFlash',
    sysNotice: 'sysNotice',
    clearSysNoticeNum: 'clearSysNoticeNum',
  },

  buy: 'buy',
  sell: 'sell',
  IsIOS,
  Is5Series,

  payment: {
    charge: {
      BTC: 0.001,
      ETH: 0.01,
    },
    limitRecharge: 10,
    limitWithdraw: 10,
    recharge: 'recharge',
    withdraw: 'withdraw',
    legalDeal: 'legalDeal',
  },

  delegate: {
    limtCurrent: 10,
    limtHistory: 10,
    current: 'current',
    history: 'history',
    status: {
      dealing: 'dealing',
      waiting: 'waiting',
      complete: 'complete',
      cancel: 'cancel',
    },
  },

  token: {
    TK: 'TK',
    BTC: 'BTC',
    CNYT: 'CNYT',
    CNY: 'CNY',
    ETH: 'ETH',
    ETC: 'ETC',
    LTC: 'LTC',
  },

  coinChinese: {
    TK: 'TK币',
    BTC: '比特币',
    CNYT: '',
    ETH: '以太坊',
    ETC: '以太经典',
    LTC: '莱特币',
  },

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

  selectionBar: {
    left: 'left',
    right: 'right',
    third: 'third',
  },

  ui: {
    kLine: 'kLine',
    depth: 'depth',
    averagePrice: 'averagePrice',
    price: 'price',
    dealled: 'dealled',
    quantity: 'quantity',
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

  sw,
  sh,

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
  w60: (60 / w) * sw,
  w65: (65 / w) * sw,
  w80: (80 / w) * sw,
  w100: (100 / w) * sw,
  w120: (120 / w) * sw,
  w150: (150 / w) * sw,

  h5: (5 / w) * sw,
  h8: (8 / w) * sw,
  h10: (10 / w) * sw, // 聊天列表头像圆角直径
  h13: (13 / w) * sw, // 首页详情页面中向上箭头高度
  h14_5: (14.5 / w) * sw, // 交易五档文字高度
  h15: (15 / w) * sw,
  h17: (17 / w) * sw,
  h18: (18 / w) * sw,
  h20: (20 / w) * sw,
  h24: (24 / w) * sw,
  h28: (28 / w) * sw,
  h30: (30 / w) * sw,
  h32: (32 / w) * sw,
  h35: (35 / w) * sw,
  h36: (36 / w) * sw,
  h40: (40 / w) * sw,
  h44: 44, // 导航栏高度
  h50: (50 / w) * sw,
  h56: (56 / w) * sw,
  h60: (60 / w) * sw, // 当前委托cell高度
  h70: (70 / w) * sw, // 首页Cell高度
  h80: (80 / w) * sw,
  h81: (81 / w) * sw, // addtag提示语专用高度
  h97: (97 / w) * sw,
  h100: (100 / w) * sw, // 二维码宽高
  h120: (120 / w) * sw, // 超级返利已推荐好友
  h154: (154 / w) * sw, // 短信验证码视图高度
  h177: (177 / w) * sw, //邀请好友
  h200: (200 / w) * sw, //法币撤销提示高度
  h234: (234 / w) * sw, // 首页公告图片高度
  h263: (263 / w) * sw, // K线图高度
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
  font8: (8 / w) * sw,

  radius6: 6,

  activeOpacity: 0.7,

  regMobile: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,

  regWebUrl: /(https|http)?:\/{2}[a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+\.?/gi,

  emojiIcons: [
    '😁',
    '😂',
    '😃',
    '😄',
    '👿',
    '😉',
    '😊',
    '☺',
    '😌',
    '😍',
    '😏',
    '😒',
    '😓',
    '😔',
    '😖',
    '😘',
    '😚',
    '😜',
    '😝',
    '😞',
    '😠',
    '😡',
    '😢',
    '😋',
    '😷',
    '😳',
    '😲',
    '😱',
    '😰',
    '😭',
    '😪',
    '😨',
    '😥',
    '😣',
    '😗',
    '😛',
    '😎',
    '😩',
    '😤',
    '👴',
    '👳',
    '👲',
    '👱',
    '👫',
    '👩',
    '👨',
    '👧',
    '👦',
    '👶',
    '👯',
    '😴',
    '👵',
    '👮',
    '👷',
    '👸',
    '💂',
    '👼',
    '🎅',
    '👻',
    '💩',
    '💀',
    '👽',
    '👾',
    '👂',
    '👏',
    '🙌',
    '💏',
    '💑',
    '🙇',
    '🙋',
    '💇',
    '💆',
    '🙆',
    '🙅',
    '💁',
    '👀',
    '👃',
    '👄',
    '💋',
    '💅',
    '👋',
    '👍',
    '👎',
    '👆',
    '👇',
    '👈',
    '👉',
    '👐',
    '🙏',
    '💪',
    '✊',
    '👊',
    '✌',
    '👌',
  ],

  isChineseLanguage(language) {
    return language === 'zh_hans';
  },

  fetchCountDownTime(time) {
    const newTime = new Date(time);
    const now = new Date();
    const diff = parseInt((newTime - now) / 1000);
    const hour = parseInt(diff / (60 * 60));
    const minute = parseInt((diff % (60 * 60)) / 60);
    const second = parseInt(diff % 60);
    if (hour <= 0 && minute <= 0 && second <= 0) {
      return '0';
    }
    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${
      second < 10 ? '0' : ''
      }${second}`;
  },

  maskUserAccount(account) {
    if (!account || account.length <= 4) return '****';

    function doMask(msg) {
      if (msg.length > 7) {
        return msg.replace(/(\S{3})\S+(\S{4})/, '$1' + '*'.repeat(msg.length - 7) + '$2');
      }

      return msg.replace(/(\S{3})\S+(\S{1})/, '$1' + '*'.repeat(msg.length - 5) + '$2');
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
        '$1' + '*'.repeat(splitEmail[0].length - 3)
      );
      return topChange + '@' + splitEmail[1];
    }

    return doMask(account);
  },


  formatSystemNoticeShortTime(time) {
    let language = getDefaultLanguage();
    if (language === 'zh_hans' || language === 'zh_hant') {
      return time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日 ';
    }
    return time.getDate() + '/' + time.getMonth() + 1 + '/' + time.getFullYear();
  },

  formatNewsletterGroupTime(time) {
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
  },

  formatNewsletterContentTime(time) {
    let minute = time.getMinutes();
    if (minute < 10) {
      minute = '0' + minute;
    }
    return time.getHours() + ':' + minute;
  },

  formatNewsletterDetailsTime(time) {
    let minute = time.getMinutes();
    if (minute < 10) {
      minute = '0' + minute;
    }
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + minute;
  },

  formatNewsMessageTime(time) {
    let minute = time.getMinutes();
    let second = time.getSeconds();
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + minute + ':' + second;
  },

  formatChatTimeToTimeStamp(time) {
    let language = getDefaultLanguage();
    let now = new Date();
    if (time.toDateString() === now.toDateString()) {
      //是今天
      let timeStr = '';
      let hours = time.getHours();
      let minute = time.getMinutes();

      minute = minute < 10 ? '0' + minute : minute;

      if (!deviceInfo.is24Hour()) {
        if (language === 'zh_hans' || language === 'zh_hant') {
          timeStr +=
            hours > 12
              ? `${transfer(language, 'chat_afternoon')} ` + (hours - 12) + ':' + minute
              : `${transfer(language, 'chat_morning')} ` + hours + ':' + minute;
        } else {
          // .. AM or PM is placed behind
          timeStr +=
            hours > 12
              ? hours - 12 + ':' + minute + ` ${transfer(language, 'chat_afternoon')}`
              : hours + ':' + minute + ` ${transfer(language, 'chat_morning')}`;
        }
      } else {
        timeStr += hours + ':' + minute;
      }
      return timeStr;
    }

    let yesterday = new Date(Date.now() - 86400 * 1000);
    if (time.toDateString() === yesterday.toDateString()) {
      //是昨天
      return `${transfer(language, 'chat_yesterday')} `;
    }

    if (time.getFullYear() !== now.getFullYear()) {
      if (language === 'zh_hans' || language === 'zh_hant') {
        return time.getFullYear() + '年' + (time.getMonth() + 1) + '月';
      }
      return time.getMonth() + 1 + '/' + time.getFullYear();
    } else {
      if (language === 'zh_hans' || language === 'zh_hant') {
        return time.getMonth() + 1 + '月' + time.getDate() + '日 ';
      }
      return time.getMonth() + 1 + '/' + time.getDate();
    }
  },

  formatTimeToTimeStamp(time) {
    let timeStr = '';
    let hours = time.getHours();
    let minute = time.getMinutes();
    let language = getDefaultLanguage();

    minute = minute < 10 ? '0' + minute : minute;

    if (!deviceInfo.is24Hour()) {
      if (language === 'zh_hans' || language === 'zh_hant') {
        timeStr +=
          hours > 12
            ? `${transfer(language, 'chat_afternoon')} ` + (hours - 12) + ':' + minute
            : `${transfer(language, 'chat_morning')} ` + hours + ':' + minute;
      } else {
        // .. AM or PM is placed behind
        timeStr +=
          hours > 12
            ? hours - 12 + ':' + minute + ` ${transfer(language, 'chat_afternoon')}`
            : hours + ':' + minute + ` ${transfer(language, 'chat_morning')}`;
      }
    } else {
      timeStr += hours + ':' + minute;
    }

    // if(!deviceInfo.is24Hour())
    // {
    // timeStr += hours > 12 ? '下午 ' + (hours - 12) : '上午 ' + hours
    // } else{
    // timeStr += hours
    // }
    // let minute = time.getMinutes()
    // timeStr += ':' + (minute < 10 ? '0' + minute : minute)

    let now = new Date();
    if (time.toDateString() === now.toDateString()) {
      //是今天
      return timeStr;
    }

    let yesterday = new Date(Date.now() - 86400 * 1000);
    if (time.toDateString() === yesterday.toDateString()) {
      //是昨天
      return `${transfer(language, 'chat_yesterday')} ` + timeStr;
    }

    // 先获取当前时间是星期几
    let curWeek = now.getDay() === 0 ? 7 : now.getDay();
    // 获取两个时间之间相差的天数
    let interval = parseInt(Math.abs((now.getTime() - time.getTime()) / 24 / 60 / 60 / 1000));
    // 同一周内显示星期几
    if (interval < curWeek) {
      switch (time.getDay()) {
        case 1:
          return `${transfer(language, 'chat_Mon')} ` + timeStr;
          break;
        case 2:
          return `${transfer(language, 'chat_Tue')} ` + timeStr;
          break;
        case 3:
          return `${transfer(language, 'chat_Wed')} ` + timeStr;
          break;
        case 4:
          return `${transfer(language, 'chat_Thu')} ` + timeStr;
          break;
        case 5:
          return `${transfer(language, 'chat_Fri')} ` + timeStr;
          break;
        case 6:
          break;
        case 0:
          break;
        default:
          break;
      }
    }

    if (time.getFullYear() !== now.getFullYear()) {
      if (language === 'zh_hans' || language === 'zh_hant') {
        return (
          time.getFullYear() +
          '年' +
          (time.getMonth() + 1) +
          '月' +
          time.getDate() +
          '日 ' +
          timeStr
        );
      }

      return time.getMonth() + 1 + '/' + time.getDate() + '/' + time.getFullYear() + ' ' + timeStr;
    } else {
      if (language === 'zh_hans' || language === 'zh_hant') {
        return time.getMonth() + 1 + '月' + time.getDate() + '日 ' + timeStr;
      }

      return time.getMonth() + 1 + '/' + time.getDate() + ' ' + timeStr;
    }
  },

  fomartAmount(amount) {
    const config = {
      tenthousand: 10000,
      hundredMillion: 100000000,
    };
    amount = BigNumber(amount);
    if (amount.isLessThan(config.tenthousand)) {
      return common.removeInvalidZero(BigNumber(amount.toPrecision(6 ,1)).toFixed(8));
    }
    if (amount.isGreaterThanOrEqualTo(config.tenthousand) && amount.isLessThan(config.hundredMillion)) {
      return common.removeInvalidZero(
        amount.dividedBy(config.tenthousand).toFixed(2, 1)
      ) + '万';
    }
    if (amount.isGreaterThanOrEqualTo(config.hundredMillion)) {
      return common.removeInvalidZero(
        amount.dividedBy(config.hundredMillion).toFixed(2, 1)
      ) + '亿';
    }

  },

  genId() {
    return `xxxxxxxx-xxxx-4xxx-yxxx-${Date.now().toString(16)}x`
      .replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  },

  escapeXml(str) {
    if (str == undefined || str == null) return;

    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/\n/g, '&#x000D;');
  },

  unescapeXml(str) {
    if (str == undefined || str == null) return;

    str = str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&#x000D;/g, '\n');
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&#x000D;/g, '\n');
  },

  encodeAt(msg, member_info) {
    Object.keys(member_info).forEach(n => {
      msg = msg.replace(n, `${n}<&#64&#64_${JSON.stringify(member_info[n])}_&#64&#64>`);
    });

    return msg;
  },
  decodeAt(msg, member_array) {
    const head = '<&#64&#64_{';
    const tail = '}_&#64&#64>';
    let new_msg = '';
    let start = 0;
    let end = -1;
    let i;
    for (i = 0; i < msg.length; i++) {
      if (msg.charAt(i) === '<') {
        start = msg.indexOf(head, i);
        if (start === i) {
          end = msg.indexOf(tail, start + head.length);
          if (end > start) {
            if (member_array) {
              try {
                let str = msg.substring(start + head.length - 1, end + 1);
                //console.log("test_app: decodeAtXXXXX:",str);

                let meminfo = JSON.parse(str);
                if (meminfo) {
                  member_array.push(meminfo);
                }
              } catch (e) {
                //console.log("test_app:" + e.stack);
              }
            }
            i = end + tail.length - 1;
            continue;
          }
        }
      }
      new_msg += msg.charAt(i);
    }

    return new_msg;
  },
  strLines(str) {
    let c = 1;
    let i = str.indexOf('\n', 0);
    while (i >= 0) {
      c++;
      i = str.indexOf('\n', i + 1);
    }
    return c;
  },
  calcHash(data) {
    var str = JSON.stringify(data);
    var defaultSalt =
      'c7a68e8ce4514ba619e5628b571b7b9bce04cc8794a1c33eac95b8615285d1cb9a9718b9527a3c6b47f2b803607c128262a083adeebc55a2e4cec509b0e9df09';
    var password = crypto.pbkdf2Sync(str, defaultSalt, 256, 24, 'sha1').toString('hex');
    return password;
  },
  calcHash2(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  },
  deSign(sign, key, iv) {
    let src = '';
    try {
      const cipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
      src += cipher.update(sign, 'hex', 'hex');
      src += cipher.final('hex');
    } catch (error) {
      console.warn('error', error, 'sign:', sign,'key:', key, 'iv:', iv)
    }
    return src;
  },
  filterPwd(pwd) {
    return (
      typeof pwd === 'string' &&
      pwd.length >= 6 &&
      pwd.length <= 20 &&
      new RegExp('[A-Z]', 'g').test(pwd) &&
      new RegExp('[0-9]', 'g').test(pwd) &&
      /^[^ ]+$/.test(pwd)
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
  getInputViewStyle(lines) {
    if (this.IsIOS) {
      return {
        backgroundColor: this.whiteColor,
        borderRadius: this.getH(10),
        flex: 1,
        maxHeight: this.getH(140),
        paddingHorizontal: this.getH(10),
        height: this.getH(36) + (lines - 1) * this.h20,
        flexDirection: 'row',
      };
    } else {
      return {};
    }
  },

  getInputTextStyle(lines, oneMissing) {
    if (this.IsIOS) {
      return [
        {
          flex: 1,
          fontSize: this.font16,
          color: this.chatInputColor,
          marginBottom: this.getH(2),
        },
        oneMissing ? { backgroundColor: this.grayColor } : {},
      ];
    } else {
      return [
        {
          backgroundColor: this.whiteColor,
          borderRadius: this.getH(20),
          flex: 1,
          textAlignVertical: 'center',
          color: this.chatInputColor,
          fontSize: this.font16,
          maxHeight: this.getH(140),
          paddingHorizontal: this.getH(22),
          paddingVertical: this.getH(15),
          borderColor: this.chatBgColor,
          borderWidth: this.getH(12),
        },
        { height: this.h60 + (lines - 1) * this.h20 },
        oneMissing ? { backgroundColor: this.grayColor } : {},
      ];
    }
  },

  chatAtAll: '@' + transfer(getDefaultLanguage(), 'chat_at_all') + '\n',

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

  dfSimplifyDate(dateStr) {
    return this.dfSimplifyDateWithSymbol(dateStr, '-');
  },

  dfSimplifyDateWithMonth(dateStr, symbol) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const dfStr = `${getYear}${symbol}${getMonth}`;
    return dfStr;
  },

  dfSimplifyDateWithSymbol(dateStr, symbol) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10 ? `0${createdAtDate.getDate()}` : createdAtDate.getDate();
    const dfStr = `${getYear}${symbol}${getMonth}${symbol}${getDate}`;
    return dfStr;
  },

  dfFullDate(dateStr) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10 ? `0${createdAtDate.getDate()}` : createdAtDate.getDate();
    const getHours =
      createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
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

  dfFullDate2(dateStr) {
    const createdAtDate = new Date(dateStr);
    const getYear = createdAtDate.getFullYear();
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10 ? `0${createdAtDate.getDate()}` : createdAtDate.getDate();
    const getHours =
      createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
    const getMinutes =
      createdAtDate.getMinutes() < 10
        ? `0${createdAtDate.getMinutes()}`
        : createdAtDate.getMinutes();
    const getSeconds =
      createdAtDate.getSeconds() < 10
        ? `0${createdAtDate.getSeconds()}`
        : createdAtDate.getSeconds();
    const dfStr = `${getYear}-${getMonth}-${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
    return dfStr;
  },

  dfCorwdFullDate(dateStr) {
    const createdAtDate = new Date(dateStr);
    const getMonthTemp = createdAtDate.getMonth() + 1;
    const getMonth = getMonthTemp < 10 ? `0${getMonthTemp}` : getMonthTemp;
    const getDate =
      createdAtDate.getDate() < 10 ? `0${createdAtDate.getDate()}` : createdAtDate.getDate();
    const getHours =
      createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
    const getMinutes =
      createdAtDate.getMinutes() < 10
        ? `0${createdAtDate.getMinutes()}`
        : createdAtDate.getMinutes();
    const getSeconds =
      createdAtDate.getSeconds() < 10
        ? `0${createdAtDate.getSeconds()}`
        : createdAtDate.getSeconds();
    const dfStr = `${getMonth}.${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
    return dfStr;
  },

  dfTime(dateStr) {
    const createdAtDate = new Date(dateStr);
    const getHours =
      createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
    const getMinutes =
      createdAtDate.getMinutes() < 10
        ? `0${createdAtDate.getMinutes()}`
        : createdAtDate.getMinutes();
    const getSeconds =
      createdAtDate.getSeconds() < 10
        ? `0${createdAtDate.getSeconds()}`
        : createdAtDate.getSeconds();
    const dfStr = `${getHours}:${getMinutes}:${getSeconds}`;
    return dfStr;
  },

  // 币币交易小数精度规则
  precision(goodsName, currencyName, block) {
    const accuracy = defaultPair.accuracy;
    const resp = accuracy[`${goodsName}_${currencyName}`];
    if (resp) {
      block(resp.priceLimit, resp.quantityLimit, resp.moneyLimit, resp.slideLimit);
    } else {
      // p:2 q:4 a:6
      block(2, 4, 6, 8);
    }
  },

  // 转换币币对配置信息
  parseConfig(data) {
    const { tokens, coinPairs } = data;
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
      new RegExp('^(13[0-9]|14[57]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$', 'i').test(
        phoneNumber
      )
    );
  },
  validateEmail(email) {
    return (
      typeof email === 'string' &&
      /^([a-zA-Z0-9_-|.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/.test(email)
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
        '$1' + '*'.repeat(splitEmail[0].length - 3)
      );
      return topChange + '@' + splitEmail[1];
    } else if (num && type === 'phone' && num.length > 7) {
      return num.replace(/(\d{3})\d+(\d{4})/, '$1' + '*'.repeat(num.length - 7) + '$2');
    } else if (num && type === 'idNum' && num.length > 4) {
      return num.replace(/(\d{2})\d+(\d{2})/, '$1' + '*'.repeat(num.length - 4) + '$2');
    } else if (num && num.length > 8) {
      return num.replace(/(\d{4})\d+(\d{4})/, '$1' + '*'.repeat(num.length - 8) + '$2');
    }
    return num;
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

  getFileSuffix(uri) {
    let suffix = '';
    const index = uri.lastIndexOf('.');
    if (index != -1) {
      suffix = uri.substring(index + 1, uri.length);
    }
    return suffix.toLowerCase();
  },

  isChatSupportImage(uri) {
    if (!uri) return false;
    const suffix = common.getFileSuffix(uri);
    if (suffix.length == 0) return true;
    const array = ['jpg', 'png', 'jpeg', 'gif'];
    return array.includes(suffix);
  },

  isSupportImage(uri) {
    if (!uri) return false;
    const suffix = common.getFileSuffix(uri);
    if (suffix.length == 0) return true;
    const array = ['jpg', 'png', 'jpeg'];
    return array.includes(suffix);
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
