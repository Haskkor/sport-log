import * as React from 'react'
import {ActionSheetIOS, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Collapsible from 'react-native-collapsible'
import exercises from '../../db/exercises'
import ModalSearch from './ModalSearch'
import * as _ from 'lodash'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import {HeaderStatus} from '../../core/enums'
import Header from './Header'
import {NavigationAction, NavigationActions, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import LoadingScreen from './LoadingScreen'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
}

type IState = {
  exercisesDay: ServerEntity.ExercisesDay[]
  showModalSearch: boolean
  saveEnabled: boolean
  showLoadingScreen: boolean
}

class ProgramExercises extends React.PureComponent<IProps, IState> {
  daySelected: ServerEntity.ExercisesDay
  indexDaySelected: number
  editedDayIndex: number
  editedExerciseIndex: number

  constructor(props: IProps) {
    super(props)
    this.state = {
      exercisesDay: [{day: '', exercises: [], isCollapsed: false, isDayOff: false}],
      showModalSearch: false,
      saveEnabled: false,
      showLoadingScreen: false
    }
    this.showActionSheet = this.showActionSheet.bind(this)
    this.editExerciseFinished = this.editExerciseFinished.bind(this)
    this.saveProgram = this.saveProgram.bind(this)
    this.editDayAttribute = this.editDayAttribute.bind(this)
  }

  componentWillMount() {
    this.props.navigation.setParams({
      rightButtonFunction: this.saveProgram
    })
  }

  componentDidMount() {
    const {params} = this.props.navigation.state
    const exercisesDayEmpty: ServerEntity.ExercisesDay[] = params.days.map((day: string) => {
      return {
        day: day,
        exercises: [] as ServerEntity.ExerciseSet[],
        isCollapsed: false,
        isDayOff: false
      }
    })
    this.setState({
      exercisesDay: (params.editedExercises && params.editedExercises.length) > 0 ?
        params.editedExercises : exercisesDayEmpty
    })
  }

  componentDidUpdate() {
    const buttonDisabled = this.state.exercisesDay.map((ed: ServerEntity.ExercisesDay) => {
      return ed.exercises.length > 0 || ed.isDayOff
    }).some((val: boolean) => val === false)
    this.setState({saveEnabled: !buttonDisabled})
    if (this.props.navigation.state.params.rightButtonEnabled === buttonDisabled) {
      this.props.navigation.setParams({
        rightButtonEnabled: !buttonDisabled
      })
    }
  }

  showActionSheet(day: ServerEntity.ExercisesDay, exercise: ServerEntity.ExerciseSet) {
    const {exercisesDay} = this.state
    ActionSheetIOS.showActionSheetWithOptions({
        title: exercise.exercise.name,
        message: exercise.exercise.equipment,
        options: ['Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2
      },
      (buttonIndex) => {
        const indexDay = _.findIndex(exercisesDay, (dayRow: ServerEntity.ExercisesDay) => {
          return day === dayRow
        })
        const indexExercise = _.findIndex(exercisesDay[indexDay].exercises, (exerciseRow: ServerEntity.ExerciseSet) => {
          return exercise === exerciseRow
        })
        if (buttonIndex === 0) {
          this.editedExerciseIndex = indexExercise
          this.editedDayIndex = indexDay
          this.props.navigation.navigate('ProgramEditExercise',
            {
              exerciseToEdit: this.state.exercisesDay[indexDay].exercises[indexExercise],
              status: HeaderStatus.stack,
              title: 'Edit exercise',
              exercise: exercise,
              saveEdit: this.editExerciseFinished
            })
        } else if (buttonIndex === 1) {
          const exercisesDayCopy = this.state.exercisesDay.slice()
          const exerciseSetCopy = exercisesDayCopy[indexDay].exercises.slice()
          exerciseSetCopy.splice(indexExercise, 1)
          exercisesDayCopy[indexDay].exercises = exerciseSetCopy
          this.setState({exercisesDay: exercisesDayCopy})
        }
      })
  }

  editExerciseFinished = (exercise: ServerEntity.ExerciseSet) => {
    const exercisesDayCopy = this.state.exercisesDay.slice()
    const exerciseSetCopy = exercisesDayCopy[this.editedDayIndex].exercises.slice()
    exerciseSetCopy[this.editedExerciseIndex] = exercise
    exercisesDayCopy[this.editedDayIndex].exercises = exerciseSetCopy
    this.setState({exercisesDay: exercisesDayCopy})
  }

  handleSelectionExercise = (exercise: string, muscle: string, equipment: string) => {
    const newExerciseSet: ServerEntity.ExerciseSet = {
      muscleGroup: muscle,
      exercise: {name: exercise, equipment: equipment},
      sets: [{reps: 8, weight: 75}, {reps: 8, weight: 75}, {reps: 8, weight: 75}],
      recoveryTime: '00:00'
    }
    let sortedExercises = this.daySelected.exercises.slice()
    sortedExercises.push(newExerciseSet)
    sortedExercises = _.sortBy(sortedExercises, (e: ServerEntity.ExerciseSet) => e.exercise.name)
    const copyCurrentDay: ServerEntity.ExercisesDay = {
      day: this.daySelected.day,
      isCollapsed: this.daySelected.isCollapsed,
      exercises: sortedExercises,
      isDayOff: this.daySelected.isDayOff
    }
    const copyExercisesDay = this.state.exercisesDay.slice()
    copyExercisesDay[this.indexDaySelected] = copyCurrentDay
    this.setState({exercisesDay: copyExercisesDay, showModalSearch: false})
    this.daySelected = null
    this.indexDaySelected = null
  }

  editDayAttribute = (day: ServerEntity.ExercisesDay, index: number) => {
    const copyExercisesDay = this.state.exercisesDay.slice()
    copyExercisesDay[index] = day
    this.setState({exercisesDay: copyExercisesDay})
  }

  renderHeaderSection = (day: ServerEntity.ExercisesDay, index: number) => {
    return (
      <View style={styles.containerHeaderSection}>
        <Text style={styles.textHeaderSection}>{day.day}</Text>
        {(!isNaN(this.props.navigation.state.params.days[0])) &&
        <TouchableOpacity onPress={() => {
          const copyCurrentDay: ServerEntity.ExercisesDay = {
            day: day.day,
            isCollapsed: day.isCollapsed,
            exercises: day.exercises.slice(),
            isDayOff: !day.isDayOff
          }
          this.editDayAttribute(copyCurrentDay, index)
        }}>
          <Icon name="airline-seat-individual-suite" size={20} color={colors.base} style={styles.iconHeaderSectionAdd}/>
        </TouchableOpacity>}
        <TouchableOpacity
          disabled={day.isDayOff}
          onPress={() => {
            this.daySelected = day
            this.indexDaySelected = index
            this.setState({showModalSearch: true})
          }}>
          <Icon name="add-circle-outline" size={20} color={colors.base}
                style={[styles.iconHeaderSectionAdd, {opacity: day.isDayOff ? grid.lowOpacity : 1}]}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          const copyCurrentDay: ServerEntity.ExercisesDay = {
            day: day.day,
            isCollapsed: !day.isCollapsed,
            exercises: day.exercises.slice(),
            isDayOff: day.isDayOff
          }
          this.editDayAttribute(copyCurrentDay, index)
        }}>
          <Icon name={day.isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={20} color={colors.base}
                style={styles.iconHeaderSectionCollapsed}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderExercisesSection = (day: ServerEntity.ExercisesDay) => {
    return (
      <Collapsible collapsed={day.isCollapsed} duration={500}>
        {day.isDayOff &&
        <View style={{padding: grid.unit}}>
          <Text style={styles.sectionDayOff}>Day Off</Text>
        </View> ||
        day.exercises.length === 0 &&
        <View style={{padding: grid.unit}}>
          <Text style={styles.sectionNoContent}>No exercises yet</Text>
        </View> ||
        <View>
          {day.exercises.map((set: ServerEntity.ExerciseSet, index: number) => {
            return (
              <TouchableOpacity key={set.exercise.name + index}
                                onPress={() => this.showActionSheet(day, set)}
                                style={[styles.sectionElement, {borderBottomWidth: index + 1 !== day.exercises.length ? 1 : 0}]}>
                <View style={styles.sectionElementRow}>
                  <Text style={styles.textBoldSection}>{set.muscleGroup}</Text>
                  <Text style={styles.textMediumSection}>{`${set.exercise.name} - ${set.exercise.equipment}`}</Text>
                </View>
                <View style={styles.sectionElementRow}>
                  <Text style={styles.textBoldSection}>{set.recoveryTime}</Text>
                  {set.sets.map((s: ServerEntity.Set, index: number) => {
                    return (<Text key={index} style={styles.textMediumSection}>{`${s.weight}x${s.reps}`}</Text>)
                  })}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        }
      </Collapsible>
    )
  }

  renderSectionDay = (day: ServerEntity.ExercisesDay, index: number) => {
    return (
      <View key={day.day + index}>
        {this.renderHeaderSection(day, index)}
        {this.renderExercisesSection(day)}
        {this.state.showModalSearch && <ModalSearch
          exercises={exercises}
          closeModal={() => this.setState({showModalSearch: false})}
          selectExercise={this.handleSelectionExercise}/>}
      </View>
    )
  }

  saveProgram = async () => {
    this.setState({showLoadingScreen: true})
    const {params} = this.props.navigation.state
    if (params.editedProgram) {
      await params.saveProgram(
        params.editedIndex,
        {
          name: params.name,
          active: params.editedProgram.active,
          days: this.state.exercisesDay,
          _id: params.editedProgram._id
        }
      )
    } else {
      await params.saveProgram(this.state.exercisesDay, params.name)
    }
    this.setState({showLoadingScreen: false})
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Programs'})]
    }))
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.stack}
          title="Exercises"
          secondaryIcon="save"
          secondaryText="Save"
          secondaryEnabled={this.state.saveEnabled}
          secondaryFunction={() => this.saveProgram()}
        />
        {this.state.exercisesDay.map((day: ServerEntity.ExercisesDay, index: number) => {
          return this.renderSectionDay(day, index)
        })}
        <View style={styles.viewButton}>
          <TouchableOpacity
            disabled={!this.state.saveEnabled}
            style={[styles.button, styles.shadow]}
            onPress={() => this.saveProgram()}>
            <Text style={[styles.text, !this.state.saveEnabled && styles.textDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewButton: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerHeaderSection: {
    width: '100%',
    paddingTop: grid.unit,
    paddingBottom: grid.unit,
    paddingLeft: grid.unit * 2,
    paddingRight: grid.unit,
    backgroundColor: colors.light,
    flexDirection: 'row'
  },
  textHeaderSection: {
    fontFamily: grid.fontBold,
    fontSize: grid.caption,
    color: colors.base,
    flex: 3
  },
  iconHeaderSectionRest: {
    flex: 1,
    marginRight: grid.unit / 2
  },
  iconHeaderSectionAdd: {
    flex: 1,
    marginRight: grid.unit / 2,
    marginLeft: grid.unit / 2
  },
  iconHeaderSectionCollapsed: {
    flex: 1,
    marginLeft: grid.unit / 2
  },
  sectionNoContent: {
    fontFamily: grid.font,
    fontSize: grid.caption,
    color: colors.base
  },
  sectionDayOff: {
    fontFamily: grid.fontBold,
    fontSize: grid.caption,
    color: colors.base
  },
  sectionElement: {
    padding: grid.unit,
    borderColor: colors.light,
    flexDirection: 'column'
  },
  sectionElementRow: {
    flexDirection: 'row'
  },
  textBoldSection: {
    fontFamily: grid.fontBold,
    fontSize: grid.caption,
    color: colors.base,
    marginRight: 5
  },
  textMediumSection: {
    fontFamily: grid.fontMedium,
    fontSize: grid.caption,
    color: colors.base,
    marginRight: 5
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: grid.unit * 2,
    marginTop: grid.unit
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
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: grid.body,
    color: colors.base
  },
  textDisabled: {
    color: colors.textDisabled
  }
})

export default ProgramExercises
