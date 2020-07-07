import React, { Component } from 'react'
import { View, StyleSheet, Image, Slider, Text, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native'
import { common } from '../../constants/common'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import Video from 'react-native-video';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import cache from '../../utils/cache';



const styles = StyleSheet.create({
  container: {
    backgroundColor: common.chatBgColor,

    //backgroundColor: '#f0f0f0'
    //paddingHorizontal: common.margin10,
  },
})

class VideoFullScreenPlayer extends Component {
  static navigationOptions = ({ navigation }) => {
    headerLeft: null
    return {
      header: () => null, // 隐藏头部
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      palyOptions: {
        name: '',
        url: '',
        currentLocation: 0,
        endLocation: 0,
        isPlaying: false,
        isPause: false,
        isEnding: false,
        isSlide: false,
        step: 0,
        type: '',
        showVideoControl: false,

      },
      videoWidth: common.sh,
      videoHeight: common.sw,
      isFullScreen: false,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    Orientation.lockToLandscape();
    const { navigation } = this.props;
    const { palyOptions, videoHeight } = this.state;
    // this.setState({
    //   videoHeight: videoHeight
    // })
  }
  componentWillMount() {
  }

  componentWillUnmount() {
    // if (this.tiem) {
    //     clearInterval(this.tiem);
    //     this.tiem = null;
    // }
    const { palyOptions } = this.state;
    const currentLocation = palyOptions.currentLocation ? palyOptions.currentLocation : cache.getObject('videoCurrentLocation');
    const endLocation = palyOptions.endLocation ? palyOptions.endLocation : cache.getObject('videoEndLocation');
    DeviceEventEmitter.emit('closeFullScreen', { currentLocation, endLocation });
  }


  componentWillReceiveProps(nextProps) {
  }

  onSlidingComplete = (completeProgress) => {
    //console.log('滑动结束监听进度条', completeProgress);
    const { palyOptions } = this.state;
    this.player.seek(completeProgress);
    this.setState({
      palyOptions: { ...palyOptions, currentLocation: completeProgress, isSlide: false, isPause: false }
    })
  }

  onValueChange = (changeProgress) => {
    const { palyOptions } = this.state;
    this.player.seek(changeProgress);
    // this.setState({
    //   palyOptions: {...palyOptions, currentLocation: changeProgress, isSlide: true, isPause: true}
    // })
  }

  onEnd = () => {
    //console.log('播放结束');
    const { palyOptions } = this.state;
    this.setState({
      palyOptions: { ...palyOptions, isEnding: true, isPause: true, currentLocation: palyOptions.endLocation }
    })
  }

  onLoad = (load) => {

    const { palyOptions } = this.state;
    if (load) {
      this.setState({
        palyOptions: { ...palyOptions, isPlaying: true, isPause: false, currentLocation: 0, endLocation: parseInt(load.duration) }
      })
      this.player.seek(cache.getObject('videoCurrentLocation'))
    }
  }

  onProgress = (progress) => {
    const { palyOptions } = this.state;
    // console.log('监听播放中',progress)
    this.setState({
      palyOptions: { ...palyOptions, currentLocation: parseInt(progress.currentTime), }
    })

  }

  onSeek = (seek) => {
    const { palyOptions } = this.state;
    this.setState({
      palyOptions: { ...palyOptions, isSlide: true, }
    })
  }

  /// 控制播放器工具栏的显示和隐藏
  hideControl() {
    if (this.state.showVideoControl) {
      this.setState({
        showVideoControl: false,
      })
    } else {
      this.setState({
        showVideoControl: true,
      })
      // setTimeout(
      //   () => {
      //     this.setState({
      //       showVideoControl: false
      //     })
      //   }, 3000
      // )

    }
  }


  /// 点击了工具栏上的全屏按钮
  onControlShrinkPress() {
    // const { toggleFullScreen } = this.props;
    // if (this.props.isFullScreen) {
    //   console.warn('开始全屏',common.sw, common.sh)
    //   this.setState({



    //     // videoWidth: common.sw*2,
    //     // videoHeight: common.sh*2,
    //     //isFullScreen: false
    //   })
    //   toggleFullScreen(false)
    //   Orientation.lockToPortrait();
    // } else {
    //   console.warn('退出全屏',common.sw, common.sh)
    //   this.setState({
    //     videoWidth: common.sw,
    //     videoHeight: common.sw * 9 / 16,
    //     //isFullScreen: true
    //   })
    //   toggleFullScreen(true);
    //   Orientation.lockToLandscape();
    // }
  }




  render() {
    const { palyOptions, videoHeight, videoWidth } = this.state;
    const { historyList, currentIndex, navigation } = this.props;
    //console.warn(this.state.videoWidth, this.state.videoHeight)
    return (
      <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
        <View style={styles.container} >
          <View style={{ width: videoWidth, height: videoHeight, }}>
            <Video
              ref={(ref) => {
                this.player = ref
              }}
              //source={{ uri: cache.getObject('videoUrl') }}
              source={{ uri: historyList.length ? historyList[currentIndex].video : null }}
              style={{ height: videoHeight, width: videoWidth }}
              onError={this.videoError}
              onLoad={this.onLoad}
              onEnd={this.onEnd}
              onProgress={this.onProgress}
              onSeek={this.onSeek}
              paused={palyOptions.isPause}
              resizeMode={'stretch'}
            />
          </View>

          {
            this.state.showVideoControl ? (
              <View style={{
                width: common.sh,
                height: common.getH(50),
                position: 'absolute',
                top: common.sh * 9 / 16 - common.getH(80),
              }}>
                <View style={{ flexDirection: 'row', height: common.margin20 }}>
                  <View style={{ height: common.margin20, alignItems: 'center', marginLeft: common.margin10 }}>

                    <NextTouchableOpacity

                      onPress={() => {
                        if (palyOptions.isPause) {
                          this.setState({
                            palyOptions: { ...palyOptions, isPause: false, }
                          })
                        } else {
                          this.setState({
                            palyOptions: { ...palyOptions, isPause: true, }
                          })
                        }
                      }}
                      activeOpacity={common.activeOpacity}
                      delay={200}
                    >
                      <Text style={{ color: '#ffffff', fontSize: common.font14 }}>{palyOptions.isPause ? '播放' : '暂停'}</Text>
                    </NextTouchableOpacity>
                  </View>

                  <View style={{ height: common.margin20, alignItems: 'center' }}>
                    <Slider style={{ height: common.margin10, width: common.sh - common.getH(80), }}
                      maximumValue={palyOptions.endLocation}
                      minimumValue={0}
                      onSlidingComplete={this.onSlidingComplete}
                      onValueChange={this.onValueChange}
                      step={1}
                      value={palyOptions.currentLocation}
                    />
                    <View style={{ width: common.sh - common.getH(120), flexDirection: 'row', justifyContent: 'space-between', }}>
                      <Text style={{ color: '#ffffff', fontSize: common.font14 }}>{`${common.formatVideoTime(palyOptions.currentLocation)}`}</Text>
                      <Text style={{ color: '#ffffff', fontSize: common.font14 }}>{`${common.formatVideoTime(palyOptions.endLocation)}`}</Text>
                    </View>
                  </View>

                  {/* <View style={{ flex: 1, }}>
                    <TouchableWithoutFeedback onPress={() => { this.onControlShrinkPress() }}>
                      <Image
                        resizeMode="contain"
                        source={require('../../resource/assets/close_icon.png')}
                        style={{ width: common.getH(20), height: common.getH(20) }}
                      />
                    </TouchableWithoutFeedback>
                  </View> */}


                </View>

              </View>
            ) : null
          }
          <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
            <View style={{
              width: common.getH(40),
              height: common.getH(40),
              position: 'absolute',
              top: common.getH(10),
              left: common.getH(20),
              justifyContent: 'center',
              // borderColor: 'red',
              // borderWidth: 1
            }}>

              <Image
                resizeMode="contain"
                source={require('../../resource/assets/arrow_left.png')}
                style={{ width: common.getH(20), height: common.getH(20) }}
              />
            </View>
            </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
    )
  }

}



function mapStateToProps(state) {
  return {
    ...state.home,
    ...state.system,
    ...state.login,
    login: state.login,
  };
}

// export default connect(
//   mapStateToProps,
// )(withNavigation(VideoFullScreenPlayer))
export default connect(
  mapStateToProps,
)(VideoFullScreenPlayer)