import * as React from 'react'
import {View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Text} from 'react-native'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums'
import Header from './Header'
import {compose, graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {grid} from '../../utils/grid'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import * as tinyTime from 'tinytime'
import {ApolloQueryResult} from 'apollo-client'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'
import LoadingScreen from './LoadingScreen'

type IProps = {
  navigation: any
  data: any
  updateUser: (email?: string, firstName?: string, lastName?: string, userName?: string, dob?: string, height?: number,
               trainingYears?: number) => Promise<ApolloQueryResult<{}>>
}

type IState = {
  editSaveStatus: EditSaveStatus
  showLoadingScreen: boolean
  editing: boolean
  email: string
  firstName: string
  lastName: string
  userName: string
  dob: string
  height: string
  trainingYears: string
  emailError: boolean
  firstNameError: boolean
  lastNameError: boolean
  userNameError: boolean
  dobError: boolean
  heightError: boolean
  trainingYearsError: boolean
  primaryIconDisabled: boolean
}

export enum EditSaveStatus {
  edit = 'Edit',
  save = 'Save'
}

const template = tinyTime('{DD}{Mo}{YYYY}', {padMonth: true})
const dateToday = template.render(new Date())

class Home extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      editSaveStatus: EditSaveStatus.edit,
      showLoadingScreen: true,
      editing: false,
      email: '',
      firstName: '',
      lastName: '',
      userName: '',
      dob: '',
      height: '',
      trainingYears: '',
      emailError: false,
      dobError: false,
      firstNameError: false,
      heightError: false,
      lastNameError: false,
      trainingYearsError: false,
      userNameError: false,
      primaryIconDisabled: true
    }
    this.editSave = this.editSave.bind(this)
    this.fieldsVerified = this.fieldsVerified.bind(this)
  }

  componentWillReceiveProps(props: IProps) {
    if (props.data.currentUser) {
      const {currentUser} = props.data
      this.setState({
        showLoadingScreen: false,
        email: currentUser.email ? currentUser.email : '',
        firstName: currentUser.firstName ? currentUser.firstName : '',
        lastName: currentUser.lastName ? currentUser.lastName : '',
        userName: currentUser.userName ? currentUser.userName : '',
        dob: currentUser.dob ? currentUser.dob : '',
        height: currentUser.height ? currentUser.height.toString() : '',
        trainingYears: currentUser.trainingYears ? currentUser.trainingYears.toString() : ''
      })
    }
  }

  fieldsVerified = () => {
    const {email, firstName, lastName, userName, height, trainingYears} = this.state
    let [emailError, firstNameError, lastNameError, userNameError, heightError, trainingYearsError] =
      [false, false, false, false, false, false]
    if (!email.match(new RegExp(/.+\@.+\..+/))) emailError = true
    if (firstName.trim().length < 2 && firstName.trim().length !== 0) firstNameError = true
    if (lastName.trim().length < 2 && lastName.trim().length !== 0) lastNameError = true
    if (userName.trim().length < 2 && userName.trim().length !== 0) userNameError = true
    if (height.length > 0 && (isNaN(+height) || +height < 100 || +height > 240)) heightError = true
    if (trainingYears.length > 0 && (isNaN(+trainingYears) || +trainingYears > 70)) heightError = true
    this.setState({emailError, firstNameError, lastNameError, userNameError, heightError, trainingYearsError})
    if (emailError || firstNameError || lastNameError || userNameError || heightError || trainingYearsError) return false
    return true
  }

  editSave = () => {
    const {email, firstName, lastName, userName, dob, height, trainingYears} = this.state
    if (this.state.editSaveStatus === EditSaveStatus.edit) {
      this.setState({editSaveStatus: EditSaveStatus.save, editing: true})
    } else {
      if (this.fieldsVerified()) {
        this.setState({showLoadingScreen: true})
        this.props.updateUser(
          email.length > 0 ? email.trim() : null,
          firstName.length > 0 ? firstName.trim() : null,
          lastName.length > 0 ? lastName.trim() : null,
          userName.length > 0 ? userName.trim() : null,
          dob.length > 0 ? dob.trim() : null,
          height.length > 0 ? +height.trim() : null,
          trainingYears.length > 0 ? +trainingYears.trim() : null
        ).then(({data}: any) => {
          this.setState({showLoadingScreen: false, editSaveStatus: EditSaveStatus.edit, editing: false})
        }).catch((e: any) => {
          this.setState({showLoadingScreen: false})
          if (/email/i.test(e.message)) this.setState({emailError: true})
          if (/firstName/i.test(e.message)) this.setState({firstNameError: true})
          if (/lastName/i.test(e.message)) this.setState({lastNameError: true})
          if (/userName/i.test(e.message)) this.setState({userNameError: true})
          if (/dob/i.test(e.message)) this.setState({dobError: true})
          if (/height/i.test(e.message)) this.setState({heightError: true})
          if (/trainingYears/i.test(e.message)) this.setState({trainingYearsError: true})
        })
      }
    }
  }

  render() {
    const {
      primaryIconDisabled, editSaveStatus, emailError, firstNameError, lastNameError, userNameError, dobError,
      heightError, trainingYearsError, email, editing, firstName, lastName, userName, dob, height, trainingYears,
      showLoadingScreen
    } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          primaryIconDisabled={primaryIconDisabled}
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.drawer}
          title="Home"
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.viewElements} scrollEnabled={false} extraHeight={90}>
          <Animate
            show={true}
            start={{
              opacityView: grid.mediumOpacity,
              colorEmail: colors.base,
              colorFirstName: colors.base,
              colorLastName: colors.base,
              colorUserName: colors.base,
              colorDob: colors.base,
              colorHeight: colors.base,
              colorTrainingYears: colors.base
            }}
            update={{
              opacityView: editSaveStatus === EditSaveStatus.edit ? [grid.mediumOpacity] : [1],
              colorEmail: emailError ? [colors.alert] : [colors.base],
              colorFirstName: firstNameError ? [colors.alert] : [colors.base],
              colorLastName: lastNameError ? [colors.alert] : [colors.base],
              colorUserName: userNameError ? [colors.alert] : [colors.base],
              colorDob: dobError ? [colors.alert] : [colors.base],
              colorHeight: heightError ? [colors.alert] : [colors.base],
              colorTrainingYears: trainingYearsError ? [colors.alert] : [colors.base],
              timing: {duration: 300, ease: easeLinear}
            }}>
            {(state: any) => {
              return (
                <View style={{width: '100%', alignItems: 'center', opacity: state.opacityView}}>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorEmail}]}>
                      <Icon name="email" size={grid.subHeader} color={state.colorEmail} style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorEmail, width: '80%', fontFamily: grid.font}}
                        value={email}
                        editable={editing}
                        onChangeText={(text) => this.setState({email: text, emailError: false})}
                        placeholder='Email...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='email-address'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorFirstName}]}>
                      <Icon name="person" size={grid.subHeader} color={state.colorFirstName}
                            style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorFirstName, width: '80%', fontFamily: grid.font}}
                        value={firstName}
                        editable={editing}
                        onChangeText={(text) => this.setState({firstName: text, firstNameError: false})}
                        placeholder='First name...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='default'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorLastName}]}>
                      <Icon name="person" size={grid.subHeader} color={state.colorLastName}
                            style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorLastName, width: '80%', fontFamily: grid.font}}
                        value={lastName}
                        editable={editing}
                        onChangeText={(text) => this.setState({lastName: text, lastNameError: false})}
                        placeholder='Last name...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='default'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorUserName}]}>
                      <Icon name="person-pin" size={grid.subHeader} color={state.colorUserName}
                            style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorUserName, width: '80%', fontFamily: grid.font}}
                        value={userName}
                        editable={editing}
                        onChangeText={(text) => this.setState({userName: text, userNameError: false})}
                        placeholder='User name...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='default'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorDob}]}>
                      <DatePicker
                        date={dob}
                        style={{width: 40}}
                        format="DD/MM/YYYY"
                        disabled={!editing}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        placeholder="Date of birth"
                        customStyles={datePickerCustomStyle}
                        minDate="01011900"
                        maxDate={dateToday}
                        duration={300}
                        hideText={true}
                        androidMode="spinner"
                        iconComponent={
                          <Icon name="today" size={grid.subHeader} color={state.colorDob}
                                style={{marginLeft: 5, marginRight: 5}}/>
                        }
                        onDateChange={(date: string) => this.setState({dob: date, dobError: false})}
                      />
                      <Text style={{
                        color: dob.length > 0 ? state.colorDob : colors.lightAlternative,
                        fontFamily: grid.font
                      }}>
                        {`${this.state.dob.length > 0 ? dob : 'Date of birth...'}`}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorHeight}]}>
                      <Icon name="accessibility" size={grid.subHeader} color={state.colorHeight}
                            style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorHeight, width: '80%', fontFamily: grid.font}}
                        value={height}
                        editable={editing}
                        onChangeText={(text) => this.setState({height: text, heightError: false})}
                        placeholder='Height...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='numeric'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                  <View style={[styles.viewElement, styles.shadow]}>
                    <View style={[styles.viewTextInput, {borderColor: state.colorTrainingYears}]}>
                      <Icon name="developer-board" size={grid.subHeader} color={state.colorTrainingYears}
                            style={styles.iconTextInput}/>
                      <TextInput
                        style={{color: state.colorTrainingYears, width: '80%', fontFamily: grid.font}}
                        value={trainingYears}
                        editable={editing}
                        onChangeText={(text) => this.setState({trainingYears: text, trainingYearsError: false})}
                        placeholder='Years of training...'
                        placeholderTextColor={colors.lightAlternative}
                        keyboardType='numeric'
                        autoCapitalize='none'/>
                    </View>
                  </View>
                </View>
              )
            }}
          </Animate>
          <View>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: editSaveStatus === EditSaveStatus.edit ? colors.orange : colors.valid}]}
              onPress={() => this.editSave()}>
              <Text style={styles.text}>{editSaveStatus}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {showLoadingScreen &&
        <LoadingScreen/>}
      </View>
    )
  }
}

export default compose(graphql(
  gql`
    query User {
      currentUser {
        email, firstName, lastName, userName, dob, height, trainingYears
      }
    }
  `
), graphql(
  gql`
    mutation UpdateUser($email: String, $firstName: String, $lastName: String, $userName: String, $dob: String, $height: Int, $trainingYears: Int) {
      updateUser(input: {email: $email, firstName: $firstName, lastName: $lastName, userName: $userName, dob: $dob, height: $height, trainingYears: $trainingYears}) {
        email
      }
    }
  `,
  {
    props: ({mutate}) => ({
      updateUser: (email?: string, firstName?: string, lastName?: string, userName?: string, dob?: string, height?: number, trainingYears?: number) => mutate({
        variables: {
          email,
          firstName,
          lastName,
          userName,
          dob,
          height,
          trainingYears
        }
      })
    }),
  },
))(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewElements: {
    backgroundColor: colors.lightAlternative,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewElement: {
    backgroundColor: colors.headerLight,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 'auto',
    marginBottom: grid.unit
  },
  viewTextInput: {
    backgroundColor: colors.light + 64,
    flexDirection: 'row',
    borderRadius: 20,
    width: '60%',
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1
  },
  iconTextInput: {
    marginRight: 10,
    marginLeft: 10
  },
  shadow: {
    backgroundColor: colors.white,
    borderRadius: grid.unit / 4,
    padding: grid.unit / 2,
    borderWidth: grid.regularBorder,
    borderColor: colors.lightAlternative,
    borderBottomWidth: 0,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: grid.highOpacity,
    shadowRadius: grid.unit / 8,
    elevation: 1
  },
  button: {
    borderRadius: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    color: colors.white,
    fontFamily: grid.fontBold
  }
})

const datePickerCustomStyle = StyleSheet.create({
  btnTextConfirm: {
    color: colors.base
  },
  placeholderText: {
    color: colors.base
  }
})
