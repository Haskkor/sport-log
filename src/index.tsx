/// <reference path='./interfaces/index.d.ts'/>
import 'regenerator-runtime/runtime'
import * as React from 'react'
import {AppRegistry} from 'react-native'
import createStore from './core/create'
import {Provider} from 'react-redux'
import App from './view/navigators/App'

export const store = createStore();

(console as any).disableYellowBox = true;

class OnBoardingApp extends React.Component {
  render() {
    return (
      <Provider store={store} key="provider">
        <App/>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('OnBoardingApp', () => OnBoardingApp)
