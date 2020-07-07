import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import transfer from '../../localization/utils';
import ProfitDetail from './profit_detail';
import ProfitWelfarestat from './profit_welfarestat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const FirstRoute = () => <ProfitDetail />;

const SecondRoute = () => <ProfitWelfarestat />;

const initialLayout = {width: Dimensions.get('window').width};

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: common.themeColor}}
    style={{backgroundColor: common.bgColor}}
    renderLabel={({route, focused, color}) => (
      <Text style={{color: focused ? common.themeColor : common.navTitleColor, margin: 8}}>{route.title}</Text>
    )}
  />
);

class PorfitDetailTab extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'profit_detail01'),
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
      routes: [{key: 'first', title: transfer(props.language, 'profit_detail01')}, {key: 'second', title: transfer(props.language,'profit_deta11')}],
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const {index, routes} = this.state;
    return (
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
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

export default connect(mapStateToProps)(PorfitDetailTab);
