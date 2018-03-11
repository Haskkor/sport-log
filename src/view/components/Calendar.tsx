import * as React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {colors} from "../../utils/colors";

type IProps = {}

type IState = {
  items: any
}

class Calendar extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      items: {}
    }
  }

  loadItems = (day: any) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000
        const strTime = this.timeToString(time)
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = []
          const numItems = Math.floor(Math.random() * 5)
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            })
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {}
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key]
      })
      this.setState({
        items: newItems
      })
    }, 1000)
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem = (item: any) => {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged = (r1: any, r2: any) => {
    return r1.name !== r2.name;
  }

  timeToString = (time: any) => {
    const date = new Date(time)
    return date.toISOString().split('T')[0]
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-05-16'} // todo use today date
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        pastScrollRange={10}
        futureScrollRange={10}
        markingType={'period'}
        monthFormat={'yyyy MM'}
        theme={{
          calendarBackground: colors.light,
          agendaKnobColor: colors.orange,
          agendaDayTextColor: colors.base,
          agendaDayNumColor: colors.base
        }}
        renderDay={(day: any, item: any) => (<Text>{day ? day.day : 'item'}</Text>)}
      />
    )
  }
}

export default Calendar

const styles = StyleSheet.create({
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
});