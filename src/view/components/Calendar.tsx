import * as React from 'react'
import {Text, View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums/index'
import Header from './Header'
import {connect} from 'react-redux'
import {grid} from '../../utils/grid'

type IProps = {
  navigation: any
  programs: ServerEntity.Program[]
}

type IState = {
  items: any // fixme any
  activeProgram: ServerEntity.Program
}

type Item = { [key: string]: {} }

const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

class Calendar extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {},
      activeProgram: this.props.programs.find((p: ServerEntity.Program) => p.active)
    }
  }

  populateItems = (day: any) => {
    for (let i = 0; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time)
      if (strTime >= this.timeToString(new Date())) {
        this.state.items[strTime] = []
        if (this.state.activeProgram && isNaN(+this.state.activeProgram.days[0].day)) {
          const tempDate = new Date()
          tempDate.setTime(time)
          const day = this.state.activeProgram.days.find((d: ServerEntity.ExercisesDay) => d.day === daysName[tempDate.getDay()])
          if (day) {
            day.exercises.map((e: ServerEntity.ExerciseSet) => {
              this.state.items[strTime].push({
                name: `${e.exercise.name} - ${e.muscleGroup}`,
                details: `${e.exercise.equipment} - Recovery time: ${e.recoveryTime}`,
                content: `${e.sets.map((s: ServerEntity.Set) => {
                  return `Sets: ${s.reps} x ${s.weight}`
                })}`
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
                content: `${e.sets.map((s: ServerEntity.Set) => {
                  return `Sets: ${s.reps} x ${s.weight}`
                })}`
              })
            })
          }
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
    const itemsLoaded = await this.populateItems(day)
    this.setState({
      items: itemsLoaded
    })
  }

  renderItem = (item: any) => {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <TouchableOpacity>
          <Text>{item.name}</Text>
          <Text>{item.details}</Text>
          <Text>{item.content}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>Day off</Text>
        <Text>Eat and sleep</Text>
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
      </View>
    )
  }
}

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {
    programs: rootState.entities.programs
  }
}

export default connect(mapStateToProps, null)(Calendar)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: 'white',
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
    alignItems: 'center'
  },
  dayText: {
    fontFamily: grid.fontMedium,
    fontSize: grid.unit
  }
})