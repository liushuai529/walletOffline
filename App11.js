import React from 'react';
// import Navigator from './App/Navigator';
import {Provider} from 'react-redux';
import configureStore from './redux/store/configureStore';
import {YellowBox} from 'react-native';
// import {Theme, TopView} from 'teaset';
import {common} from './constants/common';

export const store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }


  render() {
    return (
      <Provider store={store}>
        <TopView>
          {/* <Navigator /> */}
        </TopView>
      </Provider>
    );
  }
}
