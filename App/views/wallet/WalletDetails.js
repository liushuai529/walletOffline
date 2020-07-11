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
import SignerAlert from './SignerAlert';


import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import { Toast, Overlay } from 'teaset';
import { signerCoinType } from '../../redux/actions/wallet'


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

  getTradingInfo = () => {
    let cs = {
      "blockHash": "0xcfdc55d66d6e4dd57a0445500a0d183d6e3036d7b73d9c3c28734194ad8c97a0",
      "blockNumber": "0x2129c",
      "from": "0xf7be2382f03cf7dd8ed5e59253a7b9321aac20ec",
      "gas": "0x15f90",
      "gasPrice": "0x430e23400",
      "hash": "0x33b30de911ddba6b748287b73272cdaad90cb7ab0e06e1e6f408ba53af7e2b24",
      "input": "0x",
      "nonce": "0x4",
      "to": "0x101fab38d0a30cf630d4338832ac40f0ca696d72",
      "transactionIndex": "0x0",
      "value": "0xde0b6b3a7640000",
      "v": "0x189a",
      "r": "0x4d9e49b94fa94ac9322be34d64b11d342b40ad5a7f0357336b4595774ef3af61",
      "s": "0x746542c9b46ac9fa9e7cb2a7dd7753b79c267a731763b4dd0fd9f6bab6d2b5ff"
    }
    let tradingDic = ' {"blockHash": "0xcfdc55d66d6e4dd57a0445500a0d183d6e3036d7b73d9c3c28734194ad8c97a0", "blockNumber": "0x2129c", "from": "0xf7be2382f03cf7dd8ed5e59253a7b9321aac20ec", "gas": "0x15f90", "gasPrice": "0x430e23400", "hash": "0x33b30de911ddba6b748287b73272cdaad90cb7ab0e06e1e6f408ba53af7e2b24", "input": "0x", "nonce": "0x4", "to": "0x101fab38d0a30cf630d4338832ac40f0ca696d72", "transactionIndex": "0x0", "value": "0xde0b6b3a7640000", "v": "0x189a", "r": "0x4d9e49b94fa94ac9322be34d64b11d342b40ad5a7f0357336b4595774ef3af61", "s": "0x746542c9b46ac9fa9e7cb2a7dd7753b79c267a731763b4dd0fd9f6bab6d2b5ff" }'
    try {
      tradingDic = JSON.parse(tradingDic);
    } catch (error) {
      Toast.fail('交易格式错误');
      return;
    }
    console.warn('object', cs.blockHash);
  }

  checkTradingData = (data) => {
    return true;
  }

  scanCode = (coinType) => {
    const { navigation, dispatch } = this.props


    let input = {
      "list": [
        {
          "tx_hash": "2ae8d021dcdfef06d3567331280a741d47219af3956c4b795d7d4683fa91daae",
          "tx_output_n": 1,
          "tx_output_n2": 0,
          "value": 100000,
          "confirmations": 13
        },
        {
          "tx_hash": "c5dc44c6b926b7b56ad4f57bd0c11193205e81b84baf4fea075674d40db5d997",
          "tx_output_n": 1,
          "tx_output_n2": 0,
          "value": 105177,
          "confirmations": 5
        }],
      "page": 1,
      "page_size": 50,
      "page_total": 1,
      "total_count": 2
    }

    let newinput = {
      "list": [
        {
          "tx_hash": "62833267653fabc3af4f915ba1093bad488ee03f68f0c9eea6f8179346c30984",
          "tx_output_n": 0,
          "tx_output_n2": 0,
          "value": 198823,
          "confirmations": 2
        }
      ],
    }

    let unsing = {
      "txid": "5e03cbb607a4c11fa3e58ba25738d2a142f34a754b74cf096608dd497615c53f",
      "hash": "cbed5c5ba757c94d7d3de6f5e48cd3c9023ca302bf5da0319fb96ea4c0296d42",
      "version": 1,
      "size": 226,
      "vsize": 144,
      "weight": 574,
      "locktime": 0,
      "vin": [{
        "txid": "62833267653fabc3af4f915ba1093bad488ee03f68f0c9eea6f8179346c30984",
        "vout": 0,
        "scriptSig": { "asm": "", "hex": "" },
        "txinwitness": ["3045022100a08841e9d97c5db4a3853b5e54f02eccb5c9cb0f55771da8b1e278ccec51b0e8022074c973b59dbc110b819b86f2089ee0b61714041820603353cdcd7c0f172bb8d601",
          "0359386e28e92481614361bba6c87d8628cb338e10828fddec5d42aa4dc40be961"],
        "sequence": 4294967294
      }],
      "vout": [{
        "value": 0.0001,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 d6e3850d7da5e22ee4a415232ecbb01b83f37ee2 OP_EQUALVERIFY OP_CHECKSIG",
          "hex": "76a914d6e3850d7da5e22ee4a415232ecbb01b83f37ee288ac",
          "reqSigs": 1,
          "type": "pubkeyhash",
          "addresses": ["1LbEAQDDT6vCPcnftn8dQaCxUpcxkBwLQG"]
        }
      }, {
        "value": 0.00188597, 
        "n": 1,
        "scriptPubKey": {
          "asm": "0 b9f6ed37fa4609b4bfcc3000d56e9c40d297dbb2",
          "hex": "0014b9f6ed37fa4609b4bfcc3000d56e9c40d297dbb2",
          "reqSigs": 1,
          "type": "witness_v0_keyhash",
          "addresses": ["bc1qh8mw6dl6gcymf07vxqqd2m5ugrff0kajqraghg"]
        }
      }]
    }


    navigation.navigate('ScanBarCode', {
      didScan: val => {
        let tradingDic;
        try {
          console.warn('获取数据', val);
          tradingDic = JSON.parse(val);

        } catch (error) {
          Toast.fail('交易格式错误1');
          return
        }
        if (this.checkTradingData(tradingDic)) {
          dispatch(signerCoinType(coinType));
          let overlayView = (
            <Overlay.View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              modal={false}
              overlayOpacity={0}>
              <View style={styles.overlay_cover}></View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.hideOverlay();
                }}>
                <View style={styles.overlay_close}>
                  <Image
                    style={{ width: common.margin20, height: common.margin20 }}
                    source={require('../../resource/assets/close_icon.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.signerView}>
                <SignerAlert
                  signerData={tradingDic}
                  signerResult={(result, out) => {
                    if (result) {
                      Toast.success('签名成功')
                    } else {
                      Toast.success('签名失败')
                      this.hideOverlay();
                    }
                  }}
                />
              </View>
            </Overlay.View>
          );

          this.hideOverlay();
          this.overlayViewKeyID = Overlay.show(overlayView);

        }
      },
    })




  }

  scanCode1 = (coinType) => {
    const { navigation } = this.props;
    navigation.navigate('ScanBarCode', {
      didScan: val => {
        let tradingDic;
        try {
          //tradingDic = JSON.parse(val);
          console.warn('j靠椅信息', val);
        } catch (error) {
          Toast.fail('交易格式错误');
          return
        }
        if (this.checkTradingData(tradingDic)) {



          let overlayView = (
            <Overlay.View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              modal={false}
              overlayOpacity={0}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.hideOverlay();
                }}>
                <View style={styles.overlay_cover}></View>
              </TouchableWithoutFeedback>
              <View style={{ height: common.getH(200), width: '100%', backgroundColor: 'red', justifyContent: 'center', alignContent: 'center' }}>
                <Text>asdfsafsdf</Text>
              </View>
              {/* <FiatCurrencyAlert
                item={item}
                hide={() => {
                  this.hideOverlay();
                }}
                jump={name => {
                  this.hideOverlay();
                  const {navigation, dispatch} = this.props;
                  dispatch(setOrderInfo(item));
                  navigation.navigate(name);
                }}
              /> */}
            </Overlay.View>
          );

          this.hideOverlay();
          this.overlayViewKeyID = Overlay.show(overlayView);
        }
      },
    })

  }

  hideOverlay() {
    Overlay.hide(this.overlayViewKeyID);
  }

  render() {
    let coinInfo = this.props.navigation.state.params.coinInfo;
    // let iconDic = {
    //   BTC: require('../../resource/assets/market_BTC.png'),
    //   ETH: require('../../resource/assets/market_ETH.png'), 
    // }
    const { iconDic } = this.props;
    // console.warn('coinInfo', iconDic);
    return (
      <View style={styles.container}>

        <View style={styles.head}>
          <Image
            style={styles.headerImage}
            // source={coinInfo.source ? coinInfo.source : null}
            source={iconDic[coinInfo.coinType]}
          />



        </View>



        <View style={{ alignItems: 'center' }}>
          <TKButton
            style={{ marginTop: common.margin30, borderRadius: common.margin15, width: common.getH(160) }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'获取交易'}
            onPress={() => { this.scanCode(coinInfo.coinType) }}
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
    iconDic: {
      BTC: require('../../resource/assets/market_BTC.png'),
      ETH: require('../../resource/assets/market_ETH.png'),
    }
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

  signerView: {
    height: common.getH(200),
    width: '100%',
    backgroundColor: common.bgColor,
    justifyContent: 'center',
    alignContent: 'center'
  },


  recordHead: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  },
  overlay_cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.3,
  },
  overlay_close: {
    position: 'absolute',
    width: common.margin20,
    height: common.margin20,
    left: common.sw - common.margin40,
    top: common.margin30
  },


});

export default connect(mapStateToProps)(WalletDetails);
