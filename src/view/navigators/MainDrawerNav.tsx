import * as React from 'react'
import {DrawerNavigator} from 'react-navigation'
import TabNavRecovery from './TabNavRecovery'
import QuickLog from '../components/QuickLog'
import ProgramsStackNav from './ProgramsStackNav'
import Calendar from '../components/Calendar'

const MainDrawerNav = DrawerNavigator({
  Home: {
    screen: ProgramsStackNav
  },
  Calendar: {
    screen: Calendar
  },
  QuickLog: {
    screen: QuickLog
  },
  Programs: {
    screen: ProgramsStackNav
  },
  Recovery: {
    screen: TabNavRecovery
  }
})

export default MainDrawerNav