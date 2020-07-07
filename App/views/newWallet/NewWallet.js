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
import WalletSwiper from './WalletSwiper';
;

import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class NewWallet extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '提币详情',
      header: info => null,
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
      data: [],
    };

  }
  componentDidMount() {

  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }



  jumpToCreateWallete() {
    // const CreateWallet = NativeModules.CreateWallet;

    // let coinArray = [
    //   { name: 'BTC', checked: true, source: '' },
    //   { name: 'ETH', checked: true, source: '' },
    // ]
    // CreateWallet.createMnemonic(coinArray ,(words, seed, coinInfoArray) => {
    //   if (words && seed ) {
    //     console.warn('object', coinInfoArray);
    //   } else {
    //     console.warn('object', '生成助记词失败');
    //   }

    // })
    this.props.navigation.navigate('CreateWallet')
  }

  jumpToImportWallete() {
    this.props.navigation.navigate('ImportWallet')
  }







  render() {
    return (
      <View style={styles.container}>

        <View style={{ height: common.getH(400) }}>
          <WalletSwiper />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TKButton
            style={{ marginTop: common.margin30, borderRadius: common.margin15, width: common.getH(260) }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'创建钱包'}
            onPress={() => { this.jumpToCreateWallete() }}
          />
          <TKButton
            style={{ marginTop: common.margin15, borderRadius: common.margin15, width: common.getH(260) }}
            titleStyle={{ color: '#fff', fontSize: 16 }}
            theme="green"
            caption={'导入钱包'}
            onPress={() => { this.jumpToImportWallete() }}
          />
        </View>

      </View>
    );
  }
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
  backgroudView: {
    position: 'absolute',
    width: common.sw,
    height: common.sh,
    top: 0,
    left: 0,
    backgroundColor: 'gray',
  }






});

export default connect(mapStateToProps)(NewWallet);
