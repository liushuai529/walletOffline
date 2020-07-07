import React from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  Image,
  DeviceEventEmitter,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import {
  requestFiveProfitList,
  endRefreshingFive,
  requestRunIndex,
  requestYesterdayProfit,
  takeYesterdayProfit,
} from '../../redux/actions/profit';
import { queryConfigUserSettings_profit } from '../../redux/actions/user'
import { requestAccount } from '../../redux/actions/account';
import BigNumber from 'bignumber.js';
import transfer from '../../localization/utils';
import { withNavigationFocus } from 'react-navigation';
import actions from '../../redux/actions/index'
import Toast from 'teaset/components/Toast/Toast';
import cache from '../../utils/cache'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  topItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topItem_image: {
    width: common.w35,
    height: common.w35,
  },
  topItem_title: {
    fontSize: common.font20,
    marginTop: common.margin30,
    fontWeight: 'bold',
    color: '#FEFDFD',
    alignSelf: 'center',
    color: '#4A4035',
  },
  topItem_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: common.font25,
    textAlign: 'center',
    paddingHorizontal: common.margin5,
    color: '#4A4035',
  },
  item_container: {
    marginHorizontal: common.margin15,
    marginVertical: common.margin10,
  },
  item_container_text: {
    fontSize: common.font16,
    color: common.navTitleColor,
    flex: 1,
  },
  header_bottom_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: common.placeholderColor,
  },
  item_bottom_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: common.placeholderColor,
    position: 'absolute',
    bottom: 0,
  },
  header_container: {
    //flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    //marginBottom: common.margin15,
    //borderColor: 'red',
    //borderWidth: 1,
    paddingHorizontal: common.margin10
  },
  header_container_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: common.margin20,
  },
  header_container_bottom_center: {
    fontSize: common.font17,
    fontWeight: 'bold',
    color: common.textColor,
    paddingLeft: common.margin10,
    paddingRight: common.margin5,
  },
  header_container_bottom_right: {
    fontSize: common.font17,
    paddingRight: common.margin10,
    color: common.themeColor,
    paddingLeft: common.margin5,
  },
  header_item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header_item_top_text: {
    fontSize: common.font14,
  },
  header_item_bottom_text: {
    fontSize: common.font14,
    paddingVertical: common.margin10,
  },
});

class Profit extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'tab_profit'),
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
      reload: true,
      canTake: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isFocused && this.state.reload) {
        this.loadData();
        //this.props.dispatch(endRefreshingFive());
        //this.props.dispatch(requestAccount());
        this.state.reload = false;
        setTimeout(() => {
          this.state.reload = true;
        }, 1000 * 10);
      }
    }
  }

  componentDidMount() {
    this.loadData();
    //this.props.dispatch(endRefreshingFive());
    //this.props.dispatch(requestAccount());
    if (this.props.isLogin) this.props.dispatch(actions.sync())
    cache.setObject('currentComponentVisible', 'Profit');
  }

  componentWillUnmount() {
    if (this.time) {
      clearTimeout(this.time);
      this.time = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payMentConfig_profit, } = nextProps
    const { dispatch } = this.props;
    if (nextProps.reuqestRunIndexSuccess) {
      dispatch(
        requestYesterdayProfit({
          where: {
            run_index: nextProps.runIndex - 1,
          },
        }),
      );
    }
    if (payMentConfig_profit && payMentConfig_profit !== this.props.payMentConfig_profit) {
      if (payMentConfig_profit.idpass && this.props.loggedInResult.idCardAuthStatus !== common.user.status.pass) {
        Toast.fail(transfer(this.props.language, 'withdraw_please_perform_authentication_first'));
        return
      }
      dispatch(takeYesterdayProfit())
    }
    if (nextProps.accountInfo && nextProps.accountInfo !== this.props.accountInfo) {
      if (nextProps.accountInfo.TODAY_IS_RICHMAN) {
        console.warn('有待收')
        this.setState({ canTake: true })
      } else {
        console.warn('没待收')
        this.setState({ canTake: false })
      }
    }
    if (nextProps.takeProfitResult && nextProps.takeProfitResult !== this.props.takeProfitResult) {
      if (nextProps.takeProfitResult === '收取成功') {
        console.warn('收取成功')
        DeviceEventEmitter.emit('refreshMachine')
        let i = 0;
        this.time = setInterval(() => {
          i++;
          if (i > 20) {
            clearTimeout(this.time);
            this.time = null;
            return
          }
          if (i == 5 || i == 20) {
            this.loadData()
          }
        }, 1000);
        this.setState({ canTake: false })
      } else {
        console.warn('收取失败')
        this.setState({ canTake: true })
      }
    }

  }

  loadData() {
    const { dispatch, limit } = this.props;
    dispatch(requestRunIndex());
    dispatch(requestAccount())
    dispatch(
      requestFiveProfitList({
        skip: 0,
        limit: 5,
        orderby: '-createdAt',
        where: {
          or: [
            {
              profit: {
                gt: 0,
              },
            },
            {
              b_bonus: {
                gt: 0,
              },
            },
            {
              s_bonus: {
                gt: 0,
              },
            },
            {
              r_bonus: {
                gt: 0,
              },
            },
          ],
        },
      }),
    );
  }

  renderItem(item, index) {
    return (
      <TouchableWithoutFeedback onPress={() => { }}>
        <View style={{ paddingVertical: common.margin10 }}>
          <View style={styles.item_container}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.item_container_text}>{`${transfer(
                this.props.language,
                'profit01',
              )}：${common.covertDate(new Date(item.settleAt))}`}</Text>
              <Text style={styles.item_container_text}>{`${transfer(
                this.props.language,
                'profit03',
              )}：${common.removeInvalidZero(
                BigNumber(item.profit).toFixed(8, 1),
              )}`}</Text>
            </View>
            {this.props.busi_bonus == 1 || BigNumber(item.b_bonus).gt(0) ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: common.margin10,
                }}>
                <Text style={styles.item_container_text}>{`${transfer(
                  this.props.language,
                  'profit02',
                )}：${common.removeInvalidZero(
                  BigNumber(item.b_bonus).toFixed(8, 1),
                )}`}</Text>
                <Text style={styles.item_container_text}>{`${transfer(
                  this.props.language,
                  'profit04',
                )}：${common.removeInvalidZero(
                  BigNumber(item.s_bonus).toFixed(8, 1),
                )}`}</Text>
              </View>
            ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: common.margin10,
                  }}>
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'profit04',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.s_bonus).toFixed(8, 1),
                  )}`}</Text>
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'local_18',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.r_bonus).toFixed(8, 1),
                  )}`}</Text>
                </View>
              )}
            {this.props.busi_bonus == 1 || BigNumber(item.b_bonus).gt(0) ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: common.margin10,
                }}>
                <Text style={styles.item_container_text}>{`${transfer(
                  this.props.language,
                  'local_18',
                )}：${common.removeInvalidZero(
                  BigNumber(item.r_bonus).toFixed(8, 1),
                )}`}</Text>
                <Text style={styles.item_container_text} />
              </View>
            ) : null}
          </View>
          <View style={styles.item_bottom_line} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  listHeaderComponent = () => {
    const { total1, total2, accountInfo, fiveList, dispatch } = this.props;
    const { canTake } = this.state;
    const unProfit = accountInfo && accountInfo.TODAY_IS_RICHMAN ? accountInfo.TODAY_IS_RICHMAN.profit : 0;
    const unBonus = accountInfo && accountInfo.TODAY_IS_RICHMAN ? accountInfo.TODAY_IS_RICHMAN.bonus : 0;
    const createdAt = fiveList.length ? fiveList[0].createdAt : null
    //const canTake = accountInfo && accountInfo.TODAY_IS_RICHMAN ? true: false 
    // var day1 = createdAt ? new Date(createdAt) : null;
    // var day1 = createdAt ? new Date(createdAt) : null;
    var day1 = new Date();
    var s1;
    if (day1) {
      day1.setTime(day1.getTime());
      let month = day1.getMonth() + 1;
      let day = day1.getDate();
      s1 = `${day1.getFullYear()}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
        }`;
    }
    return (
      <View style={{ flex: 1, backgroundColor: common.bgColor }}>
        <ImageBackground
          style={{
            alignSelf: 'center',
            marginVertical: common.margin20,
            height: common.getH(194),
            width: common.getH(320),
          }}
          resizeMode="contain"
          source={require('../../resource/assets/profit_bg.png')}>
          <Text
            style={{
              fontSize: common.font16,
              alignSelf: 'center',
              marginTop: common.margin20,
              color: '#FEFDFD',
              color: '#4A4035',
              fontWeight: 'bold',
            }}>
            {s1}
          </Text>
          <TouchableWithoutFeedback
            disabled={!canTake}
            onPress={() => {
              if (this.isPush) return;
              this.isPush = true;
              setTimeout(() => {
                this.isPush = false;
              }, 2000);
              this.props.dispatch(actions.sync())
              dispatch(queryConfigUserSettings_profit({ keys: ['PaymentConfig'] }))
            }}>
            <View style={[styles.header_container,
            {
              backgroundColor: 'rgb(83,72,47)',
              borderRadius: common.margin10,
              width: common.getH(200),
              height: common.getH(40),
              alignSelf: 'center',
              marginTop: common.margin10,
            }]}
            >
              <Text style={[styles.topItem_text, { fontSize: common.font16, color: canTake ? common.themeColor : common.textColor }]}>
                {canTake ? `${transfer(this.props.language, 'profit12')}` : `${transfer(this.props.language, 'profit11')}`}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.header_container, { marginTop: common.margin20, }]}>
            <View style={styles.topItem}>
              {/* ${common.removeInvalidZero(
                BigNumber(total1).toFixed(8, 1),
              )} */}
              <Text style={styles.topItem_text}>{total1 > 0 ? `0TV` : `${common.removeInvalidZero(
                BigNumber(unProfit).toFixed(8, 1),
              )}TV`}</Text>
            </View>
            <View style={{ height: common.margin20, width: common.getH(2), backgroundColor: 'gray' }}></View>
            <View style={styles.topItem}>
              {/* ${common.removeInvalidZero(
                BigNumber(total2).toFixed(8, 1),
              )} */}
              <Text style={styles.topItem_text}>{total1 > 0 ? `0USDT` : `${common.removeInvalidZero(
                BigNumber(unBonus).toFixed(8, 1),
              )}USDT`}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.header_container_bottom}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.header_container_bottom_center}>
              {transfer(this.props.language, 'profit10')}
            </Text>
            <Image
              style={{ width: common.w20, height: common.w20 }}
              source={require('../../resource/assets/profit_left.png')}
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate('ProfitDetail');
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{ width: common.w20, height: common.w20 }}
                source={require('../../resource/assets/record.png')}
              />
              <Text style={styles.header_container_bottom_right}>
                {transfer(this.props.language, 'profit09')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.header_bottom_line} />
      </View>
    );
  };

  render() {
    console.warn(this.props.createdAt)
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.props.isLoadingFive}
          onRefresh={() => {
            this.loadData();
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={this.props.fiveList}
          ListHeaderComponent={this.listHeaderComponent()}
          renderItem={({ item, index }) => this.renderItem(item, index)}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.profit,
    accountInfo: state.account.info,
    busi_bonus: state.user.busi_bonus,
    isLogin: state.login.isLogin,
    payMentConfig_profit: state.user.payMentConfig_profit,
    loggedInResult: state.login.data,
  };
}

export default connect(mapStateToProps)(withNavigationFocus(Profit));
