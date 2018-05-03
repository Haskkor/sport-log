import * as React from 'react'
import {DrawerNavigator} from 'react-navigation'
import TabNavRecovery from './TabNavRecovery'
import QuickLog from '../components/QuickLog'
import ProgramsStackNav from './ProgramsStackNav'
import PinCode from '../components/PinCode'
import Logout from '../components/Logout'
import Home from '../components/Home'
import CalendarStackNav from './CalendarStackNav'

type IProps = {
  changeLoginState: (status: boolean) => void
}

type IState = {}

class MainDrawerNav extends React.PureComponent<IProps, IState> {

  render() {
    const MainDrawerNav = DrawerNavigator({
      Home: {
        screen: Home
      },
      Calendar: {
        screen: CalendarStackNav
      },
      QuickLog: {
        screen: QuickLog
      },
      Programs: {
        screen: ProgramsStackNav
      },
      Recovery: {
        screen: TabNavRecovery
      },
      Pin: {
        screen: PinCode
      },
      Logout: {
        screen: Logout
      }
    })
    return (
      <MainDrawerNav screenProps={{changeLoginState: this.props.changeLoginState}}/>
    )
  }
}

export default MainDrawerNav