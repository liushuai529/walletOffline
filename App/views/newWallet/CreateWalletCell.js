import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';

export default class CreateWalletCell extends Component {
  componentDidMount() { }
  render() {
    return (
      <NextTouchableOpacity
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
        delay={100}
        activeOpacity={common.activeOpacity}>
        <View
          style={{
            marginTop: common.margin10,
            marginLeft: common.margin10,
            marginRight: common.margin10,
            flexDirection: 'row',
            height: common.margin60,
            backgroundColor: common.whiteColor,
            borderRadius: 5,
            paddingRight: common.margin20
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
            }}>
            <Image
              style={{
                marginLeft: common.margin15,
                height: common.w20,
                width: common.w20,
                alignSelf: 'center',
              }}
              source={this.props.leftImageSource}
            />
            <Text
              style={[
                {
                  marginLeft: common.margin10,
                  fontSize: common.font14,
                  color: common.textColor,
                  alignSelf: 'center',
                },
              ]}>
              {this.props.title}
            </Text>
          </View>

          <View style={{ width: '10%', justifyContent: 'center' }}>
            <Image
              style={{
                marginLeft: common.margin15,
                height: common.w20,
                width: common.w20,
                alignSelf: 'center',
              }}
              source={this.props.checked ? require('../../resource/assets/selected.png') : require('../../resource/assets/unselected.png')}
            />
          </View>
        </View>
      </NextTouchableOpacity>
    );
  }
}
