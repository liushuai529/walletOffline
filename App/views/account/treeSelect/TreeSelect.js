import React, { Component } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity,Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { breadthFirstRecursion } from './menutransform';
import { ScrollView } from 'react-native-gesture-handler';
import {common} from '../../../constants/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  textName: {
    fontSize: 14,
    marginLeft: 5
  },
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  collapseIcon: {
    width: 0,
    height: 0,
    marginRight: 2,
    borderStyle: 'solid',
  }
});

export default class TreeSelect extends Component {
  constructor(props) {
    super(props);
    this.routes = [];
    this.state = {
      nodesStatus: this._initNodesStatus(),
      currentNode: null,
      searchValue: ''
    };
  }

  _initNodesStatus = () => {
    const { isOpen = false, data, openIds = [] } = this.props;
    const nodesStatus = new Map();
    if (!isOpen) {
      if (openIds && openIds.length) {
        for (let id of openIds) { // eslint-disable-line
          const routes = this._find(data, id);
          routes.map(parent => nodesStatus.set(parent.id, true));
        }
      }
      return nodesStatus;
    }
    breadthFirstRecursion(data).map(item => nodesStatus.set(item.id, true));
    return nodesStatus;
  };

  _find = (data, id) => {
    const stack = [];
    let going = true;

    const walker = (childrenData, innerId) => {
      childrenData.forEach(item => {
        if (!going) return;
        stack.push({
          id: item.id,
          name: item.name,
          parentId: item.parentId
        });
        if (item['id'] === innerId) {
          going = false;
        } else if (item['children']) {
          walker(item['children'], innerId);
        } else {
          stack.pop();
        }
      });
      if (going) stack.pop();
    };

    walker(data, id);
    return stack;
  };

  _onPressCollapse = ({ e, item }) => { // eslint-disable-line
    const { data } = this.props;
    const routes = this._find(data, item.id);
    this.setState((state) => {
      const nodesStatus = new Map(state.nodesStatus);
      nodesStatus.set(item && item.id, !nodesStatus.get(item && item.id)); // toggle
      return {
        currentNode: item.id,
        nodesStatus
      };
    }, () => {
      const { onClick } = this.props;
      onClick && onClick({ item, routes });
    });
  };

  _onClickLeaf = ({ e, item }) => { // eslint-disable-line
    const { onClickLeaf, onClick } = this.props;
    const { data } = this.props;
    const routes = this._find(data, item.id);
    this.setState({
      currentNode: item.id
    }, () => {
      onClick && onClick({ item, routes });
      onClickLeaf && onClickLeaf({ item, routes });
    });
  };

  _renderTreeNodeIcon = (isOpen, isCurrentNode) => {
    const { isShowTreeId = false, selectedItemStyle, itemStyle, treeNodeStyle } = this.props;
    const collapseIcon = isOpen ? 
    isCurrentNode ?
    {
      borderRightWidth: 5,
      borderRightColor: 'transparent',
      borderLeftWidth: 5,
      borderLeftColor: 'transparent',
      borderTopWidth: 10,
      borderTopColor: 'black',
    }:{
      borderRightWidth: 5,
      borderRightColor: 'transparent',
      borderLeftWidth: 5,
      borderLeftColor: 'transparent',
      borderTopWidth: 10,
      borderTopColor: '#FFEDCE',
    } : isCurrentNode ?
    {
      borderBottomWidth: 5,
      borderBottomColor: 'transparent',
      borderTopWidth: 5,
      borderTopColor: 'transparent',
      borderLeftWidth: 10,
      borderLeftColor: 'black',
    }:{
      borderBottomWidth: 5,
      borderBottomColor: 'transparent',
      borderTopWidth: 5,
      borderTopColor: 'transparent',
      borderLeftWidth: 10,
      borderLeftColor: 'white',
    };
    const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
    const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

    return openIcon && closeIcon ? <View>{isOpen ? openIcon : closeIcon}</View> :
      <View style={[styles.collapseIcon, collapseIcon, ]} />;
  };

  _renderRow = ({ item }) => {
    const { isShowTreeId = false, selectedItemStyle, itemStyle, treeNodeStyle } = this.props;
    const { backgroudColor, fontSize, color } = itemStyle && itemStyle;
    const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
    const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

    const selectedBackgroudColor = selectedItemStyle && selectedItemStyle.backgroudColor;
    const selectedFontSize = selectedItemStyle && selectedItemStyle.fontSize;
    const selectedColor = selectedItemStyle && selectedItemStyle.color;
    const isCurrentNode = this.state.currentNode === item.id;

    if (item && item.children && item.children.length) {
      const isOpen = this.state.nodesStatus && this.state.nodesStatus.get(item && item.id) || false;
      return (
        <View>
          <TouchableOpacity onPress={(e) => this._onPressCollapse({ e, item })} >
            <View style={{
              flexDirection: 'row',
              backgroundColor: isCurrentNode ? selectedBackgroudColor || '#FFEDCE' : backgroudColor || 'transparent',
              marginBottom: 2,
              height: 30,
              alignItems: 'center'
            }}
            >
              { this._renderTreeNodeIcon(isOpen, isCurrentNode) }
              {
                isShowTreeId && <Text numberOfLines={1} style={{ fontSize: 14, marginLeft: 4 }}>{item.id}</Text>
              }
              <Text style={[styles.textName, isCurrentNode ?
                { fontSize: selectedFontSize, color: selectedColor } : { fontSize, color }]}
                numberOfLines={1}  
              >{item.name}</Text>
            </View>
          </TouchableOpacity>
          {
            !isOpen ? null :
              <FlatList
                keyExtractor={(childrenItem, i) => i.toString()}
                style={{ flex: 1, marginLeft: 15 }}
                onEndReachedThreshold={0.01}
                {...this.props}
                data={item.children}
                extraData={this.state}
                renderItem={this._renderRow}
              />
          }
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={(e) => this._onClickLeaf({ e, item })}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: isCurrentNode ? selectedBackgroudColor || '#FFEDCE' : backgroudColor || 'transparent',
          marginBottom: 2,
          height: 30,
          alignItems: 'center'
        }}
        >
          <Text
            style={[styles.textName, isCurrentNode ?
              { fontSize: selectedFontSize, color: selectedColor, marginLeft: 18 } : { fontSize, color, marginLeft: 18 }]}
              numberOfLines={1}
          >{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _onSearch = () => {
    const { searchValue } = this.state;

  };

  _onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  _renderSearchBar = () => {
    const { searchValue } = this.state;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 5,
        borderColor: '#555', marginHorizontal: 10, }}>
        <TextInput
          style={{ height: 38, paddingHorizontal: 5, flex: 1 }}
          value={searchValue}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          blurOnSubmit
          clearButtonMode="while-editing"
          placeholder="搜索节点"
          placeholderTextColor="#e9e5e1"
          onChangeText={(text) => this._onChangeText('searchValue', text)}
        />
        <TouchableOpacity onPress={this._onSearch}>
          <Ionicons name="ios-search" style={{ fontSize: 25, marginHorizontal: 5 }} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {/*{*/}
        {/*this._renderSearchBar()*/}
        {/*}*/}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}      
        >
          <FlatList
            keyExtractor={(item, i) => i.toString()}
            style={{flex:1,minHeight:Dimensions.get('window').height-common.navHeight*2, marginVertical: 5, paddingHorizontal: 15,width:"auto" }}
            onEndReachedThreshold={0.01}
            {...this.props}
            data={data}
            extraData={this.state}
            renderItem={this._renderRow}
          />
        </ScrollView>
        
      </View>
    );
  }
}
