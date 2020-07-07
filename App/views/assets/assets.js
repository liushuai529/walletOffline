import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { Toast } from 'teaset';
import { common } from '../../constants/common';
import {
  requesetUserAssets,
  endRefreshingUserAssets,
} from '../../redux/actions/user';
import BigNumber from 'bignumber.js';
import transfer from '../../localization/utils';
import { requestExchangeRate } from '../../redux/actions/assets';
import { withNavigationFocus } from 'react-navigation';
import actions from '../../redux/actions/index'
import { queryConfigUserSettings } from '../../redux/actions/user';
import cache from '../../utils/cache'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  top_item: {
    width: (common.sw - common.margin20 * 2) / 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: common.margin5,
  },
  top_item_image: {
    width: common.sw / 10,
    height: common.sw / 10,
    tintColor: '#787878',
  },
  top_item_text: {
    fontSize: 12,
    color: '#787878',
    textAlign: 'center',
    marginTop: common.margin10,
    marginHorizontal: common.margin5,
  },
  item_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#EBEBEB',
    marginBottom: common.margin10,
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: common.margin8,
    paddingVertical: common.margin12,
  },
  item_container_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_container_left_text: {
    fontSize: common.font15,
    color: common.navTitleColor,
    marginLeft: common.margin10,
  },
  item_container_right: {
    fontSize: common.font15,
    color: common.navTitleColor,
  },
});

class Assets extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'assets_1'),
      headerTintColor: common.navTitleColor,
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: common.font17,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      operateStaus: 0,
      operateType: 2,
      reload: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isFocused && this.state.reload) {
        this.loadData();
        this.state.reload = false;
        setTimeout(() => {
          this.state.reload = true;
        }, 1000 * 10);
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.loadData();
    this.timer = setInterval(() => {
      this.loadData();
    }, 60 * 1000);
    if (this.props.isLogin) dispatch(actions.sync());
    cache.setObject('currentComponentVisible', 'Assets');
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payMentConfig, requestType } = nextProps;
    if (nextProps.reloadAssets) {
      this.loadData();
    }
    if (payMentConfig && payMentConfig !== this.props.payMentConfig) {
      if (payMentConfig.idpass && this.props.loggedInResult.idCardAuthStatus !== common.user.status.pass) {
        Toast.fail(transfer(this.props.language, 'withdraw_please_perform_authentication_first'));
        return
      }
      this.showAlert(1);
    }

  }

  loadData() {
    this.refreshData();
    const { dispatch } = this.props;
    dispatch(endRefreshingUserAssets());
    dispatch(requestExchangeRate());
  }

  refreshData() {
    const { dispatch } = this.props;
    dispatch(requesetUserAssets({ token_ids: ['*'] }));
  }

  showAlert(type) {
    const array = ['RechargeAlert', 'WithdrawAlert', 'ExchangeAlert'];
    const { navigation } = this.props;
    navigation.navigate(array[type]);
  }

  renderRefreshControl = () => {
    return (
      <RefreshControl
        refreshing={this.props.isLoadUserAssets}
        onRefresh={() => {
          this.refreshData();
        }}
      />
    );
  };
  _renderOperateContent = index => { };


  render() {
    const { assets, legalDic, exchangeRate, loggedInResult, payMentConfig, dispatch } = this.props;
    const P =
      exchangeRate && exchangeRate['USDTETH'] && exchangeRate['USDTETH'].P
        ? exchangeRate['USDTETH'].P
        : 0;
    const B =
      exchangeRate && exchangeRate['USDTETH'] && exchangeRate['USDTETH'].B
        ? exchangeRate['USDTETH'].B
        : 0;
    let amount1 = BigNumber(P).multipliedBy(
      assets && assets.revenue && assets.revenue.profit
        ? assets.revenue.profit
        : '0',
    );
    let amount2 = BigNumber(B).multipliedBy(
      assets && assets.revenue && assets.revenue.bonus
        ? assets.revenue.bonus
        : '0',
    );

    let freezed = common.removeInvalidZero(
      BigNumber(
        legalDic && legalDic['USDT']
          ? BigNumber(legalDic['USDT'].freezed)
          : '0',
      ).toFixed(8, 1),
    );

    let amount = common.removeInvalidZero(
      BigNumber(amount1)
        .plus(freezed)
        .plus(amount2)
        .plus(
          legalDic && legalDic['USDT']
            ? BigNumber(legalDic['USDT'].amount)
            : '0',
        )
        .toFixed(8, 1),
    );

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
      <View style={styles.container}>
        <ScrollView refreshControl={this.renderRefreshControl()}>
          <View
            style={{
              backgroundColor: common.navBgColor,
              paddingBottom: 0,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate('RechargeRecord');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: common.font14,
                    color: common.navTitleColor,
                  }}>
                  {transfer(this.props.screenProps.language, 'assets_2')}
                </Text>
                <Image
                  style={{
                    width: common.w20,
                    height: common.w20,
                    marginHorizontal: common.margin5,
                  }}
                  resizeMode="contain"
                  source={require('../../resource/assets/assets_record.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <ImageBackground
              style={{
                marginVertical: common.margin5,
                width: common.getH(355),
                height: common.getH(187),
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: common.h10,
                justifyContent: 'space-around',
              }}
              source={require('../../resource/assets/assets_bg.png')}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: common.font14,
                    color: '#3A3532',
                    marginTop: common.margin12,
                    marginBottom: common.margin5,
                  }}>
                  {`${transfer(this.props.language, 'total_asset')}（USDT）`}
                </Text>
                <Text
                  style={{
                    fontSize: common.font25,
                    color: '#000',
                    padding: common.margin5,
                  }}>
                  {amount}
                </Text>
                <Text
                  style={{
                    fontSize: common.font14,
                    color: '#3A3532',
                  }}
                />
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.showAlert(2);
                }}>
                <View
                  style={{
                    padding: common.margin8,
                    backgroundColor: '#9D927A',
                    marginBottom: common.margin25,
                    borderRadius: common.h5 / 2,
                  }}>
                  <Text style={{ fontSize: common.font14, color: '#E1D3AE' }}>
                    {transfer(this.props.language, 'assets_5')}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </ImageBackground>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback
                disabled={false}
                onPress={() => {
                  this.showAlert(0);
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: common.font17,
                      color:
                        this.state.operateType == 1
                          ? common.themeColor
                          : common.navTitleColor,
                      paddingVertical: common.margin12,
                    }}>
                    {transfer(this.props.language, 'assets_3')}
                  </Text>
                  <View
                    style={{
                      height: common.getH(3),
                      width: common.w25,
                      backgroundColor:
                        this.state.operateType == 1
                          ? common.themeColor
                          : 'transparent',
                      borderRadius: common.getH(3),
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                disabled={false}
                onPress={() => {
                  dispatch(queryConfigUserSettings({keys: ['PaymentConfig']}))
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: common.font17,
                      color:
                        this.state.operateType == 0
                          ? common.themeColor
                          : common.navTitleColor,
                      paddingVertical: common.margin12,
                    }}>
                    {transfer(this.props.language, 'assets_4')}
                  </Text>

                  <View
                    style={{
                      height: common.getH(3),
                      width: common.w25,
                      backgroundColor:
                        this.state.operateType == 0
                          ? common.themeColor
                          : 'transparent',
                      borderRadius: common.getH(3),
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
              {this.props.language === 'zh_hans' ? (
                <TouchableWithoutFeedback
                  disabled={false}
                  onPress={() => {
                    this.props.navigation.navigate('FiatCurrency');
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: common.font17,
                        color:
                          this.state.operateType == 0
                            ? common.themeColor
                            : common.navTitleColor,
                        paddingVertical: common.margin12,
                      }}>
                      法币交易
                    </Text>
                    <View
                      style={{
                        height: common.getH(3),
                        width: common.w25,
                        backgroundColor:
                          this.state.operateType == 0
                            ? common.themeColor
                            : 'transparent',
                        borderRadius: common.getH(3),
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
            </View>
            {/*
						<View>

              {
                this.state.operateStaus === 0 ? null: this.state.operateType === 0 ? <WithdrawAlert/> : <RechargeAlert/>
                
              }
              
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.state.operateStaus ? this.setState({operateStaus: 0}): this.setState({operateStaus: 1})
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: common.sw / 2 - common.margin15,
									bottom:-common.margin10
                }}>
                <Image
                  style={{
                    width: common.w30,
                    height: common.w30,
                    marginHorizontal: common.margin5,
                  }}
                  resizeMode="contain"
                  source={this.state.operateStaus ? require('../../resource/assets/assets_pull_up.png'): require('../../resource/assets/assets_pull_down.png')}
                />
              </View>
            </TouchableWithoutFeedback>
						*/}
          </View>
          <View
            style={{
              backgroundColor: '#46454A',
              marginHorizontal: common.margin10,
              marginVertical: common.margin5,
              marginTop: common.margin30,
              borderRadius: common.h5 / 2,
            }}>
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'assets_6')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>
                {assets.revenue && assets.revenue.profit
                  ? common.removeInvalidZero(
                    BigNumber(assets.revenue.profit).toFixed(8, 1),
                  )
                  : '0'}
              </Text>
            </View>
            {/* <View style={{width: '100%', height: 1, backgroundColor: '#565559'}} />
						<View style={styles.item_container}>
							<View style={styles.item_container_left}>
								<Text style={styles.item_container_left_text}>{transfer(this.props.language, 'assets_7')}</Text>
							</View>
							<Text style={[styles.item_container_right]}>
								{assets.revenue && assets.revenue.bonus ? common.removeInvalidZero(BigNumber(assets.revenue.bonus).toFixed(8, 1)) : '0'}
							</Text>
						</View> */}
            <View
              style={{ width: '100%', height: 1, backgroundColor: '#565559' }}
            />
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'assets_8')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>{new_usdt}</Text>
            </View>
            <View
              style={{ width: '100%', height: 1, backgroundColor: '#565559' }}
            />
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'local_20')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>{freezed}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#46454A',
              margin: common.margin10,
              borderRadius: common.h5 / 2,
              marginBottom: common.margin30,
            }}>
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'assets_9')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>
                {assets.revenue && assets.revenue.total_profit
                  ? common.removeInvalidZero(
                    BigNumber(assets.revenue.total_profit).toFixed(8, 1),
                  )
                  : '0'}
              </Text>
            </View>
            <View
              style={{ width: '100%', height: 1, backgroundColor: '#565559' }}
            />
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'assets_10')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>
                {assets.revenue && assets.revenue.share_bonus
                  ? common.removeInvalidZero(
                    BigNumber(assets.revenue.share_bonus).toFixed(8, 1),
                  )
                  : '0'}
              </Text>
            </View>
            {this.props.busi_bonus == 1 ||
              BigNumber(assets.revenue.busi_bonus).gt(0) ? (
                <View
                  style={{ width: '100%', height: 1, backgroundColor: '#565559' }}
                />
              ) : null}
            {this.props.busi_bonus == 1 ||
              BigNumber(assets.revenue.busi_bonus).gt(0) ? (
                <View style={styles.item_container}>
                  <View style={styles.item_container_left}>
                    <Text style={styles.item_container_left_text}>
                      {transfer(this.props.language, 'assets_11')}
                    </Text>
                  </View>
                  <Text style={[styles.item_container_right]}>
                    {assets.revenue && assets.revenue.busi_bonus
                      ? common.removeInvalidZero(
                        BigNumber(assets.revenue.busi_bonus).toFixed(8, 1),
                      )
                      : '0'}
                  </Text>
                </View>
              ) : null}
            <View
              style={{ width: '100%', height: 1, backgroundColor: '#565559' }}
            />
            <View style={styles.item_container}>
              <View style={styles.item_container_left}>
                <Text style={styles.item_container_left_text}>
                  {transfer(this.props.language, 'local_19')}
                </Text>
              </View>
              <Text style={[styles.item_container_right]}>
                {assets.revenue && assets.revenue.recom_bonus
                  ? common.removeInvalidZero(
                    BigNumber(assets.revenue.recom_bonus).toFixed(8, 1),
                  )
                  : '0'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.user,
    reloadAssets: state.assets.reloadAssets,
    exchangeRate: state.assets.exchangeRate,
    busi_bonus: state.user.busi_bonus,
    loggedInResult: state.login.data,
    isLogin: state.login.isLogin,
    payMentConfig: state.user.payMentConfig,
  };
}

export default connect(mapStateToProps)(withNavigationFocus(Assets));
