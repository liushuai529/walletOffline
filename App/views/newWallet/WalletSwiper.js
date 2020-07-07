import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper'
import { common } from '../../constants/common'

const styles = StyleSheet.create({
  
  banners: {
    height: common.getH(400),
  },
  dot: {
    marginBottom: -20,
  },
  walletImage: {
    width: common.sw,
    height: common.getH(400)
  }
})

class WalletSwiper extends Component {
  constructor() {
    super()
    this.state = {
      walletList: [
        require('../../resource/assets/bottom_1.png'),
        require('../../resource/assets/bottom_1.png'),
        require('../../resource/assets/bottom_1.png'),
        
      ],
    }
    this.walletIndex = 0;
    this.limit = 3;
  }

  componentDidMount() {

  }



  componentWillUnmount() {

  }




  

  render() {
    const { walletList } = this.state;
    const renderWalletsSwiper = () => {
      const items = walletList.map(element => {
        const source = element;
        return (
          <NextTouchableOpacity
            // key={element.id}
            activeOpacity={1}
            
          >
            <FastImage
              style={styles.walletImage}
              source={source}
              // resizeMode="stretch"
              // source={{ uri: uri }}
            />
          </NextTouchableOpacity>
        )
      })
      return (<Swiper
        index={this.walletIndex}
        showsButtons={false}
        dotStyle={styles.dot}
        onIndexChanged={(i) => { this.walletIndex = i }}
        activeDotStyle={styles.dot}
        dotColor={common.borderColor}
        activeDotColor={common.placeholderColor}
      >
        {items.reverse()}
      </Swiper>)
    }

    return (
      <View style={styles.banners}>
        {renderWalletsSwiper()}
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
  
  };
}

export default connect(mapStateToProps)(WalletSwiper);
