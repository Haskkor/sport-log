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
import LoadingScreen from './LoadingScreen'
import delay from '../../utils/delay'
import {ApolloQueryResult} from 'apollo-client'
import {createOmitTypenameLink} from '../../utils/graphQlHelper'
import * as _ from 'lodash'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import {dataCreateHistoryDate, dataHistoryDateUser, historyDateUserGql} from '../../utils/gaphqlData'
import {DayCalendar, Item, Items} from '../../core/types'
import {createExerciseSet, createHistoryDate, createItem} from '../../utils/constructors'
import {createContentString, createDetailsString, createNameString} from '../../utils/calendar'
import {CREATE_HISTORY_DATE, HISTORY_DATE_USER, UPDATE_HISTORY_DATE} from '../../utils/gqls'
import ModalSortExercises from './ModalSortExercises'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  programs: ServerEntity.Program[]
  data: dataHistoryDateUser
  createHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<dataCreateHistoryDate>>
  updateHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
}

type IState = {
  items: Items
  activeProgram: ServerEntity.Program
  showLoadingScreen: boolean
  fabActive: boolean
  showModalSortExercises: boolean
}

const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

enum RequestType {
  editDone = 'editDone',
  delete = 'delete',
  allDone = 'allDone',
  allDelete = 'allDelete',
  sort = 'sort',
  edit = 'edit'
}

class Calendar extends React.PureComponent<IProps, IState> {
  editedExerciseTimestamp: string
  editedExerciseRow: number
  currentDay: DayCalendar
  orderSortableList: string[]
  dataSortableList: Item[]

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {},
      activeProgram: config.shouldUseFakeActiveProgram ? fakeActiveProgram :
        this.props.programs.find((p: ServerEntity.Program) => p.active),
      showLoadingScreen: true,
      fabActive: false,
      showModalSortExercises: false
    }
    this.showActionSheet = this.showActionSheet.bind(this)
    this.saveEditedExercise = this.saveEditedExercise.bind(this)
    this.refetchData = this.refetchData.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.saveSortedExercises = this.saveSortedExercises.bind(this)
    this.updateHistoryDateRequest = this.updateHistoryDateRequest.bind(this)
    this.createHistoryDateRequest = this.createHistoryDateRequest.bind(this)
  }

  async componentWillMount() {
    this.refetchData()
  }

  refetchData = async () => {
    this.setState({showLoadingScreen: true})
    await this.props.data.refetch()
    if (this.currentDay) this.loadItems(this.currentDay)
    this.setState({showLoadingScreen: false})
  }

  closeModal = () => {
    this.setState({showModalSortExercises: false})
  }

  updateHistoryDateRequest = (item: Item, action: RequestType, indexRow?: number, notDone?: boolean,
                              sortedItems?: Item[], editedExercise?: ServerEntity.ExerciseSet) => {
    const newItems = Object.assign({}, this.state.items)
    if (action === RequestType.editDone) {
      const currentItem = this.state.items[this.timeToString(item.timestamp)][indexRow]
      const newExerciseSet = createExerciseSet(!currentItem.exerciseSet.done, currentItem.exerciseSet.exercise,
        currentItem.exerciseSet.recoveryTime, currentItem.exerciseSet.sets, currentItem.exerciseSet.muscleGroup)
      const newItem = createItem(currentItem.name, currentItem.details, currentItem.content,
        currentItem.timestamp, newExerciseSet, item._idHistoryDate)
      newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
    } else if (action === RequestType.delete) {
      newItems[this.timeToString(item.timestamp)].splice(indexRow, 1)
    } else if (action === RequestType.allDone) {
      const newItemsDay: Item[] = []
      newItems[this.timeToString(item.timestamp)].map((i: Item) => {
        newItemsDay.push(createItem(i.name, i.details, i.content, i.timestamp, createExerciseSet(notDone,
          i.exerciseSet.exercise, i.exerciseSet.recoveryTime, i.exerciseSet.sets, i.exerciseSet.muscleGroup),
          i._idHistoryDate))
      })
      newItems[this.timeToString(item.timestamp)] = newItemsDay
    } else if (action === RequestType.allDelete) {
      newItems[this.timeToString(item.timestamp)] = []
    } else if (action === RequestType.sort) {
      newItems[this.timeToString(item.timestamp)] = sortedItems
    } else if (action === RequestType.edit) {
      const editedItem: Item = this.state.items[this.timeToString(this.editedExerciseTimestamp)][this.editedExerciseRow]
      const newExerciseSet = createExerciseSet(editedItem.exerciseSet.done, editedExercise.exercise, editedExercise.recoveryTime,
        editedExercise.sets, editedExercise.muscleGroup)
      const newItem = createItem(createNameString(editedExercise.exercise.name, editedExercise.muscleGroup),
        createDetailsString(editedExercise.exercise.equipment, editedExercise.recoveryTime),
        createContentString(editedExercise.sets), this.editedExerciseTimestamp, newExerciseSet, editedItem._idHistoryDate)
      newItems[this.timeToString(this.editedExerciseTimestamp)].splice(this.editedExerciseRow, 1, newItem)
    }
    const newExercises = newItems[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
    const newHistoryDate = createHistoryDate(item.timestamp, newExercises, item._idHistoryDate)
    this.setState({items: newItems})
    this.props.updateHistoryDate(newHistoryDate).catch((e) => console.log('Update history date failed', e))
  }

  createHistoryDateRequest = (item: Item, action: RequestType, indexRow?: number, notDone?: boolean,
                              sortedItems?: Item[], editedExercise?: ServerEntity.ExerciseSet) => {
    const currentItem = this.state.items[this.timeToString(item.timestamp)][indexRow]
    const exerciseSet = createOmitTypenameLink(item.exerciseSet)
    // Exercisesets to be used in all the functions
    const exerciseSets = this.state.items[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
    this.setState({showLoadingScreen: true})
    const newItems = Object.assign({}, this.state.items)
    if (action === RequestType.editDone) {
      exerciseSet.done = !currentItem.exerciseSet.done
      exerciseSets.splice(indexRow, 1, exerciseSet)
      const newHistoryDate = createHistoryDate(item.timestamp, exerciseSets)
      this.props.createHistoryDate(newHistoryDate).then((d: { data: dataCreateHistoryDate }) => {
        const newExerciseSet = createExerciseSet(!currentItem.exerciseSet.done, currentItem.exerciseSet.exercise,
          currentItem.exerciseSet.recoveryTime, currentItem.exerciseSet.sets, currentItem.exerciseSet.muscleGroup)
        const newItem = createItem(currentItem.name, currentItem.details, currentItem.content,
          currentItem.timestamp, newExerciseSet, d.data.createHistoryDate._id)
        newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
        this.setState({items: newItems, showLoadingScreen: false})
      }).catch((e) => {
        console.log('Create history date failed', e)
        this.setState({showLoadingScreen: false})
      })
    } else if (action === RequestType.sort) {
      const newExercisesSet = sortedItems.map((i: Item) => createOmitTypenameLink(i.exerciseSet))
      const newHistoryDate = createHistoryDate(item.timestamp, newExercisesSet)
      this.props.createHistoryDate(newHistoryDate).then((d: { data: dataCreateHistoryDate }) => {
        newItems[this.timeToString(item.timestamp)] = sortedItems
          .map((i: Item) => createItem(i.name, i.details, i.content, i.timestamp, i.exerciseSet, d.data.createHistoryDate._id))
        this.setState({items: newItems, showLoadingScreen: false})
      }).catch((e) => {
        console.log('Create history date failed', e)
        this.setState({showLoadingScreen: false})
      })
    } else if (action === RequestType.edit) {
      const editedItem: Item = this.state.items[this.timeToString(this.editedExerciseTimestamp)][this.editedExerciseRow]
      const newExerciseSet = createExerciseSet(editedItem.exerciseSet.done, editedExercise.exercise, editedExercise.recoveryTime,
        editedExercise.sets, editedExercise.muscleGroup)
      const newItem = createItem(createNameString(editedExercise.exercise.name, editedExercise.muscleGroup),
        createDetailsString(editedExercise.exercise.equipment, editedExercise.recoveryTime),
        createContentString(editedExercise.sets), this.editedExerciseTimestamp, newExerciseSet, editedItem._idHistoryDate)
      const newExercisesSet = this.state.items[this.timeToString(this.editedExerciseTimestamp)].map((i: Item) => i.exerciseSet)
      newExercisesSet.splice(this.editedExerciseRow, 1, newExerciseSet)
      const newHistoryDate = createHistoryDate(this.editedExerciseTimestamp, newExercisesSet)
      this.props.createHistoryDate(newHistoryDate).then((d: { data: dataCreateHistoryDate }) => {
        newItems[this.timeToString(this.editedExerciseTimestamp)] = newItems[this.timeToString(this.editedExerciseTimestamp)]
          .map((i: Item) => createItem(i.name, i.details, i.content, i.timestamp, i.exerciseSet, d.data.createHistoryDate._id))
        newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
        this.setState({items: newItems, showLoadingScreen: false})
      }).catch((e) => {
        console.log('Create history date failed', e)
        this.setState({showLoadingScreen: false})
      })
    } else {
      if (action === RequestType.delete) {
        newItems[this.timeToString(item.timestamp)].splice(indexRow, 1)
      } else if (action === RequestType.allDone) {
        exerciseSet.done = !currentItem.exerciseSet.done
        const newItemsDay: Item[] = []
        newItems[this.timeToString(item.timestamp)].map((i: Item) => {
          newItemsDay.push(createItem(i.name, i.details, i.content, i.timestamp, createExerciseSet(notDone,
            i.exerciseSet.exercise, i.exerciseSet.recoveryTime, i.exerciseSet.sets, i.exerciseSet.muscleGroup),
            i._idHistoryDate))
        })
        newItems[this.timeToString(item.timestamp)] = newItemsDay
      } else if (action === RequestType.allDelete) {
        newItems[this.timeToString(item.timestamp)] = []
      }



      // Use this for all the create functions
      const newExercises = newItems[this.timeToString(item.timestamp)].map((i: Item) => createOmitTypenameLink(i.exerciseSet))
      const newHistoryDate = createHistoryDate(item.timestamp, newExercises)
      this.setState({items: newItems, showLoadingScreen: false})



      this.props.createHistoryDate(newHistoryDate).catch((e) => console.log('Create history date failed', e))
    }
  }

  showActionSheet = (item: Item) => {
    ActionSheetIOS.showActionSheetWithOptions({
        title: item.name,
        options: [item.exerciseSet.done ? 'Set not done' : 'Set done', 'Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      },
      (buttonIndex) => {
        const indexRow = _.findIndex(this.state.items[this.timeToString(item.timestamp)], (i: Item) => i === item)
        if (buttonIndex === 0) {
          if (item._idHistoryDate) this.updateHistoryDateRequest(item, RequestType.editDone, indexRow)
          else this.createHistoryDateRequest(item, RequestType.editDone, indexRow)
        } else if (buttonIndex === 1) {
          this.editedExerciseRow = indexRow
          this.editedExerciseTimestamp = item.timestamp
          this.props.navigation.navigate('CalendarEditExercise', {
            status: HeaderStatus.stack,
            title: 'Edit exercise ' + new Date(item.timestamp).toLocaleDateString(),
            exercise: item.exerciseSet,
            saveEdit: this.saveEditedExercise,
            editing: true
          })
        } else if (buttonIndex === 2) {
          if (item._idHistoryDate) this.updateHistoryDateRequest(item, RequestType.delete, indexRow)
          else this.createHistoryDateRequest(item, RequestType.delete, indexRow)
        }
      }
    )
  }

  showActionSheetFullDay = (item: Item, day: DayCalendar) => {
    const notDone = _.some(this.state.items[this.timeToString(item.timestamp)].map((i: Item) => !i.exerciseSet.done))
    ActionSheetIOS.showActionSheetWithOptions({
        title: new Date(day.timestamp).toLocaleDateString(),
        options: [notDone ? 'Set all day done' : 'Set all day not done', 'Add an exercise', 'Sort exercises',
          'Delete all day', 'Cancel'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 4
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          if (item._idHistoryDate) this.updateHistoryDateRequest(item, RequestType.allDone, null, notDone)
          else this.createHistoryDateRequest(item, RequestType.allDone, null, notDone)
        } else if (buttonIndex === 1) {
          this.addExerciseToDay(day.timestamp)
        } else if (buttonIndex === 2) {
          this.dataSortableList = this.state.items[this.timeToString(day.timestamp.toString())].slice()
          this.orderSortableList = Object.keys(this.dataSortableList)
          this.setState({showModalSortExercises: true})
        } else if (buttonIndex === 3) {
          if (item._idHistoryDate) this.updateHistoryDateRequest(item, RequestType.allDelete)
          else this.createHistoryDateRequest(item, RequestType.allDelete)

        }
      }
    )
  }

  showActionSheetEmptyDay = (day: DayCalendar) => {
    ActionSheetIOS.showActionSheetWithOptions({
        title: new Date(day.timestamp).toLocaleDateString(),
        options: ['Add an exercise', 'Cancel'],
        cancelButtonIndex: 1
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.addExerciseToDay(day.timestamp)
        }
      }
    )
  }

  saveSortedExercises = (items: Item[], order: string[]) => {
    const sortedItems: Item[] = order.map((o: string) => items[+o])
    this.closeModal()
    if (items[0]._idHistoryDate) this.updateHistoryDateRequest(sortedItems[0], RequestType.sort, null, null, sortedItems)
    else this.createHistoryDateRequest(sortedItems[0], RequestType.sort, null, null, sortedItems)
  }

  addExerciseToDay = (timestamp: number) => {
    this.props.navigation.navigate('CalendarEditExercise', {
      status: HeaderStatus.stack,
      title: 'New exercise ' + new Date(timestamp).toLocaleDateString(),
      timestamp: timestamp,
      refetchData: this.refetchData
    })
  }

  saveEditedExercise = (exercise: ServerEntity.ExerciseSet) => {
    const editedItem: Item = this.state.items[this.timeToString(this.editedExerciseTimestamp)][this.editedExerciseRow]
    if (editedItem._idHistoryDate) this.updateHistoryDateRequest(editedItem, RequestType.edit, null, null, null, exercise)
    else this.createHistoryDateRequest(editedItem, RequestType.edit, null, null, null, exercise)
  }


  populateItems = async (day: DayCalendar) => {
    for (let i = -30; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time.toString())
      this.state.items[strTime] = []
      const historyOnDate = this.props.data.historyDateUser.find((h: historyDateUserGql) => {
        return +h.timestamp === time
      })
      if (historyOnDate) {
        historyOnDate.exercises.map((e: ServerEntity.ExerciseSet) => {
          this.state.items[strTime].push(createItem(createNameString(e.exercise.name, e.muscleGroup),
            createDetailsString(e.exercise.equipment, e.recoveryTime), createContentString(e.sets),
            time.toString(), e, historyOnDate._id,
          ))
        })
      } else {
        if (strTime >= this.timeToString(new Date().getTime().toString())) {
          if (this.state.activeProgram && isNaN(+this.state.activeProgram.days[0].day)) {
            const tempDate = new Date()
            tempDate.setTime(time)
            const day = this.state.activeProgram.days.find((d: ServerEntity.ExercisesDay) => d.day === daysName[tempDate.getDay()])
            if (day) {
              day.exercises.map((e: ServerEntity.ExerciseSet) => {
                this.state.items[strTime].push(createItem(createNameString(e.exercise.name, e.muscleGroup),
                  createDetailsString(e.exercise.equipment, e.recoveryTime), createContentString(e.sets),
                  time.toString(), e))
              })
            }
          } else if (this.state.activeProgram) {
            const currentDayProgram = this.state.activeProgram.days[i % this.state.activeProgram.days.length]
            if (!currentDayProgram.isDayOff) {
              currentDayProgram.exercises.map((e: ServerEntity.ExerciseSet) => {
                const newItem: Item = createItem(createNameString(e.exercise.name, e.muscleGroup),
                  createDetailsString(e.exercise.equipment, e.recoveryTime), createContentString(e.sets),
                  time.toString(), e)
                this.state.items[strTime].push(newItem)
              })
            }
          }
        } else {
          this.state.items[strTime] = []
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
    this.currentDay = day
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
              {item && <TouchableOpacity onPress={() => this.showActionSheetFullDay(item, day)}>
                <Text style={styles.dayText}>{day ? day.day : ''}</Text>
              </TouchableOpacity> ||
              <TouchableOpacity onPress={() => this.showActionSheetEmptyDay(day)}>
                <Text style={styles.dayText}>{day ? day.day : ''}</Text>
              </TouchableOpacity>}
            </View>
          )}
        />
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
        {this.state.showModalSortExercises &&
        <ModalSortExercises order={this.orderSortableList} dataLog={this.dataSortableList}
                            closeModal={this.closeModal} save={this.saveSortedExercises}/>}
      </View>
    )
  }
}

const CalendarGraphQl = compose(graphql(
  HISTORY_DATE_USER),
  graphql(
    CREATE_HISTORY_DATE,
    {
      props: ({mutate}) => ({
        createHistoryDate: (historyDate: ServerEntity.HistoryDate) =>
          mutate({
            variables: {historyDate}
          })
      })
    }),
  graphql(
    UPDATE_HISTORY_DATE,
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
