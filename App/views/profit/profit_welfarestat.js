import React from 'react';
import {View, StyleSheet, FlatList, Text, Image, TouchableWithoutFeedback, Modal, Animated, ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {endRefreshing, requestRecord, loadMoreRecord, changeStartDate, changeEndDate, emptyDate} from '../../redux/actions/profit_welfarestat';
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
    paddingHorizontal: common.margin20,
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
    color: common.navTitleColor,
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
    backgroundColor: common.bgColor,
    marginHorizontal: common.margin5,
  },
  header_select_btn: {
    paddingHorizontal: common.margin8,
    backgroundColor: common.bgColor,
    height: 30,
    paddingHorizontal: common.margin15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  header_select_btn_text: {
    color: '#757575',
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
    color: common.navTitleColor,
    flex: 1,
  },
  item_bottom_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: common.placeholderColor,
    position: 'absolute',
    bottom: 0,
  },
});

class ProfitWelfarestat extends React.Component {
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
        or: [
          {
            createdAt: {
              between: [common.fetchBeginTime(startDate), common.fetchEndTime(endDate)],
            },
          },
          {
            createdAt: {
              between: [common.fetchBeginTime(startDate), common.fetchEndTime(endDate)],
            },
          },
          {
            createdAt: {
              between: [common.fetchBeginTime(startDate), common.fetchEndTime(endDate)],
            },
          },
        ],
      };
    } else if (startDate) {
      where = {
        or: [
          {
            createdAt: {
              gt: common.fetchBeginTime(startDate),
            },
          },
          {
            createdAt: {
              gt: common.fetchBeginTime(startDate),
            },
          },
          {
            createdAt: {
              gt: common.fetchBeginTime(startDate),
            },
          },
        ],
      };
    } else if (endDate) {
      where = {
        or: [
          {
            createdAt: {
              lt: common.fetchEndTime(endDate),
            },
          },
          {
            createdAt: {
              lt: common.fetchEndTime(endDate),
            },
          },
          {
            createdAt: {
              lt: common.fetchEndTime(endDate),
            },
          },
        ],
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
          <Text style={styles.fonterText}>{transfer(this.props.language, 'profit_detail02')}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.fonterContainer}>
          <Text style={styles.fonterText}>{transfer(this.props.language, 'profit_detail03')}</Text>
        </View>
      );
    }
  };

  renderItem(item, index) {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={{paddingVertical: common.margin10}}>
          <View style={styles.item_container}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.item_container_text}>{`${transfer(this.props.language, 'profit_detail04')}：${common.covertDate(
                new Date(item.createdAt),
              )}`}</Text>
              <Text style={styles.item_container_text}>{`${transfer(this.props.language, 'profit_detail12')}：${item.remark}`}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={[styles.item_container_text, {paddingTop: common.margin10}]}>{`${transfer(
                this.props.language,
                'profit_detail13',
              )}TV：${common.removeInvalidZero(BigNumber(item.profit).toFixed(8, 1))}`}</Text>
              <Text style={[styles.item_container_text, {paddingTop: common.margin10}]}>{`${transfer(
                this.props.language,
                'profit_detail13',
              )}USDT：${common.removeInvalidZero(BigNumber(item.bonus).toFixed(8, 1))}`}</Text>
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
                {startDate ? common.covertDate(startDate) : transfer(this.props.language, 'profit_detail08')}
              </Text>
              <Image style={styles.header_select_container_image} source={require('../../resource/assets/calendar.png')} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.header_select_container_line} />
          <TouchableWithoutFeedback onPress={() => this.showDatePicker(1)}>
            <View style={styles.header_select_container}>
              <Text style={styles.header_select_container_text}>
                {endDate ? common.covertDate(endDate) : transfer(this.props.language, 'profit_detail09')}
              </Text>
              <Image style={styles.header_select_container_image} source={require('../../resource/assets/calendar.png')} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ImageBackground
          style={{
            padding: 0,
          }}
          source={require('../../resource/assets/btn_golden.png')}>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(emptyDate());
              setTimeout(() => {
                this.loadData();
                dispatch(endRefreshing());
              }, 500);
            }}>
            <View
              style={{
                width: common.margin80,
                height: common.margin30,
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: common.h5,
                justifyContent: 'center',
              }}>
              <Text style={styles.header_select_btn_text}>{transfer(this.props.language, 'profit_detail10')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>
    );
  };

  render() {
    const {datePickerType} = this.state;
    const {startDate, endDate} = this.props;
    let showDate = datePickerType == 0 ? startDate : endDate;
    return (
      <View style={styles.container}>
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
                  locale={this.props.languageIndex == 0 || this.props.languageIndex == 1 ? (common.IsIOS ? 'zh-Hans' : 'zh') : 'en'}
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.profit_welfarestat,
  };
}

export default connect(mapStateToProps)(ProfitWelfarestat);
