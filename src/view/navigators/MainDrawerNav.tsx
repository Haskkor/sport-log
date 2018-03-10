import * as React from 'react'
import {DrawerNavigator} from 'react-navigation'
import TabNavRecovery from './TabNavRecovery'
import QuickLog from '../components/QuickLog'
import ProgramsStackNav from './ProgramsStackNav'

const MainDrawerNav = DrawerNavigator({
  Home: {
    drawerLabel: 'Programs',
    screen: ProgramsStackNav
  },
  QuickLog: {
    drawerLabel: 'Quick log',
    screen: QuickLog
  },
  Programs: {
    drawerLabel: 'Programs',
    screen: ProgramsStackNav
  },
  Recovery: {
    drawerLabel: 'Recovery',
    screen: TabNavRecovery
  }
})

export default MainDrawerNav