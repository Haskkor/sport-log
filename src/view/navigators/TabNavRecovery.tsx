import * as React from 'react'
import {TabNavigator} from 'react-navigation'
import StopWatch from '../components/StopWatch'
import Timer from '../components/Timer'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'

const TabNavRecovery = TabNavigator({
  Stopwatch: {
    screen: StopWatch
  },
  Timer: {
    screen: Timer
  }
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeBackgroundColor: colors.activeBackgroundTabNav,
    inactiveBackgroundColor: colors.inactiveBackgroundTabNav,
    activeTintColor: colors.white,
    inactiveTintColor: colors.inactiveTintColorTabNav,
    style: {
      borderTopWidth: 0,
      height: grid.unit * 2.5
    },
    labelStyle: {
      marginBottom: grid.unit
    }
  }
})

export default TabNavRecovery