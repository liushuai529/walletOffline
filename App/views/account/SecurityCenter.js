import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, StatusBar, ScrollView } from 'react-native';
import { Overlay } from 'teaset';
import { common, storeRead } from '../../constants/common';
import SecurityCenterCell from './SecurityCenterCell';
import { getGoogleAuth } from '../../redux/actions/securityCenter';
import actions from '../../redux/actions/index';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import transfer from '../../localization/utils';
import schemas from '../../schemas/index';
import { queryConfigUserSettings } from '../../redux/actions/user';

class SecurityCenter extends Component {
  static navigationOptions(props) {
    let title = '';
    if (props.navigation.state.params) {
      title = props.navigation.state.params.title;
    }
    return {
      headerTitle: title,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { language } = this.props;
    if (
      this.props.requestGoogleAuthLoading &&
      !nextProps.requestGoogleAuthLoading
    ) {
      const msg = nextProps.GoogleAuthBinded
        ? transfer(language, 'me_googleBinded')
        : transfer(language, 'me_googleBindReminder');
      this.showOverlay(msg);
    }
  }

  componentWillMount() {
    const { navigation, language } = this.props;
    navigation.setParams({
      title: transfer(language, 'account_3'),
    });
  }

  componentDidMount() {
    this.props.dispatch(queryConfigUserSettings({ keys: ['LegalPayType'] }));
    if (this.props.loggedIn) this.props.dispatch(actions.sync());
  }

  componentWillUnmount() { }

  showOverlay(msg) {
    const overlayView = (
      <Overlay.View
        style={{ justifyContent: 'center' }}
        modal={false}
        overlayOpacity={0}>
        <View
          style={{
            marginTop: -common.margin210,
            borderRadius: common.radius6,
            height: common.h60,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignSelf: 'center',
            width: '50%',
          }}>
          <Text
            style={{
              fontSize: common.font16,
              color: common.blackColor,
              alignSelf: 'center',
            }}>
            {msg}
          </Text>
        </View>
      </Overlay.View>
    );
    this.overlayViewKey = Overlay.show(overlayView);
    setTimeout(() => {
      Overlay.hide(this.overlayViewKey);
    }, 2000);
  }

  render() {
    const {
      navigation,
      loggedInResult,
      language,
      dispatch,
      loggedIn,
      payTypeList,
    } = this.props;
    // var alipayEnabled = false;
    // payTypeList.some(r => {
    // if (r.payType === 'alipay') {
    // alipayEnabled = r.enabled;
    // return true;
    // }
    // return false;
    // });
    var alipayEnabled = true;
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: common.bgColor,
        }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={common.bgColor}
        />
        <SecurityCenterCell
          title={transfer(language, 'me_linkEmail')}
          detail={common.maskEmail(loggedInResult.email || '')}
          onPress={() => {
            if (!loggedInResult.email) {
              navigation.navigate('UpdateEmail');
            } else {
              this.showOverlay(transfer(language, 'me_Email_binded'));
              if (loggedIn) dispatch(actions.sync());
            }
          }}
        />
        <SecurityCenterCell
          title={transfer(language, 'me_linkMobile')}
          detail={common.maskMobile(loggedInResult.mobile || '')}
          onPress={() => {
            if (!loggedInResult.mobile) {
              navigation.navigate('UpdateMobile');
            } else {
              this.showOverlay(transfer(language, 'me_Mobile_binded'));
              if (loggedIn) dispatch(actions.sync());
            }
          }}
        />
        {this.props.language === 'zh_hans' ? (
          <SecurityCenterCell
            title={transfer(language, 'me_bankCards_management')}
            detail=""
            onPress={() => {
              if (!loggedIn) {
                navigation.navigate('LoginStack');
              } else if (
                loggedInResult &&
                loggedInResult.idCardAuthStatus &&
                loggedInResult.idCardAuthStatus === common.user.status.pass
              ) {
                navigation.navigate('UpdateBank', { fromMe: 'fromMe' });
              } else {
                this.showOverlay(
                  transfer(
                    language,
                    language === 'zh_hans'
                      ? 'me_id_authentic_before'
                      : 'otc_visible_chinese',
                  ),
                );
              }
              if (loggedIn) dispatch(actions.sync());
            }}
          />
        ) : null}
        {this.props.language === 'zh_hans' && alipayEnabled ? (
          <SecurityCenterCell
            title={transfer(language, 'me_alipay_management')}
            detail=""
            onPress={() => {
              if (!loggedIn) {
                navigation.navigate('LoginStack');
              } else if (
                loggedInResult &&
                loggedInResult.idCardAuthStatus &&
                loggedInResult.idCardAuthStatus === common.user.status.pass
              ) {
                navigation.navigate('UpdateAlipay', { fromMe: 'fromMe' });
              } else {
                this.showOverlay(
                  transfer(
                    language,
                    language === 'zh_hans'
                      ? 'me_id_authentic_before'
                      : 'otc_visible_chinese',
                  ),
                );
              }
              if (loggedIn) dispatch(actions.sync());
            }}
          />
        ) : null}
        {/* <SecurityCenterCell
          title={transfer(language, 'me_google_authenticator')}
          detail=""
          onPress={() => {
            storeRead(common.user.string, result => {
              if (result) {
                const user = JSON.parse(result);
                const {dispatch} = this.props;
                dispatch(actions.findUserUpdate(user));
                dispatch(actions.findUser(schemas.findUser(user.id)));
                dispatch(getGoogleAuth(schemas.findUser(user.id)));
              }
            });
            if (loggedIn) dispatch(actions.sync());
          }}
        /> */}
        {/* <SecurityCenterCell
          title={'收货地址'}
          detail=""
          onPress={() => {
            navigation.navigate('AddressInfo'); 
          }}
        /> */}
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.securityCenter,
    loggedIn: state.login.isLogin,
    loggedInResult: state.login.data,
    language: state.system.language,
    payTypeList: state.user.payTypeList,
  };
}

export default connect(mapStateToProps)(SecurityCenter);
