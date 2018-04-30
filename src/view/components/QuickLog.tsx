import * as React from 'react'
import {Picker, StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Dimensions} from 'react-native'
import {Col, Row, Grid} from 'react-native-easy-grid'
import ModalListLog from './ModalListLog'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as _ from 'lodash'
import ModalSets from './ModalSets'
import exercises from '../../db/exercises'
import Header from './Header'
import Toaster from './Toaster'
import {HeaderStatus, ToasterInfo} from '../../core/enums'
import ModalRecovery from './ModalRecovery'
import {buildRecoveryTimes} from '../../utils/helper'
import ModalSearch from './ModalSearch'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {ApolloQueryResult} from 'apollo-client'
import LoadingScreen from './LoadingScreen'
import {bindActionCreators} from 'redux'
import {connect, Dispatch} from 'react-redux'
import * as QuickLogActions from '../../core/modules/entities/quicklog'
import * as HistoryActions from '../../core/modules/entities/history'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  createHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
  quickLog: ServerEntity.ExerciseSet[]
  setQuickLog: typeof QuickLogActions.setQuickLog
  editQuickLog: typeof QuickLogActions.editQuickLog
  deleteQuickLog: typeof QuickLogActions.deleteQuickLog
  resetQuickLog: typeof QuickLogActions.resetQuickLog
  saveQuickLogHistory: typeof HistoryActions.saveQuickLogHistory
}

type IState = {
  sets: ServerEntity.Set[]
  currentMuscle: string
  currentExercise: string
  currentRecoveryTime: string
  showModal: boolean
  showModalSets: boolean
  showModalRecovery: boolean
  showToasterInfo: boolean
  showToasterWarning: boolean
  showToasterError: boolean
  showModalSearch: boolean
  editing: boolean
  showLoadingScreen: boolean
}

class QuickLog extends React.PureComponent<IProps, IState> {
  order: string[]
  setToModify: { indexSet: number, reps: number, weight: number }
  scrollViewRef: any
  scrollViewWidth: number
  muscles: string[]
  exercises: ServerEntity.ExerciseMuscle[]
  editedExerciseIndex: number

  constructor(props: IProps) {
    super(props)
    this.muscles = exercises.map((data: ServerEntity.MuscleGroups) => data.muscle).sort()
    this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === this.muscles[0]).exercises,
      [(exercise: ServerEntity.ExerciseMuscle) => {
        return exercise.name
      }])
    this.state = {
      sets: [{reps: 8, weight: 75}, {reps: 8, weight: 80}, {reps: 8, weight: 85}],
      currentExercise: this.exercises[0].name,
      currentMuscle: this.muscles[0],
      currentRecoveryTime: buildRecoveryTimes()[0],
      showModal: false,
      showModalSets: false,
      showModalRecovery: false,
      showToasterInfo: false,
      showToasterWarning: false,
      showToasterError: false,
      showModalSearch: false,
      showLoadingScreen: false,
      editing: false
    }
    this.closeModalListLog = this.closeModalListLog.bind(this)
    this.closeModalSets = this.closeModalSets.bind(this)
    this.handleModalSearch = this.handleModalSearch.bind(this)
    this.updateRecovery = this.updateRecovery.bind(this)
    this.addExerciseSet = this.addExerciseSet.bind(this)
    this.deleteExercise = this.deleteExercise.bind(this)
    this.editExercise = this.editExercise.bind(this)
    this.saveEditedExercise = this.saveEditedExercise.bind(this)
    this.stopToaster = this.stopToaster.bind(this)
    this.backToOriginalState = this.backToOriginalState.bind(this)
    this.selectExerciseModalSearch = this.selectExerciseModalSearch.bind(this)
    this.saveHistoryDate = this.saveHistoryDate.bind(this)
  }

  componentWillMount() {
    const {params} = this.props.navigation.state
    if (params) {
      this.setState({currentMuscle: params.exercise.muscleGroup})
      this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === params.exercise.muscleGroup).exercises,
        [(exercise: ServerEntity.ExerciseMuscle) => {
          return exercise.name
        }])
      this.setState({
        currentExercise: params.exercise.exercise.name,
        sets: params.exercise.sets,
        currentRecoveryTime: params.exercise.recoveryTime,
        editing: true
      })
    }
  }

  componentDidMount() {
    this.order = Object.keys(this.props.quickLog)
  }

  componentWillUnmount() {
    this.stopToaster(ToasterInfo.none)
  }

  closeModalListLog() {
    this.setState({showModal: false})
  }

  closeModalSets() {
    this.setState({showModalSets: false})
  }

  handleModalSearch(close: boolean = false) {
    this.setState({showModalSearch: !close})
  }

  scrollToEndHorizontally() {
    if (this.scrollViewWidth >= Dimensions.get('window').width - 140) {
      this.scrollViewRef.scrollTo({
        x: this.scrollViewWidth - Dimensions.get('window').width * 0.545,
        y: 0,
        animated: true
      })
    }
  }

  updateDeleteSet(reps?: number, weight?: number) {
    let repsWeightCopy = this.state.sets.slice()
    if (reps) {
      repsWeightCopy.splice(this.setToModify.indexSet, 1, {reps: reps, weight: weight})
    } else {
      repsWeightCopy.splice(this.setToModify.indexSet, 1)
    }
    this.setState({sets: repsWeightCopy})
    this.setToModify = null
  }

  addExerciseSet = () => {
    const newSet = this.buildNewSet()
    this.props.setQuickLog({set: newSet})
    let dataLogCopy = this.props.quickLog.slice()
    dataLogCopy.push(newSet)
    this.backToOriginalState(dataLogCopy, false)
  }

  saveEditedExercise = () => {
    const newSet = this.buildNewSet()
    this.props.editQuickLog({index: this.editedExerciseIndex, set: newSet})
    let dataLogCopy = this.props.quickLog.slice()
    dataLogCopy[this.editedExerciseIndex] = newSet
    this.backToOriginalState(dataLogCopy, true)
  }

  updateRecovery = (recoveryTime: string) => {
    this.setState({showModalRecovery: false, currentRecoveryTime: recoveryTime})
  }

  buildNewSet = (): ServerEntity.ExerciseSet => {
    return {
      exercise: this.exercises.find((exercise) => {
        return exercise.name === this.state.currentExercise
      }),
      muscleGroup: this.state.currentMuscle,
      sets: this.state.sets,
      recoveryTime: this.state.currentRecoveryTime
    }
  }

  backToOriginalState = (dataLogCopy: ServerEntity.ExerciseSet[], wasEditing: boolean) => {
    this.order = Object.keys(dataLogCopy)
    this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === this.muscles[0]).exercises,
      [(exercise: ServerEntity.ExerciseMuscle) => {
        return exercise.name
      }])
    this.setState({
      sets: [{reps: 8, weight: 75}, {reps: 8, weight: 80}, {reps: 8, weight: 85}],
      currentExercise: this.exercises[0].name,
      currentMuscle: this.muscles[0],
      editing: false,
      showToasterInfo: !wasEditing,
      showToasterWarning: wasEditing
    })
  }

  editExercise = (index: number) => {
    const exerciseToEdit = this.props.quickLog[index]
    this.setState({currentMuscle: exerciseToEdit.muscleGroup})
    this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === exerciseToEdit.muscleGroup).exercises,
      [(exercise: ServerEntity.ExerciseMuscle) => {
        return exercise.name
      }])
    this.editedExerciseIndex = index
    this.setState({
      showModal: false,
      sets: exerciseToEdit.sets,
      currentExercise: exerciseToEdit.exercise.name,
      editing: true
    })
  }

  deleteExercise = (index: number) => {
    this.props.deleteQuickLog({index: index})
  }

  stopToaster = async (status: ToasterInfo) => {
    this.setState({
      showToasterInfo: status === ToasterInfo.info || status === ToasterInfo.none ? false : this.state.showToasterInfo,
      showToasterWarning: status === ToasterInfo.warning || status === ToasterInfo.none ? false : this.state.showToasterWarning,
      showToasterError: status === ToasterInfo.error || status === ToasterInfo.none ? false : this.state.showToasterError
    })
  }

  selectExerciseModalSearch = (exercise: string, muscle: string) => {
    this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === muscle).exercises,
      [(e: ServerEntity.ExerciseMuscle) => {
        return e.name
      }])
    this.setState({currentMuscle: muscle, currentExercise: exercise, showModalSearch: false})
  }

  saveHistoryDate = (historyDate: ServerEntity.HistoryDate) => {
    this.setState({
      showModal: false,
      showLoadingScreen: true,
      showToasterError: false,
      showToasterInfo: false,
      showToasterWarning: false
    })
    this.props.createHistoryDate(historyDate).then(({data}: any) => {
      this.props.resetQuickLog({})
      this.props.saveQuickLogHistory({
        quickLogHistory: {
          exercises: historyDate.exercises.slice(),
          timestamp: historyDate.timestamp,
          _id: data.createHistoryDate._id
        }
      })
      this.setState({showToasterInfo: true, showLoadingScreen: false})
    }).catch((e: any) => {
      console.log('Create history date failed', e)
      this.setState({showToasterError: true, showLoadingScreen: false})
    })
  }

  render() {
    const {
      sets, editing, currentExercise, currentMuscle, showModal, showModalSets, showToasterInfo,
      showToasterWarning, showModalRecovery, currentRecoveryTime, showModalSearch, showToasterError
    } = this.state
    const navigationParams = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          status={navigationParams ? navigationParams.status : HeaderStatus.drawer}
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          title={navigationParams ? navigationParams.title : 'Quick Log'}
          secondaryIcon="search"
          secondaryEnabled={true}
          secondaryFunction={this.handleModalSearch}/>
        <Grid style={styles.grid}>
          <Row size={35} style={styles.rows}>
            <Col size={25} style={styles.textPickers}>
              <Text style={styles.textTitle}>Muscle:</Text>
            </Col>
            <Col size={75} style={styles.columns}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={currentMuscle}
                onValueChange={(itemValue) => {
                  this.exercises = _.sortBy(exercises.find((data: ServerEntity.MuscleGroups) => data.muscle === itemValue).exercises,
                    [(exercise: ServerEntity.ExerciseMuscle) => {
                      return exercise.name
                    }])
                  this.setState({currentMuscle: itemValue, currentExercise: this.exercises[0].name})
                }}>
                {this.muscles.map((muscle: string) => {
                  return <Picker.Item key={muscle} label={muscle} value={muscle}/>
                })}
              </Picker>
            </Col>
          </Row>
          <Row size={35} style={styles.rows}>
            <Col size={25} style={styles.textPickers}>
              <Text style={styles.textTitle}>Exercise:</Text>
            </Col>
            <Col size={75} style={styles.columns}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={currentExercise}
                onValueChange={(itemValue) => this.setState({currentExercise: itemValue})}>
                {this.exercises.map((muscle: ServerEntity.ExerciseMuscle) => {
                  return <Picker.Item key={muscle.name} label={muscle.name} value={muscle.name}/>
                })}
              </Picker>
            </Col>
          </Row>
          <Row size={20} style={styles.rows}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.scroll}
              ref={ref => this.scrollViewRef = ref}
              onContentSizeChange={(width) => this.scrollViewWidth = width}>
              {sets.map((item: ServerEntity.Set, index: number) => {
                return (
                  <TouchableOpacity
                    key={item.weight + index}
                    style={[styles.elemHorizontalList, styles.shadow]}
                    onPress={() => {
                      this.setToModify = {indexSet: index, reps: item.reps, weight: item.weight}
                      this.setState({showModalSets: true})
                    }}>
                    <Text style={styles.textSets}><Text>{item.reps}</Text><Text> x</Text></Text>
                    <Text style={styles.textSets}><Text>{item.weight}</Text><Text>kg</Text></Text>
                  </TouchableOpacity>
                )
              })}
              <TouchableOpacity
                onPress={() => {
                  this.scrollToEndHorizontally()
                  this.setState({sets: [...this.state.sets, _.last(sets)]}
                  )
                }}>
                <Icon name="add-circle-outline" size={30} color="#445878"/>
              </TouchableOpacity>
            </ScrollView>
          </Row>
          <Row size={2} style={styles.rowTextRecovery}>
            <Text style={styles.textRecovery}>{currentRecoveryTime}</Text>
          </Row>
          <Row size={8} style={styles.rows}>
            <Col style={styles.columnsButtons}>
              {!editing &&
              <TouchableOpacity
                style={[styles.buttonBottom, styles.shadow]}
                onPress={() => {
                  this.stopToaster(ToasterInfo.none)
                  this.setState({showModal: true})
                }}>
                <Text style={styles.buttonsText}>See log</Text>
              </TouchableOpacity>}
            </Col>
            <Col style={styles.columnsButtons}>
              <TouchableOpacity
                style={[styles.buttonBottom, styles.shadow]}
                onPress={() => this.setState({
                  showModalRecovery: true
                })}>
                <Text style={styles.buttonsText}>Rec. time</Text>
              </TouchableOpacity>
            </Col>
            <Col style={styles.columnsButtons}>
              <TouchableOpacity
                onPress={() => {
                  if (navigationParams) {
                    navigationParams.saveEdit(this.buildNewSet())
                    this.props.navigation.goBack()
                  } else {
                    (editing ? this.saveEditedExercise() : this.addExerciseSet())
                  }
                }}
                style={[styles.buttonBottom, styles.shadow]}>
                <Text style={styles.buttonsText}>{editing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
        {showToasterInfo &&
        <Toaster text="Data saved" status={ToasterInfo.info} stopToaster={this.stopToaster}/>}
        {showToasterWarning &&
        <Toaster text="Changes saved" status={ToasterInfo.warning} stopToaster={this.stopToaster}/>}
        {showToasterError &&
        <Toaster text="Save failed" status={ToasterInfo.error} stopToaster={this.stopToaster}/>}
        {showModalSets && <ModalSets
          updateDeleteSet={(reps?, weight?) => this.updateDeleteSet(reps, weight)}
          deleteEnabled={sets.length > 1}
          reps={this.setToModify.reps}
          weight={this.setToModify.weight}
          closeModal={this.closeModalSets}
        />}
        {showModal && <ModalListLog
          dataLog={this.props.quickLog}
          deleteExercise={this.deleteExercise}
          editExercise={this.editExercise}
          saveHistoryDate={this.saveHistoryDate}
          order={this.order}
          closeModal={this.closeModalListLog}
        />}
        {showModalRecovery && <ModalRecovery
          updateRecovery={this.updateRecovery}
        />}
        {showModalSearch && <ModalSearch
          exercises={exercises}
          closeModal={this.handleModalSearch}
          selectExercise={this.selectExerciseModalSearch}/>}
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
      </View>
    )
  }
}

const QuickLogGraphQl = graphql(
  gql`
    mutation CreateHistoryDate($historyDate: HistoryDateCreateType) {
      createHistoryDate(input: $historyDate) {
        _id
        _userId
        timestamp
        exercises {
          muscleGroup
          recoveryTime
          exercise {
            name
            equipment
          }
          done
          sets {
            reps
            weight
          }
        }
      }
    }
  `,
  {
    props: ({mutate}) => ({
      createHistoryDate: (historyDate: ServerEntity.HistoryDate) =>
        mutate({
          variables: {historyDate}
        })
    })
  })(QuickLog)

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {
    quickLog: rootState.entities.quicklog
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setQuickLog: QuickLogActions.setQuickLog,
  editQuickLog: QuickLogActions.editQuickLog,
  deleteQuickLog: QuickLogActions.deleteQuickLog,
  resetQuickLog: QuickLogActions.resetQuickLog,
  saveQuickLogHistory: HistoryActions.saveQuickLogHistory
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(QuickLogGraphQl)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightAlternative
  },
  logView: {
    flex: 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightAlternative
  },
  grid: {
    flex: 1,
    backgroundColor: colors.lightAlternative,
    marginRight: grid.unit * 1.5,
    marginLeft: grid.unit * 1.5
  },
  columns: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnsButtons: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rows: {
    margin: grid.unit * 0.75
  },
  rowTextRecovery: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    width: 250,
    height: 'auto'
  },
  elemHorizontalList: {
    flexDirection: 'column',
    marginRight: 32,
    marginLeft: 2
  },
  textPickers: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center'
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
  pickerItem: {
    fontSize: grid.subHeader,
    color: colors.base
  },
  buttonBottom: {
    width: Dimensions.get('window').width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: grid.unit * 2
  },
  buttonsText: {
    fontFamily: grid.font,
    color: colors.base
  },
  textSets: {
    fontFamily: grid.font,
    color: colors.base
  },
  textTitle: {
    fontFamily: grid.font,
    color: colors.base
  },
  textRecovery: {
    fontFamily: grid.fontLight,
    fontSize: grid.body,
    color: colors.base
  }
})
