import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';

export default class PasswordWarn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { key: 'lowercase', value: false },
        { key: 'capital', value: false },
        { key: 'number', value: false },
        { key: 'length', value: false }
      ],
    };
    this.dataDic = {
      lowercase: '一个小写字母',
      capital: '一个大写字母',
      number: '一个数字',
      length: '8～32个字符'
    }
  }

  componentDidMount() { }

  renderHeader = () => {
    const { type } = this.props;
    if (type === 'repassword') return null;
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: common.margin20 }}>
        <Text style={{ color: common.textColor, fontSize: common.font18, fontWeight: 'bold', }}>为了您的资产安全，密码需要：</Text>
      </View>
    )
  }

  renderRow = item => {
    const { type } = this.props;
    return (
      <View style={{ flexDirection: 'row', marginVertical: common.margin10,  alignItems: 'center' }}>
        <Image
          style={{
            width: common.w20,
            height: common.h20,
          }}
          source={type === 'password' ? item.value ? require('../../resource/assets/selected.png') : require('../../resource/assets/unselected.png') :
            require('../../resource/assets/selected.png')
          }
        />
        <Text
          style={{
            color: type === 'password' ? item.value ? common.textColor : 'red' : common.textColor,
            fontSize: common.font14,
            marginLeft: common.margin10
          }}>
          {type === 'password' ? this.dataDic[item.key] : item}
        </Text>
      </View>
    );
  };

  render() {
    return (

      <View
        style={{
          marginTop: common.margin10,
          // marginLeft: common.margin10,
          // marginRight: common.margin10,
          height: common.getH(200),
          backgroundColor: common.whiteColor,
          borderRadius: 5,
          paddingHorizontal: common.margin10,
        }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => this.renderRow(item.item)}
          data={this.props.value}
          ListHeaderComponent={() => this.renderHeader()}
        />

      </View>
    );
  }
}
