import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.navBgColor,
    width: '90%',
    borderRadius: common.margin10,
    paddingVertical: common.margin20,
    paddingHorizontal: common.margin15,
  },
});

class SmallOrderAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSell() {
    const {
      alipay,
      card,
      hide
    } = this.props;
    const title = '温馨提示';
    const content = '当前订单为小额订单，建议使用支付宝进行交易。';

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            hide();
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: common.getH(44),
              height: common.getH(44),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ width: common.getH(15), height: common.getH(15) }}
							source={require('../../resource/assets/close_icon.png')}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontSize: common.font20,
            color: common.navTitleColor,
            alignSelf: 'center',
            marginBottom: common.margin10,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: common.font16, color: common.navTitleColor }}>
          {content}
        </Text>
        <View
          style={{
            marginTop: common.margin15,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (alipay) {
                alipay();
                hide();
              }
            }}
          >
            <View
              style={{
                backgroundColor: common.themeColor,
                paddingVertical: common.margin8,
                flex: 1,
                borderRadius: common.margin5,
                marginLeft: common.margin8,
                marginRight: common.margin10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.blackColor,
                }}
              >
                支付宝
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              if (card) {
                card();
                hide();
              }
            }}
          >
            <View
              style={{
                backgroundColor: '#CACACA',
                paddingVertical: common.margin8,
                flex: 1,
                borderRadius: common.margin5,
                marginRight: common.margin8,
                marginLeft: common.margin10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.blackColor,
                }}
              >
                银行卡
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  render() {
    return this.renderSell();
  }
}

function mapStateToProps(state) {
  return {
    ...state.FiatCurrency,
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(SmallOrderAlert);
