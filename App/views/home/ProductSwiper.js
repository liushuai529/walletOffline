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

const styles = StyleSheet.create({
  banners: {
    height: common.sw * 3 / 4,
  },
  bannersImage: {
    width: common.sw,
    height: common.sw * 3 / 4,
  },
  dot: {
    marginBottom: common.margin15,
  },
})

export default class ProductSwiper extends Component {
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
          <FastImage
            style={styles.bannersImage}
            resizeMode="stretch"
            source={require('../../resource/assets/account_mid.png')}
          />
        )
      })
      return (<Swiper
        index={this.bannersIndex}
        showsButtons={false}
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
