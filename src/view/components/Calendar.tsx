import * as React from 'react'
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, ActionSheetIOS} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums'
import Header from './Header'
import {connect, Dispatch} from 'react-redux'
import {grid} from '../../utils/grid'
import config from '../../utils/config'
import {fakeActiveProgram} from '../../utils/constants'
import {bindActionCreators} from 'redux'
import {compose, graphql} from 'react-apollo'
import gql from 'graphql-tag'
import LoadingScreen from './LoadingScreen'
import delay from '../../utils/delay'
import {ApolloQueryResult} from 'apollo-client'
import {createOmitTypenameLink} from '../../utils/graphQlHelper'
import * as _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import {dataHistoryDateUser} from '../../utils/gaphqlData'
import {DayCalendar, Item, Items} from '../../core/types'
import {createExerciseSet, createHistoryDate, createItem} from '../../utils/constructors'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  programs: ServerEntity.Program[]
  data: dataHistoryDateUser
  createHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
  updateHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
}

type IState = {
  items: Items
  activeProgram: ServerEntity.Program
  showLoadingScreen: boolean
  fabActive: boolean
}

const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

class Calendar extends React.PureComponent<IProps, IState> {
  editedExerciseTimestamp: string
  editedExerciseRow: number

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {},
      activeProgram: config.shouldUseFakeActiveProgram ? fakeActiveProgram :
        this.props.programs.find((p: ServerEntity.Program) => p.active),
      showLoadingScreen: true,
      fabActive: false
    }
    this.showActionSheet = this.showActionSheet.bind(this)
    this.saveEditedExercise = this.saveEditedExercise.bind(this)
  }

  async componentWillMount() {
    this.setState({showLoadingScreen: true})
    await this.props.data.refetch()
    this.setState({showLoadingScreen: false})
  }

  showActionSheet = (item: Item) => {
    ActionSheetIOS.showActionSheetWithOptions({
        title: item.name,
        options: [item.exerciseSet.done ? 'Set not done' : 'Set done', 'Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      },
      (buttonIndex) => {
        const indexRow = _.findIndex(this.state.items[this.timeToString(item.timestamp)], (i: Item) => {
          return i === item
        })
        if (buttonIndex === 0) {
          const currentItem = this.state.items[this.timeToString(item.timestamp)][indexRow]
          if (item._idHistoryDate) {
            const newExerciseSet = createExerciseSet(!currentItem.exerciseSet.done, currentItem.exerciseSet.exercise,
              currentItem.exerciseSet.recoveryTime, currentItem.exerciseSet.sets, currentItem.exerciseSet.muscleGroup)
            const newItem = createItem(currentItem.name, currentItem.details, currentItem.content,
              currentItem.timestamp, newExerciseSet, item._idHistoryDate)
            const newItems = Object.assign({}, this.state.items)
            newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
            const newExercises = newItems[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
            const newHistoryDate: ServerEntity.HistoryDate = {
              _id: item._idHistoryDate,
              timestamp: +item.timestamp,
              exercises: newExercises
            }
            this.props.updateHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Update history date failed', e)
            })
          } else {
            const exerciseSet = createOmitTypenameLink(item.exerciseSet)
            exerciseSet.done = !currentItem.exerciseSet.done
            const newHistoryDate: ServerEntity.HistoryDate = {
              timestamp: +item.timestamp,
              exercises: [exerciseSet]
            }
            this.props.createHistoryDate(newHistoryDate).then(({data}) => {
              const newExerciseSet = createExerciseSet(!currentItem.exerciseSet.done, currentItem.exerciseSet.exercise,
                currentItem.exerciseSet.recoveryTime, currentItem.exerciseSet.sets, currentItem.exerciseSet.muscleGroup)
              const newItem = createItem(currentItem.name, currentItem.details, currentItem.content,
                currentItem.timestamp, newExerciseSet, data.createHistoryDate._id)
              const newItems = Object.assign({}, this.state.items)
              newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Create history date failed', e)
            })
          }
        } else if (buttonIndex === 1) {
          this.editedExerciseRow = indexRow
          this.editedExerciseTimestamp = item.timestamp
          this.props.navigation.navigate('CalendarEditExercise', {
            status: HeaderStatus.stack,
            title: 'Edit exercise ' + new Date(item.timestamp).toLocaleDateString(),
            exercise: item.exerciseSet,
            saveEdit: this.saveEditedExercise
          })
        } else if (buttonIndex === 2) {
          const newItems = Object.assign({}, this.state.items)
          newItems[this.timeToString(item.timestamp)].splice(indexRow, 1)
          const newExercises = newItems[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
          if (item._idHistoryDate) {
            const newHistoryDate = createHistoryDate(item._idHistoryDate, item.timestamp, newExercises)
            this.props.updateHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Update history date failed', e)
            })
          } else {
            const newHistoryDate: ServerEntity.HistoryDate = {
              timestamp: +item.timestamp,
              exercises: newExercises
            }
            this.props.createHistoryDate(newHistoryDate).then(() => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Create history date failed', e)
            })
          }
        }
      }
    )
  }

  showActionSheetFullDay = (item: Item, day: DayCalendar) => {
    const notDone = _.some(this.state.items[this.timeToString(item.timestamp)].map((i: Item) => {
        return !i.exerciseSet.done
      })
    )
    ActionSheetIOS.showActionSheetWithOptions({
        title: new Date(day.timestamp).toLocaleDateString(),
        options: [notDone ? 'Set all day done' : 'Set all day not done', 'Delete all day', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      },
      (buttonIndex) => {
        const newItems = Object.assign({}, this.state.items)
        const newItemsDay: Item[] = []
        if (buttonIndex === 0) {
          newItems[this.timeToString(item.timestamp)].map((i: Item) => {
            // todo USE FUNCTION
            newItemsDay.push({
              exerciseSet: {
                done: notDone,
                exercise: i.exerciseSet.exercise,
                muscleGroup: i.exerciseSet.muscleGroup,
                recoveryTime: i.exerciseSet.recoveryTime,
                sets: i.exerciseSet.sets
              },
              timestamp: i.timestamp,
              _idHistoryDate: i._idHistoryDate,
              content: i.content,
              details: i.details,
              name: i.name
            })
          })
          newItems[this.timeToString(item.timestamp)] = newItemsDay
          const newExercises = newItems[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
          if (item._idHistoryDate) {
            // todo USE FUNCTION
            const newHistoryDate: ServerEntity.HistoryDate = {
              _id: item._idHistoryDate,
              timestamp: +item.timestamp,
              exercises: newExercises
            }
            this.props.updateHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Update history date failed', e)
            })
          } else {
            const newHistoryDate: ServerEntity.HistoryDate = {
              timestamp: +item.timestamp,
              exercises: newExercises
            }
            this.props.createHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Create history date failed', e)
            })
          }
        } else if (buttonIndex === 1) {
          newItems[this.timeToString(item.timestamp)] = {}
          if (item._idHistoryDate) {
            // todo USE FUNCTION
            const newHistoryDate: ServerEntity.HistoryDate = {
              _id: item._idHistoryDate,
              timestamp: +item.timestamp,
              exercises: []
            }
            this.props.updateHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Update history date failed', e)
            })
          } else {
            const newHistoryDate: ServerEntity.HistoryDate = {
              timestamp: +item.timestamp,
              exercises: []
            }
            this.props.createHistoryDate(newHistoryDate).then(({data}) => {
              this.setState({items: newItems})
            }).catch((e) => {
              console.log('Create history date failed', e)
            })
          }
        }
      }
    )
  }

  createDetailsString = (equipment: string, recovery: string): string => {
    return `${equipment} - Recovery time: ${recovery}`
  }

  createNameString = (name: string, group: string): string => {
    return `${name} - ${group}`
  }

  createContentString = (sets: ServerEntity.Set[]): string => {
    return `Sets:${sets.map((s: ServerEntity.Set) => {
      return ` ${s.reps} x ${s.weight}`
    })}`
  }

  saveEditedExercise = (exercise: ServerEntity.ExerciseSet) => {
    const editedItem: Item = this.state.items[this.timeToString(this.editedExerciseTimestamp)][this.editedExerciseRow]
    // todo USE FUNCTION
    const newExerciseSet: ServerEntity.ExerciseSet = {
      done: editedItem.exerciseSet.done,
      exercise: exercise.exercise,
      recoveryTime: exercise.recoveryTime,
      sets: exercise.sets,
      muscleGroup: exercise.muscleGroup
    }
    // todo USE FUNCTION
    const newItem: Item = {
      timestamp: this.editedExerciseTimestamp,
      _idHistoryDate: editedItem._idHistoryDate,
      name: this.createNameString(exercise.exercise.name, exercise.muscleGroup),
      details: this.createDetailsString(exercise.exercise.equipment, exercise.recoveryTime),
      content: this.createContentString(exercise.sets),
      exerciseSet: newExerciseSet
    }
    const newItems = Object.assign({}, this.state.items)
    newItems[this.timeToString(this.editedExerciseTimestamp)].splice(this.editedExerciseRow, 1, newItem)
    const newExercises = newItems[this.timeToString(this.editedExerciseTimestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
    // todo USE FUNCTION
    const newHistoryDate: ServerEntity.HistoryDate = {
      _id: editedItem._idHistoryDate,
      timestamp: +this.editedExerciseTimestamp,
      exercises: newExercises
    }
    this.props.updateHistoryDate(newHistoryDate).then(() => {
      this.setState({items: newItems})
    }).catch((e) => {
      console.log('Update history date failed', e)
    })
  }

  populateItems = async (day: DayCalendar) => {
    for (let i = -30; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time.toString())
      this.state.items[strTime] = []
      const historyOnDate = this.props.data.historyDateUser.find((h: ServerEntity.HistoryDate) => {
        return +h.timestamp === time
      })
      if (historyOnDate) {
        historyOnDate.exercises.map((e: ServerEntity.ExerciseSet) => {
          // todo USE FUNCTION
          this.state.items[strTime].push({
            _idHistoryDate: historyOnDate._id,
            name: this.createNameString(e.exercise.name, e.muscleGroup),
            details: this.createDetailsString(e.exercise.equipment, e.recoveryTime),
            content: this.createContentString(e.sets),
            exerciseSet: e,
            timestamp: time
          })
        })
      } else {
        if (strTime >= this.timeToString(new Date().getTime().toString())) {
          if (this.state.activeProgram && isNaN(+this.state.activeProgram.days[0].day)) {
            const tempDate = new Date()
            tempDate.setTime(time)
            const day = this.state.activeProgram.days.find((d: ServerEntity.ExercisesDay) => d.day === daysName[tempDate.getDay()])
            if (day) {
              day.exercises.map((e: ServerEntity.ExerciseSet) => {
                // todo USE FUNCTION
                this.state.items[strTime].push({
                  name: this.createNameString(e.exercise.name, e.muscleGroup),
                  details: this.createDetailsString(e.exercise.equipment, e.recoveryTime),
                  content: this.createContentString(e.sets),
                  exerciseSet: e,
                  timestamp: time
                })
              })
            }
          } else if (this.state.activeProgram) {
            const currentDayProgram = this.state.activeProgram.days[i % this.state.activeProgram.days.length]
            if (!currentDayProgram.isDayOff) {
              currentDayProgram.exercises.map((e: ServerEntity.ExerciseSet) => {
                const newItem: Item = createItem(this.createNameString(e.exercise.name, e.muscleGroup),
                  this.createDetailsString(e.exercise.equipment, e.recoveryTime), this.createContentString(e.sets),
                  time.toString(), e)
                this.state.items[strTime].push(newItem)
              })
            }
          }
        } else {
          this.state.items[strTime] = {}
        }
      }
    }
    const newItems: Items = {} as Items
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key]
    })
    return newItems
  }

  loadItems = async (day: DayCalendar) => {
    while (this.state.showLoadingScreen) {
      await delay(100)
    }
    const itemsLoaded = await this.populateItems(day)
    this.setState({
      items: itemsLoaded
    })
  }

  renderItem = (item: Item) => {
    return (
      <TouchableOpacity onPress={() => this.showActionSheet(item)}
                        style={[styles.item, {
                          backgroundColor: item.exerciseSet.done ? colors.lightValid : colors.white
                        }]}>
        <Text style={styles.textBold}>{item.name}</Text>
        <Text style={styles.text}>{item.details}</Text>
        <Text style={styles.text}>{item.content}</Text>
      </TouchableOpacity>
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.textBold}>Day off</Text>
        <Text style={styles.text}>Eat and sleep</Text>
      </View>
    )
  }

  rowHasChanged = (r1: Item, r2: Item) => {
    return r1 !== r2
  }

  timeToString = (time: string) => {
    const date = new Date(+time)
    return date.toISOString().split('T')[0]
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.drawer}
          title="Calendar"
        />
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={new Date()}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          pastScrollRange={10}
          futureScrollRange={10}
          markingType={'multi-dot'}
          monthFormat={'MMMM yyyy'}
          theme={{
            calendarBackground: colors.light,
            agendaKnobColor: colors.orange,
            agendaDayTextColor: colors.base,
            agendaDayNumColor: colors.base
          }}
          renderDay={(day: DayCalendar, item: Item) => (
            <View style={styles.day}>
              <Text style={styles.dayText}>{day ? day.day : ''}</Text>
              {day && item &&
              <TouchableOpacity onPress={() => this.showActionSheetFullDay(item, day)}>
                <Icon name="select-all" style={styles.selectAllIcon}/>
              </TouchableOpacity>}
            </View>
          )}
        />
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
      </View>
    )
  }
}

const CalendarGraphQl = compose(graphql(
  gql`
    query ProgramsUser {
      historyDateUser {
        _id
        _userId
        timestamp
        exercises {
          muscleGroup
          done
          recoveryTime
          exercise {
            name
            equipment
          }
          sets {
            reps
            weight
          }
        }
      }
    }
  `),
  graphql(
    gql`
    mutation CreateHistoryDate($historyDate: HistoryDateCreateType) {
      createHistoryDate(input: $historyDate) {
        _id
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
    }),
  graphql(
    gql`
    mutation UpdateHistoryDate($historyDate: HistoryDateUpdateType) {
      updateHistoryDate(input: $historyDate) {
        _id
      }
    }
  `,
    {
      props: ({mutate}) => ({
        updateHistoryDate: (historyDate: ServerEntity.HistoryDate) =>
          mutate({
            variables: {historyDate}
          })
      })
    }))(Calendar)

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {
    programs: rootState.entities.programs
  }
}

const mapDispatchToProps =
  (dispatch: Dispatch<any>) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CalendarGraphQl)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 10
  },
  emptyDate: {
    height: grid.unit * 4,
    flex: 1,
    padding: 15
  },
  day: {
    backgroundColor: colors.lightAlternative,
    width: grid.unit * 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  dayText: {
    fontFamily: grid.fontMedium,
    fontSize: grid.unit
  },
  text: {
    fontFamily: grid.font,
    color: colors.base
  },
  textBold: {
    fontFamily: grid.fontBold,
    color: colors.base
  },
  selectAllIcon: {
    fontFamily: grid.fontMedium,
    fontSize: grid.navIcon,
    marginTop: 10
  }
})
