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
import TKButton from '../../components/TKButton';
import WalletDetailsCell from './WalletDetailsCell';


import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class WalletDetails extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: props.navigation.state.params.coinInfo.name,
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
            source={require('../../resource/assets/arrow_left.png')}
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
        { name: 'Doge(狗狗币)', amount: '1000', source: '' },
        { name: 'BitcoinCash(比特现金)', amount: '100', source: '' },
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










  refreshData() {

  }

  loadMoreData() {

  }

  renderFooter = () => {
    // if (this.state.offeringList.length < this.REQUST_COUNT) return null;
    // const {language} = this.props;

    // if (this.lastData.length >= this.REQUST_COUNT) {
    //   return (
    //     <View style={styles.fonterContainer}>
    //       <Text style={styles.fonterText}>
    //         {transfer(language, 'loading_more')}
    //       </Text>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <View style={styles.fonterContainer}>
    //       <Text style={styles.fonterText}>
    //         {transfer(language, 'loading_no_date')}
    //       </Text>
    //     </View>
    //   );
    // }
  };

  renderHeader = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: common.margin20 }}>
        <Text style={styles.recordHead}>交易记录</Text>
      </View>
    )
  }

  render() {
    let coinInfo = this.props.navigation.state.params.coinInfo;
    return (
      <View style={styles.container}>


        <View style={styles.head}>
          <Image
            style={styles.headerImage}
            // source={coinInfo.source ? coinInfo.source : null}
            source={require('../../resource/assets/market_BTC.png')}
          />
          {/* <Text style={styles.headPrice1}>{coinInfo.amount}</Text>
          <Text style={styles.headPrice2}>{coinInfo.amount}</Text>
          <View style={styles.addressContainer}>
            <Text>sdfasdfasdfasdfsadfasdfsfsdf</Text>
            <Image
              style={styles.copyImage}
              source={require('../../resource/assets/copy.png')}
            />
          </View> */}


        </View>

        {/* <FlatList
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => this.renderRow(item.item)}
          data={this.state.data}
          ListHeaderComponent={() => this.renderHeader()}

        /> */}

        <View style={{ alignItems: 'center' }}>
          <TKButton
            style={{ marginTop: common.margin30, borderRadius: common.margin15, width: common.getH(160) }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'获取交易'}
            onPress={() => { this.onConfirmWords() }}
          />
        </View>


      </View>
    );
  }



  renderRow = item => {
    return (
      <View style={{ backgroundColor: common.bgColor }}>
        <WalletDetailsCell
          leftImageSource={item.source}
          address={item.address}
          time={item.time}
          amount={item.amount}
          status={item.status}
          onPress={() => {
          }}
        />
      </View>
    );
  };
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
  },
  head: {
    height: common.getH(200),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: common.whiteColor,
  },
  headerImage: {
    width: common.getH(80),
    height: common.getH(80),
  },
  headPrice1: {
    color: common.textColor,
    fontSize: common.font14,
    marginTop: common.margin10,
  },
  headPrice2: {
    color: common.grayColor,
    fontSize: common.font12,
    marginTop: common.margin10,
  },
  copyImage: {
    width: common.margin20,
    height: common.margin20,
  },
  addressContainer: {
    width: '70%',
    height: common.margin25,
    backgroundColor: common.grayColor,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: common.margin10,
  },
  recordHead: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  }


});

export default connect(mapStateToProps)(WalletDetails);
