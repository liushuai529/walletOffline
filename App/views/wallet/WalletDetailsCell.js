import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';

export default class WalletDetailsCell extends Component {
  componentDidMount() { }
  render() {
    return (
      <NextTouchableOpacity
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
        activeOpacity={common.activeOpacity}>
        <View
          style={{
            marginTop: common.margin5,
            marginLeft: common.margin10,
            marginRight: common.margin10,
            height: common.margin60,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: common.whiteColor,
            paddingLeft: common.margin5,
            paddingRight: common.margin10,
          }}>
          <View style={{
            height: common.margin25,
            width: common.margin25,
          }}>
            <Image
              style={{
                height: common.w20,
                width: common.w20,
                alignContent: 'center'
              }}
              source={require('../../resource/assets/bottom_1.png')}
            />
          </View>



          <View
            style={{
              width: '45%',
              justifyContent: 'center',
              height: common.getH(50),
            }}>
            <Text
              style={[
                {
                  fontSize: common.font14,
                  color: common.textColor,
                },
              ]}>
              fsadfsdfsafasdf
            </Text>
            <Text
              style={[
                {
                  fontSize: common.font14,
                  color: common.textColor,
                },
              ]}>
              2020-06-03 11:22:00
            </Text>
          </View>


          <View
            style={{
              width: '48%',
              justifyContent: 'center',
              height: common.getH(50),
            }}>
            <Text
              style={[
                {
                  fontSize: common.font14,
                  color: common.textColor,
                  textAlign: 'right'
                },
              ]}>
              fsadfsdfsafasdf
            </Text>
            <Text
              style={[
                {
                  fontSize: common.font14,
                  color: common.textColor,
                  textAlign: 'right'
                },
              ]}>
              2020-06-03 11:22:00
            </Text>
          </View>
         
        </View>
        <View style={{backgroundColor: common.bgColor, height: common.margin5}}></View>
      </NextTouchableOpacity>
    );
  }
}
