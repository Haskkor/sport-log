import * as React from 'react'
import {
  StyleSheet, StatusBar, ImageBackground, TextInput, View, TouchableOpacity, Text, Image,
  Dimensions
} from 'react-native'
import {colors} from '../../utils/colors'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {grid} from '../../utils/grid'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'
import {ApolloQueryResult} from 'apollo-client'
import config from '../../utils/config'
import {dataSignUp} from '../../utils/gaphqlData'

type IProps = {
  signUp: (email: string, password: string) => Promise<ApolloQueryResult<{}>>
  login: (email: string, password: string) => Promise<ApolloQueryResult<{}>>
  changeLoginState: (state: boolean, token: string) => void
}

type IState = {
  status: LoginRegisterStatus
  email: string
  password: string
  confirmPassword: string
  emailError: boolean
  passwordError: boolean
  confirmError: boolean
  showLoadingScreen: boolean
}

export enum LoginRegisterStatus {
  login = 'Login',
  register = 'Register'
}

class LoginRegister extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      emailError: false,
      passwordError: false,
      confirmError: false,
      status: LoginRegisterStatus.login,
      showLoadingScreen: false
    }
    this.verifyContent = this.verifyContent.bind(this)
  }

  verifyContent = () => {
    const {email, password, confirmPassword, status} = this.state
    let [emailError, passwordError, confirmError] = [false, false, false]
    if (!email.match(new RegExp(/.+\@.+\..+/))) {
      emailError = true
      this.setState({emailError: true})
    }
    if ((config.fakePasswordRegex && password.length < 1) ||
      (!config.fakePasswordRegex && !password.match(new RegExp('^.*(?=.{6,18})(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$')))) {
      passwordError = true
      this.setState({passwordError: true})
    }
    if (status === LoginRegisterStatus.register && password !== confirmPassword) {
      confirmError = true
      this.setState({confirmError: true})
    }
    if (!emailError && !passwordError && !confirmError) {
      if (this.state.status === LoginRegisterStatus.register) {
        this.setState({showLoadingScreen: true})
        this.props.signUp(email, password).then((d: { data: dataSignUp }) => {
          this.props.changeLoginState(true, d.data.signup.jwt)
        }).catch((e) => {
          this.setState({showLoadingScreen: false})
          if (/email/i.test(e.message)) this.setState({emailError: true})
          if (/password/i.test(e.message)) this.setState({passwordError: true})
        })
      } else {
        this.setState({showLoadingScreen: true})
        this.props.login(email, password).then((d: { data: { login: { __typename: string, jwt: string } } }) => {
          this.props.changeLoginState(true, d.data.login.jwt)
        }).catch((e) => {
          console.log(e)
          this.setState({showLoadingScreen: false})
          if (/email/i.test(e.message)) this.setState({emailError: true})
          if (/password/i.test(e.message)) this.setState({passwordError: true})
        })
      }
    }
  }

  render() {
    const buttonDisabled = this.state.email.length === 0 || this.state.password.length === 0 ||
      (this.state.status === LoginRegisterStatus.register && this.state.confirmPassword.length === 0) ||
      this.state.emailError || this.state.passwordError || this.state.confirmError
    const {status} = this.state
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false} extraHeight={90}>
        <StatusBar barStyle="light-content"/>
        <ImageBackground
          style={styles.background}
          blurRadius={10}
          source={require('../../../assets/images/loginBackground.jpg')}>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/loginLogo.png')}/>
          <Animate
            show={true}
            start={{
              colorBorderEmail: 'rgba(0, 0, 0, 0)',
              colorBorderPassword: 'rgba(0, 0, 0, 0)',
              colorBorderConfirm: 'rgba(0, 0, 0, 0)',
              colorTextEmail: colors.lightAlternative,
              colorTextPassword: colors.lightAlternative,
              colorTextConfirm: colors.lightAlternative,
              opacityButton: 0.4
            }}
            update={{
              colorBorderEmail: this.state.emailError ? [colors.alert] : ['rgba(0, 0, 0, 0)'],
              colorBorderPassword: this.state.passwordError ? [colors.alert] : ['rgba(0, 0, 0, 0)'],
              colorBorderConfirm: this.state.confirmError ? [colors.alert] : ['rgba(0, 0, 0, 0)'],
              colorTextEmail: this.state.emailError ? [colors.alert] : [colors.lightAlternative],
              colorTextPassword: this.state.passwordError ? [colors.alert] : [colors.lightAlternative],
              colorTextConfirm: this.state.confirmError ? [colors.alert] : [colors.lightAlternative],
              opacityButton: buttonDisabled ? [0.4] : [1],
              timing: {duration: 300, ease: easeLinear}
            }}>
            {(state: {
              colorBorderConfirm: string,
              colorBorderEmail: string,
              colorBorderPassword: string,
              colorTextConfirm: string,
              colorTextEmail: string,
              colorTextPassword: string,
              opacityButton: number
            }) => {
              return (
                <View style={styles.viewElements}>
                  <View style={[styles.viewTextInput, {borderColor: state.colorBorderEmail}]}>
                    <Icon name="person" size={grid.subHeader} color={state.colorTextEmail}
                          style={styles.iconTextInput}/>
                    <TextInput
                      style={[{color: state.colorTextEmail}, styles.textInput]}
                      value={this.state.email}
                      onChangeText={(text) => this.setState({email: text, emailError: false})}
                      placeholder='Enter email'
                      placeholderTextColor={colors.lightAlternative}
                      keyboardType='email-address'
                      autoCapitalize='none'/>
                  </View>
                  <View style={[styles.viewTextInput, {borderColor: state.colorBorderPassword}]}>
                    <Icon name="lock" size={grid.subHeader} color={state.colorTextPassword}
                          style={styles.iconTextInput}/>
                    <TextInput
                      style={[{color: state.colorTextPassword}, styles.textInput]}
                      value={this.state.password}
                      onChangeText={(text) => this.setState({password: text, passwordError: false})}
                      placeholder='Enter password'
                      placeholderTextColor={colors.lightAlternative}
                      keyboardType='default'
                      autoCapitalize='none'
                      secureTextEntry={true}/>
                  </View>
                  {this.state.status === LoginRegisterStatus.register &&
                  <View style={[styles.viewTextInput, {borderColor: state.colorBorderConfirm}]}>
                    <Icon name="lock" size={grid.subHeader} color={state.colorTextConfirm}
                          style={styles.iconTextInput}/>
                    <TextInput
                      style={[{color: state.colorTextConfirm}, styles.textInput]}
                      value={this.state.confirmPassword}
                      onChangeText={(text) => this.setState({confirmPassword: text, confirmError: false})}
                      placeholder='Confirm password'
                      placeholderTextColor={colors.lightAlternative}
                      keyboardType='default'
                      autoCapitalize='none'
                      secureTextEntry={true}/>
                  </View>}
                  <View style={{opacity: state.opacityButton}}>
                    <TouchableOpacity
                      disabled={buttonDisabled}
                      style={styles.button}
                      onPress={() => this.verifyContent()}>
                      <Text style={styles.text}>{this.state.status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          </Animate>
          <View style={styles.viewTextBottom}>
            <TouchableOpacity
              onPress={() => this.setState({status: status === LoginRegisterStatus.login ? LoginRegisterStatus.register : LoginRegisterStatus.login})}>
              <Text style={styles.textBottom}>
                {status === LoginRegisterStatus.login ? 'Create an account' : 'Already have an account?'}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {this.state.showLoadingScreen &&
        <View style={styles.viewLoader}>
          <Image source={require('../../../assets/images/loader.gif')} style={styles.imageLoader}/>
        </View>}
      </KeyboardAwareScrollView>
    )
  }
}

export default compose(graphql(
  gql`
    mutation SignUp($email: String!, $password: String!) {
      signup(input: {email: $email, password: $password}) {
        _id
        email
        jwt
      }
    }
  `,
  {
    props: ({mutate}) => ({
      signUp: (email: string, password: string) => mutate({variables: {email, password}}),
    })
  }
), graphql(
  gql`
    mutation Login($email: String!, $password: String!) {
      login(input: {email: $email, password: $password}) {
        jwt
      }
    }
  `,
  {
    props: ({mutate}) => ({
      login: (email: string, password: string) => mutate({variables: {email, password}})
    }),
  },
))(LoginRegister)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 30,
    borderRadius: 50,
    resizeMode: 'contain',
    backgroundColor: colors.lightAlternative
  },
  textInput: {
    fontFamily: grid.font,
    width: '80%'
  },
  viewTextInput: {
    backgroundColor: colors.light + 64,
    flexDirection: 'row',
    borderRadius: 20,
    width: '60%',
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1
  },
  iconTextInput: {
    marginRight: 10,
    marginLeft: 10
  },
  button: {
    borderRadius: 20,
    backgroundColor: colors.orange,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    color: colors.lightAlternative,
    fontFamily: grid.fontBold
  },
  viewElements: {
    width: '100%',
    alignItems: 'center'
  },
  textBottom: {
    color: colors.orange,
    fontFamily: grid.font
  },
  viewTextBottom: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    top: Dimensions.get('window').height - 50
  },
  imageLoader: {
    width: 50,
    height: 50
  },
  viewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    opacity: grid.highOpacity
  }
})
