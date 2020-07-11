import React from 'react';
import {
  Image,
  View,
  DeviceEventEmitter,
  StatusBar,
  Linking,
  Modal,
  BackHandler,
  AppState,
} from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';
import { connect } from 'react-redux';
import { common } from './constants/common';


import NewWallet from './views/newWallet/NewWallet';
import CreateWallet from './views/newWallet/CreateWallet';
import SetPassword from './views/newWallet/SetPassword';
import SetRePassword from './views/newWallet/SetRePassword';
import ShowMnemonicWords from './views/newWallet/ShowMnemonicWords';
import VerifyWrods from './views/newWallet/VerifyWrods';
import ImportWallet from './views/newWallet/ImportWallet';

import Wallet from './views/wallet/Wallet';
import WalletDetails from './views/wallet/WalletDetails';
import ScanBarCode from './views/wallet/ScanBarCode';


import Withdraw from './views/withdraw/Withdraw';
import WithdrawCell from './views/withdraw/WithdrawCell';
import WithdrawDetails from './views/withdraw/WithdrawDetails';

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initRootStack(props);
  }


  componentWillMount() {
  }

  componentDidMount() {
    this._setStatusBar();
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }





  _setStatusBar = () => {
    StatusBar.setBarStyle('light-content');
    if (!common.IsIOS) {
      StatusBar.setBackgroundColor(common.navBgColor);
    }
  };

  initRootStack(props) {
    let labelConfig = {
      wallet: '签名',
      withdraw: '提现',
      transfer: '转账',
      setting: '设置'
    }

    const TabNavigator = createBottomTabNavigator(
      {
        Wallet: {
          screen: createStackNavigator({
            Wallet,
          }),
          navigationOptions: ({ navigation }) => {
            return {
              tabBarLabel: labelConfig['wallet'],
              tabBarIcon: ({ focused, horizontal, tintColor }) => {
                return (
                  <Image
                    style={{ height: 23, width: 23 }}
                    resizeMode="contain"
                    source={
                      focused
                        ? require('./resource/assets/tab_1_s.png')
                        : require('./resource/assets/tab_1.png')
                    }
                  />
                );
              },
            };
          },
        },


        Withdraw: {
          screen: createStackNavigator({
            Withdraw,
          }),
          navigationOptions: ({ navigation }) => {
            return {
              tabBarLabel: labelConfig['withdraw'],
              tabBarIcon: ({ focused, horizontal, tintColor }) => {
                return (
                  <Image
                    style={{ height: 23, width: 23 }}
                    resizeMode="contain"
                    source={
                      focused
                        ? require('./resource/assets/tab_2_s.png')
                        : require('./resource/assets/tab_2.png')
                    }
                  />
                );
              },
            };
          },
        },

        Withdraw: {
          screen: createStackNavigator({
            Withdraw,
          }),
          navigationOptions: ({ navigation }) => {
            return {
              tabBarLabel: labelConfig['transfer'],
              tabBarIcon: ({ focused, horizontal, tintColor }) => {
                return (
                  <Image
                    style={{ height: 23, width: 23 }}
                    resizeMode="contain"
                    source={
                      focused
                        ? require('./resource/assets/tab_4_s.png')
                        : require('./resource/assets/tab_4.png')
                    }
                  />
                );
              },
            };
          },
        },

        Account: {
          screen: createStackNavigator(
            {
              Withdraw,
            },
            {
              headerMode: 'none',
            },
          ),
          navigationOptions: ({ navigation }) => {
            return {
              tabBarLabel: labelConfig['withdraw'],
              tabBarIcon: ({ focused, horizontal, tintColor }) => {
                return (
                  <Image
                    style={{ height: 23, width: 23 }}
                    resizeMode="contain"
                    source={
                      focused
                        ? require('./resource/assets/tab_5_s.png')
                        : require('./resource/assets/tab_5.png')
                    }
                  />
                );
              },
            };
          },
        },
      },
      {
        initialRouteName: 'Wallet',
        defaultNavigationOptions: ({ navigation }) => {
          const { routeName } = navigation.state.routes[navigation.state.index];
          return {
            headerTintColor: 'white',
            tabBarLabel: labelConfig[routeName],
            tabBarOptions: {
              activeTintColor: common.themeColor,
              inactiveTintColor: common.textColor,
              style: {
                backgroundColor: 'white',
              },
            },
          };
        },
      },



    );

    TabNavigator.navigationOptions = ({ navigation }) => {
      return {
        header: null,
      };
    };

    const defaultNavigationOptions = {
      headerBackTitleVisible: false,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: common.navBgColor,
            borderBottomWidth: 0,
            elevation: 0,
          },
          headerTitleStyle: {
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: common.font17,
          },
          headerRight: <View />,
        };
      },
    };


    const TabStack = createStackNavigator(
      {
        Tabbar: TabNavigator,
        WalletDetails,
        Withdraw,
        WithdrawCell,
        WithdrawDetails,
        ScanBarCode,
      },
      defaultNavigationOptions,
    );

    const RootStack = createStackNavigator(
      {
        Main: TabStack,
      },
      {
        mode: 'modal',
        headerMode: 'none',
      });

    const LoginStack = createStackNavigator(
      {
        NewWallet,
        CreateWallet,
        SetPassword,
        SetRePassword,
        ShowMnemonicWords,
        VerifyWrods,
        ImportWallet,
        ScanBarCode,
      },
      defaultNavigationOptions,
    );

    return {
      RootStack,
      LoginStack,
    };
  }

  shouldComponentUpdate(nextProps) {
    if ((nextProps.isLogin !== this.props.isLogin)) {
      return true
    }
    return false
  }





  render() {
    const { RootStack, LoginStack } = this.state;
    const { isLogin } = this.props;
    const Container = createAppContainer(isLogin ? RootStack : LoginStack);
    return (
      <View style={{ flex: 1 }}>

        <Container
          screenProps={{
            // language: language,
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

export default connect(mapStateToProps)(Navigator);
