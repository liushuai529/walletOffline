import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  ImageBackground,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {Toast} from 'teaset';
import transfer from '../../localization/utils';
import {rebatesLink} from '../../services/api';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

class inviteFriend extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'account_inviteFriend'),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
    };
  }

  componentDidMount() {}

  onImageLoad = () => {
    this.refs.viewShot.capture().then(uri => {
      this.state.uri = uri;
    });
  };

  saveImage() {
    if (this.state.uri) {
      this.save();
    } else {
      this.refs.viewShot.capture().then(uri => {
        this.state.uri = uri;
        this.save();
      });
    }
  }

  save() {
    const {language} = this.props;
    if (this.state.uri.length == 0) {
      Toast.fail(transfer(language, 'me_super_saveFailed'));
      return;
    }
    CameraRoll.saveToCameraRoll(this.state.uri)
      .then(() => {
        Toast.success(transfer(language, 'me_super_saveSuccess'));
      })
      .catch(error => {
        if (error.code === 'E_UNABLE_TO_SAVE') {
          if (!common.IsIOS && language === 'zh_hans') {
            Toast.fail(transfer(language, 'me_authority_request_album'));
          } else {
            Toast.fail(transfer(language, 'me_super_savePhotoReminder'));
          }
        } else {
          if (!common.IsIOS && language === 'zh_hans') {
            Toast.fail(transfer(language, 'me_authority_request_album'));
          } else {
            Toast.fail(transfer(language, 'me_super_savePhotoReminder'));
          }
        }
      });
  }

  render() {
    let userInfo = this.props.userInfo;
    let inkQr = userInfo.recommendNo
      ? `${rebatesLink}${userInfo.recommendNo}&ts=${Math.random()}`
      : null;
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{
            zIndex: 9999,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: common.bgColor,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          source={require('../../resource/assets/invite_bg.jpg')}>
          {this.props.languageIndex < 2 ? (
            <View
              style={{
                position: 'absolute',
                top: -common.getH(70),
                left: (common.sw - common.getH(600)) / 2,
              }}>
              <Image
                style={{width: common.getH(600), height: common.getH(600)}}
                source={require('../../resource/assets/inviteFriendLogo1.jpg')}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View
              style={{
                position: 'absolute',
                top: common.getH(150),
                left: (common.sw - common.getH(300)) / 2,
              }}>
              <Image
                style={{width: common.getH(300), height: common.getH(300)}}
                source={require('../../resource/assets/inviteFriendLogo2.jpg')}
                resizeMode="cover"
              />
            </View>
          )}

          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingTop: common.margin10,
              backgroundColor: '#000',
              opacity: 0.6,
              width: '100%',
            }}>
            {inkQr ? (
              <QRCode value={inkQr} backgroundColor={'#000'} color={'#fff'} />
            ) : null}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              backgroundColor: '#000',
              paddingVertical: common.margin10,
              paddingHorizontal: common.margin10,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.6,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                }}>
                {transfer(this.props.language, 'my_invite_num')}
              </Text>
              <Text
                style={{
                  fontSize: common.font16,
                  color: common.navTitleColor,
                }}>
                {`: ${userInfo.recommendNo}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              backgroundColor: '#000',
              paddingVertical: common.margin30,
              paddingHorizontal: common.margin10,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.6,
              paddingBottom: common.getH(20),
            }}>
            <View
              style={{
                height: common.getH(1),
                width: '70%',
                borderBottomWidth: 1,
                borderColor: common.cutOffLine,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (userInfo.recommendNo) {
                  Clipboard.setString(userInfo.recommendNo);
                  Toast.success(transfer(this.props.language, 'copy_success'));
                }
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: common.margin30,
                  width: common.getH(170),
                  borderRadius: common.margin15,
                  backgroundColor: common.themeColor,
                  marginLeft: common.margin8,
                  marginTop: common.margin10,
                }}>
                <Text
                  style={{
                    fontSize: common.font16,
                    color: '#000',
                  }}>
                  {this.props.languageIndex < 2
                    ? `${transfer(this.props.language, 'copy')}${transfer(
                        this.props.language,
                        'account_register_10',
                      )}`
                    : `${transfer(this.props.language, 'copy')}  ${transfer(
                        this.props.language,
                        'account_register_10',
                      )}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.saveImage();
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: common.margin30,
                  width: common.getH(170),
                  borderRadius: common.margin15,
                  backgroundColor: common.themeColor,
                  marginLeft: common.margin8,
                  marginTop: common.margin10,
                }}>
                <Text
                  style={{
                    fontSize: common.font16,
                    color: '#000',
                  }}>
                  {transfer(this.props.language, 'my_referral_poster')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <ViewShot ref="viewShot">
          <ImageBackground
            style={{
              width: common.sw,
              height: 2.165 * common.sw,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: common.getH(180),
            }}
            // onLoad={this.onImageLoad}
            source={
              this.props.languageIndex == 0 || this.props.languageIndex == 1
                ? require('../../resource/assets/invite_share.png')
                : require('../../resource/assets/invite_share_2.png')
            }>
            <QRCode value={inkQr} backgroundColor={'#000'} color={'#fff'} />
          </ImageBackground>
        </ViewShot>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    user: state.user,
    userInfo: state.login.data,
  };
}

export default connect(mapStateToProps)(inviteFriend);
