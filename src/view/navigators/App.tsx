/// <reference path='../../interfaces/index.d.ts'/>
import * as React from 'react'
import {StatusBar, StyleSheet, AppRegistry, View, AsyncStorage} from 'react-native'
import MainDrawerNav from './MainDrawerNav'
import 'regenerator-runtime/runtime'
import {AppLoading, Asset, Font} from 'expo'
import createStore from '../../core/create'
import {Provider} from 'react-redux'
import {ApolloClient, InMemoryCache} from 'apollo-client-preset'
import {ApolloProvider} from 'react-apollo'
import LoginRegister from '../components/LoginRegister'
import config from '../../utils/config'
import {createHttpLink} from 'apollo-link-http'
import {setContext} from 'apollo-link-context'

type IProps = {}

type IState = {
  isReady: boolean
  isLoggedIn: boolean
}

export const store = createStore()

const httpLink = createHttpLink({
  uri: 'https://r948m3339n.lp.gql.zone/graphql'
})

const authLink = setContext(async (_, { headers }) => {
  let token
  await AsyncStorage.getItem(config.jwtToken).then((val) => {
    token = val
  })
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

class App extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {isReady: false, isLoggedIn: false}
    this.changeLoginState = this.changeLoginState.bind(this)
  }

  async componentWillMount() {
    if (!config.shouldShowLoginScreen) {
      let token
      await AsyncStorage.getItem(config.jwtToken).then((val) => {
        token = val
      })
      if (token) {
        this.setState({isLoggedIn: true})
      }
    }
  }

  async loadAssets() {
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
    await Asset.loadAsync([
      require('../../../assets/images/loader.gif')
    ])
  }

  changeLoginState = async (state: boolean, token?: string) => {
    if (state) {
      await AsyncStorage.setItem(config.jwtToken, token)
    } else {
      await AsyncStorage.removeItem(config.jwtToken)
      await client.resetStore()
    }
    this.setState({isLoggedIn: state})
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store} key="provider">
          <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            {!this.state.isReady ?
              <AppLoading
                startAsync={this.loadAssets}
                onFinish={() => this.setState({isReady: true})}/> :
              (this.state.isLoggedIn ? <MainDrawerNav changeLoginState={this.changeLoginState}/> :
                <LoginRegister changeLoginState={this.changeLoginState}/>)}
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
