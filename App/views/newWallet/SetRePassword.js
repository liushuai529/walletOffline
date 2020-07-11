import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  NativeModules,
} from 'react-native';
import { common } from '../../constants/common';
import PasswordWarn from './PasswordWarn';
import TKInputItem from '../../components/TKInputItem'
import { Toast } from 'teaset';
// import { updateMnemonic, updateSeed, updateCoinInfoArray, updateOperationType } from '../../redux/actions/wallet'
import { updateMnemonic, updateSeed, updateCoinInfoArray, updateOperationType, createWallet } from '../../redux/actions/wallet';

import NextTouchableOpacity from '../../components/NextTouchableOpacity';
// import * as chatlib from '../../datafeed/chatlib';
import cache from '../../utils/cache';

class SetRePassword extends Component {
  static navigationOptions(props) {
    let params = props.navigation.state.params;
    let pwd = params.pwd;
    let repwd = params.repwd;
    let dispatch = params.dispatch;
    return {
      headerTitle: '创建钱包',
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
      // headerRight: params && params.next ? (
      headerRight: params ? (
        <NextTouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={common.activeOpacity}
          onPress={() => {
            if (pwd === repwd) {
              let operationType = params.operationType;
              const CreateWallet = NativeModules.CreateWallet;
              if (operationType === 0) {
                let coinArray = params.coinArray;
                CreateWallet.createMnemonic(coinArray, (error, walletInfoDic) => {
                  if (!error) {
                    // console.warn('dispatch', dispatch ,updateMnemonic);
                    dispatch(updateMnemonic(walletInfoDic['mnemic']));
                    dispatch(updateSeed(walletInfoDic['seed']));
                    dispatch(updateCoinInfoArray(walletInfoDic['coinArray']));
                    // dispatch(updateOperationType(0));
                    dispatch(createWallet());
                    params.saveDataToDB(walletInfoDic);
                    // props.navigation.navigate('ShowMnemonicWords', { pwd })
                  } else {
                    console.warn('object', '生成助记词失败');
                  }

                })
              } else if (operationType === 1) {
                let coinArray = [
                  { name: 'BTC' },
                  { name: 'ETH' },
                ];
                CreateWallet.importMnemonic(coinArray, cache.getObject('mnemic'), (error, walletInfoDic) => {
                  if (!error) {
                    dispatch(updateMnemonic(cache.getObject('mnemic')));
                    dispatch(updateSeed(walletInfoDic['seed']));
                    dispatch(updateCoinInfoArray(walletInfoDic['coinArray']));
                    dispatch(createWallet());
                    // console.warn('保存dispatch', walletInfoDic['coinArray']);
                    // // props.navigation.navigate('ShowMnemonicWords', { pwd })
                    // params.saveDataToDB(walletInfoDic);
                  } else {
                    console.warn('object', '生成助记词失败');
                  }

                })

              }


            } else {
              Toast.fail('密码不一致')
            }
          }}
        >
          <Text style={{ color: common.whiteColor, marginRight: common.margin10 }}>确定</Text>

        </NextTouchableOpacity>
      ) : <View style={{ marginRight: common.margin10 }}></View>,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [
        'Tok钱包不会存储您的密码',
        '请您务必妥善保存',
        '万一丢失将无法找回或重置密码'
      ],
      repwd: '',
    };

  }
  componentDidMount() {
    const { coinArray, navigation, operationType, screenProps } = this.props;
    console.warn('coinArray', coinArray);
    navigation.setParams({ coinArray, operationType, screenProps, saveDataToDB: this.saveDataToDB })
  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }

  saveDataToDB = (walletInfoDic) => {
    // if (walletInfoDic.mnemic && walletInfoDic.seed && walletInfoDic.coinArray) {
    //   chatlib.db.db_update({
    //     tbname: 'config',
    //     item: {
    //       subType: 'update',
    //       k: 'mnemic',
    //       v: walletInfoDic.mnemic,
    //     },
    //   });
    //   chatlib.db.db_update({
    //     tbname: 'config',
    //     item: {
    //       subType: 'update',
    //       k: 'seed',
    //       v: walletInfoDic.seed,
    //     },
    //   });
    //   walletInfoDic.coinArray.forEach(coin => {
    //     chatlib.db.db_update({
    //       tbname: 'coinInfo',
    //       item: {
    //         subType: 'addMsg',
    //         JID: coin.coinType,
    //         msg: { coinType: coin.coinType, address: coin.address, pubKey: coin.pubKey, priKey: coin.priKey },
    //       },
    //     });
    //   });

    // }

  }

  handlePwd = repwd => {
    this.setState({ repwd });
    if (repwd) {
      this.props.navigation.setParams({ next: true, repwd: repwd })
    } else {
      this.props.navigation.setParams({ next: false, repwd: repwd })
    }
  }






  render() {
    const { repwd } = this.state;
    return (
      <View style={styles.container}>

        <View>
          <Text style={styles.tip}>请设置安全密码</Text>
          <View style={{ height: common.margin40, marginTop: common.margin10 }}>
            <TKInputItem
              inputStyle={{
                fontSize: common.font14,
              }}
              // value={repwd}
              value={'a'}
              onChangeText={this.handlePwd}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <PasswordWarn
            type={'repassword'}
            value={this.state.data}
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
    paddingHorizontal: common.margin10,
    paddingTop: common.margin20
  },
  tip: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  }






});

export default connect(mapStateToProps)(SetRePassword);
