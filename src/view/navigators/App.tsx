/// <reference path='../../interfaces/index.d.ts'/>
import * as React from 'react'
import {StatusBar, StyleSheet, AppRegistry, View} from 'react-native'
import MainDrawerNav from './MainDrawerNav'
import 'regenerator-runtime/runtime'
import {AppLoading, Font} from 'expo'
import createStore from '../../core/create'
import {Provider} from 'react-redux'

type IProps = {}

type IState = {
  isReady: boolean
}

export const store = createStore()

class App extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {isReady: false}
  }

  async loadFonts() {
    await Font.loadAsync({
      'Montserrat-Regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('../../../assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Light': require('../../../assets/fonts/Montserrat-Light.ttf'),
      'Montserrat-Medium': require('../../../assets/fonts/Montserrat-Medium.ttf'),
      'courier': require('../../../assets/fonts/courier.ttf')
    })
  }

  render() {
    return (
      <Provider store={store} key="provider">
        <View style={styles.container}>
          <StatusBar barStyle="light-content"/>
          {!this.state.isReady && <AppLoading
            startAsync={this.loadFonts}
            onFinish={() => this.setState({ isReady: true })}
          /> ||
          <MainDrawerNav/>}
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App

AppRegistry.registerComponent('OnBoardingApp', () => App)
