import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import Swiper from 'react-native-swiper'
import QRCode from 'react-native-qrcode-svg';
import { common } from '../../constants/common'

const styles = StyleSheet.create({

  banners: {
    height: '90%',
    paddingTop: common.margin20,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'red',
    // borderWidth: 1,
    

  },
  dot: {
    marginBottom: 0,
  },
})

class QRcodeSwiper extends Component {
  constructor() {
    super()
    this.state = {
      QRList: [],
    }
    this.QRIndex = 0;
    // this.limit = 3;
  }

  componentDidMount() {
    const { out } = this.props;
    let QRList = [];
    for (var i = 0; i < out.length / Math.ceil(common.getQRcodeLength()); i++) {
      QRList.push(out.substring(i * common.getQRcodeLength(), (i + 1) * common.getQRcodeLength()))
    }
    this.setState({ QRList })
  }



  componentWillUnmount() {

  }






  render() {
    const { QRList } = this.state;
    const renderQRCodeSwiper = () => {
      const items = QRList.map((element, index) => {
        const source = element;
        return (
          <NextTouchableOpacity
            activeOpacity={1}
            style={{
              width: '100%',
              alignItems: 'center'
            }}

          >
            <QRCode value={source} />
            <Text style={{textAlign: 'center', marginTop: common.margin5}}>{index + 1}</Text>
          </NextTouchableOpacity>
        )
      })
      return (<Swiper
        index={this.QRIndex}
        showsButtons={false}
        dotStyle={styles.dot}
        onIndexChanged={(i) => { this.QRIndex = i }}
        activeDotStyle={styles.dot}
        dotColor={common.borderColor}
        activeDotColor={common.placeholderColor}
      >
        {items}
      </Swiper>)
    }

    return (
      <View style={styles.banners}>
        {renderQRCodeSwiper()}
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

export default connect(mapStateToProps)(QRcodeSwiper);
