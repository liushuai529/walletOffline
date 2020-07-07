import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  NativeModules
} from 'react-native';
import { common } from '../../constants/common';
import WalletCell from './WalletCell';
import { Toast } from 'teaset';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import TKButton from '../../components/TKButton';
// import * as chatlib from '../../datafeed/chatlib';
import { updateMnemonic, updateSeed, updateCoinInfoArray, updateOperationType } from '../../redux/actions/wallet'

class Wallet extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '交易签名',
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
      headerRight: (
        <NextTouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={common.activeOpacity}
          onPress={() => {
            props.navigation.navigate('ImportWallet');
          }}
        >
          <Image
            style={{ width: common.margin15, height: common.margin15, }}
            source={require('../../resource/assets/add_address.png')}
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
    // const { dispatch } = this.props;
    // let mnemicObj = chatlib.db.db_getbyPrimaryKey({
    //   tbname: 'config',
    //   PrimaryKeyvalue: 'mnemic',
    //   queryKeys: ['v'],
    // });
    // let seedObj = chatlib.db.db_getbyPrimaryKey({
    //   tbname: 'config',
    //   PrimaryKeyvalue: 'seed',
    //   queryKeys: ['v'],
    // });
    // let mnemic;
    // let seed;
    // if (typeof mnemicObj === 'object') {
    //   mnemic = mnemicObj.config.v !== undefined ? mnemicObj.config.v : '';
    // }
    // if (typeof seedObj === 'object') {
    //   seed = seedObj.config.v !== undefined ? seedObj.config.v : '';
    // }
    // let coinArray = [];
    // let navigationWatcher = chatlib.db.db_createNavigationWatcher;
    // chatlib.db.db_subscribe(navigationWatcher(this.props.navigation).bind("coinInfo"), ['*'], (collection) => {

    //   Object.keys(collection).forEach(item => {
    //     coinArray.push(collection[item]);
    //   })
    // })
    // // console.warn('getDB', seed, mnemic, coinArray);
    // if (!seed && !mnemic && coinArray.length === 0) {

    //   this.props.navigation.navigate('LoginStack');
    // } else {
    //   console.warn('执行dispatch', coinArray);
    //   dispatch(updateMnemonic(mnemic));
    //   dispatch(updateSeed(seed));
    //   dispatch(updateCoinInfoArray(coinArray));
    // }
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

  render() {
    const { coinInfoArray, mnemic } = this.props;
    console.warn('getRedux', this.props);
    return (
      <View style={styles.container}>

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderRow(item)}
          data={coinInfoArray}
          extraData={this.props}

        />


      </View>
    );
  }

  jumpToWalleteDetail = item => {
    this.props.navigation.navigate('WalletDetails', { coinInfo: item });
  }



  renderRow = item => {
    return (
      <View style={{ backgroundColor: common.bgColor }}>
        <WalletCell
          leftImageSource={item.source}
          title={item.coinType}
          detail={'100'}
          onPress={() => {
            this.jumpToWalleteDetail(item);
          }}
        />
      </View>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
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


  fonterContainer: {
    height: common.h40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonterText: {
    color: common.textColor,
    fontSize: common.font14,
  },



});

export default connect(mapStateToProps)(Wallet);
