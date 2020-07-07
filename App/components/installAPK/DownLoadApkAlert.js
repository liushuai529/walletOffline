import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback, Image} from 'react-native';
import {common} from '../../constants/common';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingVertical: common.margin10,
		backgroundColor: common.navBgColor,
    borderRadius: common.h10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class DownLoadApkAlert extends Component {
  render() {
    const {language, onPress} = this.props;
    return (
      <View style={styles.container}>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: common.margin40, height: common.margin40}} source={require('../../resource/assets/home_network_error.jpg')} />
        </View>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: common.margin5}}>
          <Text style={{color: 'white', fontSize: common.font18, marginHorizontal: common.margin20, lineHeight: common.margin18}}>
            {transfer(language, 'home_network_error')}
          </Text>
        </View>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: common.margin5}}>
          <Text style={{color: 'white', fontSize: common.font18, marginHorizontal: common.margin20, lineHeight: common.margin18}}>
            {transfer(language, 'home_network_retry')}
          </Text>
        </View>

        <View style={{width: '100%', height: common.getH(1), backgroundColor: 'rgb(77,79,99)', marginTop: common.margin10}} />
        <TouchableWithoutFeedback
          onPress={() => {
            onPress();
          }}>
          <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: common.margin10}}>
            <View
              style={{
                paddingHorizontal: common.margin20,
                paddingVertical: common.margin10,
                borderRadius: common.h5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: common.font18, alignSelf: 'center'}}>{transfer(language, 'alert_36')}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
