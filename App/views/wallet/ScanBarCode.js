import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Alert } from 'react-native'
import { common } from '../../constants/common'
import QRScannerView from './scan/QRScannerView'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
// import Alert from '../../components/Alert'

class ScanBarCode extends Component {
  static navigationOptions(props) {
    let title = ''
    if (props.navigation.state.params) {
      title = props.navigation.state.params.title
    }
    return {
      headerTitle: title,
      headerLeft:
        (
          <NextTouchableOpacity
            style={{
              height: common.w40,
              width: common.w40,
              justifyContent: 'center',
            }}
            activeOpacity={common.activeOpacity}
            onPress={() => props.navigation.goBack()}
          >
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
    }
  }

  constructor(props) {
    super(props)
    this.didFindData = false
  }

  componentDidMount() {
    const { navigation } = this.props
    navigation.setParams({
      title: '扫一扫',
    })
  }

  barcodeReceived(barCode) {
    if (this.didFindData) {
      return
    }
    this.didFindData = true
    const { navigation } = this.props
    // const { coin, didScan, showName } = navigation.state.params
    const data = barCode.data
    var address = data
    let pos = address.indexOf(':')
    if(pos >= 0 && pos != (address.length - 1)){
      address = address.substring(pos + 1)
    }

    let item = coin
    if(coinIdDic && coinIdDic[item] && coinIdDic[item].contract.chain){
      item = coinIdDic[item].contract.chain
    }

    const disMatch = barCode.data.length;

    if (disMatch) {
      
      Alert.alert(
        '提示',
        `交易信息格式有误`,
        [
          {
            text: '确定',
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
      )
      return
    } else if (didScan) {
      didScan(address)
    }
    navigation.goBack()
  }

  render() {
    return (
      <QRScannerView
        hintText={'将条码放入框内，即可自动扫描'}
        onScanResultReceived={barCode => this.barcodeReceived(barCode)}
        renderTopBarView={() => null}
        renderBottomMenuView={() => null}
        rectHeight={262}
        rectWidth={262}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
  
  }
}

export default connect(mapStateToProps)(ScanBarCode)
