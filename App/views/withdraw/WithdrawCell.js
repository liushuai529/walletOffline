import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';

export default class WithdrawCell extends Component {
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
            justifyContent: 'space-between',
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
              width: '80%',
              justifyContent: 'center',
              height: common.getH(50),
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', height: common.margin25 }}>
              <Text style={styles.contentText}>2020-06-03 11:22:00</Text>
              <Text style={styles.contentText}>0.123456BTC</Text>
            </View>
            <Text style={styles.contentText}>
              1sdkjf23423kjklsjflasdnasnlk
            </Text>
          </View>
          <View style={{
            height: common.margin25,
            width: common.margin25,
            borderWidth: 1,
            borderColor: 'yellow',
            justifyContent: 'flex-end'
          }}>
            <Image
              style={{
                height: common.w20,
                width: common.w20,
                alignContent: 'center',
                
              }}
              source={require('../../resource/assets/bottom_1.png')}
            />
          </View>

        </View>
        <View style={{ backgroundColor: common.bgColor, height: common.margin5 }}></View>
      </NextTouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contentText: {
    color: common.textColor,
    fontSize: common.font14,
  }



});
