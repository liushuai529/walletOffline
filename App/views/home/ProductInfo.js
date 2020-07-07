import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import { common } from '../../constants/common';
import ProductSwiper from './ProductSwiper';
import TextInputTransactions from '../../components/TextInputTransactions';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import { changeQuantity } from '../../redux/actions/market';
import { clearForm } from '../../redux/actions/market';


class ProductInfo extends Component {

  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '商品信息',
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
      banners: [
        { path: require('../../resource/assets/account_mid.png') },
        { path: require('../../resource/assets/assets_bg.png') },
      ],
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearForm());
  }




  render() {
    const { dispatch, quantity, navigation } = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.productImageContainer}>
            <ProductSwiper
              banners={this.state.banners}
            />
          </View>
          <View style={styles.productInfoContainer}>
            <View style={[styles.productInfoItemContainer]}>
              <Text style={styles.productInfoItem1}>产品名称</Text>
              <Text style={[styles.productInfoItem1, { marginLeft: common.margin10 }]}>测试商品名称</Text>
            </View>
            <View style={styles.productInfoItemContainer}>
              <Text style={styles.productInfoItem1}>499</Text>
              <Text style={styles.productInfoItem1}>TV</Text>
            </View>

            <View style={styles.productInfoItemContainer}>
              <Text style={styles.productInfoItem2}>库存数量:</Text>
              <Text style={styles.productInfoItem2}>12223</Text>
            </View>

            <View style={styles.productInfoItemContainer}>
              <Text style={styles.productInfoItem2}>购买数量:</Text>
              <View style={styles.price}>
                <NextTouchableOpacity
                  style={styles.plusBtn}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    dispatch(
                      changeQuantity({
                        type: 'release',
                        val: null
                      }),
                    );
                  }}
                >
                  <Image
                    style={styles.plusBtnImage}
                    source={require('../../resource/assets/release.png')}
                    resizeMode={'contain'}
                  />
                </NextTouchableOpacity>
                <TextInputTransactions
                  //placeholder={'0'}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={(e) => {
                    dispatch(
                      changeQuantity({
                        type: 'change',
                        val: e
                      }),
                    );
                  }}
                />
                <NextTouchableOpacity
                  style={styles.plusBtn}
                  activeOpacity={common.activeOpacity}
                  onPress={() => {
                    dispatch(
                      changeQuantity({
                        type: 'plus',
                        val: null
                      }),
                    );
                  }}
                >
                  <Image
                    style={styles.plusBtnImage}
                    source={require('../../resource/assets/plus.png')}
                    resizeMode={'contain'}
                  />
                </NextTouchableOpacity>
              </View>
            </View>


            <ImageBackground
              style={{
                padding: 0,
                marginTop: common.getH(40),
                //marginBottom: common.getH(60),
                marginHorizontal: common.margin20,
              }}
              resizeMode="cover"
              source={require('../../resource/assets/login_btn.png')}>
              <TouchableOpacity onPress={() => { navigation.navigate('OrderConfirm') }}>
                <View style={styles.submit}>
                  <Text style={styles.submitText}>立即购买</Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>

            <View style={styles.productDetailsHead}>
              <Text style={[styles.productInfoItem2, { color: common.themeColor, textAlign: 'center' }]}>产品详情</Text>
            </View>
            <View style={styles.productDetailsContainer}>
              <FastImage
                style={styles.productDetailsImage}
                resizeMode="stretch"
                //source={require('../../resource/assets/cs.png')}
              />
            </View>

          </View>
          <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
            <View style={{
              width: common.getH(30),
              height: common.getH(30),
              position: 'absolute',
              top: common.getH(10),
              left: common.getH(20),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: common.placeholderColor,
              borderRadius: common.getH(15)
            }}>

              <Image
                resizeMode="contain"
                source={require('../../resource/assets/arrow_left.png')}
                style={{ width: common.getH(20), height: common.getH(20) }}
              />
            </View>
          </TouchableWithoutFeedback>

        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    // paddingHorizontal: common.margin5,
  },
  productImageContainer: {
    width: common.sw,
    height: common.sw * 3 / 4,
  },
  productInfoContainer: {
    flex: 1,

  },
  productInfoItemContainer: {
    flexDirection: 'row',
    marginTop: common.margin20,
    paddingHorizontal: common.margin5,
    //borderColor: 'red',
    //borderWidth: 1,
  },
  productInfoItem1: {
    color: '#ffffff',
    fontSize: common.font20,
  },
  productInfoItem2: {
    color: '#ffffff',
    fontSize: common.font16,
  },
  buyBtn: {
    width: common.getH(60),
    height: common.margin30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignContent: 'center',
  },
  productDetailsHead: {
    width: common.sw,
    height: common.getH(40),
    marginTop: common.margin20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: common.navBgColor,
  },
  productDetailsContainer: {
    flex: 1,
  },
  productDetailsImage: {
    width: common.sw,
    height: common.getH(4000)
  },
  plusBtnImage: {
    height: common.h15,
    width: common.h15,
    alignSelf: 'center',
  },
  price: {
    height: common.h30,
    width: common.getH(100),
    //borderWidth: 1,
    //borderColor: common.borderColor,
    //backgroundColor: common.blackColor,
    flexDirection: 'row',
  },
  plusBtn: {
    width: common.h30,
    justifyContent: 'center',
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
function mapStateToProps(state) {
  return {
    ...state.home,
    ...state.market,
    login: state.login,
  };
}

export default connect(mapStateToProps)(withNavigation(ProductInfo));
