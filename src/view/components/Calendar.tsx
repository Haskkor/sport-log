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

type IProps = {
  navigation: any
  pgUser: { programsUser: ServerEntity.Program[] }
  hdUser: { historyDateUser: ServerEntity.HistoryDate[] }
}

type IState = {
  items: any
  activeProgram: ServerEntity.Program
  showLoadingScreen: boolean
}

type Item = { [key: string]: {
  name: string,
  details: string,
  content: string,
  done: boolean
}}

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
      activeProgram: null,
      showLoadingScreen: true
    }
    this.showActionSheet = this.showActionSheet.bind(this)
  }

  componentWillReceiveProps(props: IProps) {
    if (props.pgUser.programsUser && props.hdUser.historyDateUser) {
      this.setState({
        showLoadingScreen: false,
        activeProgram: config.shouldUseFakeActiveProgram ? fakeActiveProgram :
          props.pgUser.programsUser.find((p: ServerEntity.Program) => p.active),
      })
    }
  }

  showActionSheet = () => {
    // ActionSheetIOS.showActionSheetWithOptions({
    //     title: data.exercise.name,
    //     options: [data.done ? 'Set not done' : 'Set done', 'Edit', 'Delete', 'Cancel'],
    //     destructiveButtonIndex: 2,
    //     cancelButtonIndex: 3
    //   },
    //   (buttonIndex) => {
    //     if (buttonIndex === 0) {
    //     } else if (buttonIndex === 1) {
    //     } else if (buttonIndex === 2) {
    //     }
    //   })
  }

  populateItems = async (day: DayCalendar) => {
    for (let i = -30; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time)
      if (strTime >= this.timeToString(new Date())) {
        this.state.items[strTime] = []
        const historyOnDate = this.props.hdUser.historyDateUser.find((h: ServerEntity.HistoryDate) => +h.timestamp === time)
        if (historyOnDate) {
          historyOnDate.exercises.map((e: ServerEntity.ExerciseSet) => {
            this.state.items[strTime].push({
              name: `${e.exercise.name} - ${e.muscleGroup}`,
              details: `${e.exercise.equipment} - Recovery time: ${e.recoveryTime}`,
              content: `Sets:${e.sets.map((s: ServerEntity.Set) => {
                return ` ${s.reps} x ${s.weight}`
              })}`,
              done: true
            })
          })

        } else {
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
                  done: false
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
                  done: false
                })
              })
            }
          }
        }
      } else {
        this.state.items[strTime] = {}
      }
    }
    const newItems: Item = {}
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key]
    })
    return newItems
  }

  loadItems = async (day: any) => {
    while (!this.state.activeProgram) {
      await delay(100)
    }
    const itemsLoaded = await this.populateItems(day)
    this.setState({
      items: itemsLoaded
    })
  }

  renderItem = (item: any) => {
    return (
      <View style={[styles.item, {height: item.height, backgroundColor: item.done ? colors.lightValid : colors.white}]}>
        <TouchableOpacity onPress={() => this.showActionSheet()}>
          <Text style={styles.textBold}>{item.name}</Text>
          <Text style={styles.text}>{item.details}</Text>
          <Text style={styles.text}>{item.content}</Text>
        </TouchableOpacity>
      </View>
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
    return r1.name !== r2.name
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
      programsUser {
        name
        _id
        _userId
        active
        days {
          day
          isCollapsed
          isDayOff
          exercises {
            muscleGroup
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
    }
  `
  , {name: 'pgUser'}), graphql(
  gql`
    query ProgramsUser {
      historyDateUser {
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
          sets {
            reps
            weight
          }
        }
      }
    }
  `
  , {name: 'hdUser'}))(Calendar)

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {}
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
