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
import TKButton from '../../components/TKButton'

import { Toast, Overlay } from 'teaset';
import QRCode from 'react-native-qrcode-svg';

import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class WithdrawDetails extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '提币详情',
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
      dataDic: {},
      data: [],
    };
    this.titleDic = {
      amount: '金额',
      address: '接收地址',
      fee: '矿工费',
      time: '提币时间'
    };
  }
  componentDidMount() {
    let dataDic = this.props.navigation.state.params.withdrawInfo;
    this.setState({ dataDic });
    this.setState({ data: Object.keys(dataDic).concat([]) });
  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }

  showQRcode() {
    const overlayView = (
      <Overlay.View
        style={{ justifyContent: 'center', alignItems: 'center' }}
        modal={false}
        overlayOpacity={0.1}>
        <TouchableWithoutFeedback
          onPress={() => { Overlay.hide(this.overlayCancelViewKey); }}
        >
          <View style={styles.backgroudView}></View>
        </TouchableWithoutFeedback>
        <QRCode
          size={common.getH(260)}
          value={'sadfasdfsafsdf'} />
      </Overlay.View>
    );
    this.overlayCancelViewKey = Overlay.show(overlayView);
  }







  render() {
    return (
      <View style={styles.container}>

        <View style={{ height: common.getH(200) }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => this.renderRow(item.item)}
            data={this.state.data}

          />
        </View>
        <View style={{ flexDirection: 'row', }}>
          <TKButton
            style={{ flex: 1, marginTop: common.margin15, marginLeft: '10%', marginRight: '5%', borderRadius: common.margin20 }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'生成二维码'}
            onPress={() => { this.showQRcode() }}
          />
          <TKButton
            style={{ flex: 1, marginTop: common.margin15, marginLeft: '5%', marginRight: '10%', borderRadius: common.margin20 }}
            titleStyle={{ color: '#fff', fontSize: 16 }}
            theme="blue"
            caption={'扫描签名交易'}
          />
        </View>

      </View>
    );
  }



  renderRow = item => {
    const { dataDic } = this.state;
    return (
      <View style={{ backgroundColor: common.whiteColor, paddingHorizontal: common.margin5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: common.margin5, marginBottom: common.margin5 }}>
          <Text>{`${this.titleDic[item]}:`}</Text>
          <Text>{dataDic[item]}</Text>
        </View>
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
  backgroudView: {
    position: 'absolute',
    width: common.sw,
    height: common.sh,
    top: 0,
    left: 0,
    backgroundColor: 'gray',
  }






});

export default connect(mapStateToProps)(WithdrawDetails);
