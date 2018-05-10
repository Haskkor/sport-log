import * as React from 'react'
import {NavigationAction, NavigationRoute, NavigationScreenProp, StackNavigator} from 'react-navigation'
import {colors} from '../../utils/colors'
import QuickLog from '../components/QuickLog'
import Calendar from '../components/Calendar'

const CalendarStackNav = StackNavigator({
  Calendar: {
    screen: Calendar,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  },
  CalendarEditExercise: {
    screen: QuickLog,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  },
  CalendarNewExercise: {
    screen: QuickLog,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  }
}, {
  cardStyle: {
    backgroundColor: colors.white
  }
})

export default CalendarStackNav