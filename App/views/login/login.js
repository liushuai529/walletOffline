import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  ImageBackground,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {
  changeMobile,
  changePassword,
  showVerify,
  hideVerify,
  verifyCheckData,
  requestCheckLogin,
} from '../../redux/actions/login';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Toast, PopoverPicker} from 'teaset';
import VerifyWebView from './VerifyWebView';
import {version} from '../../../app.json';
import transfer from '../../localization/utils';
import {changeLanuage, reloadLanuageTransfer} from '../../redux/actions/system';

let languages = ['简体', '繁體', 'EN'];

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this._keyboardDidShow();
      },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this._keyboardDidHide();
      },
    );
  }

  _keyboardDidShow() {
    this.isKeyboardShow = true;
  }

  _keyboardDidHide() {
    this.isKeyboardShow = false;
  }

  componentWillUnmount() {
    this.hideCustom();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps(nextprops) {}

  forgetPasswordAction() {
    const {navigation} = this.props;
    navigation.navigate('ResetCode');
  }

  registerAction() {
    const {navigation} = this.props;
    navigation.navigate('Register', {isFromLogin: true});
  }

  showView(view) {
    view.measure((x, y, width, height, pageX, pageY) => {
      PopoverPicker.show(
        {
          x: pageX,
          y: pageY,
          width,
          height,
        },
        languages,
        0,
        (item, index) =>
          setTimeout(() => {
            const {dispatch} = this.props;
            dispatch(changeLanuage(index));
            dispatch(reloadLanuageTransfer());
          }, 300),
        {
          modal: false,
        },
      );
    });
  }

  render() {
    const {login, dispatch, isShowVerify, mobile, password} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(39,39,41)" />
        <Modal
          animationType="none"
          transparent={true}
          visible={isShowVerify}
          onRequestClose={() => {
            dispatch(hideVerify());
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(hideVerify());
              }}>
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  opacity: 0.3,
                }}
              />
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '100%',
                backgroundColor: common.navBgColor,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: common.font18,
                  paddingVertical: common.margin20,
                  paddingHorizontal: common.margin20,
                }}>
                {transfer(this.props.language, 'login01')}
              </Text>
              <VerifyWebView
                callback={data => {
                  dispatch(verifyCheckData());
                  if (data == undefined) {
                    Toast.fail(transfer(this.props.language, 'login02'));
                  } else {
                    const platform = common.IsIOS ? 'ios' : 'android';
                    let parma = {
                      password: password,
                      language: this.props.language,
                      client: `app-${platform}-${version}`,
                      encryptedKey: '',
                      checkLogin: true,
                      checkData: data,
                    };
                    if (!common.validateEmail(mobile)) {
                      parma['mobile'] = mobile;
                    } else {
                      parma['email'] = mobile;
                    }
                    dispatch(requestCheckLogin(parma));
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal visible={this.props.logining} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#2B2B2B',
                width: 130,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <ActivityIndicator size="large" color="gray" />
              <Text
                style={{
                  fontSize: common.font17,
                  color: 'white',
                  marginTop: common.margin15,
                }}>
                {transfer(this.props.language, 'login03')}
              </Text>
            </View>
          </View>
        </Modal>
        <Image
          style={styles.image}
          source={require('../../resource/assets/login_bg.jpg')}
          resizeMode="cover"
        />
        <KeyboardAwareScrollView
          style={{width: '100%', height: '100%'}}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                if (this.isKeyboardShow) {
                  setTimeout(() => {
                    this.showView(this.fromView);
                  }, 150);
                } else {
                  this.showView(this.fromView);
                }
              }}>
              <View
                ref={view => {
                  this.fromView = view;
                }}
                style={{
                  padding: common.margin5,
                  marginTop: common.navHeight,
                  alignSelf: 'flex-end',
                  paddingRight: common.margin20,
                }}>
                <Text
                  style={{fontSize: common.font16, color: common.themeColor}}>
                  {languages[this.props.languageIndex]}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Image
              style={{
                width: 100,
                height: 137,
                marginTop: common.margin10,
              }}
              source={require('../../resource/assets/logo_white.png')}
            />
            <View
              style={{
                width: '100%',
                marginTop: common.margin20,
                paddingBottom: common.margin20,
              }}>
              <View
                style={{
                  backgroundColor: 'transparent',
                  marginHorizontal: common.margin30,
                  borderRadius: common.h10,
                }}>
                <View
                  style={{
                    marginHorizontal: common.margin20,
                  }}>
                  <Text
                    style={{
                      fontSize: common.font20,
                      color: 'red',
                      marginTop: common.margin30,
                      fontWeight: '400',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      marginTop: common.margin20,
                      flexDirection: 'row',
                      height: common.h40,
                      borderColor: common.placeholderColor,
                      borderWidth: 1,
                    }}>
                    <Image
                      style={{
                        width: common.w20,
                        height: common.w20,
                        marginHorizontal: common.margin15,
                      }}
                      source={require('../../resource/assets/login_user.png')}
                      resizeMode="contain"
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: common.font14,
                        color: common.textColor,
                      }}
                      placeholder={transfer(this.props.language, 'login05')}
                      placeholderTextColor={common.textColor}
                      value={mobile}
                      onChangeText={e => {
                        dispatch(changeMobile(e));
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      marginTop: common.margin12,
                      flexDirection: 'row',
                      height: common.h40,
                      borderColor: common.placeholderColor,
                      borderWidth: 1,
                    }}>
                    <Image
                      style={{
                        width: common.w20,
                        height: common.w20,
                        marginHorizontal: common.margin15,
                      }}
                      source={require('../../resource/assets/login_password.png')}
                      resizeMode="contain"
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: common.font14,
                        color: common.textColor,
                      }}
                      placeholder={transfer(this.props.language, 'login06')}
                      placeholderTextColor={common.textColor}
                      value={password}
                      secureTextEntry={true}
                      onChangeText={e => {
                        dispatch(changePassword(e));
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: common.margin12,
                      flexDirection: 'row',
                      height: common.h40,
                    }}
                  />
                  <ImageBackground
                    style={{marginTop: common.margin15, padding: 0}}
                    source={require('../../resource/assets/login_btn.png')}
                    imageStyle={{resizeMode: 'cover'}}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        dispatch(showVerify());
                      }}>
                      <View
                        style={{
                          height: common.h40,
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: common.loginTextColor,
                            fontSize: common.font16,
                          }}>
                          {transfer(this.props.language, 'login07')}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </ImageBackground>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      height: common.h36,
                      marginBottom: common.margin12,
                    }}>
                    <Text
                      style={{
                        color: common.textColor,
                        fontSize: common.font16,
                        flex: 1,
                      }}
                      onPress={() => {
                        this.forgetPasswordAction();
                      }}>
                      {transfer(this.props.language, 'login08')}
                    </Text>
                    <Text
                      style={{
                        color: common.textColor,
                        fontSize: common.font16,
                        flex: 1,
                        textAlign: 'right',
                      }}
                      onPress={() => {
                        this.registerAction();
                      }}>
                      {transfer(this.props.language, 'login09')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <Text
                    style={{
                        alignSelf: "center",
                        position: "absolute",
                        top: common.sh - common.extraTop - common.h30,
                        height: common.h30,
                        fontSize: common.font14,
                        color: "white",
                        fontWeight: "600"
                    }}
                >{`TV（China）Foundation`}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: common.bgColor,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.login,
    login: state.login,
  };
}

export default connect(mapStateToProps)(Login);
