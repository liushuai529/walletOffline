import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Text,
  NativeModules,
  CameraRoll,
  Dimensions,
  DeviceEventEmitter,
  Linking,
  Alert,
} from 'react-native';
import { common } from '../../constants/common';
import {Toast} from 'teaset';
import TKButton from '../../components/TKButton'
import { PopoverPicker } from 'teaset';
import {
  newsImgHashApi,
  defaultRebatesLink,
  rebatesLink,
  addNewsFlashCount,
} from '../../services/api';

import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class ImportWallet extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '导入钱包',
      headerLeft: (
        <NextTouchableOpacity
          style={{
            height: common.w40,
            width: common.w40,
            justifyContent: 'center',
          }}
          activeOpacity={common.activeOpacity}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={{
              marginLeft: common.margin10,
              width: common.w10,
              height: common.h20,
            }}
            source={require('../../assets/arrow_left.png')}
          />
        </NextTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      detailData: {},
      data: [
        'Doge(狗狗币)',
        'BitcoinCash(比特现金)',
      ],
    };
  }
  componentDidMount() {
    // this.initRefreshData();
  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }

  showView(view) {
    if (this.state.data.length == 0) {
      Toast.fail('暂无可导入币种');
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
        this.state.data,
        0,
        (item, index) =>
          setTimeout(() => {
            // this.props.dispatch(changeProductsIndex(index));
            // this.props.dispatch(
            //   requestEstimate({
            //     buy_prices: [this.props.selectProduct.buy_price],
            //     check_asset: 'no',
            //   }),
            // );
            // console.warn("object", item, index);
          }, 300),
        {
          modal: false,
        },
      );
    });
  }




  render() {

    return (
      <View style={styles.container}>

        <View>
          <Text style={styles.titleText}>币种</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              this.showView(this.fromView);
            }}>
            <View
              ref={view => {
                this.fromView = view;
              }}
              style={styles.select}>
              <Text style={{ alignSelf: 'center' }}>比特币</Text>
              <Image
                style={{
                  width: common.h40,
                  height: common.h40,
                  alignSelf: 'center',
                }}
                source={require('../../assets/yellow_arrow_down.png')}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ marginTop: common.margin10 }}>
          <Text style={styles.titleText}>钱包地址</Text>
          <View style={styles.select}>
            <View style={{ width: common.sw - common.getH(80), justifyContent: 'center' }}>
              <Text style={styles.contentText}>asdfasdfasdfasdfasdfasdfasdfasdf</Text>
            </View>
            <Image
              style={{
                width: common.margin40,
                height: common.margin40,
                alignSelf: 'center',
              }}
              source={require('../../assets/yellow_arrow_down.png')}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: common.margin80 }}>
          <TKButton
            style={{ flex: 1, marginTop: common.margin15, marginLeft: '10%', marginRight: '5%', borderRadius: common.margin20 }}
            theme="blue"
            caption={'确定'}
          />
          <TKButton
            style={{ flex: 1, marginTop: common.margin15, marginLeft: '5%', marginRight: '10%', borderRadius: common.margin20 }}
            titleStyle={{ color: '#fff', fontSize: 16 }}
            theme="orange"
            caption={'取消'}
          />
        </View>

      </View>
    );
  }

  jumpToWalleteDetail = item => {
    this.props.navigation.navigate('WalletDetails', { coinInfo: item });
  }


}

function mapStateToProps(state) {
  return {
    ...state.newsLetter,
 
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingHorizontal: common.margin10,
  },
  titleText: {
    color: common.textColor,
    fontSize: common.font16,
  },
  contentText: {
    color: common.textColor,
    fontSize: common.font14,
  },
  head: {
    height: common.margin20,
    width: '100%',
    backgroundColor: '#3b4367',
  },
  headText: {
    color: 'white',
    marginLeft: common.margin10,
  },
  select: {
    height: common.margin60,
    backgroundColor: common.whiteColor,
    borderColor: common.textColor,
    borderWidth: 1,
    borderRadius: common.h5 / 2,
    flexDirection: 'row',
    marginTop: common.margin10,
    justifyContent: 'space-between'
  },
  bottomContainer: {
    width: common.sw,
    height: common.margin60,
    marginTop: common.margin80,
    height: common.margin40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }



});

export default connect(mapStateToProps)(ImportWallet);
