import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {logout} from '../../redux/actions/login';
import {requestAccount} from '../../redux/actions/account';
import Alert from '../../components/Alert';
import BigNumber from 'bignumber.js';
import {version} from '../../../app.json';
import transfer from '../../localization/utils';
import {Toast} from 'teaset';
import {queryConfigUserSettings} from '../../redux/actions/user';
import actions from '../../redux/actions/index';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: `${transfer(
        this.props.language,
        'account_version',
      )}：V ${version}`,
      menuList: [
        {
          label: transfer(this.props.language, 'account_register'),
          link: 'Register',
        },
        {
          label: transfer(this.props.language, 'account_structure'),
          link: 'Structure',
        },
        {
          label: transfer(this.props.language, 'account_inviteFriend'),
          link: 'inviteFriend',
        },
        {
          label: transfer(this.props.language, 'account_1'),
          link: '',
          source: require('../../resource/assets/bottom_1.png'),
        },
        {
          label: transfer(this.props.language, 'account_2'),
          link: 'Authentication',
          source: require('../../resource/assets/bottom_2.png'),
        },
        {
          label: transfer(this.props.language, 'account_3'),
          link: 'SecurityCenter',
          source: require('../../resource/assets/bottom_3.png'),
        },
        {
          label: transfer(this.props.language, 'account_modifyInfo'),
          link: 'ModifyInfo',
          source: require('../../resource/assets/bottom_4.png'),
        },
        {
          label: transfer(this.props.language, 'account_4'),
          link: '',
          source: require('../../resource/assets/bottom_5.png'),
        },
        {
          label: '',
          link: '1',
        },
      ],
    };
  }

  logoutAction() {
    Alert.alert(
      transfer(this.props.language, 'account_logout_title'),
      '',
      [
        {
          text: transfer(this.props.language, 'account_logout_btn1'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: transfer(this.props.language, 'account_logout_btn2'),
          onPress: () => {
            const {dispatch} = this.props;
            dispatch(logout());
          },
        },
      ],
      {cancelable: false},
    );
  }

  gotoPage(url) {
    if (
      url.length == 0 ||
      (url === 'Authentication' && this.props.language !== 'zh_hans')
    ) {
      Toast.info(transfer(this.props.language, 'comingsoon'));
      return;
    }
    const {navigation} = this.props;
    navigation.navigate(url);
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(requestAccount());
    dispatch(queryConfigUserSettings({keys: ['LegalPayType']}));
    if (this.props.isLogin) this.props.dispatch(actions.sync());
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {}
  render() {
    const {data, info} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: common.bgColor,
        }}>
        <ScrollView>
          <ImageBackground
            style={{
              width: '100%',
              height: common.getH(220),
              paddingHorizontal: common.margin20,
            }}
            source={require('../../resource/assets/account_bg.png')}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: common.paddingTop + common.margin25,
                flex: 1,
              }}>
              <Image
                style={{width: common.getH(85), height: common.getH(85)}}
                source={require('../../resource/assets/avatar.png')}
                resizeMode="cover"
              />
              <View
                style={{
                  justifyContent: 'flex-start',
                  margin: common.margin10,
                  flex: 1,
                  marginTop: common.margin30,
                }}>
                <Text
                  style={[
                    styles.headerText,
                    {fontSize: common.font20},
                  ]}>{`${transfer(this.props.language, 'account_username')}：${
                  data ? `${data.nickName ? data.nickName : ''}` : ''
                }`}</Text>
                {/*
								<View style={{marginTop: common.margin10}}>
                  <ImageBackground
                    style={{
                      width: common.getH(80),
                      height: common.getH(28),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    source={require('../../resource/assets/level.png')}>
                    <Text style={{fontSize: common.font14, color: 'white'}}>
                      等 级
                    </Text>
                  </ImageBackground>
                </View>
								*/}
              </View>
            </View>
            <View style={{position: 'absolute', bottom: common.margin25}}>
              {info && info.parent_id > 0 && info.parent ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: common.margin35,
                    marginLeft: common.margin15,
                  }}>
                  <Text style={styles.headerText}>{`${transfer(
                    this.props.language,
                    'account_recommand',
                  )}：`}</Text>
                  <Text
                    style={[styles.headerText, {color: common.themeColor}]}>{`${
                    info ? info.parent.nickName : ''
                  }`}</Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: common.margin15,
                  marginLeft: common.margin15,
                }}>
                <Text style={styles.headerText}>{`${transfer(
                  this.props.language,
                  'account_total',
                )}：`}</Text>
                <Text
                  style={[styles.headerText, {color: common.themeColor}]}>{`${
                  info && info.total_sales
                    ? common.removeInvalidZero(
                        BigNumber(info.total_sales).toFixed(8, 1),
                      )
                    : ''
                }`}</Text>
              </View>
            </View>
          </ImageBackground>
          <ImageBackground
            style={{
              flexDirection: 'row',
              width: '100%',
              minHeight: common.getH(116),
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
            source={require('../../resource/assets/account_mid.png')}>
            <TouchableWithoutFeedback
              onPress={this.gotoPage.bind(this, this.state.menuList[0].link)}>
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: common.margin5,
                  width: '33.3%',
                  height: '100%',
                }}>
                <ImageBackground
                  style={{
                    width: common.getH(80),
                    height: common.getH(90),
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  source={require('../../resource/assets/mid_1.png')}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.themeColor,
                    paddingBottom: common.margin10,
                    textAlign: 'center',
                  }}>
                  {this.state.menuList[0].label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.gotoPage.bind(this, this.state.menuList[1].link)}>
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: common.margin5,
                  width: '33.3%',
                  height: '100%',
                }}>
                <ImageBackground
                  style={{
                    width: common.getH(80),
                    height: common.getH(90),
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  source={require('../../resource/assets/mid_2.png')}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.themeColor,
                    paddingBottom: common.margin10,
                    textAlign: 'center',
                  }}>
                  {this.state.menuList[1].label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.gotoPage.bind(this, this.state.menuList[2].link)}>
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: common.margin5,
                  height: '100%',
                  width: '33.3%',
                }}>
                <ImageBackground
                  style={{
                    width: common.getH(80),
                    height: common.getH(90),
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  source={require('../../resource/assets/mid_3.png')}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: common.font16,
                    color: common.themeColor,
                    paddingBottom: common.margin10,
                    textAlign: 'center',
                  }}>
                  {this.state.menuList[2].label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
          <FlatList
            style={{marginTop: common.margin20}}
            numColumns={3}
            data={this.state.menuList.slice(3)}
            renderItem={({item, index}) => {
              return (
                <TouchableWithoutFeedback
                  onPress={this.gotoPage.bind(this, item.link)}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      flex: 1,
                      paddingVertical: common.margin20,
                    }}>
                    <Image
                      style={{width: common.w60, height: common.w60}}
                      source={item.source}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        color: common.navTitleColor,
                        fontSize: common.font14,
                        marginTop: common.margin15,
                      }}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
          <Text style={styles.version}>{this.state.version}</Text>
          <Text style={styles.quitBtn} onPress={() => this.logoutAction()}>
            {transfer(this.props.language, 'account_logout')}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: common.getH(180) + common.navHeight,
    backgroundColor: '#E42F37',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: common.navHeight,
  },
  headerText: {
    color: common.navTitleColor,
    fontSize: common.font16,
  },
  headImg: {
    width: common.getH(50),
    height: common.getH(50),
    marginBottom: common.getH(10),
  },
  menuList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quitBtn: {
    width: '80%',
    height: common.getH(40),
    backgroundColor: common.themeColor,
    marginTop: common.getH(30),
    textAlign: 'center',
    lineHeight: common.getH(40),
    fontSize: common.getH(20),
    color: common.textColor,
    borderRadius: common.getH(4),
    alignSelf: 'center',
    marginBottom: common.margin35,
  },
  version: {
    marginTop: common.getH(40),
    color: '#c3c3c3',
    fontSize: common.getH(16),
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.login,
    ...state.account,
    isLogin: state.login.isLogin
  };
}

export default connect(mapStateToProps)(Account);
