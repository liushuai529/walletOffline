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
  TouchableWithoutFeedback,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { common } from '../../constants/common'



export default class OrderConfirm extends Component {

  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '确认订单',
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

    }
  }




  render() {
    const { navigation } = this.props;
    return (
      // <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('AddressInfo');
            }}>
            <View style={styles.addressContainer}>
              <Image
                style={styles.addressImage}
                source={require('../../resource/assets/login_btn.png')}
              />
              <View style={styles.addressInfo}>
                <Text style={styles.productInfoItem}>收货地址:</Text>
                <Text
                  style={styles.productInfoItem}
                  numberOfLines={3}
                >
                  江苏省南京市秦淮区收到发生大幅收到发生发收到发生大幅收到发生大幅收到发生的
              </Text>
              </View>
              <Image
                style={styles.addressRightImage}
                source={require('../../resource/assets/arrow_right.png')}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.productInfo}>
            <View style={styles.productInfoHead}>
              <Text style={styles.productInfoHeadName}>商品名称</Text>
            </View>
            <View style={styles.productInfoLine}></View>

            <View style={styles.productItemContainer}>
              <Text style={styles.productInfoItem}>下单时间:</Text>
              <Text style={styles.productInfoRightItem}>2020-11-26 12:00</Text>
            </View>
            <View style={styles.productItemContainer}>
              <Text style={styles.productInfoItem}>购买数量:</Text>
              <Text style={styles.productInfoRightItem}>1</Text>
            </View>
            <View style={styles.productItemContainer}>
              <Text style={styles.productInfoItem}>订单金额:</Text>
              <Text style={styles.productInfoRightItem}>118</Text>
            </View>
            <View style={styles.productItemContainer}>
              <Text style={styles.productInfoItem}>收货人姓名:</Text>
              <Text style={styles.productInfoRightItem}>XX</Text>
            </View>
            <View style={styles.productItemContainer}>
              <Text style={styles.productInfoItem}>收货人手机号:</Text>
              <Text style={styles.productInfoRightItem}>13900000000</Text>
            </View>
            <View style={[styles.productPayInfo, { marginTop: common.margin20 }]}>
              <Text style={styles.productPayItem}>共需支付:</Text>
              <Text style={styles.productPayItem}>XXXXX</Text>
            </View>
            <View style={[styles.productPayInfo, { marginBottom: common.margin20, marginTop: common.margin10 }]}>
              <Text style={styles.productInfoItem}>可用余额:</Text>
              <Text style={styles.productInfoRightItem}>XXXX</Text>
            </View>

          </View>

          <View style={styles.WarmTip}>
            <Text style={styles.productInfoItem}>温馨提示</Text>
            <Text style={[styles.productInfoItem, { marginTop: common.margin20 }]}>1、请仔细核对收货信息。</Text>
            <Text style={[styles.productInfoItem, { marginTop: common.margin10 }]}>2、当可用余额不足时，无法进行购买。</Text>
          </View>
          <ImageBackground
            style={{
              padding: 0,
              marginTop: common.getH(40),
              marginBottom: common.getH(60),
              marginHorizontal: common.margin20,
            }}
            resizeMode="cover"
            source={require('../../resource/assets/login_btn.png')}>
            <TouchableOpacity onPress={() => { navigation.navigate('OrderInfo', {type: 'confirm'}) }}>
              <View style={styles.submit}>
                <Text style={styles.submitText}>确认并购买</Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
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
  productInfoItem: {
    color: '#ffffff',
    fontSize: common.font16,
  },
  productPayItem: {
    color: common.themeColor,
    fontSize: common.font20,
  },
  productInfoRightItem: {
    color: '#ffffff',
    fontSize: common.font16,
    marginLeft: common.margin10,
  },
  addressContainer: {
    height: common.getH(100),
    marginTop: common.margin10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: common.navBgColor,
    paddingHorizontal: common.margin10,
    borderRadius: common.margin5,
  },
  addressImage: {
    height: common.getH(40),
    width: common.getH(40),
  },
  addressInfo: {
    width: common.sw - common.getH(110),
    marginLeft: common.margin10,
    //alignItems: 'center',
  },
  addressRightImage: {
    height: common.getH(20),
    width: common.getH(20),
  },
  productInfo: {
    //height: common.getH(300),
    flex: 1,
    marginTop: common.margin10,
    paddingHorizontal: common.margin10,
    backgroundColor: common.navBgColor,
    borderRadius: common.margin5,
  },

  productInfoHead: {
    height: common.margin40,
    justifyContent: 'center'
  },
  productInfoHeadName: {
    fontSize: common.font20,
    color: '#ffffff',
  },
  productInfoLine: {
    height: common.getH(1),
    width: common.sw - common.getH(40),
    backgroundColor: common.cutOffLine,
  },
  productItemContainer: {
    flexDirection: 'row',
    marginTop: common.margin10,
  },
  productPayInfo: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
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
})
