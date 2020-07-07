/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  NativeModules
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export class App extends React.Component {


  test = () => {
    let coinArray = [
      // { name: 'BTC' },
      { name: 'ETH' },
    ];
    // const CreateWallet = NativeModules.CreateWallet
    // CreateWallet.createMnemonic(coinArray, (error, walletInfoDic) => {
    //   if (!error) {
    //     console.warn('walletDic', walletInfoDic, typeof walletInfoDic);

    //   } else {
    //     console.warn('object', '生成助记词失败');
    //   }
    // })
    const EthereumSigner = NativeModules.CreateWallet
    //nonce 09
    //toAddress 0x3535353535353535353535353535353535353535
    //amount 0de0b6b3a7640000
    //privateKey 0x9e6755dcee2c48661d1e226fb1c7739d901dbcb8af69959fabf9eb8f2a4516c2
    let signerDic = {
      'chinID': '01',
      'nonce': '0277',
      'gasPrice': '04a817c800',
      'gasLimit': '5208',
      'toAddress': '0x3535353535353535353535353535353535353535',
      'amount': '0de0b6b3a7640000',
      'privateKey': '0x4646464646464646464646464646464646464646464646464646464646464646',
    }
    // EthereumSigner.signer(signerDic, result => {
    //   if(!result.error) {
    //     console.warn('object', result.out);
    //   } else {
    //     console.warn('object', 'singError');
    //   }
    // }) 
    let dic = {
      "txid": "62dd1b0cc288424875014c1c025ab0fa3d1be9a3952d639aa9169f65f3be1704",
      "hash": "cd226ffed12258e1ea2f810bc8c9df89bbd39deb1928cd674d31341f9958a792",
      "version": 2,
      "size": 215,
      "vsize": 134,
      "weight": 533,
      "locktime": 637946,
      "vin": [{
        "txid": "32ef737199bf07570ecf486aea06071e9abb61b8ce568460197f67fdecc31b45",
        "vout": 0,
        "scriptSig": {
          "asm": "001405c709dafd379a9bcc8b837a066b217f50d676c4",
          "hex": "16001405c709dafd379a9bcc8b837a066b217f50d676c4"
        },
        "txinwitness": ["304402207147990963f582360d5ccf39e56324c8e76ee09cadb132599d6fc06afad7fe41022010160ce9ba4526aeef0a0ce5596570026ac97bb075d3e8ad807628ee3018bf9f01", "03f210263d9a1246bd5c729cbb1d062f759d88e093b419971060b91b61919f49f9"],
        "sequence": 4294967294
      }],
      "vout": [{
        "value": 0.00276,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_HASH160 c159a1e04e4cd526f7c3f8b58d5ff23cb3d22038 OP_EQUAL",
          "hex": "a914c159a1e04e4cd526f7c3f8b58d5ff23cb3d2203887",
          "reqSigs": 1,
          "type": "scripthash",
          "addresses": ["3KKMiL7mkJ6mmV95Lduemux6qpbSJFuZq8"]
        }
      }],

    }

    let dic1 = {
      "txid": "050d00e2e18ef13969606f1ceee290d3f49bd940684ce39898159352952b8ce2",
      "hash": "050d00e2e18ef13969606f1ceee290d3f49bd940684ce39898159352952b8ce2",
      "version": 1,
      "size": 249,
      "locktime": 0,
      "vin":
        [{
          "txid": "bdff60f8c244f764a2623ec0c9c6e9053055e8457b15bbaba45426348792501b",
          "vout": 2,
          "scriptSig": {
            "asm": "304502210091183f38cbb7c2062026916c0e6e9d58e350b5f4426c8ebffbfdd4d5670e69d602207c70856f5351b9f262e8e9cc492881d427fe8c1698dfbae5c260974863bfb94e[ALL|FORKID] 03e24af24c75b67967004e4f4bac2e9e8ae0e74b6155ec72a9be2d1adea8ebaf6d",
            "hex": "48304502210091183f38cbb7c2062026916c0e6e9d58e350b5f4426c8ebffbfdd4d5670e69d602207c70856f5351b9f262e8e9cc492881d427fe8c1698dfbae5c260974863bfb94e412103e24af24c75b67967004e4f4bac2e9e8ae0e74b6155ec72a9be2d1adea8ebaf6d"
          },
          "sequence": 4294967295
        }],
      "vout": [{
        "value": 0.000006,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 769bdff96a02f9135a1d19b749db6a78fe07dc90 OP_EQUALVERIFY OP_CHECKSIG", 
          "hex": "76a914769bdff96a02f9135a1d19b749db6a78fe07dc9088ac",
          "reqSigs": 1,
          "type": "pubkeyhash",
          "addresses": ["bitcoincash:qpmfhhledgp0jy66r5vmwjwmdfu0up7ujqcp07ha9v"]
        }
      },
      {
        "value": 0, 
        "n": 1,
        "scriptPubKey": { "asm": "OP_RETURN 59656e6f6d2057616c6c6574", "hex": "6a0c59656e6f6d2057616c6c6574", "type": "nulldata" }
      },
      {
        "value": 0.00005151,
        "n": 2,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 aff1e0789e5fe316b729577665aa0a04d5b0f8c7 OP_EQUALVERIFY OP_CHECKSIG", 
          "hex": "76a914aff1e0789e5fe316b729577665aa0a04d5b0f8c788ac",
          "reqSigs": 1,
          "type": "pubkeyhash",
          "addresses": ["bitcoincash:qzhlrcrcne07x94h99thved2pgzdtv8ccujjy73xya"]
        }
      }]
    }
    // EthereumSigner.bitcoinSignP2WSH();

  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <TouchableOpacity
                  onPress={this.test}
                >
                  <Text style={styles.sectionTitle}>TestRN</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
              </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
              </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
