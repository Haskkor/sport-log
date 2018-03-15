import * as React from 'react'
import {Text, View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums/index'
import Header from './Header'
import {connect} from 'react-redux'

type IProps = {
  navigation: any
  programs: ServerEntity.Program[]
}

type IState = {
  items: any
  activeProgram: ServerEntity.Program
}

class Calendar extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {},
      activeProgram: this.props.programs.find((p: ServerEntity.Program) => p.active)
    }
  }

  populateItems = (day: any) => {
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time)
      this.state.items[strTime] = []
      this.state.items[strTime].push({
        name: 'Test',
        content: 'Exercise'
      })
    }
    const newItems = {}
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key]
    })
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
        <Text>{item.name}</Text>
        <TouchableOpacity>
          <Text>{item.content}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>Day off</Text>
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
          renderDay={(day: any, item: any) => (<Text>{day ? day.day : 'item'}</Text>)}
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
    height: 15,
    flex: 1,
    paddingTop: 30
  }
})