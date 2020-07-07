import React from 'react';
import {View, TouchableWithoutFeedback, Text, Clipboard, StyleSheet, Image, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {Toast} from 'teaset';
import {common} from '../../constants/common';
import {requesetUserAddress} from '../../redux/actions/user';
import transfer from '../../localization/utils';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import {clearFormData} from '../../redux/actions/assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingBottom: common.margin30,
  },
});

class RechargeAlert extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerStyle: {
        backgroundColor: common.bgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: '',
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(requesetUserAddress({token_id: 2}));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(clearFormData());
  }

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
    const {rechargeaddr, hide} = this.props;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: common.bgColor,
                  paddingHorizontal: common.margin20,
                  width: '100%',
                }}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    marginTop: common.margin10,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: common.font30,
                      color: common.navTitleColor,
                    }}>
                    {transfer(this.props.language, 'alert_37')}
                  </Text>
                  <Text style={{color: common.themeColor, fontSize: common.font20, marginLeft: common.margin10}}>USDT-ERC20</Text>
                </View>
                <View style={{backgroundColor: common.navBgColor, marginTop: common.margin15, paddingVertical: common.margin10}}>
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    {rechargeaddr ? (
                      <ViewShot ref="viewShot">
                        <View
                          style={{
                            width: common.getH(160),
                            height: common.getH(160),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                          }}>
                          <QRCode backgroundColor={'#fff'} color={'#000'} size={common.w150} value={rechargeaddr} />
                        </View>
                      </ViewShot>
                    ) : null}
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.saveImage();
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        backgroundColor: common.themeColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: common.w120,
                        paddingVertical: common.margin10,
												marginTop: common.margin10
                      }}>
                      <Text style={{color: '#000', fontSize: common.font16}}>{transfer(this.props.language, 'local_1')}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: common.font16,
                      color: common.navTitleColor,
                      paddingBottom: common.margin10,
                      marginTop: common.margin20,
                    }}>
                    {transfer(this.props.language, 'alert_15')}
                  </Text>
                  <View
                    style={{
                      paddingBottom: common.margin10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: common.margin10,
                    }}>
                    <Text
                      style={{
                        fontSize: common.font16,
                        color: common.navTitleColor,
                        flex: 1,
                        textAlign: 'center',
                      }}
                      onLongPress={() => {
                        Clipboard.setString(rechargeaddr);
                        Toast.success(transfer(this.props.language, 'copy_success'));
                      }}>
                      {rechargeaddr}
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Clipboard.setString(rechargeaddr);
                      Toast.success(transfer(this.props.language, 'copy_success'));
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        backgroundColor: '#C2C2CB',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: common.margin10,
                        width: common.w120,
                        paddingVertical: common.margin10,
                        marginBottom: common.margin10,
                      }}>
                      <Text
                        style={{
                          fontSize: common.font16,
                          color: 'black',
                          paddingLeft: common.margin5,
                        }}>
                        {transfer(this.props.language, 'copy')}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Text
                  style={{
                    fontSize: common.font18,
                    paddingVertical: common.margin5,
                    marginTop: common.margin20,
                    color: common.navTitleColor,
                  }}>
                  {transfer(this.props.language, 'alert_16')}
                </Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    paddingVertical: common.margin5,
                    color: common.navTitleColor,
                  }}>
                  {transfer(this.props.language, 'alert_17')}
                </Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    paddingVertical: common.margin5,
                    color: common.navTitleColor,
                  }}>
                  {transfer(this.props.language, 'alert_18')}
                </Text>
                <Text
                  style={{
                    fontSize: common.font16,
                    paddingVertical: common.margin5,
                    color: common.navTitleColor,
                  }}>
                  {transfer(this.props.language, 'alert_19')}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.user,
  };
}

export default connect(mapStateToProps)(RechargeAlert);
