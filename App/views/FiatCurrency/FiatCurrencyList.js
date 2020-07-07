import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import FiatCurrencyAlert from './FiatCurrencyAlert';
import {Overlay, Toast} from 'teaset';
import {
  updateForm,
  requestLegalMarketHandicap,
  requestLegalMarketDeal,
  setOrderInfo,
} from './redux/action/FiatCurrency';
import BigNumber from 'bignumber.js';
import {withNavigation} from 'react-navigation';
import transfer from '../../localization/utils';
import Toast2 from 'antd-mobile/lib/toast';

class FiatCurrencyList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.requestData(this.props, 'first');
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const {dispatch} = nextProps;
    const {operateType, selectMarketCurrency} = nextProps.form;
    if (nextProps.reloadHandicapAction) {
      this.requestData(nextProps, 'first');
    }
    if (nextProps.showBuySuccess1) {
      this.hideOverlay();
      this.requestData(nextProps, 'first');
      const currency = nextProps.currencyList[selectMarketCurrency];
      if (nextProps.buyOrderId) {
        dispatch(
          requestLegalMarketDeal({
            action: 'deal',
            where: {
              token_id: currency.token_id,
              id: nextProps.buyOrderId.id,
            },
          }),
        );
      }
    }
    if (nextProps.orderInfo && nextProps.orderInfo !== this.props.orderInfo) {
      if (operateType === 0) {
        this.hideOverlay();
        const orderInfo = nextProps.orderInfo[0];
        this.props.navigation.navigate('ReceiverInfo', {
          receiverInfoData: orderInfo,
          titleName: transfer(this.props.language, 'payment_b'),
        });
      } else if (operateType === 1) {
        this.hideOverlay();
        const orderInfo = nextProps.orderInfo[0];
        this.props.navigation.navigate('Payment', {
          havedPayDisabled: true,
          cancelBtnDisabled: true,
          cancelPress: null,
          havedPayPress: null,
          data: orderInfo,
          lang: this.props.language,
        });
      }
    }
    if (
      nextProps.currencyList !== this.props.currencyList &&
      nextProps.currencyList.length
    ) {
      this.requestData(nextProps, 'first');
    }
  }

  requestData(props, requestType) {
    const {dispatch, requestLimit, handicapPage, currencyList} = props;
    const {operateType, selectMarketCurrency} = props.form;
    if (currencyList.length <= selectMarketCurrency) return;
    const currency = currencyList[selectMarketCurrency];
    dispatch(
      requestLegalMarketHandicap(
        {
          action: 'handicap',
          skip: requestType == 'more' ? handicapPage * requestLimit : 0,
          limit: requestLimit,
          orderby: operateType == 1 ? '-price' : 'price',
          where: {
            direct: operateType == 1 ? 'buy' : 'sell',
            token_id: currency.token_id,
          },
        },
        requestType,
      ),
    );
  }

  showOverlay(item) {
    let overlayView = (
      <Overlay.View
        style={{flex: 1, justifyContent: 'flex-end'}}
        modal={false}
        overlayOpacity={0}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideOverlay();
          }}>
          <View style={styles.overlay_cover} />
        </TouchableWithoutFeedback>
        <FiatCurrencyAlert
          item={item}
          hide={() => {
            this.hideOverlay();
          }}
          jump={name => {
            this.hideOverlay();
            const {navigation, dispatch} = this.props;
            dispatch(setOrderInfo(item));
            navigation.navigate(name);
          }}
        />
      </Overlay.View>
    );

    this.hideOverlay();
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideOverlay() {
    Overlay.hide(this.overlayViewKeyID);
  }

  renderHeaderItem = ({item, index}) => {
    const {selectMarketCurrency} = this.props.form;
    let color =
      index == selectMarketCurrency
        ? common.themeColor
        : common.placeholderColor;
    let line_color =
      index == selectMarketCurrency ? common.themeColor : 'transparent';
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          const {dispatch} = this.props;
          dispatch(
            updateForm({
              selectMarketCurrency: index,
            }),
          );
        }}>
        <View style={styles.top_item_container}>
          <Text style={[styles.item_name2, {color: color}]}>
            {item.token.name}
          </Text>
          <View style={[styles.item_line, {backgroundColor: line_color}]} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  hasCard() {
    const {payTypeList} = this.props;
    var cardEnabled = false;
    payTypeList.some(r => {
      if (r.payType === 'card') cardEnabled = r.enabled;
    });
    return cardEnabled;
  }

  hasAlipay() {
    const {payTypeList} = this.props;
    var alipayEnabled = false;
    payTypeList.some(r => {
      if (r.payType === 'alipay') alipayEnabled = r.enabled;
    });
    return alipayEnabled;
  }

  renderItemData(item) {
    const {operateType} = this.props.form;
    const least_v = common.removeInvalidZero(
      BigNumber(item.least_v).toFixed(2, 0),
    );
    const remain_v = common.removeInvalidZero(
      BigNumber.min(item.remain_v, item.upper_v).toFixed(2, 0),
    );
    const price = common.removeInvalidZero(BigNumber(item.price).toFixed(8, 1));
    let quantityLimit = 8;
    this.props.currencyList.forEach(rd => {
      if (rd.token.token_id === item.token.token_id) {
        quantityLimit = rd.quantityLimit;
      }
    });
    const remain = common.removeInvalidZero(
      BigNumber(item.remain).toFixed(quantityLimit, 1),
    );
    return (
      <View style={styles.item_container}>
        <View style={styles.item_container_top}>
          <View style={styles.item_container_top_left}>
            <View style={styles.item_container_top_left_image} />
            <Text style={styles.item_container_top_left_text}>
              {item.trader.name}
            </Text>
          </View>
        </View>
        <View style={styles.item_container_mid}>
          <Text style={styles.item_container_mid_left}>{`数量：${remain} ${
            item.token.name
          }`}</Text>
          <Text style={styles.item_container_mid_right}>单价</Text>
        </View>
        <View style={styles.item_container_mid2}>
          <Text
            style={
              styles.item_container_mid2_left
            }>{`限额：¥${least_v} - ¥${remain_v}`}</Text>
          <Text style={styles.item_container_mid2_right}>{`¥ ${price}`}</Text>
        </View>
        <View style={styles.item_container_bottom}>
          <View style={styles.item_container_bottom_left}>
            {item.paytype.indexOf('card') != -1 ? (
              <Image
                style={styles.item_container_bottom_left_image}
                source={require('../../resource/assets/yinhangka.png')}
              />
            ) : null}
            {item.paytype.indexOf('alipay') != -1 ? (
              <Image
                style={styles.item_container_bottom_left_image}
                source={require('../../resource/assets/zhifubao.png')}
              />
            ) : null}
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              const {loggedInResult, language, navigation} = this.props;
              if (loggedInResult.idCardAuthStatus !== common.user.status.pass) {
                Toast.fail(
                  transfer(language, 'Otc_please_perform_authentication_first'),
                );
                navigation.navigate('Authentication');
                return;
              }
              // 手机号
              if (!loggedInResult.mobile || loggedInResult.mobile.length == 0) {
                navigation.navigate('UpdateMobile');
                Toast.fail(transfer(language, '请先绑定手机号'));
                return;
              }
              this.showOverlay(item);
            }}>
            <View
              style={[
                styles.item_container_bottom_right,
                {backgroundColor: operateType == 0 ? '#DF4B43' : '#4DA54A'},
              ]}>
              <Text style={styles.item_container_bottom_right_text}>{`${
                operateType == 0 ? '购买' : '出售'
              }`}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.item_container_bottom_line} />
      </View>
    );
  }

  renderItem = ({item, index}) => {
    {
      return this.hasAlipay()
        ? this.renderItemData(item)
        : item.paytype.indexOf('card') != -1
        ? this.renderItemData(item)
        : null;
    }
  };

  refreshData() {
    this.requestData(this.props, 'more');
  }

  loadMoreData() {
    const {isLoadingHandicap, hasNextHandicap} = this.props;
    if (isLoadingHandicap == true) {
      return;
    }
    if (hasNextHandicap) {
      this.refreshData();
    }
  }

  headerComponent() {
    const {currencyList} = this.props;
    return (
      <View style={{height: common.h44, width: '100%'}}>
        <FlatList
          data={currencyList}
          extraData={this.props.form}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={this.renderHeaderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.top_line} />
      </View>
    );
  }

  renderFooter = () => {
    const {hasNextHandicap, language, handicapList} = this.props;
    if (!handicapList.length) return null;

    if (hasNextHandicap) {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(language, 'loading_more')}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(language, 'loading_no_date')}
          </Text>
        </View>
      );
    }
  };

  render() {
    const {form, handicapList, isLoadingHandicap} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.props.isLoadingHandicap}
          onRefresh={() => {
            this.requestData(this.props, 'reload');
          }}
          data={handicapList}
          extraData={form}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          onEndReached={() => {
            this.loadMoreData();
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => this.headerComponent()}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_container: {
    justifyContent: 'space-between',
    paddingHorizontal: common.margin12,
    paddingTop: common.margin20,
    paddingBottom: common.margin8,
  },
  item_container_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item_container_top_left: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  item_container_top_left_image: {
    width: common.w25,
    height: common.w25,
    borderRadius: common.w25 / 2,
    backgroundColor: common.themeColor,
  },
  item_container_top_left_text: {
    color: common.navTitleColor,
    fontSize: common.font14,
    marginLeft: common.margin5,
  },
  item_container_top_right: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  item_container_mid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: common.margin5,
  },
  item_container_mid_left: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  item_container_mid_right: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  item_container_mid2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item_container_mid2_left: {
    fontSize: common.font14,
    color: common.navTitleColor,
  },
  item_container_mid2_right: {
    fontSize: common.font17,
    color: common.themeColor,
  },
  item_container_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: common.margin5,
    alignItems: 'center',
  },
  item_container_bottom_left: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  item_container_bottom_left_image: {
    width: common.w20,
    height: common.w20,
    marginRight: common.margin10,
  },
  item_container_bottom_right: {
    paddingVertical: common.margin8,
    paddingHorizontal: common.margin25,
    backgroundColor: common.themeColor,
    borderRadius: common.margin5,
  },
  item_container_bottom_right_text: {
    fontSize: common.font17,
    color: 'white',
  },
  item_container_bottom_line: {
    backgroundColor: common.placeholderColor,
    height: 0.5,
    width: '100%',
    marginTop: common.margin8,
  },
  overlay_cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.3,
  },
  item_name2: {
    fontSize: common.font17,
    color: common.themeColor,
  },
  item_line: {
    width: '50%',
    height: 2,
    backgroundColor: common.themeColor,
    borderRadius: 1,
  },
  top_line: {
    backgroundColor: common.placeholderColor,
    height: 0.5,
    width: '100%',
  },
  top_item_container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: common.margin12,
    paddingHorizontal: common.margin15,
  },
  fonterContainer: {
    height: common.h40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonterText: {
    color: common.navTitleColor,
    fontSize: common.font14,
  },
});

function mapStateToProps(state) {
  return {
    ...state.FiatCurrency,
    payTypeList: state.user.payTypeList,
    language: state.system.language,
    loggedInResult: state.login.data,
  };
}

export default connect(mapStateToProps)(withNavigation(FiatCurrencyList));
