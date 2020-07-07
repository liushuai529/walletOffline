import React from 'react';
import {Text, View, StatusBar, ImageBackground, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import TreeSelect from './treeSelect/TreeSelect';
import {
  requestStructure,
  requestOneStructure,
} from '../../redux/actions/structure';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BigNumber from 'bignumber.js';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
});

class Structure extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'account_structure'),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isRequested: [],
      data: [],
    };
    this.selectKey = {};
  }

  componentDidMount() {
    const {dispatch, userInfo} = this.props;
    dispatch(
      requestOneStructure({
        skip: 0,
        limit: 500,
        user_id: userInfo.id,
      }),
    );
  }

  componentWillReceiveProps(nextProps) {
    const {data} = this.state;
    const {dispatch, userInfo} = this.props;
    if (
      nextProps.oneStructure !== this.props.oneStructure &&
      nextProps.oneStructure.length
    ) {
      const obj = nextProps.oneStructure[0];
      if (data.length === 0) {
        let name = this.formartDes(userInfo, obj);
        let arr = {id: obj['user_id'], name};
        this.setState({data: [arr]});
        if (obj.child_count > 0) {
          dispatch(
            requestStructure({
              skip: 0,
              limit: 500,
              parent_id: userInfo.id,
            }),
          );
        }
      }
    }

    if (
      nextProps.structure !== this.props.structure &&
      nextProps.structure.length
    ) {
      const {data} = this.state;
      let children = [];
      if (!this.state.data[0].children) {
        this.state.data[0].children = this.setChindren(nextProps.structure);
        this.setState({data: this.state.data});
      } else {
        this.setTargetObj(this.state.data[0], nextProps.structure);
      }
    }
  }

  formartDes = (item, obj) =>
    `${item.nickName ? item.nickName : ''} ${
      item.mobile
        ? common.maskMobile(item.mobile)
        : common.maskEmail(item.email)
    } ${transfer(this.props.language, 'structure_1')}【${
      obj.child_count
    }】${transfer(this.props.language, 'structure_2')}【${
      obj.descend_count
    }】 ${transfer(this.props.language, 'structure_3')}【${
      obj.total_sales
        ? common.removeInvalidZero(BigNumber(obj.total_sales).toFixed(8, 1))
        : ''
    }】${transfer(this.props.language, 'structure_6')}【${
      obj.total_mines
        ? common.removeInvalidZero(BigNumber(obj.total_mines).toFixed(8, 1))
        : ''
    }】`;

  setChindren = ary => {
    let children = [];
    ary.forEach(item => {
      let name = this.formartDes(item.user, item);
      if (item.child_count > 0)
        children.push({
          id: item.user.id,
          name,
          children: [
            {
              id: `${item.user.id}@`,
              name: transfer(this.props.language, 'structure_4'),
            },
          ],
        });
      else children.push({id: item.user.id, name});
    });
    return children;
  };

  setTargetObj = (obj, structure) => {
    if (obj.children) {
      Object.keys(obj.children).forEach(key => {
        if (structure[0].parent_id === obj.children[key].id) {
          obj.children[key].children = this.setChindren(structure);
        } else {
          this.setTargetObj(obj.children[key], structure);
        }
      });
    }
  };

  getStructure = (item, routes) => {
    const {userInfo, dispatch} = this.props;
    if (
      item.item.id === userInfo.id ||
      !item.item.children ||
      this.selectKey[item.item.id]
    )
      return;
    this.selectKey[item.item.id] = true;
    dispatch(
      requestStructure({
        skip: 0,
        limit: 500,
        parent_id: item.item.id,
      }),
    );
  };
  refresh() {
    this.setState({
      refreshing: false,
    });
  }
  render() {
    const {structure} = this.props;
    let props = {};
    if (structure.children && !structure.children.id) props.isOpen = true;
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(39,39,41)" />
        {/* <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh.bind(this)}
          />
        }
        > */}
        <ImageBackground
          style={styles.container}
          resizeMode="cover"
          source={require('../../resource/assets/nomal_bg.png')}>
          {this.state.data.length ? (
            <TreeSelect
              data={this.state.data}
              onClick={this.getStructure}
              isShowTreeId={false}
              itemStyle={{
                fontSize: common.getH(12),
                color: '#959595',
              }}
              selectedItemStyle={{
                backgroudColor: '#f7edca',
                fontSize: common.getH(12),
                color: '#666',
              }}
            />
          ) : (
            <View>
              <Text>{transfer(this.props.language, 'structure_5')}</Text>
            </View>
          )}
        </ImageBackground>
        {/* </KeyboardAwareScrollView> */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.structure,
    user: state.user,
    userInfo: state.login.data,
  };
}

export default connect(mapStateToProps)(Structure);
