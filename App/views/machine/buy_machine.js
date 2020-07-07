import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {PopoverPicker} from 'teaset';
import {
  requestAllProducts,
  requestTotalProducts,
  changeProductsIndex,
  requestBuyProduct,
  requestEstimate,
  clearData,
} from '../../redux/actions/buy_machine';
import {requesetUserAssets} from '../../redux/actions/user';
import BigNumber from 'bignumber.js';
import {Toast, Overlay} from 'teaset';
import {USER_BUY_PRODUCTS_SUCCESS_KEY} from '../../constants/constant';
import Alert from '../../components/Alert';
import transfer from '../../localization/utils';
import actions from '../../redux/actions/index'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: common.h60,
    paddingHorizontal: common.margin20,
  },
  item_left: {
    fontSize: common.font16,
    color: '#9C9C9C',
    minWidth: common.w150,
  },
  item_right: {
    fontSize: common.font16,
    color: '#9C9C9C',
    flex: 1,
  },
  select: {
    flex: 1,
    borderColor: common.textColor,
    borderWidth: 1,
    borderRadius: common.h5 / 2,
    flexDirection: 'row',
    height: common.h36,
    justifyContent: 'space-between',
  },
  select_text: {
    color: '#9C9C9C',
    fontSize: common.font14,
    marginVertical: common.margin8,
    marginRight: common.margin15,
    marginHorizontal: common.margin10,
    flex: 1,
  },
  btn_container: {
    paddingVertical: common.margin15,
    paddingHorizontal: common.margin20,
  },
  btn_inside: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: common.margin15,
  },
  btn_text: {
    color: common.textColor,
    fontSize: common.font16,
  },
});

class BuyMachine extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'buy_machine01'),
    };
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(clearData());
  }

  componentDidMount() {
    const {dispatch, navigation} = this.props;
    dispatch(
      requestTotalProducts({
        skip: 0,
        limit: 500,
        orderby: 'id',
      }),
    );
    dispatch(
      requestAllProducts({
        skip: 0,
        limit: 500,
        orderby: 'buy_price',
        where: {
          status: 'allow',
        },
      }),
    );
    dispatch(
      requesetUserAssets({
        token_ids: ['*'],
      }),
    );
    this.uiListener = DeviceEventEmitter.addListener(
      USER_BUY_PRODUCTS_SUCCESS_KEY,
      item => {
        navigation.goBack();
      },
    );
    if (this.props.loggedIn) this.props.dispatch(actions.sync());
  }

  componentWillUnmount() {
    this.uiListener.remove();
  }

  showView(view) {
    if (this.props.allProductsName.length == 0) {
      Toast.fail(transfer(this.props.language, 'buy_machine02'));
      return;
    }
    view.measure((x, y, width, height, pageX, pageY) => {
      PopoverPicker.show(
        {
          x: pageX,
          y: pageY,
          width,
          height,
        },
        this.props.allProductsName,
        this.props.selectProductsIndex,
        (item, index) =>
          setTimeout(() => {
            this.props.dispatch(changeProductsIndex(index));
            this.props.dispatch(
              requestEstimate({
                buy_prices: [this.props.selectProduct.buy_price],
                check_asset: 'no',
              }),
            );
          }, 300),
        {
          modal: false,
        },
      );
    });
  }

  buyAction() {
    const {selectProduct} = this.props;
    if (!selectProduct) {
      Toast.fail(transfer(this.props.language, 'buy_machine03'));
      return;
    }
    this.showAlert();
  }

  showAlert() {
    const {dispatch, selectProduct} = this.props;
    this.hideAlert();
    let overlayView = (
      <Overlay.View style={{flex: 1}} modal={false} overlayOpacity={0}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: common.margin20,
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: 0.7,
            }}
          />
          <View
            style={{
              backgroundColor: common.themeColor,
              borderRadius: common.h5,
              paddingHorizontal: common.margin20,
              paddingVertical: common.margin30,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.hideAlert();
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: common.margin5,
                  right: common.margin5,
                  width: common.h44,
                  height: common.h44,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: common.w15,
                    height: common.w15,
                    tintColor: common.textColor,
                  }}
                  source={require('../../resource/assets/close_icon.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontSize: common.font17,
                lineHeight: common.h28,
                color: common.textColor,
                marginTop: common.margin20,
              }}>
              {transfer(this.props.language, 'alert_40')}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.hideAlert();
                setTimeout(() => {
                  if (this.isPush) return;
                  this.isPush = true;
                  setTimeout(() => {
                    this.isPush = false;
                  }, 2000);
                  dispatch(
                    requestBuyProduct({
                      prod_id: selectProduct.id,
                    }),
                  );
                }, 200);
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: common.bgColor,
                  marginTop: common.margin20,
                  marginHorizontal: common.margin20,
                  paddingVertical: common.margin10,
                  borderRadius: common.h5,
                }}>
                <Text
                  style={{fontSize: common.font20, color: common.themeColor}}>
                  {transfer(this.props.language, 'alert_36')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay.View>
    );
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideAlert() {
    if (this.overlayViewKeyID) {
      Overlay.hide(this.overlayViewKeyID);
      this.overlayViewKeyID = null;
    }
  }

  render() {
    const {selectProduct, assets, estimate, legalDic} = this.props;
    const price =
      selectProduct && estimate ? estimate[selectProduct.buy_price] : undefined;
    let atv =
      assets.revenue && assets.revenue.bonus
        ? common.removeInvalidZero(
            BigNumber(assets.revenue.bonus).toFixed(8, 1),
          )
        : '0';
    let usdt =
      legalDic && legalDic['USDT']
        ? common.removeInvalidZero(
            BigNumber(legalDic['USDT'].amount).toFixed(8, 1),
          )
        : '0';
    let new_usdt = common.removeInvalidZero(
      BigNumber(atv)
        .plus(usdt)
        .toFixed(8, 1),
    );
    return (
      <ImageBackground
        style={{flex: 1, backgroundColor: common.bgColor}}
        source={require('../../resource/assets/nomal_bg.png')}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.item, {marginTop: common.margin10}]}>
            <Text style={[styles.item_left, {minWidth: common.w120}]}>
              {transfer(this.props.language, 'buy_machine07')}:
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.showView(this.fromView);
              }}>
              <View
                ref={view => {
                  this.fromView = view;
                }}
                style={styles.select}>
                <Text style={styles.select_text}>
                  {selectProduct
                    ? selectProduct.name
                    : transfer(this.props.language, 'buy_machine08')}
                </Text>
                <Image
                  style={{
                    width: common.h10,
                    height: common.h10,
                    alignSelf: 'center',
                    marginRight: common.margin10,
                    tintColor: common.themeColor,
                  }}
                  source={require('../../resource/assets/down.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine09')}：
            </Text>
            <Text style={styles.item_right}>
              {selectProduct
                ? common.removeInvalidZero(
                    BigNumber(selectProduct.buy_price).toFixed(8, 1),
                  )
                : ''}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine10')}：
            </Text>
            <Text style={styles.item_right}>
              {selectProduct
                ? common.removeInvalidZero(
                    BigNumber(selectProduct.mine_base).toFixed(8, 1),
                  )
                : ''}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine11')}：
            </Text>
            <Text style={styles.item_right}>
              {selectProduct
                ? `${common.removeInvalidZero(
                    BigNumber(selectProduct.fixed_rate)
                      .multipliedBy(100)
                      .toFixed(8, 1),
                  )}%`
                : ''}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine12')}：
            </Text>
            <Text style={styles.item_right}>
              {selectProduct
                ? common.removeInvalidZero(
                    BigNumber(selectProduct.outof_multipe).toFixed(8, 1),
                  )
                : ''}
            </Text>
          </View>
          <View style={[styles.item, {height: common.h100}]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine13')}：
            </Text>
            <Text style={styles.item_right}>
              {price
                ? `${common.removeInvalidZero(
                    BigNumber(price.legal).toFixed(8, 1),
                  )} USDT`
                : ''}
            </Text>
            {/* <Text style={styles.item_right}>
              {price
                ? `\nATV:${common.removeInvalidZero(
                    BigNumber(price.bonus).toFixed(8, 1),
                  )}\n\nTV:${common.removeInvalidZero(
                    BigNumber(price.profit).toFixed(8, 1),
                  )}\n`
                : ''}
            </Text> */}
          </View>
          <View style={[styles.item]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine14')}：
            </Text>
            <Text style={styles.item_right}>{new_usdt}</Text>
          </View>
          {/* <View style={[styles.item, {marginBottom: common.margin20}]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'buy_machine15')}：
            </Text>
            <Text style={styles.item_right}>
              {assets && assets.revenue && assets.revenue.profit
                ? common.removeInvalidZero(
                    BigNumber(assets.revenue.profit).toFixed(8, 1),
                  )
                : '0'}
            </Text>
          </View> */}
        </ScrollView>
        <View style={styles.btn_container}>
          <ImageBackground
            style={{padding: 0}}
            source={require('../../resource/assets/login_btn.png')}>
            <TouchableWithoutFeedback onPress={() => this.buyAction()}>
              <View style={styles.btn_inside}>
                <Text style={styles.btn_text}>
                  {transfer(this.props.language, 'buy_machine16')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.buy_machine,
    ...state.user,
    assets: state.user.assets,
    isLogin: state.login.isLogin,
  };
}

export default connect(mapStateToProps)(BuyMachine);
