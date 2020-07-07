import React from 'react';
import { View, StyleSheet, Dimensions, Text, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import transfer from '../../localization/utils';
import OrderManageList from './OrderManageList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const FirstRoute = () => <OrderManageList />;
const SecondRoute = () => <OrderManageList />;
const ThirdRoute = () => <OrderManageList />;
const FourthRoute = () => <OrderManageList />;
const FifthRoute = () => <OrderManageList />;


const initialLayout = { width: Dimensions.get('window').width };

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: common.themeColor }}
    style={{ backgroundColor: common.bgColor }}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color: focused ? common.themeColor : common.navTitleColor, textAlign: 'center',   }}>{route.title}</Text>
    )}
  />
);

class OrderManageListTab extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '订单管理',
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '全部' },
        { key: 'second', title: '待付款' },
        { key: 'third', title: '待发货' },
        { key: 'fourth', title: '待收货' },
        { key: 'fifth', title: '已取消' },
      ],
    };
  }

  componentDidMount() { }

  componentWillUnmount() { 
    DeviceEventEmitter.emit('orderManagerBack')
  }

  componentWillReceiveProps(nextProps) { }

  render() {
    const { index, routes } = this.state;
    return (
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute,
          fourth: FourthRoute,
          fifth: FifthRoute,
        })}
        onIndexChange={index => {
          this.setState({
            index: index,
          });
        }}
        initialLayout={initialLayout}
      />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(OrderManageListTab);
