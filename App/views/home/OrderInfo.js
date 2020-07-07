import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { common } from '../../constants/common'



export default class OrderInfo extends Component {

  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '订单详情',
      headerTintColor: common.navTitleColor,
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: common.font17,
      },
    };
  };

  constructor() {
    super()
    this.state = {
      isShow: true
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('orderManagerBack', item => {
      this.setState({isShow: false})
    })
  }




  render() {
    const { navigation } = this.props;
    const { isShow } = this.state;
    const type = navigation.state.params.type;
    return (
      // <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>订单编号:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>商品名称:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>购买数量:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>商品单价:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>收货人姓名:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>收货人手机号:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>收货地址:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>订单金额:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={styles.productInfoItemContainer}>
            <Text style={styles.productInfoItem}>快递单号:</Text>
            <Text style={styles.productInfoItem}>测试商品名称</Text>
          </View>
          <View style={styles.productLine}></View>
          <View style={[styles.WarmTip, isShow && type !== 'search' ? null: {marginBottom: common.margin40}]}>
            <Text style={styles.productInfoItem}>温馨提示</Text>
            <Text style={[styles.productInfoItem, { marginTop: common.margin20 }]}>1、请仔细核对收货信息。</Text>
            <Text style={[styles.productInfoItem, { marginTop: common.margin10 }]}>2、当可用余额不足时，无法进行购买。</Text>
          </View>
          {
            type === 'confirm' && isShow ?
              (<ImageBackground
                style={{
                  padding: 0,
                  marginTop: common.getH(40),
                  marginBottom: common.getH(60),
                  marginHorizontal: common.margin20,
                }}
                resizeMode="cover"
                source={require('../../resource/assets/login_btn.png')}>
                <TouchableOpacity onPress={() => { navigation.navigate('OrderManageListTab') }}>
                  <View style={styles.submit}>
                    <Text style={styles.submitText}>确认并购买</Text>
                  </View>
                </TouchableOpacity>
              </ImageBackground>) : null
          }

        </View>
      </ScrollView>
      // </View >

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingHorizontal: common.margin10,
  },
  productInfoItemContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: common.margin20,
    paddingHorizontal: common.margin5,
  },
  productInfoItem: {
    color: '#ffffff',
    fontSize: common.font16,
  },
  WarmTip: {
    flex: 1,
    marginTop: common.margin20,
  },
  submit: {
    height: common.getH(40),
  },
  submitText: {
    fontSize: common.getH(16),
    color: common.textColor,
    textAlign: 'center',
    lineHeight: common.getH(40),
  },
  productLine: {
    height: common.getH(1),
    width: common.sw - common.getH(20),
    backgroundColor: common.cutOffLine,
    //backgroundColor: common.placeholderColor,
    marginTop: common.margin10,
  },
})
