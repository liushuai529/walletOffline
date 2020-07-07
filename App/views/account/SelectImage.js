import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
} from 'react-native'
import {
  ActionSheet,
} from 'teaset'
import ImagePicker from 'rn-image-picker-d3j'
import { common } from '../../constants/common'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import transfer from '../../localization/utils'

const styles = {
  baseContainer: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    height: common.h120,
    backgroundColor: common.navBgColor,
    borderColor: common.borderColor,
    borderWidth: 1,
  },
  baseImage: {
    marginTop: common.margin28,
    width: common.w40,
    height: common.w40,
    alignSelf: 'center',
		tintColor: common.navTitleColor
  },
  baseText: {
    marginTop: common.margin20,
    color: common.navTitleColor,
    fontSize: common.font14,
    alignSelf: 'center',
  },
  baseContainerHigh: {
    marginTop: common.margin10,
    marginLeft: common.margin10,
    marginRight: common.margin10,
    height: common.h300,
    backgroundColor: common.navBgColor,
    borderColor: common.borderColor,
    borderWidth: 1,
  },
  baseImageHigh: {
    marginTop: common.margin28,
    width: common.w40,
    height: common.h120,
    alignSelf: 'center',
  },
  baseTextHigh: {
    marginTop: common.margin20,
    color: common.textColor,
    fontSize: common.font14,
    alignSelf: 'center',
  },
  hitsHigh: {
    position: 'absolute',
    left: common.margin10,
    top: common.margin10,
    right: common.margin10,
    paddingTop: common.getH(30),
    paddingBottom: common.getH(30),
    width: common.sw - common.margin10 * 2,
    height: common.h300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  hits: {
    position: 'absolute',
    left: common.margin10,
    top: common.margin10,
    right: common.margin10,
    paddingTop: common.getH(30),
    paddingBottom: common.getH(30),
    width: common.sw - common.margin10 * 2,
    height: common.h120,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  icon: {
    width: common.getH(40),
    height: common.getH(28),
  },
  text: {
    color: '#DFE4FF',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  repeat: {
    color: '#FFD502',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginLeft: 5,
  },
}

export default class SelectImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 0, // 0:default, 1:uploading, 2:upload_success 3:upload_failed
    }
  }

  componentDidMount() { }

  setStatus(status) {
    this.setState({
      status,
    })
  }
  
  showImagePicker() {
    const { imagePickerBlock, language } = this.props
    const items = [
      {
        title: transfer(language, 'me_takePhoto'),
        onPress: () => {
          ImagePicker.launchCamera({
            cameraType: 'back',
            allowsEditing: false,
            permissionDenied: {title: transfer(language, 'me_authority_request_title'), 
                               text: transfer(language, 'me_authority_request_camera'), 
                               reTryTitle: transfer(language, 'me_authority_request_set'), 
                               okTitle: transfer(language, 'me_authority_request_cancel')},
          }, (response) => {
            if (response.uri && response.uri.length) {
              const uri = common.IsIOS ? response.uri : response.path;
              if (common.isSupportImage(uri)) {
                imagePickerBlock(undefined, uri, response.hash);
              }else {
                imagePickerBlock('不支持的格式');
              }
            } else if (response.error) {
              imagePickerBlock(transfer(language, 'me_noCameraPower'));
            }
          })
        },
      },
      {
        title: transfer(language, 'me_takeLibrary'),
        onPress: () => {
          ImagePicker.launchImageLibrary({
            allowsEditing: false,
            permissionDenied: {title: transfer(language, 'me_authority_request_title'), 
                               text: transfer(language, 'me_authority_request_album'), 
                               reTryTitle: transfer(language, 'me_authority_request_set'), 
                               okTitle: transfer(language, 'me_authority_request_cancel')},
          }, (response) => {

            if (response.uri && response.uri.length) {
              const uri = common.IsIOS ? response.uri : response.path;
              if (common.isSupportImage(uri)) {
                imagePickerBlock(undefined, uri, response.hash);
              }else {
                imagePickerBlock('不支持的格式');
              }
            } else if (response.error) {
              if(response.error === 'invalid photo'){
                imagePickerBlock('invalid photo');
              } else {
                imagePickerBlock(transfer(language, 'me_noLibraryPower'));
              }
            }
          })
        },
      },
    ]
    const cancelItem = { title: transfer(language, 'home_updateCancel') }
    ActionSheet.show(items, cancelItem)
  }

  renderHits() {
    const { language, highMode } = this.props
    const { status } = this.state
    const hitStyle = highMode ? styles.hitsHigh : styles.hits;
    if (status === 0) {
      return null
    }
    if (status === 1) {
      return (
        <View style={hitStyle}>
          <Image
            resizeMode="contain"
						source={require('../../resource/assets/upload.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>{transfer(language, 'auth_uploading')}</Text>
        </View>
      )
    }
    if (status === 2) {
      return (
        <View style={hitStyle}>
          <Image
            resizeMode="contain"
						source={require('../../resource/assets/upload_success.png')}
            style={styles.icon}
          />
          <Text style={styles.text}>{transfer(language, 'auth_upload_success')}</Text>
        </View>
      )
    }
    return (
      <View style={hitStyle}>
        <Image
          resizeMode="contain"
					source={require('../../resource/assets/upload_failed.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>{transfer(language, 'auth_upload_failed')}
          <Text style={styles.repeat}>{transfer(language, 'auth_upload_repeat')}</Text>
        </Text>
      </View>
    )
  }

  _getImagePath(imagePath) {
    if (common.IsIOS || imagePath.startsWith('http')) {
      return imagePath;
    }
    return `file://${imagePath}`;
  }

  render() {
    const { title, avatarSource, onPress, editable, highMode } = this.props
    const { status } = this.state
    if (avatarSource ) {
      return (
        <NextTouchableOpacity
          activeOpacity={common.activeOpacity}
          onPress={() => {
            if (editable !== undefined && !editable) {
              return;
            }
            onPress()
            this.showImagePicker()
          }}
        >
          <Image
            resizeMode={"contain"}
            style={highMode ? styles.baseContainerHigh : styles.baseContainer}
            source={{ uri: this._getImagePath(avatarSource) }}
          />
          {this.renderHits()}
        </NextTouchableOpacity>
      )
    }
    return (
      <NextTouchableOpacity
        style={ highMode ? styles.baseContainerHigh : styles.baseContainer}
        activeOpacity={common.activeOpacity}
        onPress={() => {
          onPress()
          this.showImagePicker()
        }}
      >
        <Image
          resizeMode={"contain"}
          style={highMode?styles.baseImageHigh : styles.baseImage}
					source={require('../../resource/assets/plus2.png')}
        />
        <Text
          style={highMode ? styles.baseTextHigh: styles.baseText}
        >{title}</Text>
      </NextTouchableOpacity>
    )
  }
}
