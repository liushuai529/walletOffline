import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {
  endRefreshing,
  requestRecord,
  loadMoreRecord,
  changeStartDate,
  changeEndDate,
  emptyDate,
} from '../../redux/actions/assets';
import {findPaymentList} from '../../schemas/payment';
import DatePicker from 'react-native-date-picker';
import BigNumber from 'bignumber.js';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  header_container: {
    backgroundColor: common.bgColor,
    width: '100%',
    paddingVertical: common.margin15,
    paddingHorizontal: common.margin10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header_select_date_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header_select_container: {
    paddingHorizontal: common.margin15,
    height: 30,
    backgroundColor: common.navBgColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  header_select_container_text: {
    color: '#757575',
    fontSize: common.font12,
  },
  header_select_container_image: {
    width: common.getH(15),
    height: common.getH(15),
    alignSelf: 'center',
    marginLeft: common.margin10,
  },
  header_select_container_line: {
    width: common.w10,
    height: 1,
    backgroundColor: '#757575',
    marginHorizontal: common.margin5,
  },
  header_select_btn: {
    backgroundColor: common.themeColor,
    height: 30,
    paddingHorizontal: common.margin15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_select_btn_text: {
    color: common.textColor,
    fontSize: common.font14,
  },
  fonterContainer: {
    height: common.h40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonterText: {
    color: '#999999',
    fontSize: common.font14,
  },
  item_container: {
    marginHorizontal: common.margin15,
    marginVertical: common.margin10,
  },
  item_container_text: {
    fontSize: common.font14,
    color: '#787878',
  },
  item_bottom_line: {
    width: '100%',
    height: common.h10,
    backgroundColor: common.bgColor,
    position: 'absolute',
    bottom: 0,
  },
});

class RechargeRecord extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'assets_12'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      datePicker: false,
      bottom: new Animated.Value(-500),
      opacity: new Animated.Value(0),
      datePickerType: 0,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    this.loadData();
    dispatch(endRefreshing());
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(emptyDate());
  }

  loadData() {
    const {dispatch, limit, data, startDate, endDate} = this.props;
    dispatch(
      requestRecord(findPaymentList(0, limit, data, startDate, endDate)),
    );
  }

  loadMoreData() {
    if (!this.props.hasNext || this.props.isLoadingMore) return;
    const {dispatch, page, limit, data, startDate, endDate} = this.props;
    dispatch(
      loadMoreRecord(findPaymentList(page, limit, data, startDate, endDate)),
    );
  }

  showDatePicker(index) {
    this.setState({
      datePickerType: index,
      datePicker: true,
    });
    Animated.timing(this.state.bottom, {
      toValue: 0,
      duration: 300,
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  hideDatePicker() {
    Animated.timing(this.state.bottom, {
      toValue: -500,
      duration: 300,
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
    }).start();
    setTimeout(() => {
      this.setState({
        datePicker: false,
      });
      this.loadData();
      this.props.dispatch(endRefreshing());
    }, 300);
  }

  onDateChange(date) {
    const {datePickerType} = this.state;
    const {dispatch} = this.props;
    if (datePickerType == 0) {
      dispatch(changeStartDate(date));
    } else {
      dispatch(changeEndDate(date));
    }
  }

  renderFooter = () => {
    if (this.props.recordList.length < this.props.limit) return null;

    if (this.props.hasNext) {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(this.props.language, 'assets_13')}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(this.props.language, 'assets_14')}
          </Text>
        </View>
      );
    }
  };

  renderItem(item, index) {
    const {typeDic} = this.props;
    let rechargeType = 0;
    let typeName = typeDic[item.type];
    if (item.type == 'recharge' || item.type == 'deduct') {
      if (item.type == 'recharge')
        typeName = transfer(this.props.language, 'assets_15');
      if (
        (BigNumber(item.amount).gt(0) &&
          BigNumber(item.profit).eq(0) &&
          BigNumber(item.bonus).eq(0)) ||
        (BigNumber(item.amount).eq(0) &&
          BigNumber(item.profit).gt(0) &&
          BigNumber(item.bonus).eq(0)) ||
        (BigNumber(item.amount).eq(0) &&
          BigNumber(item.profit).eq(0) &&
          BigNumber(item.bonus).gt(0))
      ) {
        // 后台充值
        rechargeType = 1;
        if (item.type == 'recharge')
          typeName = transfer(this.props.language, 'assets_16');
      }
    }
    const status = {
      正常: transfer(this.props.language, 'reduce_50'),
      待审核: transfer(this.props.language, 'assets_29'),
      已拒绝: transfer(this.props.language, 'assets_30'),
      提币中: transfer(this.props.language, 'assets_31'),
      已完成: transfer(this.props.language, 'assets_32'),
      已取消: transfer(this.props.language, 'assets_33'),
      已审核: transfer(this.props.language, 'assets_34'),
      失败: transfer(this.props.language, 'assets_35'),
    };
    const array = ['profit', 'bonus'];
    const dic = {profit: 'TV', bonus: 'ATV'};
    let isMutual = false;
    let direction = '';
    let amount1 = '';
    let amount2 = '';
    if (
      item.type == 'exchange' &&
      array.includes(item.fromaddr) &&
      array.includes(item.toaddr)
    ) {
      isMutual = true;
      direction = `${transfer(this.props.language, 'local_14')}：${
        dic[item.fromaddr]
      }${transfer(this.props.language, 'local_16')}${dic[item.toaddr]}`;
      amount1 = `${transfer(
        this.props.language,
        'local_15',
      )}：${common.removeInvalidZero(
        BigNumber(item[item.fromaddr]).toFixed(8, 1),
      )}${dic[item.fromaddr]}`;
      amount2 = `${transfer(
        this.props.language,
        'local_17',
      )}：${common.removeInvalidZero(
        BigNumber(item[item.toaddr]).toFixed(8, 1),
      )}${dic[item.toaddr]}`;
    }
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View
          style={{
            paddingVertical: common.margin10,
            marginHorizontal: common.margin10,
            backgroundColor: common.navBgColor,
          }}>
          <Text
            style={[
              styles.item_container,
              {fontSize: common.font14, color: '#787878'},
            ]}>{`${transfer(
            this.props.language,
            'machine_record06',
          )}：${common.covertDate(new Date(item.createdAt))}`}</Text>
          <View style={styles.item_container}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={styles.item_container_text}>{`${transfer(
                this.props.language,
                'assets_17',
              )}：${typeName}`}</Text>
              <Text style={styles.item_container_text}>{`${transfer(
                this.props.language,
                'assets_18',
              )}：${status[item.status]}`}</Text>
            </View>
            {item.type == 'withdraw' ? (
              <View
                style={{
                  justifyContent: 'space-between',
                  marginTop: common.margin10,
                }}>
                <Text style={styles.item_container_text}>{`${transfer(
                  this.props.language,
                  'assets_19',
                )}：${common.removeInvalidZero(
                  BigNumber(item.amount).toFixed(8, 1),
                )}`}</Text>
                <Text
                  style={[
                    styles.item_container_text,
                    {marginTop: common.margin10},
                  ]}>{`${transfer(this.props.language, 'assets_20')}：${
                  item.toaddr
                }`}</Text>
              </View>
            ) : null}
            {item.type == 'exchange' ? (
              isMutual ? (
                <View
                  style={{
                    justifyContent: 'space-between',
                    marginTop: common.margin10,
                  }}>
                  <Text style={styles.item_container_text}>{direction}</Text>
                  <Text
                    style={[
                      styles.item_container_text,
                      {marginVertical: common.margin10},
                    ]}>
                    {amount1}
                  </Text>
                  <Text style={styles.item_container_text}>{amount2}</Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'space-between',
                    marginTop: common.margin10,
                  }}>
                  {BigNumber(item.amount).gt(0) ? (
                    <Text style={styles.item_container_text}>{`${transfer(
                      this.props.language,
                      'assets_19',
                    )}：${common.removeInvalidZero(
                      BigNumber(item.amount).toFixed(8, 1),
                    )}`}</Text>
                  ) : null}
                  {BigNumber(item.profit).gt(0) ? (
                    <Text
                      style={[
                        styles.item_container_text,
                        {marginTop: common.margin10},
                      ]}>{`${transfer(
                      this.props.language,
                      'assets_21',
                    )}：${common.removeInvalidZero(
                      BigNumber(item.profit).toFixed(8, 1),
                    )}`}</Text>
                  ) : null}
                  {BigNumber(item.bonus).gt(0) ? (
                    <Text
                      style={[
                        styles.item_container_text,
                        {marginTop: common.margin10},
                      ]}>{`${transfer(
                      this.props.language,
                      'assets_22',
                    )}：${common.removeInvalidZero(
                      BigNumber(item.bonus).toFixed(8, 1),
                    )}`}</Text>
                  ) : null}
                </View>
              )
            ) : null}
            {item.type == 'recharge' ? (
              <View
                style={{
                  justifyContent: 'space-between',
                  marginTop: common.margin10,
                }}>
                {BigNumber(item.profit).gt(0) ? (
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'assets_23',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.profit).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
                {BigNumber(item.bonus).gt(0) ? (
                  <Text
                    style={[
                      styles.item_container_text,
                      {marginVertical: common.margin10},
                    ]}>{`${transfer(
                    this.props.language,
                    'assets_24',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.bonus).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
                {rechargeType == 1 && BigNumber(item.amount).gt(0) ? (
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'assets_25',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.amount).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
              </View>
            ) : null}
            {item.type == 'deduct' ? (
              <View
                style={{
                  justifyContent: 'space-between',
                  marginTop: common.margin10,
                }}>
                {BigNumber(item.profit).gt(0) ? (
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'machine_record07',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.profit).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
                {BigNumber(item.bonus).gt(0) ? (
                  <Text
                    style={[
                      styles.item_container_text,
                      {marginVertical: common.margin10},
                    ]}>{`${transfer(
                    this.props.language,
                    'machine_record09',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.bonus).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
                {rechargeType == 1 && BigNumber(item.amount).gt(0) ? (
                  <Text style={styles.item_container_text}>{`${transfer(
                    this.props.language,
                    'machine_record09_1',
                  )}：${common.removeInvalidZero(
                    BigNumber(item.amount).toFixed(8, 1),
                  )}`}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
          <View style={styles.item_bottom_line} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  listHeaderComponent = () => {
    const {dispatch, startDate, endDate} = this.props;
    return (
      <View style={styles.header_container}>
        <View style={styles.header_select_date_container}>
          <TouchableWithoutFeedback onPress={() => this.showDatePicker(0)}>
            <View style={styles.header_select_container}>
              <Text style={styles.header_select_container_text}>
                {startDate
                  ? common.covertDate(startDate)
                  : transfer(this.props.language, 'assets_26')}
              </Text>
              <Image
                style={styles.header_select_container_image}
                source={require('../../resource/assets/calendar.png')}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.header_select_container_line} />
          <TouchableWithoutFeedback onPress={() => this.showDatePicker(1)}>
            <View style={styles.header_select_container}>
              <Text style={styles.header_select_container_text}>
                {endDate
                  ? common.covertDate(endDate)
                  : transfer(this.props.language, 'assets_27')}
              </Text>
              <Image
                style={styles.header_select_container_image}
                source={require('../../resource/assets/calendar.png')}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            dispatch(emptyDate());
            setTimeout(() => {
              this.loadData();
              dispatch(endRefreshing());
            }, 500);
          }}>
          <View style={styles.header_select_btn}>
            <Text style={styles.header_select_btn_text}>
              {transfer(this.props.language, 'assets_28')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    const {datePickerType} = this.state;
    const {startDate, endDate} = this.props;
    let showDate = datePickerType == 0 ? startDate : endDate;
    return (
      <ImageBackground
        style={styles.container}
        resizeMode="cover"
        source={require('../../resource/assets/nomal_bg.png')}>
        <Modal
          visible={this.state.datePicker}
          transparent={true}
          onRequestClose={() => {
            this.hideDatePicker();
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.hideDatePicker();
            }}>
            <Animated.View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'rgba(97,105,137,0.5)',
                opacity: this.state.opacity,
              }}>
              <Animated.View
                style={{
                  backgroundColor: 'white',
                  width: '100%',
                  bottom: this.state.bottom,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <DatePicker
                  mode="date"
                  locale={
                    this.props.languageIndex == 0 ||
                    this.props.languageIndex == 1
                      ? common.IsIOS
                        ? 'zh-Hans'
                        : 'zh'
                      : 'en'
                  }
                  date={showDate ? showDate : new Date()}
                  minimumDate={datePickerType == 0 ? null : startDate}
                  maximumDate={datePickerType == 0 ? endDate : null}
                  onDateChange={date => {
                    this.onDateChange(date);
                  }}
                />
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
        <FlatList
          refreshing={this.props.isLoading}
          onRefresh={() => {
            this.loadData();
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={this.props.recordList}
          ListHeaderComponent={this.listHeaderComponent()}
          renderItem={({item, index}) => this.renderItem(item, index)}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            this.loadMoreData();
          }}
          ListFooterComponent={this.renderFooter}
        />
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.assets,
    data: state.login.data,
  };
}

export default connect(mapStateToProps)(RechargeRecord);
