import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  NativeModules,
} from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import TKButton from '../../components/TKButton';
import QRcodeSwiper from './QRcodeSwiper';


class SignerAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSigner: false,
      out: '',
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  formartETHSignerData = () => {
    const { signerData } = this.props;
    return signerData
  }

  formartBTCSignerData = () => {
    const { signerData } = this.props;
    let signerData1 = {
      mnemonic: 'amazing input dose economy boil giraffe antique tuition play toward yard wink'
    }
    return signerData1
  }

  signer = () => {
    const { signerCoinType, signerResult } = this.props;
    const CreateWallet = NativeModules.CreateWallet;
    if (signerCoinType === 'ETH') {
      CreateWallet.ethSigner(this.formartETHSignerData(), result => {
        if (!result.error) {
          if (signerResult) signerResult(true, result.out)
          this.setState({ hasSigner: true, out: result.out })
          console.warn('object', '签名成功');
        } else {
          if (signerResult) signerResult(false)
          console.warn('object', '签名失败');
        }
      })
    }
    if(signerCoinType === 'BTC') {
      CreateWallet.btcSign(this.formartBTCSignerData(), result => {
        if (!result.error) {
          if (signerResult) signerResult(true, result.out)
          this.setState({ hasSigner: true, out: result.out })
          console.warn('object', '签名成功');
        } else {
          if (signerResult) signerResult(false)
          console.warn('object', '签名失败');
        }
      }) 
    }

  }

  render() {
    // const { signerData, signerResult } = this.props;
    const { hasSigner, out } = this.state
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        {
          !hasSigner ? (
            <View style={styles.container}>

              <View style={styles.content}>

                <Text style={{ width: '30%', fontSize: common.font16 }}>接收地址</Text>
                <Text style={{ width: '70%', fontSize: common.font16, textAlign: 'right' }}>1pdsfsdfsdfsdfsdfsfsdfssdfsdf</Text>
              </View>
              <View style={styles.content}>
                <Text style={{ width: '30%' }}>数量</Text>
                <Text style={{ width: '70%', fontSize: common.font16, textAlign: 'right' }}>100</Text>
              </View>

              <View style={{ alignItems: 'center', }}>
                <TKButton
                  style={{ marginTop: common.margin60, borderRadius: common.margin15, width: common.getH(160) }}
                  theme="blue"
                  titleStyle={{ color: '#fff', fontSize: 16 }}
                  caption={'签名'}
                  onPress={() => { this.signer() }}
                />
              </View>


            </View>
          ) : (
              <View style={styles.container}>
                <Text style={{ fontSize: common.font18, fontWeight: 'bold', textAlign: 'center' }}>签名成功</Text>
                <QRcodeSwiper
                  out={out}
                />
              </View>
            )
        }
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: common.margin10
  },
  content: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: common.margin10
  }

});

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

export default connect(mapStateToProps)(SignerAlert);
