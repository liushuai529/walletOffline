import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import equal from 'deep-equal'
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import { common } from '../../constants/common'
import { imgHashApi } from '../../services/api'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'

const styles = StyleSheet.create({
  banners: {
    height: common.getH(100),
  },
  bannersImage: {
    width: common.sw,
    height: common.getH(100),
  },
  dot: {
    marginBottom: common.margin15,
  },
})

export default class HomeSwiper extends Component {
  constructor() {
    super()
    this.bannersIndex = 0
  }


  render() {
    const { banners, onPress } = this.props
    const renderBannersSwiper = () => {
      if (!banners || !banners.length) return null
      const items = banners.map((element, index) => {
        const uri = element.path
        return (
          <NextTouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => onPress({
              type: 'Banner',
              element,
            })}
          >
            <FastImage
              style={styles.bannersImage}
              resizeMode="stretch"
              source={require('../../resource/assets/account_mid.png')}
             />
          </NextTouchableOpacity>
        )
      })
      return (<Swiper
        index={this.bannersIndex}
        showsButtons={false}
        autoplay
        dotStyle={styles.dot}
        onIndexChanged={(i) => { this.bannersIndex = i }}
        activeDotStyle={styles.dot}
        dotColor={common.borderColor}
        activeDotColor={common.placeholderColor}
      >
        {items}
      </Swiper>)
      
    }

    return (
      <View style={styles.banners}>
        {renderBannersSwiper()}
      </View>
    )
  }
}
