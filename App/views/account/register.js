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
import {Select, Overlay, Toast} from 'teaset';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {requestRegister} from '../../redux/actions/register';
import {requesetPhoneCode} from '../../redux/actions/code';
import {requestClearRegisterStatus} from '../../redux/actions/register';
import VerifyWebView from '../login/VerifyWebView';
import transfer from '../../localization/utils';
import {requesetAutoLogin} from '../../redux/actions/login';
import {isValidPhoneNumber} from 'react-phone-number-input';

class Register extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'account_register'),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isShowVerify: false,
      refreshing: false,
      formValue: {
        userName: '',
        nick: '',
        card: '',
        mobile: '',
        code: '',
        recommend: '',
        grade: '',
        loginPwd: '',
        reLoginPwd: '',
        transferPwd: '',
        reTransferPwd: '',
      },
      tabList: {
        curIndex: 0,
        typeList: ['mobile', 'email'],
        list: [
          transfer(this.props.language, 'account_register_title1'),
          transfer(this.props.language, 'account_register_title2'),
        ],
      },
      infoList: [
        // {
        //     type: "text",
        //     label: "姓　　名：",
        //     placeholder: "请输入姓名",
        //     state: "userName",
        //     isRequest: true,
        //     regular: /[\u4E00-\u9FA5].{1,6}/,
        //     accept: ["chinese"]
        // },
        {
          type: 'text',
          label: transfer(this.props.language, 'account_register_1'),
          placeholder: transfer(this.props.language, 'account_register_2'),
          state: 'nick',
          isRequest: true,
          regular: '',
          accept: ['letter', 'number', 'chinese'],
          maxLength: 16,
        },
        // {
        //     type: "text",
        //     label: "身  份  证：",
        //     placeholder: "请输入身份证",
        //     state: "card",
        //     isRequest: true,
        //     regular: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[X|x])$/,
        //     accept: ["number"],
        //     maxLength: 18
        // },
        {
          type: 'regType',
          label: {
            mobile: transfer(this.props.language, 'account_register_3'),
            email: transfer(this.props.language, 'account_register_4'),
          },
          placeholder: {
            mobile: transfer(this.props.language, 'account_register_5'),
            email: transfer(this.props.language, 'account_register_6'),
          },
          state: 'mobile',
          isRequest: true,
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
          label: transfer(this.props.language, 'account_register_7'),
          placeholder: transfer(this.props.language, 'account_register_8'),
          btnText: transfer(this.props.language, 'account_register_7'),
          btnSendText: transfer(this.props.language, 'account_register_9'),
          state: 'code',
          delay: {
            mobile: 0,
            email: 0,
          },
          maxLength: 6,
          isRequest: true,
          regular: /^.{4,6}$/,
          accept: ['number'],
        },
        {
          type: 'text',
          label: transfer(this.props.language, 'account_register_10'),
          placeholder: transfer(this.props.language, 'account_register_11'),
          state: 'recommend',
          isRequest: true,
          regular: '',
          accept: ['letter', 'number'],
        },
        {
          type: 'pwd',
          label: transfer(this.props.language, 'account_register_12'),
          placeholder: [
            transfer(this.props.language, 'account_register_13'),
            transfer(this.props.language, 'account_register_14'),
          ],
          state: ['loginPwd', 'reLoginPwd'],
          isRequest: true,
          regular: /^(?=^.{6,20}$)(?=.*[A-Z]).*$/,
          maxLength: 20,
          accept: ['number', 'letter', 'other'],
        },
      ],
      submitText: transfer(this.props.language, 'account_register_15'),
      modalBtnText: transfer(this.props.language, 'account_register_16'),
      regular: {
        chinese: /^[\u4e00-\u9fa5]{0,}$/,
        number: /[0-9]/,
        letter: /[a-zA-Z]/,
        other: /[\~\!\@\#\$\%\^\&\*\(\)\{\}\[\]_\-\+=\?\<\>\  \ \\\|\.\,]/,
      },
    };
  }

  getCode() {
    const {
      tabList: {curIndex, typeList},
    } = this.state;
    if (this.state.infoList[2].delay[typeList[curIndex]]) return;
    const {mobile} = this.state.formValue;
    let code = this.props.country_data[this.props.country_index].code;
    if (curIndex == 0 && code !== 86) {
      if (isValidPhoneNumber(`+${code}${mobile}`)) {
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
        mobile &&
        (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile) ||
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            mobile,
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
    const {
      tabList: {curIndex, typeList},
    } = this.state;
    if (this.state.infoList[2].delay[typeList[curIndex]]) return;
    const {mobile} = this.state.formValue;
    const {dispatch} = this.props;
    if (this.state.tabList.curIndex == '0') {
      let newMobile = mobile;
      let code = this.props.country_data[this.props.country_index].code;
      if (code !== 86) {
        newMobile = `+${code}-${mobile}`;
      }
      dispatch(
        requesetPhoneCode({
          mobile: newMobile,
          service: 'register',
          language: this.props.language,
          checkData: checkData,
        }),
      );
    } else {
      dispatch(
        requesetPhoneCode({
          email: mobile,
          service: 'register',
          language: this.props.language,
          checkData: checkData,
        }),
      );
    }
    let infoList = this.state.infoList;
    infoList[2].delay[typeList[curIndex]] = 60;
    this.setState({infoList: infoList});
    this[`interval${typeList[curIndex]}`] = setInterval(() => {
      let info = this.state.infoList;
      let time = this.state.infoList[2].delay[typeList[curIndex]];
      if (time > 0) {
        info[2].delay[typeList[curIndex]] = time - 1;
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
        !this.state.formValue[item.type == 'pwd' ? item.state[0] : item.state]
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
        Toast.fail(message);
        check = false;
        break;
      }
      //验证格式是否符合要求
      if (item.regular) {
        if (typeof item.regular.mobile != 'undefined') {
          let code = this.props.country_data[this.props.country_index].code;
          if (curIndex == 0 && code !== 86) {
            // 国际手机号
            if (
              !isValidPhoneNumber(`+${code}${this.state.formValue[item.state]}`)
            ) {
              let label = item.label[typeList[curIndex]];
              Toast.fail(
                `${transfer(
                  this.props.language,
                  'account_register_17',
                )}${label}`,
              );
              check = false;
              break;
            }
          } else {
            if (
              !item.regular[typeList[curIndex]].test(
                this.state.formValue[item.state],
              )
            ) {
              //跟据注册类型来验证
              let label = item.label[typeList[curIndex]];
              Toast.fail(
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
              ? this.state.formValue[item.state[0]]
              : this.state.formValue[item.state];
          if (!item.regular.test(value)) {
            Toast.fail(
              `${transfer(
                this.props.language,
                'account_register_17',
              )}${item.label.replace(/  /g, '').replace(/　/g, '')}`,
            );
            check = false;
            break;
          }
        }
      }
      //验证2次密码是否相同
      const value1 = this.state.formValue[item.state[0]];
      const value2 = this.state.formValue[item.state[1]];
      if (value1 !== value2) {
        check = false;
        Toast.fail(
          `${transfer(this.props.language, 'account_register_20')}${
            item.label
          }${transfer(this.props.language, 'account_register_21')}`,
        );
        break;
      }
    }
    if (!check) return;
    const {dispatch} = this.props;
    const {
      formValue: {
        loginPwd,
        transferPwd,
        userName,
        nick,
        card,
        mobile,
        code,
        recommend,
      },
    } = this.state;
    const params = {
      password: loginPwd,
      nickName: nick,
      code: code,
      encryptedKey: '',
      recommendNo: recommend,
      inviteReq: 'invite',
    };
    if (this.state.tabList.curIndex == '0') {
      let newMobile = mobile;
      let code = this.props.country_data[this.props.country_index].code;
      if (code !== 86) {
        newMobile = `+${code}-${mobile}`;
      }
      params['mobile'] = newMobile;
    } else {
      params['email'] = mobile;
    }
    dispatch(requestRegister(params));
  }

  componentWillReceiveProps(next) {
    const {navigation, success} = next;
    if (success) {
      if (
        this.props.navigation.state.params &&
        this.props.navigation.state.params.isFromLogin
      ) {
        setTimeout(() => {
          this.autoLogin();
        }, 200);
      } else {
        navigation.goBack();
      }
    }
  }

  autoLogin() {
    const {dispatch} = this.props;
    dispatch(requesetAutoLogin());
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(requestClearRegisterStatus());
  }

  componentDidMount() {
    this.setState({
      formValue: {
        recommend: this.props.login.data.recommendNo,
      },
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

  refresh() {
    const refreshData = {
      userName: '',
      nick: '',
      card: '',
      mobile: '',
      code: '',
      recommend: '',
      grade: '',
      loginPwd: '',
      reLoginPwd: '',
      transferPwd: '',
      reTransferPwd: '',
    };
    this.setState({
      refreshing: false,
    });
  }

  render() {
    const {
      tabList: {curIndex, typeList, list},
      infoList,
      submitText,
      isShowVerify,
    } = this.state;
    const {agent} = this.props;
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
                    formValue: {
                      ...this.state.formValue,
                      code: '',
                      mobile: '',
                      userName: '',
                      nick: '',
                      card: '',
                      //recommend: "",
                      grade: '',
                      loginPwd: '',
                      reLoginPwd: '',
                      transferPwd: '',
                      reTransferPwd: '',
                    },
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
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {showContent}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      placeholderTextColor={common.textColor}
                      defaultValue={
                        item.state == 'grade' && agent ? agent.rank : ''
                      }
                      editable={item.state == 'grade' ? false : true}
                      value={
                        item.state == 'grade' && agent
                          ? agent.rank
                          : this.state.formValue[item.state]
                      }
                      maxLength={item.maxLength ? item.maxLength : 30}
                      onChangeText={text => {
                        const {accept} = item;
                        const {formValue} = this.state;
                        const value = text.replace(formValue[item.state], '');
                        const {regular} = this.state;
                        if (accept && text != '') {
                          let flag = false;
                          for (let i = 0; i < accept.length; i++) {
                            let reg = accept[i];
                            if (regular[reg].test(value)) {
                              const res = this.state.formValue;
                              res[item.state] = text;
                              this.setState({formValue: res});
                              flag = true;
                              break;
                            }
                          }
                          if (
                            item.state == 'card' &&
                            text.length == 18 &&
                            (value == 'x' || value == 'X')
                          ) {
                            const res = this.state.formValue;
                            res[item.state] = text;
                            this.setState({formValue: res});
                            flag = true;
                          }
                          if (!flag) {
                            const res = this.state.formValue;
                            res[item.state] = formValue[item.state];
                            this.setState({formValue: res});
                          }
                        } else {
                          const res = this.state.formValue;
                          res[item.state] = text;
                          this.setState({formValue: res});
                        }
                      }}
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
                        justifyContent: 'center',
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
                        value={this.state.formValue[item.state]}
                        textContentType={
                          curIndex == 0 ? 'telephoneNumber' : 'emailAddress'
                        }
                        keyboardType={
                          curIndex == 0 ? 'default' : 'email-address'
                        }
                        maxLength={
                          item.maxLength && item.maxLength[typeList[curIndex]]
                            ? item.maxLength[typeList[curIndex]]
                            : 30
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
                            const regs = item.accept[type];
                            let flag = false;
                            for (let i = 0; i < regs.length; i++) {
                              const reg = regs[i];
                              if (regular[reg].test(value)) {
                                const res = this.state.formValue;
                                res[item.state] = text;
                                this.setState({formValue: res});
                                flag = true;
                                break;
                              }
                            }
                            if (!flag) {
                              const res = this.state.formValue;
                              res[item.state] = text;
                              this.setState({formValue: res});
                            }
                          } else {
                            let res = this.state.formValue;
                            res[item.state] = text;
                            this.setState({formValue: res});
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
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {showContent}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      placeholderTextColor={common.textColor}
                      value={this.state.formValue[item.state]}
                      maxLength={item.maxLength ? item.maxLength : 30}
                      onChangeText={text => {
                        const {accept} = item;
                        const value = text.substr(-1);
                        const {regular} = this.state;
                        if (accept) {
                          let flag = false;
                          for (let i = 0; i < accept.length; i++) {
                            let reg = accept[i];
                            if (regular[reg].test(value)) {
                              const res = this.state.formValue;
                              res[item.state] = text;
                              this.setState({formValue: res});
                              flag = true;
                              break;
                            }
                          }
                          if (!flag) {
                            const res = this.state.formValue;
                            res[item.state] = text;
                            this.setState({formValue: res});
                          }
                        } else {
                          const res = this.state.formValue;
                          res[item.state] = text;
                          this.setState({formValue: res});
                        }
                      }}
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
                        justifyContent: 'center',
                      }}>
                      {showContent}
                    </View>
                    <View style={[styles.pwdWrap, {flexDirection: 'column'}]}>
                      <TextInput
                        style={styles.input}
                        placeholder={item.placeholder[0]}
                        placeholderTextColor={common.textColor}
                        textContentType={'password'}
                        secureTextEntry={true}
                        value={this.state.formValue[item.state[0]]}
                        maxLength={item.maxLength ? item.maxLength : 30}
                        onChangeText={text => {
                          const res = this.state.formValue;
                          res[item.state[0]] = text;
                          this.setState({formValue: res});
                        }}
                      />
                      {this.state.formValue[item.state[0]] &&
                      this.state.formValue[item.state[0]].length > 0 &&
                      !/^(?=^.{6,20}$)(?=.*[A-Z]).*$/.test(
                        this.state.formValue[item.state[0]],
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
                        textContentType={'password'}
                        secureTextEntry={true}
                        placeholder={item.placeholder[1]}
                        placeholderTextColor={common.textColor}
                        value={this.state.formValue[item.state[1]]}
                        maxLength={item.maxLength ? item.maxLength : 30}
                        onChangeText={text => {
                          const res = this.state.formValue;
                          res[item.state[1]] = text;
                          this.setState({formValue: res});
                        }}
                      />
                    </View>
                  </View>
                );
              }
            }
          })}
          <ImageBackground
            style={{
              padding: 0,
              marginTop: common.getH(30),
              marginBottom: common.getH(60),
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
    width: common.getH(250),
    height: common.getH(40),
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.register,
    ...state.country_code,
    login: state.login,
  };
}

export default connect(mapStateToProps)(Register);
