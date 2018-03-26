/// <reference path='../../interfaces/index.d.ts'/>
import * as React from 'react'
import {StatusBar, StyleSheet, AppRegistry, View} from 'react-native'
import MainDrawerNav from './MainDrawerNav'
import 'regenerator-runtime/runtime'
import {AppLoading, Font} from 'expo'
import createStore from '../../core/create'
import {Provider} from 'react-redux'
import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-client-preset'
import {ApolloProvider} from 'react-apollo'
import Login from '../components/Login'

type IProps = {}

type IState = {
  isReady: boolean
  isLoggedIn: boolean
}

export const store = createStore()

const client = new ApolloClient({
  link: new HttpLink({uri: 'https://r948m3339n.lp.gql.zone/graphql'}),
  cache: new InMemoryCache()
})

class App extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {isReady: false, isLoggedIn: false}
  }

  async loadFonts() {
    await Font.loadAsync({
      'Montserrat-Regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('../../../assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Light': require('../../../assets/fonts/Montserrat-Light.ttf'),
      'Montserrat-Medium': require('../../../assets/fonts/Montserrat-Medium.ttf'),
      'Roboto-Bold': require('../../../assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Light': require('../../../assets/fonts/Roboto-Light.ttf'),
      'Roboto-Medium': require('../../../assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('../../../assets/fonts/Roboto-Regular.ttf'),
      'RobotoMono-Medium': require('../../../assets/fonts/RobotoMono-Medium.ttf'),
      'courier': require('../../../assets/fonts/courier.ttf')
    })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store} key="provider">
          <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            {!this.state.isReady ?
              <AppLoading
                startAsync={this.loadFonts}
                onFinish={() => this.setState({isReady: true})}/> :
              (this.state.isLoggedIn ? <MainDrawerNav/> : <Login />)}
          </View>
        </Provider>
      </ApolloProvider>
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
