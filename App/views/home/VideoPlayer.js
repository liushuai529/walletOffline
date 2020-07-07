import React, { Component } from 'react'
import { View, StyleSheet, Image, Slider, Text, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native'
import { common } from '../../constants/common'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import Video from 'react-native-video';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { withNavigation } from 'react-navigation';
import { updateForm } from '../../redux/actions/home';
import cache from '../../utils/cache';



const styles = StyleSheet.create({
  container: {
    //backgroundColor: common.chatBgColor,
    backgroundColor: '#f0f0f0'
    //paddingHorizontal: common.margin10,
  },
})

class VideoPlayer extends Component {

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
      videoWidth: common.sw,
      videoHeight: common.sw * 9 / 16,
      isFullScreen: false,
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    const { palyOptions } = this.state;
    DeviceEventEmitter.addListener('closeFullScreen', item => {
      //返回视频最大值, 当前播放位置
      this.player.seek(parseInt(item.currentLocation) + 1);
      this.setState({
        palyOptions: { ...palyOptions, currentLocation: item.currentLocation, isPause: false, endLocation: item.endLocation }
      })
    })

    // const url = navigation.getParam('palyOptions').url;
    // this.setState({
    //   palyOptions: {...palyOptions, url}
    // })
  }
  componentWillMount() {
  }

  componentWillUnmount() {
    // if (this.tiem) {
    //     clearInterval(this.tiem);
    //     this.tiem = null;
    // }
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
    const { dispatch, currentIndex, historyList } = this.props;
    const { palyOptions } = this.state;
    // this.setState({
    //   palyOptions: { ...palyOptions, isEnding: true, isPause: true, currentLocation: palyOptions.endLocation }
    // })
    if (historyList.length - 1 === currentIndex) {
      dispatch(dispatch(updateForm({ currentIndex: 0 })))
    } else {
      dispatch(dispatch(updateForm({ currentIndex: currentIndex + 1 })))
    }


  }

  onLoad = (load) => {
    const { palyOptions } = this.state;
    if (load) {
      this.setState({
        palyOptions: { ...palyOptions, isPlaying: true, isPause: false, currentLocation: 0, endLocation: parseInt(load.duration) }
      })
      if (cache.getObject('videoLocation') !== null) this.player.seek(parseInt(cache.getObject('videoLocation')));
    }
  }

  onProgress = (progress) => {
    const { palyOptions } = this.state;
    //console.warn('监听播放中',progress.currentTime)
    cache.setObject('videoLocation', parseInt(progress.currentTime))
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
  onControlShrinkPress = () => {
    const { navigation, historyList, currentIndex } = this.props;
    const { palyOptions, } = this.state;
    //console.warn('播放器', this.player)
    this.setState({
      palyOptions: { ...palyOptions, isPause: true, }
    })
    cache.setObject('videoUrl', historyList[currentIndex].video);
    cache.setObject('videoCurrentLocation', palyOptions.currentLocation + 1);
    cache.setObject('videoEndLocation', palyOptions.endLocation);
    navigation.navigate('VideoFullScreenPlayer')
  }




  render() {
    const { historyList, currentIndex } = this.props;
    const { palyOptions, videoHeight, videoWidth } = this.state;
    //console.warn(this.state.videoWidth, this.state.videoHeight)
    return (
      <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
        <View style={styles.container} >
          <View style={{ width: this.state.videoWidth, height: this.state.videoHeight, }}>
            <Video
              ref={(ref) => {
                this.player = ref
              }}
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
                width: common.sw,
                height: common.getH(50),
                position: 'absolute',
                top: common.sw * 9 / 16 - common.getH(60),
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
                    <Slider style={{ height: common.margin10, width: common.sw - common.getH(80), }}
                      maximumValue={palyOptions.endLocation}
                      minimumValue={0}
                      onSlidingComplete={this.onSlidingComplete}
                      onValueChange={this.onValueChange}
                      step={1}
                      value={palyOptions.currentLocation}
                    />
                    <View style={{ width: common.sw - common.getH(120), flexDirection: 'row', justifyContent: 'space-between', }}>
                      <Text style={{ color: '#ffffff', fontSize: common.font14 }}>{`${common.formatVideoTime(palyOptions.currentLocation)}`}</Text>
                      <Text style={{ color: '#ffffff', fontSize: common.font14 }}>{`${common.formatVideoTime(palyOptions.endLocation)}`}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, }}>
                    <TouchableWithoutFeedback
                      onPress={() => { this.onControlShrinkPress() }}

                    >
                      <View style={{
                        width: common.getH(40),
                        height: common.getH(40),
                        marginTop: common.getH(-10),
                        marginLeft: common.getH(-10),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>


                        <Image
                          resizeMode="contain"
                          source={require('../../resource/assets/close_icon.png')}
                          style={{ width: common.getH(20), height: common.getH(20) }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>


                </View>

              </View>
            ) : null
          }


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

export default connect(
  mapStateToProps,
)(withNavigation(VideoPlayer))
