import * as React from 'react'
import {ActionSheetIOS, Dimensions, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import * as _ from 'lodash'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums'
import Header from './Header'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
}

type IState = {
  name: string
  numberOfDays: string
  weekdays: Day[]
}

export type Day = {
  name: string,
  training: boolean
}

class ProgramNameDays extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      name: '',
      numberOfDays: '',
      weekdays: [
        {name: 'Monday', training: false},
        {name: 'Tuesday', training: false},
        {name: 'Wednesday', training: false},
        {name: 'Thursday', training: false},
        {name: 'Friday', training: false},
        {name: 'Saturday', training: false},
        {name: 'Sunday', training: false}
      ]
    }
    this.buttonNextEnabled = this.buttonNextEnabled.bind(this)
    this.navigateToProgramExercises = this.navigateToProgramExercises.bind(this)
    this.modifyEditedProgram = this.modifyEditedProgram.bind(this)
  }

  componentDidMount() {
    const {params} = this.props.navigation.state
    if (params.editedProgram) {
      this.setState({name: params.editedProgram.name})
      if (isNaN(+params.editedProgram.days[0].day)) {
        const activeDays = params.editedProgram.days.map((day: ServerEntity.ExercisesDay) => day.day)
        let weekdaysCopy = this.state.weekdays.slice()
        activeDays.map((ad: string) => {
          const index = _.findIndex(weekdaysCopy, (wd: {name: string, training: false}) => {
            return wd.name === ad
          })
          weekdaysCopy[index] = {name: ad, training: true}
        })
        this.setState({weekdays: weekdaysCopy})
      } else {
        this.setState({numberOfDays: params.editedProgram.days.length.toString()})
      }
    }
  }

  showActionSheet() {
    const {params} = this.props.navigation.state
    ActionSheetIOS.showActionSheetWithOptions({
        title: 'Conflict: please select a value',
        options: ['Selected days', 'Number of days', 'Cancel'],
        cancelButtonIndex: 2
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.props.navigation.navigate('ProgramExercises', {
            name: this.state.name,
            days: this.state.weekdays.filter((day: Day) => {
              if (day.training) return day.name
            }).map((day: Day) => day.name),
            saveProgram: params.saveProgram,
            editedExercises: params.editedProgram ? this.modifyEditedProgram(true) : null,
            editedProgram: params.editedProgram ? params.editedProgram : null,
            editedIndex: params.editedIndex ? params.editedIndex : null
          })
        } else if (buttonIndex === 1) {
          this.props.navigation.navigate('ProgramExercises', {
            name: this.state.name,
            days: _.range(+this.state.numberOfDays).map((value: number) => value.toString()),
            saveProgram: params.saveProgram,
            editedExercises: params.editedProgram ? this.modifyEditedProgram(false) : null,
            editedProgram: params.editedProgram ? params.editedProgram : null,
            editedIndex: params.editedIndex ? params.editedIndex : null
          })
        }
      })
  }

  buttonNextEnabled = () => {
    const {name, numberOfDays, weekdays} = this.state
    return name !== '' && (numberOfDays !== '' || weekdays.some((elem) => {
      return elem.training
    }))
  }

  modifyEditedProgram = (currentIsDays: boolean): ServerEntity.ExercisesDay[] | null => {
    const editedProgram: ServerEntity.Program = this.props.navigation.state.params.editedProgram ?
      Object.assign(this.props.navigation.state.params.editedProgram) : null
    let exercisesDay: ServerEntity.ExercisesDay[] = []
    if (editedProgram) {
      if (isNaN(+editedProgram.days[0].day)) {
        // If the edited program contained day names
        if (currentIsDays) {
          // If days were added push empty days, if days were removed destroy the difference
          this.state.weekdays.map((d: Day) => {
            if (d.training) {
              const existingDay = editedProgram.days.find((ed: ServerEntity.ExercisesDay) => ed.day === d.name)
              if (existingDay) {
                exercisesDay.push(existingDay)
              } else {
                exercisesDay.push({
                  day: d.name,
                  exercises: [] as ServerEntity.ExerciseSet[],
                  isCollapsed: false,
                  isDayOff: false
                })
              }
            }
          })
        }
      } else {
        // If the edited program contained numbers as days
        if (currentIsDays) {
          // If the current state is day names remove all
          editedProgram.days.length = 0
        } else {
          // If days were added push empty days, if days were removed destroy the difference
          if (+this.state.numberOfDays > editedProgram.days.length) {
            editedProgram.days.map((d: ServerEntity.ExercisesDay) => {exercisesDay.push(d)})
            _.range(+this.state.numberOfDays - editedProgram.days.length).map((i: number) => {
              exercisesDay.push({
                day: i.toString(),
                exercises: [] as ServerEntity.ExerciseSet[],
                isCollapsed: false,
                isDayOff: false
              })
            })
          } else {
            exercisesDay = editedProgram.days.slice()
            exercisesDay.length = +this.state.numberOfDays
          }
        }
      }
      return exercisesDay
    } else {
      return null
    }
  }

  navigateToProgramExercises = () => {
    const {params} = this.props.navigation.state
    this.props.navigation.navigate('ProgramExercises', {
      name: this.state.name,
      days: this.state.numberOfDays === '' ? this.state.weekdays.filter((day: Day) => {
          if (day.training) return day.name
        }).map((day: Day) => day.name) :
        _.range(+this.state.numberOfDays).map((value: number) => (value + 1).toString()),
      saveProgram: params.saveProgram,
      editedExercises: params.editedProgram ? (this.state.numberOfDays === '' ? this.modifyEditedProgram(true) :
        this.modifyEditedProgram(false)) : null,
      editedProgram: params.editedProgram ? params.editedProgram : null,
      editedIndex: params.editedIndex
    })
  }

  render() {
    const {name, numberOfDays, weekdays} = this.state
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false} extraHeight={90}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.stack}
          title="Name and Days"
          secondaryIcon="arrow-forward"
          secondaryText="Next"
          secondaryEnabled={this.buttonNextEnabled()}
          secondaryFunction={() => this.navigateToProgramExercises()}
        />
        <View style={styles.containerForm}>
          <Text style={[styles.text, styles.elementsSeparator]}>Enter a name for the program:</Text>
          <TextInput
            style={[styles.textInput, styles.sectionSeparator, {width: grid.unit * 12.5}]}
            onChangeText={(text: string) => this.setState({name: text})}
            placeholder={'Type here'}
            value={name}/>
          <Text style={[styles.text, styles.elementsSeparator]}>Select training days:</Text>
          <View style={styles.wrapperDay}>
            {weekdays.map((day: Day, index: number) => {
              return (
                <TouchableOpacity
                  key={day.name}
                  style={[styles.box, day.training ? styles.dayTrained : styles.dayOff,
                    index === weekdays.length - 1 && styles.sectionSeparator]}
                  onPress={() => {
                    let weekdaysCopy = weekdays.slice()
                    weekdaysCopy[index] = {name: day.name, training: !day.training}
                    this.setState({weekdays: weekdaysCopy})
                  }}>
                  <Text style={styles.text}>{day.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <Text style={[styles.text, styles.elementsSeparator]}>Or enter a number of days trained and days off:</Text>
          <View style={styles.wrapperTextInputsNumber}>
            <TextInput
              style={[styles.textInput, styles.sectionSeparator, {width: 100}]}
              onChangeText={(text: string) => this.setState({numberOfDays: text})}
              placeholder={'Type here'}
              value={numberOfDays}
              keyboardType={'numeric'}/>
          </View>
          <TouchableOpacity
            style={[styles.buttons, styles.shadow]}
            disabled={!this.buttonNextEnabled()}
            onPress={() => {
              if ((numberOfDays !== '' && weekdays.some((elem) => {
                  return elem.training
                }))) {
                this.showActionSheet()
              } else {
                this.navigateToProgramExercises()
              }
            }}>
            <Text style={[styles.text, !this.buttonNextEnabled() && styles.textDisabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerForm: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: grid.body,
    color: colors.base
  },
  textDisabled: {
    color: colors.textDisabled
  },
  wrapperTextInputsNumber: {
    flexDirection: 'row'
  },
  textInput: {
    fontSize: grid.body,
    padding: grid.unit * 0.75,
    fontFamily: grid.font,
    color: colors.base,
    borderColor: colors.base,
    borderWidth: grid.heavyBorder,
    borderRadius: grid.radiusTextInput,
    marginRight: 5,
    marginLeft: 5
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    height: grid.unit * 2
  },
  box: {
    backgroundColor: colors.white,
    margin: 2,
    borderWidth: grid.heavyBorder,
    borderRadius: grid.radiusBox,
    overflow: 'hidden',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2.7,
    height: 'auto',
    minHeight: grid.unit * 2.5,
    justifyContent: 'center',
    padding: grid.unit / 4
  },
  wrapperDay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  dayTrained: {
    borderColor: colors.orange
  },
  dayOff: {
    borderColor: colors.base
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
  elementsSeparator: {
    marginBottom: grid.unit * 1.25
  },
  sectionSeparator: {
    marginBottom: grid.unit * 2.5
  }
})

export default ProgramNameDays
