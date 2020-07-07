import React from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  Image,
  DeviceEventEmitter,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { common, storeRead } from '../../constants/common';
import {
  requestMyProducts,
  loadMoreMyProducts,
  endRefreshing,
  requestAnnouncement,
} from '../../redux/actions/machine';
import {
  requestAllProducts,
  requestTotalProducts,
} from '../../redux/actions/buy_machine';
import { requesetUserAssets } from '../../redux/actions/user';
import BigNumber from 'bignumber.js';
import { USER_BUY_PRODUCTS_SUCCESS_KEY } from '../../constants/constant';
import MarqueeLabel from '../../components/MarqueeLabel';
import transfer from '../../localization/utils';
import { Overlay } from 'teaset';
import actions from '../../redux/actions/index';
import schemas from '../../schemas/index';

const styles = StyleSheet.create({
  fonterContainer: {
    height: common.h40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonterText: {
    color: '#999999',
    fontSize: common.font14,
  },
  topItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: common.margin10,
  },
  topItem_image: {
    width: common.w50,
    height: common.w50,
  },
  topItem_text: {
    fontSize: common.font14,
    color: '#4A4035',
  },
  item_container: {
    marginHorizontal: common.margin15,
    marginVertical: common.margin10,
    flexDirection: 'row',
  },
  item_container_left1: {
    fontSize: common.font20,
    color: common.themeColor,
  },
  item_container_left2: {
    fontSize: common.font20,
    color: common.themeColor,
    marginLeft: common.margin5,
  },
  item_container_centertext: {
    fontSize: common.font16,
    color: common.navTitleColor,
    marginVertical: common.margin5,
  },
  item_container_center_mid_text: {
    fontSize: common.font16,
    color: common.navTitleColor,
    marginVertical: common.margin5,
  },
  item_container_right_text1: {
    fontSize: common.font16,
    color: '#787878',
  },
  item_container_right_text2: {
    fontSize: common.font14,
    color: common.themeColor,
    marginTop: common.margin5,
  },
  item_bottom_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: common.navBgColor,
    position: 'absolute',
    bottom: 0,
  },
  header_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: common.margin20,
  },
  header_container_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: common.margin20,
  },
  header_container_bottom_center: {
    fontSize: common.font20,
    fontWeight: 'bold',
    color: common.themeColor,
    marginLeft: common.margin20,
  },
  header_container_bottom_right: {
    width: common.w25,
    height: common.w25,
    paddingHorizontal: common.margin10,
    marginHorizontal: common.margin10,
  },
});

class Machine extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'machine04'),
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
      isShowAlert: false,
    };
  }

  componentDidMount() {
    this.refreshData();
    this.uiListener = DeviceEventEmitter.addListener(
      USER_BUY_PRODUCTS_SUCCESS_KEY,
      item => {
        setTimeout(() => {
          this.refreshData();
        }, 500);
      },
    );
    this.uiListener1 = DeviceEventEmitter.addListener(
      'refreshMachine',
      item => {
        this.timer1 = setTimeout(() => {
          this.refreshData();
        }, 10 * 1000);
      },
    );
    this.timer = setInterval(() => {
      this.props.dispatch(requestAnnouncement({ language: this.props.language }));
    }, 60 * 1000);
    if (this.props.isLogin) this.props.dispatch(actions.sync());
  }

  componentWillUnmount() {
    this.uiListener.remove();
    this.uiListener1.remove();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timer1) {
      clearInterval(this.timer1);
      this.timer1 = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.isLoading &&
      nextProps.showAlert &&
      !this.state.isShowAlert
    ) {
      this.state.isShowAlert = true;
      // this.showAlert(0);
    }
    this.handleSync(nextProps);
  }

  handleSync = nextProps => {
    if (this.props.authorize.syncing && !nextProps.authorize.syncing) {
      const { syncSuccess } = nextProps.authorize;
      const { isLogin } = nextProps;
      if (syncSuccess) {
        this.syncSuccess(isLogin);
      } else {
        this.syncFailed();
      }
    }
  };

  syncSuccess = isLogin => {
    const { language } = this.props;
    storeRead(common.user.string, result => {
      if (result) {
        const { dispatch } = this.props;
        if (isLogin) {
          // cache.setObject('isLoginIn', 'true');
          const user = JSON.parse(result);
          dispatch(actions.findUserUpdate(user));
          dispatch(actions.findUser(schemas.findUser(user.id)));
          // dispatch(system.updateRemoteLanguage({lang: language}));
        } else {
          // cache.removeObject('isLoginIn');
          // dispatch(actions.clearLogin());
        }
      }
    });
  };

  syncFailed = () => {
    // const {dispatch} = this.props;
    // dispatch(
    // actions.findAssetListUpdate({
    // asset: [],
    // amountVisible: undefined,
    // }),
    // );
  };

  showAlert(index) {
    this.hideAlert();
    let overlayView = (
      <Overlay.View style={{ flex: 1 }} modal={false} overlayOpacity={0}>
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
              {transfer(
                this.props.language,
                index == 0 ? 'alert_38' : 'alert_40',
              )}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.hideAlert();
                if (index == 1) {
                  setTimeout(() => {
                    const { navigation } = this.props;
                    navigation.navigate('BuyMachine');
                  }, 300);
                }
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
                  style={{ fontSize: common.font20, color: common.themeColor }}>
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

  refreshData() {
    const { dispatch } = this.props;
    this.loadData();
    dispatch(endRefreshing());
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
    dispatch(requestAnnouncement({ language: this.props.language }));
    dispatch(requesetUserAssets({ token_ids: ['*'] }));
  }

  loadData() {
    const { dispatch, limit } = this.props;
    dispatch(
      requestMyProducts({
        skip: 0,
        limit: limit,
        orderby: ['status', 'id'],
      }),
    );
  }

  loadMoreData() {
    if (!this.props.hasNext || this.props.isLoadingMore) return;
    const { dispatch, page, limit } = this.props;
    dispatch(
      loadMoreMyProducts({
        skip: page * limit,
        limit: limit,
        orderby: ['status', 'id'],
      }),
    );
  }

  renderFooter = () => {
    if (this.props.myProducts.length < this.props.limit) return null;

    if (this.props.hasNext) {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(this.props.language, 'machine02')}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(this.props.language, 'machine03')}
          </Text>
        </View>
      );
    }
  };

  renderItem(item, index) {
    const { allProductsNameDic, stateDic } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => { }}>
        <View style={{ paddingVertical: common.margin10 }}>
          <View style={styles.item_container}>
            <View style={{ flex: 4 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: common.margin10,
                }}>
                <Text style={styles.item_container_left1}>
                  {transfer(this.props.language, 'machine04')}
                </Text>
                <Text style={styles.item_container_left2}>
                  {allProductsNameDic[item.prod_id]
                    ? allProductsNameDic[item.prod_id]
                    : item.prod_id}
                </Text>
              </View>
              <Text style={styles.item_container_centertext}>{`${transfer(
                this.props.language,
                'machine05',
              )}：${common.removeInvalidZero(
                BigNumber(item.buy_price).toFixed(8, 1),
              )}`}</Text>
              <Text style={styles.item_container_center_mid_text}>{`${transfer(
                this.props.language,
                'machine06',
              )}：${common.removeInvalidZero(
                BigNumber(item.total_income).toFixed(8, 1),
              )}`}</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <ImageBackground
                style={{
                  width: common.getH(60),
                  height: common.getH(60),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                resizeMode="cover"
                source={require('../../resource/assets/circle.png')}>
                <Text
                  style={
                    styles.item_container_right_text2
                  }>{`${common.removeInvalidZero(
                    BigNumber(item.fixed_rate)
                      .multipliedBy(100)
                      .toFixed(2, 1),
                  )}%`}</Text>
              </ImageBackground>
              <Text style={styles.item_container_centertext}>
                {stateDic[item.status]}
              </Text>
            </View>
          </View>
          <View style={styles.item_bottom_line} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  listHeaderComponent = () => {
    const { announcement } = this.props;
    const content =
      announcement && announcement.content
        ? announcement.content.replace(/[\n\r]/g, '    ')
        : '';
    let mWidth = Dimensions.get('window').width;
    return (
      <View style={{ flex: 1, backgroundColor: common.bgColor }}>
        {content && content.length > 0 ? (
          <TouchableWithoutFeedback
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate('Announcement', {
                content: announcement.content,
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: common.bgColor,
                  width: common.getH(100),
                  height: '100%',
                  zIndex: 999,
                  borderWidth: 0,
                }}
              />
              <Image
                style={{
                  backgroundColor: common.bgColor,
                  width: 25,
                  height: '100%',
                  tintColor: common.navTitleColor,
                  zIndex: 999,
                }}
                resizeMode={'contain'}
                source={require('../../resource/assets/laba.png')}
              />
              <MarqueeLabel
                bgViewStyle={{ width: mWidth - 100, height: 50 }}
                speed={this.props.language == 'en' ? 40 : 60}
                textStyle={{
                  fontSize: common.font17,
                  color: common.navTitleColor,
                }}>
                {content}
              </MarqueeLabel>
              <View
                style={{
                  backgroundColor: common.bgColor,
                  width: common.getH(100),
                  height: '100%',
                  zIndex: 999,
                  borderWidth: 0,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <View style={styles.header_container}>
          <TouchableWithoutFeedback
            disabled={false}
            onPress={() => {
              this.showAlert(1);
            }}>
            <View style={styles.topItem}>
              <Image
                resizeMode="contain"
                style={styles.topItem_image}
                source={require('../../resource/assets/buy.png')}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: common.h32,
                  borderRadius: common.h32 / 2,
                  paddingHorizontal: common.margin20,
                  backgroundColor: common.themeColor,
                  marginTop: common.margin20,
                }}>
                <Text style={styles.topItem_text}>
                  {transfer(this.props.language, 'machine09')}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            onPress={() => {
              const {navigation} = this.props;
              navigation.navigate('UpdateMachine');
            }}>
            <View style={styles.topItem}>
              <Image
                resizeMode="contain"
                style={styles.topItem_image}
                source={require('../../resource/assets/update.png')}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: common.h32,
                  borderRadius: common.h32 / 2,
                  paddingHorizontal: common.margin20,
                  backgroundColor: common.themeColor,
                  marginTop: common.margin20,
                }}>
                <Text style={styles.topItem_text}>
                  {transfer(this.props.language, 'machine10')}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback> */}
        </View>
        <View
          style={{
            height: common.h5,
            backgroundColor: common.navBgColor,
            width: '100%',
          }}
        />
        <View style={styles.header_container_bottom}>
          <Text style={styles.header_container_bottom_center}>
            {transfer(this.props.language, 'machine12')}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate('MachineRecord');
            }}>
            <Image
              source={require('../../resource/assets/record.png')}
              style={styles.header_container_bottom_right}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{ width: '100%', height: 1, backgroundColor: common.navBgColor }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: common.bgColor }}>
        <FlatList
          refreshing={this.props.isLoading}
          onRefresh={() => {
            this.loadData();
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={this.props.myProducts}
          ListHeaderComponent={this.listHeaderComponent()}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            this.loadMoreData();
          }}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.machine,
    authorize: state.authorize,
    allProductsNameDic: state.buy_machine.allProductsNameDic,
    isLogin: state.login.isLogin,
  };
}

export default connect(mapStateToProps)(Machine);
