import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {common} from '../../../constants/common';
import NextTouchableOpacity from '../../../components/NextTouchableOpacity';
import TKButton from '../../../components/TKButton';
import transfer from '../../../localization/utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: common.getH(2),
    marginRight: common.getH(2),
    borderBottomColor: common.lineColor,
    borderBottomWidth: 1,
  },
  titlesMiddleLine: {
    width: common.getH(1),
    top: common.getH(4),
    bottom: common.getH(4),
    backgroundColor: common.lineColor,
  },
  titleView: {
    marginTop: common.getH(10),
    marginBottom: common.getH(10),
    justifyContent: 'center',
  },
});

class LegalDealConfirmCancelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmCancelSelected: false,
    };
  }

  render() {
    const {language, pressCancel, pressConfirm} = this.props;
    const {confirmCancelSelected} = this.state;
    return (
      <View
        style={{
          borderRadius: common.radius6,
          height: common.h200,
          backgroundColor: 'white',
          alignSelf: 'center',
          maxWidth: '90%',
        }}>
        <Text
          style={{
            paddingTop: common.h15,
            paddingHorizontal: common.h15,
            fontSize: common.font20,
            color: common.blackColor,
            justifyContent: 'center',
          }}>
          {transfer(language, 'otc_confirm_cancel_title')}
        </Text>
        <Text
          style={{
            paddingTop: common.h15,
            paddingHorizontal: common.h15,
            fontSize: common.font16,
            color: common.redColor,
          }}>
          {transfer(language, 'otc_confirm_cancel_content')}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: common.h15,
            paddingHorizontal: common.h15,
          }}>
          <NextTouchableOpacity
            style={{height: common.h20}}
            delay={100}
            onPress={() => {
              this.setState({
                confirmCancelSelected: !this.state.confirmCancelSelected,
              });
            }}>
            {confirmCancelSelected ? (
              <Image
                style={{width: common.h20, height: common.h20}}
                source={require('../../../resource/assets/otc_confirm.png')}
              />
            ) : (
              <Image
                style={{width: common.h20, height: common.h20}}
                source={require('../../../resource/assets/otc_not_confirm.png')}
              />
            )}
          </NextTouchableOpacity>
          <Text
            style={{
              paddingLeft: common.h5,
              fontSize: common.font16,
              color: common.blackColor,
            }}>
            {transfer(language, 'otc_confirm_cancel_item')}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            paddingTop: common.h15,
            paddingHorizontal: common.h15,
          }}>
          <View style={{width: 50, height: 30}}>
            <TKButton
              style={{
                backgroundColor: 'transparent',
              }}
              titleStyle={{color: common.blackColor}}
              onPress={pressCancel}
              disabled={false}
              caption={'取消'}
            />
          </View>
          <View style={{width: 50, height: 30}}>
            <TKButton
              style={{
                backgroundColor: 'transparent',
              }}
              titleStyle={{
                color: confirmCancelSelected
                  ? common.blackColor
                  : common.grayColor,
              }}
              onPress={pressConfirm}
              disabled={confirmCancelSelected ? false : true}
              caption={'确定'}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default LegalDealConfirmCancelView;
