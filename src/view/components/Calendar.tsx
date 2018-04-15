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

type IProps = {
  navigation: any
  programs: ServerEntity.Program[]
  hdUser: { historyDateUser: ServerEntity.HistoryDate[] }
  createHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
  updateHistoryDate: (historyDate: ServerEntity.HistoryDate) => Promise<ApolloQueryResult<{}>>
}

type IState = {
  items: any
  activeProgram: ServerEntity.Program
  showLoadingScreen: boolean
}

type Item = {
  [key: string]: {
    name: string,
    details: string,
    content: string,
    done: boolean,
    timestamp: string
    exerciseSet: ServerEntity.ExerciseSet
    _id?: string
  }
}

type DayCalendar = {
  dateString: string
  day: number
  month: number
  timestamp: number
  year: number
}

const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

class Calendar extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {},
      activeProgram: config.shouldUseFakeActiveProgram ? fakeActiveProgram :
        this.props.programs.find((p: ServerEntity.Program) => p.active),
      showLoadingScreen: true
    }
    this.showActionSheet = this.showActionSheet.bind(this)
  }

  componentWillReceiveProps(props: IProps) {
    if (props.hdUser.historyDateUser) {
      this.setState({
        showLoadingScreen: false
      })
    }
  }

  showActionSheet = (item: any) => {
    ActionSheetIOS.showActionSheetWithOptions({
        title: item.name,
        options: [item.done ? 'Set not done' : 'Set done', 'Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      },
      (buttonIndex) => {
        const indexRow = _.findIndex(this.state.items[this.timeToString(item.timestamp)], (i: any) => {
          return i === item
        })
        if (buttonIndex === 0) {
          if (item.done) {
            const exerciseSet = createOmitTypenameLink(item.exerciseSet)
            exerciseSet.done = false
            const newHistoryDate: ServerEntity.HistoryDate = {
              _id: item._id,
              timestamp: item.timestamp,
              exercises: [exerciseSet]
            }
            this.props.updateHistoryDate(newHistoryDate).then(({data}) => {
              const currentItem = this.state.items[this.timeToString(item.timestamp)][indexRow]
              const newItem: any = {
                _id: data.updateHistoryDate._id,
                name: currentItem.name,
                details: currentItem.details,
                content: currentItem.content,
                done: false,
                timestamp: currentItem.timestamp,
                exerciseSet: currentItem.exerciseSet
              }
              const newItems = Object.assign({}, this.state.items)
              newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
              newItems[this.timeToString(item.timestamp)][indexRow].done = false
              this.setState({items: newItems})
            }).catch((e: any) => {
              console.log('Update history date failed', e)
            })
          } else {
            const exerciseSet = createOmitTypenameLink(item.exerciseSet)
            exerciseSet.done = true
            const newHistoryDate: ServerEntity.HistoryDate = {
              timestamp: item.timestamp,
              exercises: [exerciseSet]
            }
            this.props.createHistoryDate(newHistoryDate).then(({data}) => {
              const currentItem = this.state.items[this.timeToString(item.timestamp)][indexRow]
              const newItem: any = {
                _id: data.createHistoryDate._id,
                name: currentItem.name,
                details: currentItem.details,
                content: currentItem.content,
                done: true,
                timestamp: currentItem.timestamp,
                exerciseSet: currentItem.exerciseSet
              }
              const newItems = Object.assign({}, this.state.items)
              newItems[this.timeToString(item.timestamp)].splice(indexRow, 1, newItem)
              newItems[this.timeToString(item.timestamp)][indexRow].done = true
              this.setState({items: newItems})
            }).catch((e: any) => {
              console.log('Create history date failed', e)
            })
          }
        } else if (buttonIndex === 1) {
        } else if (buttonIndex === 2) {
        }
      })
  }

  populateItems = async (day: DayCalendar) => {
    for (let i = -30; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time)
      this.state.items[strTime] = []
      const historyOnDate = this.props.hdUser.historyDateUser.find((h: ServerEntity.HistoryDate) => {
        return +h.timestamp === time
      })
      if (historyOnDate) {
        historyOnDate.exercises.map((e: ServerEntity.ExerciseSet) => {
          this.state.items[strTime].push({
            _id: historyOnDate._id,
            name: `${e.exercise.name} - ${e.muscleGroup}`,
            details: `${e.exercise.equipment} - Recovery time: ${e.recoveryTime}`,
            content: `Sets:${e.sets.map((s: ServerEntity.Set) => {
              return ` ${s.reps} x ${s.weight}`
            })}`,
            done: e.done,
            exerciseSet: e,
            timestamp: time
          })
        })
      } else {
        if (strTime >= this.timeToString(new Date())) {
          if (this.state.activeProgram && isNaN(+this.state.activeProgram.days[0].day)) {
            const tempDate = new Date()
            tempDate.setTime(time)
            const day = this.state.activeProgram.days.find((d: ServerEntity.ExercisesDay) => d.day === daysName[tempDate.getDay()])
            if (day) {
              day.exercises.map((e: ServerEntity.ExerciseSet) => {
                this.state.items[strTime].push({
                  name: `${e.exercise.name} - ${e.muscleGroup}`,
                  details: `${e.exercise.equipment} - Recovery time: ${e.recoveryTime}`,
                  content: `Sets:${e.sets.map((s: ServerEntity.Set) => {
                    return ` ${s.reps} x ${s.weight}`
                  })}`,
                  done: false,
                  exerciseSet: e,
                  timestamp: time
                })
              })
            }
          } else if (this.state.activeProgram) {
            const currentDayProgram = this.state.activeProgram.days[i % this.state.activeProgram.days.length]
            if (!currentDayProgram.isDayOff) {
              currentDayProgram.exercises.map((e: ServerEntity.ExerciseSet) => {
                this.state.items[strTime].push({
                  name: `${e.exercise.name} - ${e.muscleGroup}`,
                  details: `${e.exercise.equipment} - Recovery time: ${e.recoveryTime}`,
                  content: `Sets:${e.sets.map((s: ServerEntity.Set) => {
                    return ` ${s.reps} x ${s.weight}`
                  })}`,
                  done: false,
                  exerciseSet: e,
                  timestamp: time
                })
              })
            }
          }
        } else {
          this.state.items[strTime] = {}
        }
      }
    }
    const newItems: Item = {}
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key]
    })
    return newItems
  }

  loadItems = async (day: any) => {
    while (this.state.showLoadingScreen) {
      await delay(100)
    }
    const itemsLoaded = await this.populateItems(day)
    this.setState({
      items: itemsLoaded
    })
  }

  renderItem = (item: any) => {
    return (
      <TouchableOpacity onPress={() => this.showActionSheet(item)}
                        style={[styles.item, {
                          height: item.height,
                          backgroundColor: item.done ? colors.lightValid : colors.white
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

  rowHasChanged = (r1: any, r2: any) => {
    return r1 !== r2
  }

  timeToString = (time: any) => {
    const date = new Date(time)
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
          renderDay={(day: any, item: any) => (
            <View style={styles.day}>
              <Text style={styles.dayText}>{day ? day.day : ''}</Text>
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
  `, {name: 'hdUser'}),
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
    marginTop: 17
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
  }
})
