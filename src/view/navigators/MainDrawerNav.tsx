import * as React from 'react'
import {DrawerNavigator} from 'react-navigation'
import TabNavRecovery from './TabNavRecovery'
import QuickLog from '../components/QuickLog'
import ProgramsStackNav from './ProgramsStackNav'
import Calendar from '../components/Calendar'
import PinCode from '../components/PinCode'
import Logout from '../components/Logout'
import Home from '../components/Home'

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