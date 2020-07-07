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
} from '../../redux/actions/machine_record';
import DatePicker from 'react-native-date-picker';
import transfer from '../../localization/utils';
import BigNumber from 'bignumber.js';

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
    fontSize: common.font14,
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
    paddingHorizontal: common.margin15,
    backgroundColor: common.themeColor,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_select_btn_text: {
    color: common.textColor,
    fontSize: common.font12,
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
  item_container_text_top: {
    fontSize: common.font14,
    color: '#787878',
    flex: 1,
  },
  item_container_text_bottom: {
    fontSize: common.font14,
    color: '#787878',
    marginTop: common.margin10,
    flex: 1,
  },
  item_bottom_line: {
    width: '100%',
    height: common.h10,
    backgroundColor: common.bgColor,
    position: 'absolute',
    bottom: 0,
  },
});

class MachineRecord extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'machine_record01'),
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
    const {dispatch, limit} = this.props;
    dispatch(
      requestRecord({
        skip: 0,
        limit: limit,
        orderby: '-createdAt',
        where: this.fetchWhere(),
      }),
    );
  }

  loadMoreData() {
    if (!this.props.hasNext || this.props.isLoadingMore) return;
    const {dispatch, page, limit} = this.props;
    dispatch(
      loadMoreRecord({
        skip: page * limit,
        limit: limit,
        orderby: '-createdAt',
        where: this.fetchWhere(),
      }),
    );
  }

  fetchWhere() {
    const {dispatch, limit, startDate, endDate} = this.props;
    let where = {};
    if (startDate && endDate) {
      where = {
        createdAt: {
          between: [
            common.fetchBeginTime(startDate),
            common.fetchEndTime(endDate),
          ],
        },
      };
    } else if (startDate) {
      where = {
        createdAt: {
          gt: common.fetchBeginTime(startDate),
        },
      };
    } else if (endDate) {
      where = {
        createdAt: {
          lt: common.fetchEndTime(endDate),
        },
      };
    }
    return where;
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
            {transfer(this.props.language, 'machine_record02')}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>
            {transfer(this.props.language, 'machine_record03')}
          </Text>
        </View>
      );
    }
  };

  renderItem(item, index) {
    const {allProductsNameDic} = this.props;
    let type =
      item.action == 'upgrade_product'
        ? `${allProductsNameDic[item.context.from.pid]}${transfer(
            this.props.language,
            'machine_record04',
          )}${item.context.name}`
        : `${transfer(this.props.language, 'machine_record05')}${
            item.context.name
          }`;
    let isLegal = BigNumber(item.context.payinfo.legal).gt(0);
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View
          style={{
            paddingVertical: common.margin10,
            backgroundColor: common.navBgColor,
            marginHorizontal: common.margin10,
          }}>
          <View style={styles.item_container}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.item_container_text_top}>{`${transfer(
                this.props.language,
                'machine_record06',
              )}：${common.covertDate(new Date(item.createdAt))}`}</Text>
              <Text style={styles.item_container_text_top}>{`${transfer(
                this.props.language,
                'machine_record08',
              )}：${type}`}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              {!isLegal ? (
                <Text style={styles.item_container_text_bottom}>{`${transfer(
                  this.props.language,
                  'machine_record07',
                )}：${item.context.payinfo.profit}`}</Text>
              ) : null}
              {!isLegal ? (
                <Text style={styles.item_container_text_bottom}>{`${transfer(
                  this.props.language,
                  'machine_record09',
                )}：${item.context.payinfo.bonus}`}</Text>
              ) : null}
              {isLegal ? (
                <Text style={styles.item_container_text_bottom}>{`${transfer(
                  this.props.language,
                  'machine_record09_1',
                )}：${common.removeInvalidZero(
                  BigNumber(item.context.payinfo.legal).toFixed(8, 1),
                )}`}</Text>
              ) : null}
            </View>
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
                  : transfer(this.props.language, 'machine_record10')}
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
                  : transfer(this.props.language, 'machine_record11')}
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
              {transfer(this.props.language, 'machine_record12')}
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
    ...state.machine_record,
    allProductsNameDic: state.buy_machine.allProductsNameDic,
  };
}

export default connect(mapStateToProps)(MachineRecord);
