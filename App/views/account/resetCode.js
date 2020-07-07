import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {Overlay, Toast} from 'teaset';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {requesetPhoneCode} from '../../redux/actions/code';
import {requestResetCode} from '../../redux/actions/resetCode';
import VerifyWebView from '../login/VerifyWebView';
import transfer from '../../localization/utils';
import {isValidPhoneNumber} from 'react-phone-number-input';

class ResetCode extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'reset_code_1'),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isShowVerify: false,
      refreshing: false,
      tabList: {
        curIndex: 0,
        typeList: ['mobile', 'email'],
        list: [
          transfer(this.props.language, 'reset_code_2'),
          transfer(this.props.language, 'reset_code_3'),
        ],
      },
      infoList: [
        {
          type: 'regType',
          label: {
            mobile: transfer(this.props.language, 'reset_code_4'),
            email: transfer(this.props.language, 'reset_code_5'),
          },
          placeholder: {
            mobile: transfer(this.props.language, 'reset_code_6'),
            email: transfer(this.props.language, 'reset_code_7'),
          },
          isRequest: true,
          state: 'account',
          maxLength: {
            mobile: 20,
            email: 50,
          },
          regular: {
            mobile: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          },
          accept: {
            mobile: ['number', 'letter', 'other'],
            email: ['number', 'letter', 'other'],
          },
        },
        {
          type: 'code',
          label: transfer(this.props.language, 'reset_code_8'),
          placeholder: transfer(this.props.language, 'reset_code_9'),
          btnText: transfer(this.props.language, 'reset_code_8'),
          btnSendText: transfer(this.props.language, 'reset_code_10'),
          state: 'code',
          delay: {
            mobile: 0,
            email: 0,
          },
          isRequest: true,
          regular: /^.{4,6}$/,
        },
        {
          type: 'pwd',
          label: transfer(this.props.language, 'reset_code_11'),
          placeholder: [
            transfer(this.props.language, 'reset_code_12'),
            transfer(this.props.language, 'reset_code_13'),
          ],
          state: ['loginPwd', 'reLoginPwd'],
          isRequest: true,
          regular: /^(?=^.{6,20}$)(?=.*[A-Z]).*$/,
        },
        // {
        //     type:"pwd",
        //     label:"转账密码：",
        //     placeholder:[
        //         "请输入6-18位转账密码",
        //         "重复输入转账密码"
        //     ],
        //     state:["transferPwd","reTransferPwd"],
        //     isRequest:true,
        //     regular:/^(?=^.{6,20}$)(?=.*[A-Z]).*$/
        // }
      ],
      submitText: transfer(this.props.language, 'reset_code_14'),
      modalBtnText: transfer(this.props.language, 'reset_code_15'),
      regular: {
        chinese: /^[\u4e00-\u9fa5]{0,}$/,
        number: /[0-9]/,
        letter: /[a-zA-Z]/,
        other: /[\~\!\@\#\$\%\^\&\*\(\)\{\}\[\]_\-\+=\?\<\>\  \ \\\|\.\,]/,
      },
    };
  }

  componentWillReceiveProps(next) {
    const {navigation, resetSuccess} = next;
    if (resetSuccess) {
      navigation.goBack();
    }
  }

  getCode() {
    const {dispatch} = this.props;
    const {
      account,
      tabList: {curIndex, typeList},
    } = this.state;
    if (this.state.infoList[1].delay[typeList[curIndex]]) return;
    let code = this.props.country_data[this.props.country_index].code;
    if (curIndex == 0 && code !== 86) {
      if (isValidPhoneNumber(`+${code}${account}`)) {
        this.setState({isShowVerify: true});
      } else {
        setTimeout(() => {
          Toast.fail(
            `${transfer(this.props.language, 'account_register_17')}${
              this.state.tabList.curIndex == '0'
                ? transfer(this.props.language, 'account_register_18')
                : transfer(this.props.language, 'account_register_19')
            }`,
          );
        }, 100);
      }
    } else {
      if (
        account &&
        (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(account) ||
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            account,
          ))
      ) {
        this.setState({isShowVerify: true});
      } else {
        setTimeout(() => {
          Toast.fail(
            `${transfer(this.props.language, 'account_register_17')}${
              this.state.tabList.curIndex == '0'
                ? transfer(this.props.language, 'account_register_18')
                : transfer(this.props.language, 'account_register_19')
            }`,
          );
        }, 100);
      }
    }
  }

  requestCode(checkData) {
    const {dispatch} = this.props;
    const {
      account,
      tabList: {curIndex, typeList},
    } = this.state;
    if (this.state.tabList.curIndex == '0') {
      let newMobile = account;
      let code = this.props.country_data[this.props.country_index].code;
      if (code !== 86) {
        newMobile = `+${code}-${account}`;
      }
      dispatch(
        requesetPhoneCode({
          mobile: newMobile,
          service: 'reset_pass',
          language: this.props.language,
          checkData: checkData,
        }),
      );
    } else {
      dispatch(
        requesetPhoneCode({
          email: account,
          service: 'reset_pass',
          language: this.props.language,
          checkData: checkData,
        }),
      );
    }
    let infoList = this.state.infoList;
    infoList[1].delay[typeList[curIndex]] = 60;
    this.setState({infoList: infoList});
    this[`interval${typeList[curIndex]}`] = setInterval(() => {
      let info = this.state.infoList;
      let time = this.state.infoList[1].delay[typeList[curIndex]];
      if (time > 0) {
        info[1].delay[typeList[curIndex]] = time - 1;
        this.setState({infoList: info});
      } else {
        clearInterval(this[`interval${typeList[curIndex]}`]);
      }
    }, 1000);
  }

  submit() {
    const {
      infoList,
      tabList: {curIndex, typeList},
    } = this.state;
    let check = true;
    for (let i = 0; i < infoList.length; i++) {
      let item = infoList[i];
      //验证是否为空
      if (
        item.isRequest &&
        !this.state[item.type == 'pwd' ? item.state[0] : item.state]
      ) {
        let message = '';
        if (typeof item.placeholder == 'string') {
          message = item.placeholder;
        } else {
          if (Array.isArray(item.placeholder)) {
            message = item.placeholder[0];
          } else {
            message = item.placeholder[typeList[curIndex]];
          }
        }
        this.showModal(message);
        check = false;
        break;
      }
      //验证格式是否符合要求
      if (item.regular) {
        if (typeof item.regular.mobile != 'undefined') {
          let code = this.props.country_data[this.props.country_index].code;
          if (curIndex == 0 && code !== 86) {
            // 国际手机号
            if (!isValidPhoneNumber(`+${code}${this.state[item.state]}`)) {
              let label = item.label[typeList[curIndex]];
              this.showModal(
                `${transfer(
                  this.props.language,
                  'account_register_17',
                )}${label}`,
              );
              check = false;
              break;
            }
          } else {
            //跟据注册类型来验证
            if (
              !item.regular[typeList[curIndex]].test(this.state[item.state])
            ) {
              let label = item.label[typeList[curIndex]];
              this.showModal(
                `${transfer(
                  this.props.language,
                  'account_register_17',
                )}${label}`,
              );
              check = false;
              break;
            }
          }
        } else {
          let value =
            item.type == 'pwd'
              ? this.state[item.state[0]]
              : this.state[item.state];
          if (!item.regular.test(value)) {
            this.showModal(
              `${item.label.replace(/  /g, '')}${transfer(
                this.props.language,
                'reset_code_16',
              )}`,
            );
            check = false;
            break;
          }
        }
      }
      //验证2次密码是否相同
      const value1 = this.state[item.state[0]];
      const value2 = this.state[item.state[1]];
      if (value1 !== value2) {
        Toast.fail(
          `${transfer(this.props.language, 'account_register_20')}${
            item.label
          }${transfer(this.props.language, 'account_register_21')}`,
        );
        check = false;
        break;
      }
    }
    if (!check) return;
    const {dispatch} = this.props;
    const {account, code, loginPwd} = this.state;
    let params = {
      newpassword: loginPwd,
      code: code,
    };
    if (this.state.tabList.curIndex == '0') {
      let newMobile = account;
      let code = this.props.country_data[this.props.country_index].code;
      if (code !== 86) {
        newMobile = `+${code}-${account}`;
      }
      params['mobile'] = newMobile;
    } else {
      params['email'] = account;
    }
    dispatch(requestResetCode(params));
  }

  refresh() {
    this.setState({
      refreshing: false,
    });
  }

  showModal(text) {
    const {modalBtnText} = this.state;
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity={0.5}
        ref={v => (this.overlayView = v)}>
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 40,
            borderRadius: 15,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: common.getH(16), color: '#959595'}}>
            {text}
          </Text>
          <TouchableOpacity
            onPress={() => this.overlayView && this.overlayView.close()}>
            <View
              style={{
                backgroundColor: common.themeColor,
                marginTop: common.getH(20),
                borderRadius: common.getH(4),
                paddingHorizontal: common.getH(10),
              }}>
              <Text style={styles.submitText}>{modalBtnText}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Overlay.View>
    );
    Overlay.show(overlayView);
  }
  render() {
    const {
      tabList: {curIndex, typeList, list},
      infoList,
      submitText,
      isShowVerify,
    } = this.state;
    return (
      <ImageBackground
        style={{flex: 1, backgroundColor: common.bgColor}}
        source={require('../../resource/assets/nomal_bg.png')}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(39,39,41)" />
        <Modal
          animationType="none"
          transparent={true}
          visible={isShowVerify}
          onRequestClose={() => {
            this.setState({isShowVerify: false});
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({isShowVerify: false});
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
                {transfer(this.props.language, 'account_register_22')}
              </Text>
              <VerifyWebView
                callback={data => {
                  this.setState({isShowVerify: false});
                  if (data == undefined) {
                    Toast.fail(
                      transfer(this.props.language, 'account_register_23'),
                    );
                  } else {
                    this.requestCode(data);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.tabWrap}>
          {list.map((item, index) => {
            return (
              <Text
                style={[
                  styles.tabItem,
                  (() => {
                    let style = {
                      borderRightWidth: common.getH(1),
                      borderColor: '#959595',
                    };
                    if (curIndex == index) {
                      style.color = common.themeColor;
                    }
                    if (!index) {
                      style.borderRightWidth = common.getH(1);
                      style.borderColor = '#959595';
                    }
                    return style;
                  })(),
                ]}
                key={index}
                onPress={() => {
                  this.setState({
                    tabList: {...this.state.tabList, curIndex: index},
                    code: '',
                    account: '',
                    loginPwd: '',
                    reLoginPwd: '',
                  });
                }}>
                {item}
              </Text>
            );
          })}
        </View>
        <KeyboardAwareScrollView
          style={styles.infoList}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh.bind(this)}
            />
          }>
          {infoList.map((item, index) => {
            switch (item.type) {
              case 'text': {
                let showContent = [];
                common.getSymbols(item.label).forEach(str => {
                  showContent.push(<Text style={styles.label}>{str}</Text>);
                });
                return (
                  <View style={styles.infoItem} key={index}>
                    <View
                      style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {showContent}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      placeholderTextColor={common.textColor}
                      onChangeText={text => this.setState({[item.state]: text})}
                    />
                  </View>
                );
              }
              case 'regType': {
                let showContent = [];
                common
                  .getSymbols(item.label[typeList[curIndex]])
                  .forEach(str => {
                    showContent.push(<Text style={styles.label}>{str}</Text>);
                  });
                return (
                  <View style={styles.infoItem} key={index}>
                    <View
                      style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {showContent}
                    </View>
                    <View
                      style={[
                        styles.input,
                        {
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 0,
                        },
                      ]}>
                      {curIndex == 0 ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.props.navigation.navigate('CountryCode');
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingHorizontal: common.margin8,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: common.font14,
                                color: common.themeColor,
                              }}>
                              {`+${
                                this.props.country_data[
                                  this.props.country_index
                                ].code
                              }`}
                            </Text>
                            <Image
                              style={{
                                width: common.getH(8),
                                height: common.getH(5),
                                marginLeft: common.margin5,
                                tintColor: common.themeColor,
                              }}
                              source={require('../../resource/assets/down.png')}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      ) : null}
                      <TextInput
                        style={[
                          styles.input,
                          {
                            flex: 1,
                            borderWidth: 0,
                          },
                        ]}
                        placeholder={item.placeholder[typeList[curIndex]]}
                        placeholderTextColor={common.textColor}
                        value={this.state[item.state]}
                        textContentType={
                          curIndex == 0 ? 'telephoneNumber' : 'emailAddress'
                        }
                        keyboardType={
                          curIndex == 0 ? 'default' : 'email-address'
                        }
                        onChangeText={text => {
                          if (item.accept) {
                            const {accept} = item;
                            const value = text.substr(-1);
                            const {
                              regular,
                              tabList: {typeList, curIndex},
                            } = this.state;
                            const type = typeList[curIndex];
                            const regs = accept[type];
                            let flag = false;
                            for (let i = 0; i < regs.length; i++) {
                              const reg = regs[i];
                              if (regular[reg].test(value)) {
                                this.setState({[item.state]: text});
                                flag = true;
                                break;
                              }
                            }
                            if (!flag) {
                              this.setState({[item.state]: text});
                            }
                          } else {
                            this.setState({[item.state]: text});
                          }
                        }}
                      />
                    </View>
                  </View>
                );
              }
              case 'select': {
                return (
                  <View style={styles.infoItem} key={index}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Select
                      style={styles.select}
                      items={item.list}
                      value={this.state.grade}
                      placeholder={item.placeholder}
                      pickerTitle={item.placeholder}
                      placeholderTextColor={common.textColor}
                      onSelected={(text, index) => {
                        setTimeout(() => {
                          this.setState({[item.state]: text});
                        }, 300);
                      }}
                      valueStyle={{
                        color: '#959595',
                        fontSize: common.getH(16),
                      }}
                    />
                  </View>
                );
              }
              case 'code': {
                let showContent = [];
                common.getSymbols(item.label).forEach(str => {
                  showContent.push(<Text style={styles.label}>{str}</Text>);
                });
                return (
                  <View style={styles.infoItem} key={index}>
                    <View
                      style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {showContent}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      placeholderTextColor={common.textColor}
                      value={this.state[item.state]}
                      onChangeText={text => this.setState({[item.state]: text})}
                    />
                    <Text
                      style={styles.codeBtn}
                      onPress={this.getCode.bind(this)}>
                      {item.delay[typeList[curIndex]]
                        ? `${item.btnSendText}(${
                            item.delay[typeList[curIndex]]
                          })`
                        : item.btnText}
                    </Text>
                  </View>
                );
              }
              case 'pwd': {
                let showContent = [];
                common.getSymbols(item.label).forEach(str => {
                  showContent.push(<Text style={styles.label}>{str}</Text>);
                });
                return (
                  <View style={[styles.infoItem]} key={index}>
                    <View
                      style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {showContent}
                    </View>
                    <View style={[styles.pwdWrap, {flexDirection: 'column'}]}>
                      <TextInput
                        style={styles.input}
                        placeholder={item.placeholder[0]}
                        placeholderTextColor={common.textColor}
                        value={this.state[item.state[0]]}
                        secureTextEntry={true}
                        onChangeText={text =>
                          this.setState({[item.state[0]]: text})
                        }
                      />
                      {this.state[item.state[0]] &&
                      this.state[item.state[0]].length > 0 &&
                      !/^(?=^.{6,20}$)(?=.*[A-Z]).*$/.test(
                        this.state[item.state[0]],
                      ) ? (
                        <Text
                          style={[
                            styles.input,
                            {
                              fontSize: common.font12,
                              color: '#ff0000',
                              borderWidth: 0,
                            },
                          ]}>
                          {transfer(this.props.language, 'account_register_24')}
                        </Text>
                      ) : null}
                      <TextInput
                        style={[styles.input, {marginTop: common.getH(20)}]}
                        secureTextEntry={true}
                        placeholder={item.placeholder[1]}
                        placeholderTextColor={common.textColor}
                        value={this.state[item.state[1]]}
                        onChangeText={text =>
                          this.setState({[item.state[1]]: text})
                        }
                      />
                    </View>
                  </View>
                );
              }
            }
          })}
          <ImageBackground
            style={{
              marginTop: common.getH(20),
              marginHorizontal: common.margin20,
            }}
            resizeMode="cover"
            source={require('../../resource/assets/login_btn.png')}>
            <TouchableOpacity onPress={this.submit.bind(this)}>
              <View style={styles.submit}>
                <Text style={styles.submitText}>{submitText}</Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  tabWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: common.getH(10),
  },
  tabItem: {
    width: '50%',
    textAlign: 'center',
    color: '#959595',
    lineHeight: common.getH(30),
    fontSize: common.getH(16),
  },
  infoList: {
    marginTop: common.getH(10),
    paddingHorizontal: common.getH(20),
  },
  infoItem: {
    width: '100%',
    flexDirection: 'row',
    marginTop: common.getH(20),
    position: 'relative',
  },
  label: {
    lineHeight: common.getH(36),
    fontSize: common.getH(16),
    color: '#959595',
  },
  input: {
    borderWidth: common.getH(1),
    borderColor: common.placeholderColor,
    fontSize: common.getH(16),
    width: common.getH(250),
    padding: common.margin5,
    color: common.textColor,
  },
  submit: {
    height: common.getH(40),
  },
  submitText: {
    fontSize: common.getH(16),
    color: common.textColor,
    textAlign: 'center',
    lineHeight: common.getH(40),
  },
  codeBtn: {
    position: 'absolute',
    right: common.getH(20),
    lineHeight: common.getH(36),
    color: common.themeColor,
    fontSize: common.getH(16),
  },
  select: {
    width: common.getH(240),
    height: common.getH(40),
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.resetCode,
    ...state.country_code,
  };
}

export default connect(mapStateToProps)(ResetCode);
