import * as React from 'react'
import {NavigationAction, NavigationRoute, NavigationScreenProp, StackNavigator} from 'react-navigation'
import Programs from '../components/Programs'
import ProgramNameDays from '../components/ProgramNameDays'
import ProgramExercises from '../components/ProgramExercises'
import {colors} from '../../utils/colors'
import QuickLog from '../components/QuickLog'

const ProgramsStackNav = StackNavigator({
  Programs: {
    screen: Programs,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  },
  ProgramNameDays: {
    screen: ProgramNameDays,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  },
  ProgramExercises: {
    screen: ProgramExercises,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  },
  ProgramEditExercise: {
    screen: QuickLog,
    navigationOptions: ({navigation}: NavigationScreenProp<NavigationRoute<>, NavigationAction>) => ({header: null})
  }
}, {
  cardStyle: {
    backgroundColor: colors.white
  }
})

export default ProgramsStackNav